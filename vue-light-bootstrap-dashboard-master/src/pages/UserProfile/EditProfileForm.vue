<template>
  <div>
    <card>
      <h4 slot="header" class="card-title">用户信息</h4>
      <form @submit.prevent="updateUserProfile">
        <div class="row">
          <div class="col-md-3">
            <base-input
              type="text"
              label="Username"
              placeholder="Username"
              v-model="user.username"
            >
            </base-input>
          </div>
          <div class="col-md-4">
            <base-input
              type="text"
              label="Phone"
              :disabled="true"
              placeholder="Phone"
              v-model="user.phone"
            >
            </base-input>
          </div>
        </div>

        <div class="text-center">
          <button
            type="submit"
            class="btn btn-info btn-fill float-right"
            @click.prevent="updateUserProfile()"
          >
            更新信息
          </button>
        </div>
        <div class="clearfix"></div>
      </form>
    </card>

    <card>
      <h4 slot="header" class="card-title">当前家庭组</h4>
      <form>
        <div class="row">
          <div class="col-md-4">
            <base-input
              type="text"
              label="Family Name"
              placeholder="Family Name"
              v-model="family.familyName"
              :disabled="true"
            >
            </base-input>
          </div>
          <!-- <div class="col-md-6">
            <base-input
              type="text"
              label="Family Code"
              placeholder="Family Code"
              v-model="family.familyCode"
              :disabled="true"
            >
            </base-input>
          </div> -->
          <div class="col-md-4">
            <template v-if="hasPermission('INVITE_MEMBER')">
              <base-input
                type="text"
                label="Family Code"
                placeholder="Family Code"
                v-model="family.familyCode"
                :disabled="true"
              >
              </base-input>
            </template>
            <template v-else>
              <base-input
                type="text"
                label="Family Code"
                placeholder="Family Code"
                v-model="noviewCode"
                :disabled="true"
              >
              </base-input>
            </template>
          </div>
        </div>

        <div v-show="isFamilyEmpty" class="text-center">
          <!-- <button
            type="submit"
            class="btn btn-info btn-fill float-right"
            style="margin-left: 15px"
            @click.prevent="updateToFamilyProfile()"
          >
            跳转到家庭组信息页面
          </button> -->
          <button
            type="submit"
            class="btn btn-info btn-fill float-right"
            style="margin-left: 15px"
            @click="showCreateFamilyDialog()"
          >
            创建家庭组
          </button>
          <button
            type="submit"
            class="btn btn-info btn-fill float-right"
            style="margin-left: 15px"
            @click="showJoinFamilyDialog()"
          >
            加入家庭组
          </button>
        </div>
        <!-- 下面是 有 家庭组 的情况 -->
        <div v-show="!isFamilyEmpty" class="text-center">
          <button
            type="submit"
            class="btn btn-info btn-fill float-right"
            style="margin-left: 15px"
            @click.prevent="updateToFamilyProfile()"
          >
            跳转到家庭组信息
          </button>
          <button
            type="submit"
            class="btn btn-info btn-fill float-right"
            style="margin-left: 15px"
            @click="showChangeFamilyDialog()"
          >
            更换家庭组
          </button>
          <button
            type="submit"
            class="btn btn-info btn-fill float-right"
            style="margin-left: 15px"
            @click="centerDialogVisible = true"
          >
            退出家庭组
          </button>
        </div>
        <div class="clearfix"></div>
      </form>
    </card>

    <!-- 创建家庭组对话框 -->
    <el-dialog
      :visible="createFamilyDialog"
      title="创建家庭组"
      width="30%"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form :model="form" :rules="rules" ref="createFamilyForm">
        <el-form-item
          label="新家庭组名称"
          prop="newFamilyName"
          label-width="auto"
        >
          <el-input
            v-model="form.newFamilyName"
            placeholder="请输入新家庭组名称"
            style="font-family: \5E7C\5706; font-size: 16px"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createFamilyDialog = false">取消</el-button>
          <el-button type="primary" @click="submitCreateFamily()"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- 加入家庭组对话框 -->
    <el-dialog
      :visible="joinFamilyDialog"
      title="加入家庭组"
      width="30%"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <el-form :model="joinFamilyForm" :rules="rules" ref="joinFamilyForm">
        <el-form-item
          label="家庭组编码"
          prop="newFamilyCode"
          label-width="100px"
        >
          <el-input
            v-model="joinFamilyForm.newFamilyCode"
            placeholder="请输入家庭组编码"
            style="font-family: \5E7C\5706; font-size: 16px"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="joinFamilyDialog = false">取消</el-button>
          <el-button type="primary" @click="submitJoinFamily()">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      :visible="changeFamilyDialog"
      title="更改家庭组"
      width="30%"
      :close-on-click-modal="false"
    >
      <el-form :model="changeFamilyForm" :rules="rules" ref="changeFamilyForm">
        <el-form-item
          label="新家庭组编号"
          prop="newFamilyCode"
          label-width="auto"
        >
          <el-input
            v-model="changeFamilyForm.newFamilyCode"
            placeholder="请输入要加入的新家庭组编号"
            style="font-family: '微软雅黑'; font-size: 16px"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="changeFamilyDialog = false">取消</el-button>
        <el-button type="primary" @click="submitChangeFamily">确定</el-button>
      </template>
    </el-dialog>

    <!-- 退出家庭组对话框 -->
    <el-dialog
      :visible="centerDialogVisible"
      title="Warning"
      width="500"
      align-center
    >
      <span style="font-size: 16px">您确定要退出当前家庭组吗？</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="exitFamily()"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import Card from "src/components/Cards/Card.vue";
import axios from "axios";
import { EventBus } from "../../utils/event-bus";
import { hasPermission } from "@/utils/permission";
export default {
  mounted() {
    this.getUserInfo();
    this.getFamilyInfoOfUser();
  },
  computed: {
    // 计算属性：判断 user.family 是否为空
    // isFamilyEmpty() {
    //   return !this.user.family || this.user.family.trim() === "";
    // },
    isFamilyEmpty() {
      return !this.family.familyId; // 更准确
    },
  },
  props: {
    username: String,
  },
  emits: ["user-updated"],
  components: {
    Card,
  },
  data() {
    return {
      user: {
        id: "",
        username: "temp",
        phone: "123456",
        family: "",
      },
      noviewCode: "您没有查询家庭组编码的权限",
      family: {
        familyId: "",
        familyName: "暂未加入家庭组",
        familyCode: "暂未加入家庭组",
        currentBudget: "",
        createAt: "",
        updateAt: "",
      },
      centerDialogVisible: false,
      joinFamilyDialog: false,
      changeFamilyDialog: false,
      createFamilyDialog: false,
      form: {
        newUsername: "",
        newPhone: "",
        familyCode: "",
        newFamilyCode: "",
      },
      // 表单数据
      changeFamilyForm: {
        newFamilyCode: "",
      },
      joinFamilyForm: {
        newFamilyCode: "",
      },
      rules: {
        newPhone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入有效的手机号",
            trigger: "blur",
          },
        ],
        familyCode: [
          { required: true, message: "家庭组编码不能为空", trigger: "blur" },
          {
            pattern: /^FAM-\w{8}$/,
            message: "编码格式为FAM-加8位字符",
            trigger: "blur",
          },
        ],
        newFamilyCode: [
          { required: true, message: "新家庭组编码不能为空", trigger: "blur" },
          {
            pattern: /^FAM-\w{8}$/,
            message: "编码格式为FAM-加8位字符",
            trigger: "blur",
          },
        ],
        newUsername: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          {
            min: 2,
            max: 12,
            message: "长度在 1 到 50 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    hasPermission,
    updateUserProfile() {
      axios({
        method: "post",
        url: "/api/user/updateUserProfile",
        data: this.user,
      }).then((resp) => {
        if (resp.data.code === "200") {
          this.$message({
            showClose: true,
            message: "信息更新成功!",
          });
          localStorage.setItem("username", this.user.username);
          this.$emit("user-updated", this.user.username);
          EventBus.$emit("username-updated", this.user.username); // 广播给全局
        } else {
          this.$message(resp.data.msg);
        }
      });
    },
    updateToFamilyProfile() {
      this.$router.push("/admin/family");
    },
    showCreateFamilyDialog() {
      console.log("让对话框弹出");
      this.createFamilyDialog = true;
      console.log("this.createFamilyDiaglog=" + this.createFamilyDialog);
    },
    getUserInfo() {
      axios({
        method: "get",
        url: "/api/user/userInfo?userId=" + localStorage.getItem("userId"),
      }).then((resp) => {
        console.log("用户信息:" + resp);
        this.user = resp.data.content;
        localStorage.setItem("username", this.user.username);
      });
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
          this.user.family = this.family.familyName;
        } else {
          console.log("当前用户没有家庭组");
        }
      });
    },
    exitFamily() {
      axios({
        method: "post",
        url:
          "/api/user/exitFamily?userId=" +
          localStorage.getItem("userId") +
          "&familyId=" +
          this.family.familyId,
      }).then((resp) => {
        if (resp.data.code == "200") {
          this.$message({
            showClose: true,
            message: "退出成功!",
          });
          this.family.familyId = "";
          this.family.familyCode = "";
          this.family.familyName = "";
          this.family.currentBudget = "";
          this.family.createAt = "";
          this.family.updateAt = "";
          this.user.family = "";
          localStorage.setItem("family", "");
          this.$bus.$emit("family-updated");
        } else {
          this.$message({
            showClose: true,
            message: resp.data.msg,
          });
        }
        this.centerDialogVisible = false;
      });
    },
    // 家庭组相关操作
    showJoinFamilyDialog() {
      this.joinFamilyDialog = true;
      this.joinFamilyForm.newFamilyCode = "";
      console.log("showJoinFamilyDialog方法执行：" + this.joinFamilyDialog);
    },
    submitCreateFamily() {
      this.$refs.createFamilyForm.validate((valid) => {
        if (valid) {
          axios({
            method: "post",
            url:
              "/api/family/createFamily?userId=" +
              localStorage.getItem("userId") +
              "&familyName=" +
              this.form.newFamilyName,
          }).then((resp) => {
            if (resp.data.code == "200") {
              console.log("用户信息:" + resp);
              this.family = resp.data.content;
              console.log("this.family的form=" + this.family.familyId);
              console.log("this.family的form=" + this.family.familyName);
              console.log("this.family的form=" + this.family.familyCode);
              console.log("this.family的form=" + this.family.currentBudget);
              console.log("this.family的form=" + this.family.createAt);
              console.log("this.family的form=" + this.family.updateAt);
              this.user.family = this.family.familyName;
              localStorage.setItem("family", this.family.familyCode);
              this.$bus.$emit("family-updated");
              this.$message({
                showClose: true,
                message: "创建成功!",
              });
              this.form.newFamilyName = "";
            } else {
              this.$message({
                showClose: true,
                message: this.resp.data.msg,
              });
            }
          });
          this.createFamilyDialog = false;
        }
      });
    },
    submitJoinFamily() {
      this.$refs.joinFamilyForm.validate((valid) => {
        if (valid) {
          axios({
            method: "post",
            url:
              "/api/family/joinFamily?userId=" +
              localStorage.getItem("userId") +
              "&familyCode=" +
              this.joinFamilyForm.newFamilyCode,
          }).then((resp) => {
            if (resp.data.code == "200") {
              console.log("用户信息:" + resp);
              this.family = resp.data.content;
              this.user.family = this.family.familyName;
              localStorage.setItem("family", this.family.familyCode);
              this.$message({
                showClose: true,
                message: "加入成功!",
              });
              this.joinFamilyForm.newFamilyCode = "";
              this.$bus.$emit("family-updated");
            } else {
              this.$message({
                showClose: true,
                message: resp.data.msg,
              });
            }
          });
          this.joinFamilyDialog = false;
        }
      });
    },

    showChangeFamilyDialog() {
      this.changeFamilyForm.newFamilyCode = "";
      this.changeFamilyDialog = true;
      console.log("showChangeFamilyDialog执行：" + this.changeFamilyDialog);
    },

    submitChangeFamily() {
      this.$refs.changeFamilyForm.validate((valid) => {
        if (valid) {
          axios({
            method: "post",
            url:
              "/api/user/changeFamily?userId=" +
              localStorage.getItem("userId") +
              "&familyCode=" +
              this.changeFamilyForm.newFamilyCode,
          }).then((resp) => {
            if (resp.data.code == "200") {
              console.log("用户信息:" + resp);
              this.family = resp.data.content;
              this.user.family = this.family.familyName;
              this.$message({
                showClose: true,
                message: "更换家庭组成功!",
              });
              this.changeFamilyForm.newFamilyCode = "";
            } else {
              this.$message({
                showClose: true,
                message: resp.data.msg,
              });
            }
          });
          this.changeFamilyDialog = false;
        }
      });
    },
  },
};
</script>
<style>
</style>
