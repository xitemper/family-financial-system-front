<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div
          class="button-section"
          style="
            margin-left: 15px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            gap: 20px;
          "
        >
          <el-button @click="openAddRecordDialog">新增收支记录</el-button>
          <el-button @click="openUploadDialog">上传并解析账单</el-button>
          <div style="margin-left: 30px">
            <span>选择日期：</span>
            <el-date-picker
              v-model="selectTime"
              type="daterange"
              range-separator="~"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
            <el-button
              round
              @click="getRecordByDate()"
              style="margin-left: 10px"
              >查看</el-button
            >
          </div>
        </div>

        <div
          class="button-section"
          style="
            margin-left: 15px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            gap: 20px;
          "
        >
          <el-button
            style="margin-left: 30px"
            @click="openPlanDialog()"
            type="info"
            v-if="hasPermission('ADD_FAMILY_BILL')"
            >储蓄/还款计划创建</el-button
          >
        </div>

        <div class="col-12">
          <card
            class="strpied-tabled-with-hover"
            body-classes="table-full-width table-responsive"
          >
            <template slot="header">
              <h4 class="card-title">收入记录</h4>
              <!-- <p class="card-category" v-if="!selectTime">
                默认显示近三个月的收入记录
              </p> -->
              <p class="card-category">
                {{
                  selectedFormattedTime
                    ? selectedFormattedTime
                    : "默认显示当前月份"
                }}的支出记录
              </p>
            </template>
            <l-table
              class="table-hover table-striped"
              :columns="table1.columns"
              :data="
                table1.data.map((item) => ({
                  ...item,
                  time: item.time.replace('T', ' '),
                  amount: '￥' + item.amount,
                }))
              "
            >
            </l-table>
          </card>
        </div>

        <div class="col-12">
          <card
            class="strpied-tabled-with-hover"
            body-classes="table-full-width table-responsive"
          >
            <template slot="header">
              <h4 class="card-title">支出记录</h4>
              <!-- <p class="card-category" v-if="!selectTime">
                默认显示近三个月的收入记录
              </p> -->
              <p class="card-category">
                {{
                  selectedFormattedTime
                    ? selectedFormattedTime
                    : "默认显示当前月份"
                }}的支出记录
              </p>
            </template>
            <l-table
              class="table-hover table-striped"
              :columns="table2.columns"
              :data="
                table2.data.map((item) => ({
                  ...item,
                  time: item.time.replace('T', ' '),
                  amount: '￥' + item.amount,
                }))
              "
            >
            </l-table>
          </card>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="addRecordDialogVisible" title="新增收支记录">
      <el-form :model="newTransaction" label-width="80px">
        <el-form-item label="类型">
          <el-select v-model="newTransaction.type" placeholder="请选择类型">
            <el-option label="收入" value="income"></el-option>
            <el-option label="支出" value="expense"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <!-- <el-input v-model="newTransaction.category"></el-input> -->
          <el-select v-model="newTransaction.category" placeholder="请选择分类">
            <el-option
              v-for="(category, index) in filteredCategories"
              :key="index"
              :label="category.label"
              :value="category.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额">
          <el-input v-model="newTransaction.amount" type="number">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="newTransaction.description"></el-input>
        </el-form-item>
        <el-form-item label="交易时间">
          <el-date-picker
            v-model="newTransaction.transactionDate"
            type="datetime"
            placeholder="选择交易时间"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          v-if="hasPermission('ADD_FAMILY_BILL')"
          label="是否并入家庭组账单信息"
          label-width="200px"
        >
          <el-switch
            v-model="newTransaction.isFamilyBill"
            :active-value="2"
            :inactive-value="0"
            active-text="是"
            inactive-text="否"
            style="margin-left: 20px"
          >
          </el-switch>
        </el-form-item>

        <el-form-item v-if="availablePlans.length > 0" label="关联计划">
          <el-select
            v-model="newTransaction.planId"
            placeholder="可选择并入某个计划"
          >
            <!-- 添加一个可取消的空选项 -->
            <el-option
              :key="0"
              :label="'不关联任何计划'"
              :value="null"
            ></el-option>
            <el-option
              v-for="plan in availablePlans"
              :key="plan.id"
              :label="plan.name + '（' + plan.type + '）'"
              :value="plan.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addRecordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRecord()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="planDialogVisible" title="新增储蓄/还款计划">
      <el-form :model="newPlan" label-width="100px">
        <el-form-item label="计划名称">
          <el-input
            v-model="newPlan.name"
            placeholder="例如：还信用卡、存购车款"
          ></el-input>
        </el-form-item>

        <el-form-item label="计划类型">
          <el-select v-model="newPlan.type" placeholder="请选择类型">
            <el-option label="储蓄计划" value="income"></el-option>
            <el-option label="还款计划" value="expense"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="目标金额">
          <el-input v-model="newPlan.targetAmount" type="number">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="当前金额">
          <el-input
            v-model="newPlan.currentAmount"
            type="number"
            placeholder="可填0，系统将自动更新"
          >
            <template slot="append">元</template>
          </el-input>
        </el-form-item>

        <el-form-item label="目标日期">
          <el-date-picker
            v-model="newPlan.targetDate"
            type="date"
            placeholder="请选择目标日期"
            :picker-options="{
              disabledDate(time) {
                // 禁止选择今天之前的日期
                return time.getTime() < new Date().setHours(0, 0, 0, 0);
              },
            }"
          ></el-date-picker>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="planDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addPlan()">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="uploadDialogVisible" title="上传并解析账单">
      <el-upload
        action="#"
        :on-change="handleFileChange"
        :show-file-list="false"
        accept=".csv,.xlsx"
      >
        <el-button type="primary">选择文件</el-button>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="uploadDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="uploadAndParse()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import LTable from "src/components/Table.vue";
import Card from "src/components/Cards/Card.vue";
import axios from "axios";
import { hasPermission } from "@/utils/permission";
const tableColumns = ["Category", "Amount", "Description", "Time"];

const tableData = [
  {
    category: 1,
    amount: "Dakota Rice",
    description: "$36.738",
    time: "Niger",
  },
];
const incomeTransactions = [
  {
    // category: "工资",
    // amount: "33.29",
    // description: "这是一条收入数据",
    // time: "2025.3.30",
  },
];
const expenseTransactions = [
  {
    // category: "餐饮",
    // amount: "33.28",
    // description: "这是一条支出数据",
    // time: "2025.3.30",
  },
];
export default {
  components: {
    LTable,
    Card,
  },
  watch: {
    "newTransaction.type"(newType) {
      const validCategories = this.categories[newType] || [];
      const currentCategoryValid = validCategories.some(
        (category) => category.value === this.newTransaction.category
      );

      if (!currentCategoryValid) {
        this.newTransaction.category = ""; // 只有当旧分类无效时才清空
      }
    },
    "newTransaction.type"(newVal) {
      this.newTransaction.planId = null;
    },
  },
  mounted() {
    this.getIncomeRecord();
    this.getExpenseRecord();
    this.getAllPlan();
  },
  computed: {
    // 根据选中的类型动态筛选分类
    filteredCategories() {
      return this.categories[this.newTransaction.type] || [];
    },
    availablePlans() {
      return this.allPlans.filter(
        (plan) => plan.type === this.newTransaction.type
      );
    },
    formattedselectTime() {
      if (this.selectTime) {
        const startDate = new Date(this.selectTime[0]);
        const endDate = new Date(this.selectTime[1]);
        return (
          startDate.toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          }) +
          "至" +
          endDate.toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })
        );
      }
      return "默认显示当前月份";
    },
  },
  methods: {
    hasPermission,
    getIncomeRecord() {
      const startDate =
        this.selectTime && this.selectTime[0]
          ? new Date(this.selectTime[0]).toISOString()
          : "";
      const endDate =
        this.selectTime && this.selectTime[1]
          ? new Date(this.selectTime[1]).toISOString()
          : "";
      axios({
        method: "get",
        url:
          "/api/transaction/getIncomeRecord?userId=" +
          localStorage.getItem("userId") +
          "&startTime=" +
          startDate +
          "&endTime=" +
          endDate,
      }).then(async (resp) => {
        // this.incomeTransactions = resp.data.content;
        this.incomeTransactions = resp.data.content.filter(
          (item) => item.isFamilyBill === 0 || item.isFamilyBill === 2
        );
        this.table1.data = this.incomeTransactions;
        if (resp.data.code === "200") {
          console.log("getIncomeRecord方法执行成功");
          console.log("getIncomeRecord方法返回结果：" + resp.data.content);
        } else {
          this.$message(resp.data.msg);
        }
      });
    },
    getExpenseRecord() {
      const startDate =
        this.selectTime && this.selectTime[0]
          ? new Date(this.selectTime[0]).toISOString()
          : "";
      const endDate =
        this.selectTime && this.selectTime[1]
          ? new Date(this.selectTime[1]).toISOString()
          : "";
      axios({
        method: "get",
        url:
          "/api/transaction/getExpenseRecord?userId=" +
          localStorage.getItem("userId") +
          "&startTime=" +
          startDate +
          "&endTime=" +
          endDate,
      }).then(async (resp) => {
        // this.expenseTransactions = resp.data.content;
        this.expenseTransactions = resp.data.content.filter(
          (item) => item.isFamilyBill === 0 || item.isFamilyBill === 2
        );
        this.table2.data = this.expenseTransactions;
        if (resp.data.code === "200") {
          console.log("getExpenseRecord方法执行成功");
        } else {
          this.$message(resp.data.msg);
        }
      });
    },
    addPlan() {
      axios({
        method: "post",
        url: "/api/user/addPlan?userId=" + localStorage.getItem("userId"),
        data: this.newPlan,
      }).then(async (resp) => {
        if (resp.data.code === "200") {
          console.log("addPlan方法执行成功");
          this.$message("计划新增成功！");
        } else {
          this.$message(resp.data.msg);
        }
      });
      (this.newPlan = {
        name: "",
        type: "", // 'income' 或 'expense'
        targetAmount: null,
        currentAmount: 0,
        targetDate: "",
      }),
        (this.planDialogVisible = false);
      this.getAllPlan();
    },
    getAllPlan() {
      axios({
        method: "get",
        url: "/api/user/getAllPlan?userId=" + localStorage.getItem("userId"),
      }).then(async (resp) => {
        if (resp.data.code === "200") {
          console.log("addPlan方法执行成功");
          this.allPlans = resp.data.content;
        } else {
          this.$message(resp.data.msg);
        }
      });
    },
    disableFutureDates(date) {
      // 获取当前日期，时间部分设为00:00:00
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // 只比较日期，不比较时间

      // 禁用当前日期以后的日期
      return date.getTime() > currentDate.getTime();
    },
    getRecordByDate() {
      // 更新 selectedFormattedTime
      if (this.selectTime) {
        const startDate = new Date(this.selectTime[0]);
        const endDate = new Date(this.selectTime[1]);
        this.selectedFormattedTime = `${startDate.toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        })}至${endDate.toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        })}`;
      } else {
        this.selectedFormattedTime = "默认显示当前月份";
      }

      // 调用获取记录的方法
      this.getIncomeRecord();
      this.getExpenseRecord();
    },
    openAddRecordDialog() {
      this.addRecordDialogVisible = true;
      console.log("当前addRecordDialogVisible：" + this.addRecordDialogVisible);
    },
    openUploadDialog() {
      this.uploadDialogVisible = true;
    },
    openPlanDialog() {
      this.planDialogVisible = true;
    },
    handleFileChange(file) {
      this.selectedFile = file.raw;
    },
    addRecord() {
      axios({
        method: "post",
        url:
          "/api/transaction/addTransaction?userId=" +
          localStorage.getItem("userId"),
        data: this.newTransaction,
      }).then(async (resp) => {
        if (resp.data.code === "200") {
          console.log("addRecord方法执行成功");
          this.getIncomeRecord();
          this.getExpenseRecord();
        } else {
          this.$message(resp.data.msg);
        }
      });
      (this.newTransaction = {
        type: "income",
        category: "",
        amount: 0,
        description: "",
        transactionDate: new Date().toISOString(),
        planId: "",
      }),
        (this.addRecordDialogVisible = false);
    },

    uploadAndParse() {
      // 这里需要实现文件上传和解析逻辑
      console.log("上传文件:", this.selectedFile);
      this.uploadDialogVisible = false;
    },
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        },
      },
      selectedFormattedTime: "",
      table1: {
        columns: [...tableColumns],
        data: [...incomeTransactions],
      },
      table2: {
        columns: [...tableColumns],
        data: [...expenseTransactions],
      },
      selectTime: "",
      addRecordDialogVisible: false,
      uploadDialogVisible: false,
      planDialogVisible: false,
      allPlans: [],
      newTransaction: {
        type: "income",
        category: "",
        amount: 0,
        description: "",
        transactionDate: new Date().toISOString(),
        isFamilyBill: 0,
        planId: "",
      },
      newPlan: {
        name: "",
        type: "", // 'income' 或 'expense'
        targetAmount: null,
        currentAmount: 0,
        targetDate: "",
      },
      // 定义所有分类
      categories: {
        income: [
          { label: "工资", value: "工资" },
          { label: "奖金", value: "奖金" },
          { label: "投资收益", value: "投资收益" },
          { label: "红包", value: "红包" },
          { label: "租金", value: "租金" },
          { label: "分红", value: "分红" },
          { label: "其他", value: "其他" },
          { label: "收款", value: "收款" },
        ],
        expense: [
          { label: "餐饮", value: "餐饮" },
          { label: "交通", value: "交通" },
          { label: "购物", value: "购物" },
          { label: "日用", value: "日用" },
          { label: "蔬菜", value: "蔬菜" },
          { label: "水果", value: "水果" },
          { label: "零食", value: "零食" },
          { label: "运动", value: "运动" },
          { label: "娱乐", value: "娱乐" },
          { label: "通讯", value: "通讯" },
          { label: "房租", value: "房租" },
          { label: "烟酒", value: "烟酒" },
          { label: "医疗", value: "医疗" },
          { label: "学习", value: "学习" },
          { label: "礼品", value: "礼品" },
          { label: "维修", value: "维修" },
          { label: "快递", value: "快递" },
          { label: "还款", value: "还款" },
          { label: "游戏", value: "游戏" },
        ],
      },
      selectedFile: null,
    };
  },
};
</script>
<style>
</style>
