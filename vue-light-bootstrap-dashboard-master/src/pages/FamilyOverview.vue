<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-xl-3 col-md-6">
          <stats-card style="height: 138px">
            <div slot="header" class="icon-warning">
              <i class="nc-icon nc-favourite-28 text-warning"></i>
            </div>
            <div slot="content">
              <p class="card-category">家庭组本月预算总额</p>
              <!-- <h4 class="card-title">${{ totalBudget }}</h4> -->
              <h4 class="card-title">
                {{
                  totalBudget === null || totalBudget === ""
                    ? "未设置本月家庭组预算"
                    : "￥" + totalBudget
                }}
              </h4>
            </div>
            <div slot="footer">
              <i class="fa fa-refresh"></i
              >{{
                isSelectMonth
                  ? this.year + "年" + this.month + "月数据"
                  : this.defaultText
              }}
            </div>
          </stats-card>
        </div>

        <div class="col-xl-3 col-md-6">
          <stats-card style="height: 138px">
            <div slot="header" class="icon-success">
              <i class="nc-icon nc-fav-remove text-success"></i>
            </div>
            <div slot="content">
              <p class="card-category">家庭组本月已支出</p>
              <h4 class="card-title">${{ totalExpense }}</h4>
            </div>
            <div slot="footer">
              <i class="fa fa-calendar-o"></i
              >{{
                isSelectMonth
                  ? this.year + "年" + this.month + "月数据"
                  : this.defaultText
              }}
            </div>
          </stats-card>
        </div>

        <div
          class="col-xl-3 col-md-6"
          style="display: flex; align-items: center; margin-top: 66px"
          v-if="hasPermission('EDIT_FAMILY_BUDGET')"
        >
          <el-button type="info" @click="openBudgetDialog">
            {{
              totalBudget === null || totalBudget === ""
                ? "设置本月家庭组预算"
                : "修改本月家庭组预算"
            }}
          </el-button>
        </div>
      </div>
      <div class="row">
        <span style="margin-top: 26px; margin-left: 20px">选择月份：</span>
        <div style="margin-top: 18px">
          <div class="filter-bar" style="margin-bottom: 20px">
            <el-date-picker
              v-model="selectedMonth"
              type="month"
              placeholder="请选择月份"
              @change="handleMonthChange"
            >
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-md-8">
          <chart-card
            :key="this.lineChartIncomeKey"
            :chart-data="lineChartIncome.data"
            :chart-options="lineChartIncome.options"
            :responsive-options="lineChartIncome.responsiveOptions"
          >
            <template slot="header">
              <h4 class="card-title">收入月份记录表</h4>
              <p class="card-category">
                {{
                  isSelectMonth
                    ? this.year + "年" + this.month + "月数据"
                    : this.defaultText
                }}
              </p>
            </template>
            <template slot="footer">
              <div class="legend">
                <i class="fa fa-circle text-info"></i> 当天收入总金额
              </div>
              <hr />
              <div class="stats">
                <i class="fa fa-history"></i> Updated 3 minutes ago
              </div>
            </template>
          </chart-card>
        </div>

        <div class="col-md-4">
          <chart-card
            v-if="pieIncomeHasData"
            :key="pieChartIncomeKey"
            :chart-data="pieChartIncome.data"
            chart-type="Pie"
          >
            <template slot="header">
              <h4 class="card-title">收入分类比例统计</h4>
              <p class="card-category">
                {{
                  isSelectMonth
                    ? year + "年" + month + "月数据"
                    : "默认显示当前月份数据"
                }}
              </p>
            </template>
            <template slot="footer">
              <div class="legend">
                <span v-for="(item, index) in incomeCategories" :key="index">
                  <i class="fa fa-circle" :class="item.colorClass"></i>
                  {{ item.name }}
                </span>
              </div>
              <hr />
              <div class="stats">
                <i class="fa fa-clock-o"></i> Campaign sent 2 days ago
              </div>
            </template>
          </chart-card>
          <div
            v-else
            class="no-data-card"
            style="
              text-align: center;
              padding: 20px;
              border: 1px solid #ccc;
              height: 489px;
            "
          >
            <h4>收入分类比例统计</h4>
            <p>
              {{
                isSelectMonth
                  ? year + "年" + month + "月数据"
                  : "默认显示当前月份数据"
              }}
            </p>
            <div>当前月份暂无数据</div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-8">
          <chart-card
            :key="this.lineChartExpenseKey"
            :chart-data="lineChartExpense.data"
            :chart-options="lineChartExpense.options"
            :responsive-options="lineChartExpense.responsiveOptions"
          >
            <template slot="header">
              <h4 class="card-title">支出月份记录表</h4>
              <p class="card-category">
                {{
                  isSelectMonth
                    ? this.year + "年" + this.month + "月数据"
                    : this.defaultText
                }}
              </p>
            </template>
            <template slot="footer">
              <div class="legend">
                <i class="fa fa-circle text-info"></i> 当天支出总金额
                <!-- <i class="fa fa-circle text-danger"></i> Click
                <i class="fa fa-circle text-warning"></i> Click Second Time -->
              </div>
              <hr />
              <div class="stats">
                <i class="fa fa-history"></i> Updated 3 minutes ago
              </div>
            </template>
          </chart-card>
        </div>

        <div class="col-md-4">
          <chart-card
            v-if="pieExpenseHasData"
            :key="pieChartExpenseKey"
            :chart-data="pieChartExpense.data"
            chart-type="Pie"
          >
            <template slot="header">
              <h4 class="card-title">支出分类比例统计</h4>
              <p class="card-category">
                {{
                  isSelectMonth
                    ? year + "年" + month + "月数据"
                    : this.defaultText
                }}
              </p>
            </template>
            <template slot="footer">
              <div class="legend">
                <span v-for="(item, index) in expenseCategories" :key="index">
                  <i class="fa fa-circle" :class="item.colorClass"></i>
                  {{ item.name }}
                </span>
              </div>
              <hr />
              <div class="stats">
                <i class="fa fa-clock-o"></i> Campaign sent 2 days ago
              </div>
            </template>
          </chart-card>
          <div
            v-else
            class="no-data-card"
            style="
              text-align: center;
              padding: 20px;
              border: 1px solid #ccc;
              height: 489px;
            "
          >
            <h4>支出分类比例统计</h4>
            <p>
              {{
                isSelectMonth
                  ? year + "年" + month + "月数据"
                  : this.defaultText
              }}
            </p>
            <div>当前月份暂无数据</div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      :title="
        totalBudget === null || totalBudget === ''
          ? '设置本月家庭组预算'
          : '修改本月家庭组预算'
      "
      :visible.sync="setBudgetDialogVisible"
      width="30%"
      @close="resetBudgetForm"
    >
      <el-form :model="budgetForm" label-width="120px">
        <el-form-item label="预算金额">
          <el-input
            v-model="budgetForm.budget"
            placeholder="请输入本月预算金额"
            type="number"
            min="0"
          ></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="setBudgetDialogVisible = false">取消</el-button>
        <el-button
          v-if="totalBudget === null || totalBudget === ''"
          type="primary"
          @click="addBudget"
          >保存</el-button
        >
        <el-button v-else type="primary" @click="updateBudget">修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import ChartCard from "src/components/Cards/ChartCard.vue";
import StatsCard from "src/components/Cards/StatsCard.vue";
import LTable from "src/components/Table.vue";
import { hasPermission } from "@/utils/permission";

export default {
  components: {
    LTable,
    ChartCard,
    StatsCard,
  },
  watch: {
    pieExpenseHasData(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          // 确保图表被正确渲染
        });
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    console.log("beforeRouteEnter 触发");
    console.log("路由参数：", to.params);
    next((vm) => {
      if (typeof to.params.userId !== "undefined") {
        console.log("进入beforeRouterEnter的if判断");
        vm.userId = to.params.userId;
        localStorage.setItem("userId", to.params.userId);
      }
      console.log(
        "主页的beforeRouteEnter方法，读取localStorage的userId：" +
          localStorage.getItem("userId")
      );
    });
  },

  mounted() {
    console.log("组件已挂载");
    if (
      localStorage.getItem("userId") !== null &&
      localStorage.getItem("userId") !== "undefined"
    ) {
      console.log("进入判断userId可行性的循环内");
      this.userId = localStorage.getItem("userId");
    }
    console.log("当前的userId:" + this.userId);
    Promise.all([
      this.getFamilyInfoOfUser(),
      this.getMonthlyIncome(),
      this.getMonthlyExpense(),
      this.getMonthlyIncomeMaxValue(),
      this.getMonthlyExpenseMaxValue(),
      this.getMonthlyIncomeCategoryProportion(),
      this.getMonthlyExpenseCategoryProportion(),
    ]).then(() => {
      this.getMonthlyExpenseCategoryProportion();
    });
  },
  methods: {
    hasPermission,
    openBudgetDialog() {
      this.setBudgetDialogVisible = true;
      // 如果已有预算，就带入原始值；否则为空
      this.budgetForm.budget =
        this.totalBudget === null || this.totalBudget === ""
          ? ""
          : this.totalBudget;
    },
    getFamilyInfoOfUser() {
      axios({
        method: "get",
        url:
          "/api/family/getFamilyInfoOfUser?userId=" +
          localStorage.getItem("userId"),
      }).then((resp) => {
        if (resp.data.code == "200") {
          console.log("用户的家庭组信息:" + resp.data);
          this.family = resp.data.content;
          // this.user.family = this.family.familyName;
          this.getTotalBudget();
          this.getCurMonthTotalExpense();
        } else {
          console.log("当前用户没有家庭组");
        }
      });
    },
    resetBudgetForm() {
      this.budgetForm.budget = "";
    },
    getTotalBudget() {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;
      axios({
        method: "get",
        url:
          "/api/family/getTotalBudget?familyId=" +
          this.family.familyId +
          "&year=" +
          currentYear +
          "&month=" +
          currentMonth,
      }).then((resp) => {
        if (resp.data.code == "200") {
          this.totalBudget = resp.data.content;
        } else {
          console.log("当前用户没有家庭组");
        }
      });
    },
    addBudget() {
      if (!this.budgetForm.budget) {
        this.$message.warning("请输入预算金额");
        return;
      }

      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;
      axios({
        method: "post",
        url:
          "/api/family/addBudget?familyId=" +
          this.family.familyId +
          "&year=" +
          currentYear +
          "&month=" +
          currentMonth +
          "&budget=" +
          this.budgetForm.budget,
      }).then((resp) => {
        if (resp.data.code == "200") {
          this.getTotalBudget();
          this.$message.success("预算已保存");
        } else {
          this.$message(resp.data.msg);
        }
      });
      this.setBudgetDialogVisible = false;
    },
    updateBudget() {
      if (!this.budgetForm.budget) {
        this.$message.warning("请输入预算金额");
        return;
      }

      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;
      axios({
        method: "post",
        url:
          "/api/family/updateBudget?familyId=" +
          this.family.familyId +
          "&year=" +
          currentYear +
          "&month=" +
          currentMonth +
          "&budget=" +
          this.budgetForm.budget,
      }).then((resp) => {
        if (resp.data.code == "200") {
          this.getTotalBudget();
          this.$message.success("预算已保存");
        } else {
          this.$message(resp.data.msg);
        }
      });
      this.setBudgetDialogVisible = false;
    },
    generateMonthLabels(
      year = new Date().getFullYear(),
      month = new Date().getMonth() + 1
    ) {
      const daysInMonth = new Date(year, month, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) =>
        (i + 1).toString().padStart(2, "0")
      );
    },
    // 格式化日期为 YYYY-MM 格式
    formatMonth(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      return `${year}-${month}`;
    },
    // 处理月份选择变化
    handleMonthChange(value) {
      // 如果 value 是 Date 对象，直接使用 getFullYear 和 getMonth
      if (value instanceof Date) {
        this.year = value.getFullYear();
        this.month = value.getMonth() + 1;
      } else if (typeof value === "string") {
        // 如果 value 是字符串，可以解析
        const [year, month] = value.split("-").map(Number);
        this.year = year;
        this.month = month;
      }
      // 根据新的 year 和 month 调用接口刷新数据
      this.getMonthlyIncome();
      this.getMonthlyExpense();
      this.getMonthlyIncomeMaxValue();
      this.getMonthlyExpenseMaxValue();
      this.getMonthlyIncomeCategoryProportion();
      this.getMonthlyExpenseCategoryProportion();
      this.isSelectMonth = true;
    },
    getCurMonthTotalExpense() {
      axios({
        method: "get",
        url:
          "/api/family/getCurMonthTotalExpense?familyId=" +
          this.family.familyId,
      }).then(async (resp) => {
        if (resp.data.code === "200") {
          this.totalExpense = resp.data.content;
        } else {
          this.$message(resp.data.msg);
        }
      });
    },
    getMonthlyIncome() {
      axios({
        method: "get",
        url:
          "/api/transaction/monthlyIncome?userId=" +
          localStorage.getItem("userId") +
          "&year=" +
          this.year +
          "&month=" +
          this.month,
      }).then(async (resp) => {
        if (resp.data.code === "200") {
          this.$set(
            this.lineChartIncome.data,
            "labels",
            resp.data.content.labels
          );
          this.$set(
            this.lineChartIncome.data,
            "series",
            resp.data.content.series
          );
          this.$forceUpdate();
          // console.log("getMonthlyIncome执行成功");
          // console.log("getMonthlyIncome:" + resp.data.content);
          this.lineChartIncomeKey++;
        } else {
          this.$message(resp.data.msg);
        }
      });
    },
    getMonthlyExpense() {
      axios({
        method: "get",
        url:
          "/api/transaction/monthlyExpense?userId=" +
          localStorage.getItem("userId") +
          "&year=" +
          this.year +
          "&month=" +
          this.month,
      }).then(async (resp) => {
        if (resp.data.code === "200") {
          this.$set(
            this.lineChartExpense.data,
            "labels",
            resp.data.content.labels
          );
          this.$set(
            this.lineChartExpense.data,
            "series",
            resp.data.content.series
          );
          this.$forceUpdate();
          // console.log("getMonthlyExpense执行成功");
          // console.log("getMonthlyExpense:" + resp.data.content);
          this.lineChartExpenseKey++;
        } else {
          this.$message(resp.data.msg);
        }
      });
    },
    getMonthlyIncomeMaxValue() {
      axios({
        method: "get",
        url:
          "/api/transaction/getMonthlyMaxValue?userId=" +
          localStorage.getItem("userId") +
          "&type=" +
          "income" +
          "&year=" +
          this.year +
          "&month=" +
          this.month,
      }).then(async (resp) => {
        if (resp.data.code === "200") {
          this.$set(this.lineChartIncome.options, "high", resp.data.content);
          this.$forceUpdate();
          this.lineChartIncomeKey++;
        } else {
          this.$message(resp.data.msg);
        }
      });
    },
    getMonthlyExpenseMaxValue() {
      axios({
        method: "get",
        url:
          "/api/transaction/getMonthlyMaxValue?userId=" +
          localStorage.getItem("userId") +
          "&type=" +
          "expense" +
          "&year=" +
          this.year +
          "&month=" +
          this.month,
      }).then(async (resp) => {
        if (resp.data.code === "200") {
          this.$set(this.lineChartExpense.options, "high", resp.data.content);
          this.$forceUpdate();
          this.lineChartExpenseKey++;
        } else {
          this.$message(resp.data.msg);
        }
      });
    },
    getMonthlyIncomeCategoryProportion() {
      axios({
        method: "get",
        url:
          "/api/transaction/getMonthlyCategoryProportion?userId=" +
          localStorage.getItem("userId") +
          "&type=" +
          "income" +
          "&year=" +
          this.year +
          "&month=" +
          this.month,
      }).then(async (resp) => {
        if (resp.data.code === "200") {
          // 原始数据
          const labels = resp.data.content.labels;
          const series = resp.data.content.series[0];

          // 过滤掉数值为0的数据
          const filteredLabels = [];
          const filteredSeries = [];
          for (let i = 0; i < series.length; i++) {
            if (series[i] !== 0) {
              filteredLabels.push(labels[i]);
              filteredSeries.push(series[i]);
            }
          }

          this.pieIncomeHasData = filteredSeries.length > 0;

          // this.$set(this.pieChartIncome.data, "labels", filteredLabels);
          // this.$set(this.pieChartIncome.data, "series", filteredSeries);
          // this.incomeCategories = resp.data.content.categories
          //   .filter((_, index) => series[index] !== 0)
          //   .map((category, index) => ({
          //     name: category,
          //     colorClass:
          //       this.availableColors[index % this.availableColors.length],
          //   }));
          // console.log("pieChartIncome:", this.pieChartIncome.labels);
          // console.log("incomeCategories:", this.incomeCategories);

          if (this.pieIncomeHasData) {
            this.$set(this.pieChartIncome.data, "labels", filteredLabels);
            this.$set(this.pieChartIncome.data, "series", filteredSeries);
            // 同时更新图例（过滤为0的项）
            this.incomeCategories = resp.data.content.categories
              .filter((_, index) => series[index] !== 0)
              .map((category, index) => ({
                name: category,
                colorClass:
                  this.availableColors[index % this.availableColors.length],
              }));
          } else {
            // 清空图表数据
            this.$set(this.pieChartIncome.data, "labels", []);
            this.$set(this.pieChartIncome.data, "series", []);
            // 也可以清空图例
            this.incomeCategories = [];
          }
          this.$forceUpdate();
          this.pieChartIncomeKey++;
        } else {
          this.$message(resp.data.msg);
        }
      });
    },
    getMonthlyExpenseCategoryProportion() {
      axios({
        method: "get",
        url:
          "/api/transaction/getMonthlyCategoryProportion?userId=" +
          localStorage.getItem("userId") +
          "&type=" +
          "expense" +
          "&year=" +
          this.year +
          "&month=" +
          this.month,
      }).then(async (resp) => {
        if (resp.data.code === "200") {
          // 原始数据
          const labels = resp.data.content.labels;
          const series = resp.data.content.series[0];

          // 过滤掉数值为0的数据
          const filteredLabels = [];
          const filteredSeries = [];
          for (let i = 0; i < series.length; i++) {
            if (series[i] !== 0) {
              filteredLabels.push(labels[i]);
              filteredSeries.push(series[i]);
            }
          }

          this.pieExpenseHasData = filteredSeries.length > 0;

          // this.$set(this.pieChartExpense.data, "labels", filteredLabels);
          // this.$set(this.pieChartExpense.data, "series", filteredSeries);
          // this.expenseCategories = resp.data.content.categories
          //   .filter((_, index) => series[index] !== 0)
          //   .map((category, index) => ({
          //     name: category,
          //     colorClass:
          //       this.availableColors[index % this.availableColors.length],
          //   }));
          if (this.pieIncomeHasData) {
            this.$set(this.pieChartExpense.data, "labels", filteredLabels);
            this.$set(this.pieChartExpense.data, "series", filteredSeries);
            // 同时更新图例（过滤为0的项）
            this.expenseCategories = resp.data.content.categories
              .filter((_, index) => series[index] !== 0)
              .map((category, index) => ({
                name: category,
                colorClass:
                  this.availableColors[index % this.availableColors.length],
              }));
          } else {
            // 清空图表数据
            this.$set(this.pieChartExpense.data, "labels", []);
            this.$set(this.pieChartExpense.data, "series", []);
            // 也可以清空图例
            this.expenseCategories = [];
          }
          console.log("pieChartExpense:", this.pieChartExpense);
          this.$forceUpdate();
          this.pieChartExpenseKey++;
        } else {
          this.$message(resp.data.msg);
        }
      });
    },
  },
  data() {
    return {
      isPageLoaded: false,
      lineChartIncomeKey: 1,
      lineChartExpenseKey: 1,
      pieChartIncomeKey: 1,
      pieChartExpenseKey: 1,
      editTooltip: "Edit Task",
      deleteTooltip: "Remove",
      setBudgetDialogVisible: false,
      userId: "",
      totalBudget: null,
      totalExpense: "",
      selectTime: "",
      defaultText: "默认显示当前月份数据",
      pieIncomeHasData: false,
      pieExpenseHasData: false,
      incomeCategories: [],
      expenseCategories: [],
      availableColors: [
        "text-info",
        "text-danger",
        "text-warning",
        "text-success",
        "text-primary",
        "text-dark",
      ],
      family: {
        familyId: "",
        familyName: "暂未加入家庭组",
        familyCode: "暂未加入家庭组",
        currentBudget: "",
        createAt: "",
        updateAt: "",
      },
      isSelectMonth: false,
      budgetForm: {
        budget: "",
      },
      selectedMonth: this.formatMonth(new Date()),
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      pieChartIncome: {
        data: {
          labels: ["78%", "14%", "8%"],
          series: [78, 14, 8],
        },
      },
      pieChartExpense: {
        data: {
          labels: ["66%", "34%", "10%"],
          series: [66, 34, 10],
        },
      },
      lineChartIncome: {
        data: {
          labels: this.generateMonthLabels(),
          series: [
            [
              0.0, 0.0, 0.0, 888.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
              0.0, 0.0, 0.0, 0.0, 0.0, 33.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
              0.0, 0.0, 0.0, 452.11, 0.0,
            ],
          ],
        },
        options: {
          low: 0,
          high: 1000,
          showArea: false,
          height: "245px",
          axisX: {
            showGrid: false,
          },
          lineSmooth: true,
          showLine: true,
          showPoint: true,
          fullWidth: true,
          chartPadding: {
            right: 50,
          },
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              axisX: {
                labelInterpolationFnc(value) {
                  return value[0];
                },
              },
            },
          ],
        ],
      },
      lineChartExpense: {
        data: {
          labels: this.generateMonthLabels(),
          series: [
            [
              0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 661.0, 0.0, 0.0, 0.0,
              0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 221.0, 0.0, 0.0, 0.0, 0.0, 0.0,
              0.0, 0.0, 0.0, 567.11, 0.0,
            ],
          ],
        },
        options: {
          low: 0,
          high: 1000,
          showArea: false,
          height: "245px",
          axisX: {
            showGrid: false,
          },
          lineSmooth: true,
          showLine: true,
          showPoint: true,
          fullWidth: true,
          chartPadding: {
            right: 50,
          },
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              axisX: {
                labelInterpolationFnc(value) {
                  return value[0];
                },
              },
            },
          ],
        ],
      },
      barChart: {
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "Mai",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          series: [
            [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895],
            [412, 243, 280, 580, 453, 353, 300, 364, 368, 410, 636, 695],
          ],
        },
        options: {
          seriesBarDistance: 10,
          axisX: {
            showGrid: false,
          },
          height: "245px",
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc(value) {
                  return value[0];
                },
              },
            },
          ],
        ],
      },
      tableData: {
        data: [
          {
            title:
              'Sign contract for "What are conference organizers afraid of?"',
            checked: false,
          },
          {
            title:
              "Lines From Great Russian Literature? Or E-mails From My Boss?",
            checked: true,
          },
          {
            title:
              "Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit",
            checked: true,
          },
          {
            title: "Create 4 Invisible User Experiences you Never Knew About",
            checked: false,
          },
          { title: 'Read "Following makes Medium better"', checked: false },
          { title: "Unfollow 5 enemies from twitter", checked: false },
        ],
      },
    };
  },
};
</script>
<style>
</style>
