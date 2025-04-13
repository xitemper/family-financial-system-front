<!-- <template>
  <div class="container1">
    <el-form class="formClass" ref="registerForm" :model="registerForm">
      <h2 class="title">用户注册</h2>
      <el-form-item>
        <el-input
          v-model="registerForm.username"
          placeholder="请输入用户名"
        ></el-input>
      </el-form-item>
      <el-form-item :error="phoneError">
        <el-input
          v-model="registerForm.phone"
          placeholder="请输入手机号"
          @input="validatePhone"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="isPhoneValid">
        <el-input
          v-model="registerForm.vercode"
          placeholder="请输入验证码"
          style="width: 100%; position: relative"
        >
          <template #suffix>
            <el-button
              type="warning"
              :disabled="countdown > 0"
              @click="sendCode"
              style="
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                padding: 0 10px;
              "
            >
              {{ countdown > 0 ? `${countdown}s后重试` : "获取验证码" }}
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="registerForm.password"
          placeholder="请输入密码"
          show-password
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="Register" block style="width: 100%"
          >注册</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  methods: {
    Register() {
      axios({
        method: "post",
        url:
          "/api/user/register?username=" +
          this.registerForm.username +
          "&phone=" +
          this.registerForm.phone +
          "&vercode=" +
          this.registerForm.vercode +
          "&password=" +
          this.registerForm.password,
      }).then(async (resp) => {
        console.log(resp.data);
        if (resp.data.code == "200") {
          this.$message({
            showClose: true,
            message: "注册成功，即将跳转至登录页面",
          });
          await new Promise((resolve) => setTimeout(resolve, 5000));
          this.$router.push("/login");
        } else {
          this.$message.error(resp.data.msg);
        }
      });
    },
    // 发送验证码（模拟）
    sendCode() {
      if (!this.isPhoneValid) {
        this.phoneError = "请输入正确的手机号后再获取验证码";
        return;
      }

      axios({
        method: "post",
        url:
          "/api/user/generateVercode?phone=" +
          this.registerForm.phone +
          "&type=" +
          2,
      }).then(async (resp) => {
        if ((resp.data.code = "200")) {
          this.$message.success("验证码已发送，请查收！");
        } else {
          this.$message.error(resp.data.content);
        }
      });
      // 开启倒计时
      this.countdown = 60;
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.timer);
        }
      }, 1000);
    }, // 验证手机号格式
    validatePhone() {
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (this.registerForm.phone.match(phoneRegex)) {
        this.isPhoneValid = true;
        this.phoneError = "";
      } else {
        this.isPhoneValid = false;
        this.phoneError = "请输入正确的手机号";
      }
    },
  },
  data() {
    return {
      registerForm: {
        username: "",
        phone: "",
        vercode: "",
        password: "",
      },
      result: {
        code: "", // 状态码 200 500
        msg: "", // 返回描述
        content: {}, // 内容（可能是对象、数组或其他类型）
      },
      isPhoneValid: false, // 记录手机号是否验证通过
      phoneError: "", // 记录手机号错误信息
      countdown: 0, // 倒计时
      timer: null, // 定时器
    };
  },
};
</script>

<style>
.container1 {
  background-image: url(../assets/fenjing.jpg);
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.formClass {
  background-color: white;
  padding: 30px;
  width: 400px; 
  border-radius: 10px; 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); 
  text-align: center;
}

.el-form-item {
  width: 100%;
}
</style> -->

<template>
  <div class="container1">
    <el-form class="formClass" ref="registerForm" :model="registerForm">
      <h2 class="title">用户注册</h2>

      <!-- 用户名 -->
      <el-form-item :error="usernameError">
        <el-input
          v-model="registerForm.username"
          placeholder="请输入用户名"
          @blur="validateUsername"
        ></el-input>
      </el-form-item>

      <!-- 手机号 -->
      <el-form-item :error="phoneError">
        <el-input
          v-model="registerForm.phone"
          placeholder="请输入手机号"
          @input="validatePhone"
          @blur="validatePhone"
        ></el-input>
      </el-form-item>

      <!-- 验证码（根据手机号合法性显示） -->
      <el-form-item v-if="isPhoneValid" :error="vercodeError">
        <el-input
          v-model="registerForm.vercode"
          placeholder="请输入验证码"
          style="width: 100%; position: relative"
          @blur="validateVercode"
        >
          <template #suffix>
            <el-button
              type="warning"
              :disabled="countdown > 0"
              @click="sendCode"
              style="
                position: absolute;
                right: 0;
                top: 50%;
                transform: translateY(-50%);
                padding: 0 10px;
              "
            >
              {{ countdown > 0 ? `${countdown}s后重试` : "获取验证码" }}
            </el-button>
          </template>
        </el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-form-item :error="passwordError">
        <el-input
          v-model="registerForm.password"
          placeholder="请输入密码"
          show-password
          @blur="validatePassword"
        ></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="Register" block style="width: 100%">
          注册
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      registerForm: {
        username: "",
        phone: "",
        vercode: "",
        password: "",
      },
      // 错误提示变量
      usernameError: "",
      phoneError: "",
      vercodeError: "",
      passwordError: "",
      // 标记手机号是否通过验证
      isPhoneValid: false,
      // 倒计时变量
      countdown: 0,
      timer: null,
    };
  },
  methods: {
    // 验证用户名不能为空
    validateUsername() {
      if (!this.registerForm.username) {
        this.usernameError = "请输入用户名";
      } else {
        this.usernameError = "";
      }
    },
    // 验证手机号（与之前方式类似）
    validatePhone() {
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (this.registerForm.phone.match(phoneRegex)) {
        this.isPhoneValid = true;
        this.phoneError = "";
      } else {
        this.isPhoneValid = false;
        this.phoneError = "请输入正确的手机号";
      }
    },
    // 验证验证码不能为空
    validateVercode() {
      if (!this.registerForm.vercode) {
        this.vercodeError = "请输入验证码";
      } else {
        this.vercodeError = "";
      }
    },
    // 验证密码长度
    validatePassword() {
      const pass = this.registerForm.password;
      if (!pass) {
        this.passwordError = "请输入密码";
      } else if (pass.length < 8 || pass.length > 20) {
        this.passwordError = "密码长度应在 8 到 20 个字符之间";
      } else {
        this.passwordError = "";
      }
    },
    // 模拟发送验证码
    sendCode() {
      if (!this.isPhoneValid) {
        this.phoneError = "请输入正确的手机号后再获取验证码";
        return;
      }
      // 发送验证码请求
      axios({
        method: "post",
        url:
          "/api/user/generateVercode?phone=" +
          this.registerForm.phone +
          "&type=2",
      }).then((resp) => {
        if (resp.data.code === "200") {
          this.$message.success("验证码已发送，请查收！");
        } else {
          this.$message.error(resp.data.content);
        }
      });
      // 开始倒计时
      this.countdown = 60;
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
        } else {
          clearInterval(this.timer);
        }
      }, 1000);
    },
    // 手动综合验证所有字段，并返回验证是否通过
    validateAll() {
      this.validateUsername();
      this.validatePhone();
      // 如果手机号验证通过，再验证验证码
      if (this.isPhoneValid) {
        this.validateVercode();
      }
      this.validatePassword();
      return (
        !this.usernameError &&
        !this.phoneError &&
        (!this.isPhoneValid || !this.vercodeError) && // 当手机号有效时验证码不能为空
        !this.passwordError
      );
    },
    // 注册操作
    Register() {
      // 先调用各项验证
      if (!this.validateAll()) {
        this.$message.error("表单验证失败！");
        return;
      }
      // 如果验证通过，再提交注册请求
      axios({
        method: "post",
        url:
          "/api/user/register?username=" +
          this.registerForm.username +
          "&phone=" +
          this.registerForm.phone +
          "&vercode=" +
          this.registerForm.vercode +
          "&password=" +
          this.registerForm.password,
      }).then(async (resp) => {
        console.log(resp.data);
        if (resp.data.code === "200") {
          this.$message({
            showClose: true,
            message: "注册成功，即将跳转至登录页面",
          });
          await new Promise((resolve) => setTimeout(resolve, 5000));
          this.$router.push("/login");
        } else {
          this.$message.error(resp.data.msg);
        }
      });
    },
  },
};
</script>

<style>
.container1 {
  background-image: url(../assets/fenjing.jpg);
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.formClass {
  background-color: white;
  padding: 30px;
  width: 400px; /* 固定宽度 */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.el-form-item {
  width: 100%;
}

.title {
  font-size: 30px;
  font-family: sans-serif;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
