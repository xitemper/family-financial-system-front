<template>
  <div>
    <card class="card-user">
      <img
        slot="image"
        src="https://ununsplash.imgix.net/photo-1431578500526-4d9613015464?fit=crop&fm=jpg&h=300&q=75&w=400"
        alt="..."
      />
      <div class="author">
        <a href="#">
          <img
            class="avatar border-gray"
            src="
https://xitemper.oss-cn-guangzhou.aliyuncs.com/%E5%AE%B6%E5%BA%AD%E8%B4%A2%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%94%A8%E6%88%B7%E5%A4%B4%E5%83%8F.jpg"
            alt="..."
          />

          <h4 class="title">{{ username }}<br /></h4>
        </a>
      </div>

      <p class="description text-center">
        “Budget Tracker Precision <br />
        Your family’s finances so streamlined <br />
        I’m in that comprehensive finance system”
      </p>
    </card>
    <el-button
      icon="el-icon-edit"
      @click="openAlertPasswordDialog()"
      type="primary"
      round
      >修改密码</el-button
    >

    <el-dialog :visible.sync="alertPasswordDialogVisible" title="新增收支记录">
      <el-form
        :model="passwordForm"
        :rules="rules"
        ref="passwordFormRef"
        label-width="120px"
      >
        <el-form-item label="当前密码" prop="curPassword">
          <el-input
            type="password"
            v-model="passwordForm.curPassword"
            placeholder="请输入当前密码"
          ></el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            type="password"
            v-model="passwordForm.newPassword"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>

        <el-form-item label="确认新密码" prop="checkNewPassword">
          <el-input
            type="password"
            v-model="passwordForm.checkNewPassword"
            placeholder="请输入确认新密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alertPasswordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import Card from "src/components/Cards/Card.vue";
export default {
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  // mounted() {
  //   this.username = localStorage.getItem("username");
  // },
  components: {
    Card,
  },
  data() {
    return {
      // username: "",
      alertPasswordDialogVisible: false,
      details: [
        {
          title: "12",
          subTitle: "Files",
        },
        {
          title: "2GB",
          subTitle: "Used",
        },
        {
          title: "24,6$",
          subTitle: "Spent",
        },
      ],
      passwordForm: {
        curPassword: "",
        newPassword: "",
        checkNewPassword: "",
      },
      rules: {
        curPassword: [
          { required: true, message: "请输入当前密码", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "密码长度应在 6 到 20 个字符之间",
            trigger: "blur",
          },
        ],
        checkNewPassword: [
          { required: true, message: "请确认新密码", trigger: "blur" },
          { validator: this.validateConfirmPassword, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    openAlertPasswordDialog() {
      (this.passwordForm = {
        curPassword: "",
        newPassword: "",
        checkNewPassword: "",
      }),
        (this.alertPasswordDialogVisible = true);
    },
    // 提交表单
    handleSubmit() {
      this.$refs.passwordFormRef.validate((valid) => {
        if (valid) {
          // 校验通过，发送请求
          this.changePassword();
        } else {
          this.$message.error("表单验证失败！");
          return false;
        }
      });
    },
    // 校验确认密码与新密码是否一致
    validateConfirmPassword(rule, value, callback) {
      if (value === this.passwordForm.newPassword) {
        callback();
      } else {
        callback(new Error("确认密码与新密码不一致"));
      }
    },
    getClasses(index) {
      var remainder = index % 3;
      if (remainder === 0) {
        return "col-md-3 col-md-offset-1";
      } else if (remainder === 2) {
        return "col-md-4";
      } else {
        return "col-md-3";
      }
    },
    changePassword() {
      axios({
        method: "post",
        url:
          "/api/user/changePassword?userId=" +
          localStorage.getItem("userId") +
          "&curPassword=" +
          this.passwordForm.curPassword +
          "&newPassword=" +
          this.passwordForm.newPassword,
      }).then((resp) => {
        if (resp.data.code === "200") {
          this.$message({
            showClose: true,
            message: "密码更新成功!",
          });
        } else {
          this.$message({
            message: resp.data.msg,
            type: "error",
          });
        }
      });
      (this.passwordForm = {
        curPassword: "",
        newPassword: "",
        checkNewPassword: "",
      }),
        (this.alertPasswordDialogVisible = false);
    },
  },
};
</script>
<style scoped>
</style>
