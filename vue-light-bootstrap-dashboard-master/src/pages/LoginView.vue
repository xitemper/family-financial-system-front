<template>
  <!-- <div class="container">
    <div style="height: 20%"></div>
    <el-form
      class="formClass"
      ref="loginForm"
      :model="loginForm"
      label-width="80px"
      style="width: 30%; margin-left: 1000px; height: 55%"
    >
      <br />
      <label style="font-size: 30px; font-family: \5E7C\5706; font-weight: bold"
        >用户登录</label
      >
      <el-form-item
        label="用户名"
        style="width: 300px; color: white; margin-top: 40px"
      >
        <el-input
          v-model="loginForm.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        style="width: 300px; color: white; margin-top: 30px"
      >
        <el-input
          v-model="loginForm.password"
          placeholder="请输入密码"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item style="margin-right: 150px; margin-top: 40px">
        <el-button type="primary" @click="Login" round>登录</el-button>
        <el-button type="primary" round plain @click="jumpToRegister"
          >点此注册账户</el-button
        >
      </el-form-item>
    </el-form>
  </div> -->
  <div class="containerLogin">
    <el-form
      class="formClassLogin"
      ref="loginForm"
      :model="loginForm"
      label-width="80px"
    >
      <h2 class="titleLogin">用户登录</h2>
      <el-form-item label="用户名">
        <el-input
          v-model="loginForm.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input
          v-model="loginForm.password"
          placeholder="请输入密码"
          show-password
        ></el-input>
      </el-form-item>
      <!-- <el-form-item class="button-groupLogin">
        <el-button type="primary" @click="Login" round>登录</el-button>
        <el-button type="primary" round plain @click="jumpToRegister"
          >点此注册账户</el-button
        >
      </el-form-item> -->
      <el-form-item class="button-groupLogin" label-width="0">
        <div class="button-container">
          <el-button type="primary" @click="Login" round>登录</el-button>
          <el-button type="primary" round plain @click="jumpToRegister"
            >点此注册账户</el-button
          >
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import { loadUserPermissions } from "@/utils/permission";
export default {
  methods: {
    jumpToRegister() {
      this.$router.push("/register");
    },
    Login() {
      axios({
        method: "get",
        url:
          "/api/user/login?username=" +
          this.loginForm.username +
          "&password=" +
          this.loginForm.password,
      }).then(async (resp) => {
        this.user = resp.data.content;
        if (resp.data.code === "200") {
          // 调用获取家庭信息，并等待其执行完成
          localStorage.setItem("userId", this.user.id);
          await this.getFamilyInfoOfUser();
          console.log(
            "登录页面执行登录方法后，当前的localStorage中的family：" +
              localStorage.getItem("family")
          );
          this.$message({
            showClose: true,
            message: "登录成功!",
          });
          const userId = localStorage.getItem("userId");
          if (userId) {
            loadUserPermissions(userId);
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
          this.$router.push("/admin/overview/" + this.user.id);
        } else {
          this.$message(resp.data.msg);
        }
      });
    },
    getFamilyInfoOfUser() {
      return axios({
        method: "get",
        url:
          "/api/family/getFamilyInfoOfUser?userId=" +
          localStorage.getItem("userId"),
      }).then((resp) => {
        if (resp.data.code == "200") {
          console.log("用户的家庭组信息:", resp.data.content);
          this.family = resp.data.content;
          localStorage.setItem("family", this.family.familyCode); // 此时才安全
        } else {
          console.log("当前用户没有家庭组");
          localStorage.setItem("family", ""); // 确保为 ""，让 isFamilyEmpty 判断成立
        }
      });
    },
  },
  data() {
    return {
      username: "",
      password: "",
      loginForm: {
        username: "",
        password: "",
      },
      user: {
        id: "",
        username: "",
      },
      family: {
        familyId: "",
        familyName: "temp",
        familyCode: "",
        currentBudget: "",
        createAt: "",
        updateAt: "",
      },
    };
  },
};
</script>

<style scoped>
/*.container {
  background-image: url(../assets/reg_bg_min.jpg);
  background-size: cover;
  height: 97vh;
  background-position: center;
}
.formClass {
  border-radius: 12px;
  background-color: white;
} */
/* 让页面整体居中 */
.containerLogin {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 97vh;
  background: url(../assets/reg_bg_min.jpg) no-repeat center center;
  background-size: cover;
}

/* 设置表单的大小和样式 */
.formClassLogin {
  width: 350px;
  padding: 30px;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 让标题居中 */
.titleLogin {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.button-groupLogin {
  width: 100%; /* 确保按钮组和输入框对齐 */
  display: flex;
  justify-content: center; /* 让按钮水平居中 */
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 20px; /* 调整按钮间距 */
  width: 100%;
}
</style>