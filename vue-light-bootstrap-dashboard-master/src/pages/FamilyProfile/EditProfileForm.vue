<template>
  <div>
    <card>
      <h4 slot="header" class="card-title">家庭组信息</h4>
      <form>
        <div class="row">
          <div class="col-md-4">
            <base-input
              type="text"
              label="Family Name"
              placeholder="Family Name"
              v-model="family.familyName"
              :disabled="!hasPermission('ALERT_FAMILY_PROFILE')"
            >
            </base-input>
          </div>
          <div class="col-md-4">
            <!-- <base-input
              type="text"
              label="Family Code"
              placeholder="Family Code"
              v-model="family.familyCode"
              :disabled="true"
            >
            </base-input> -->
            <template v-if="hasPermission('INVITE_MEMBER')">
              <base-input
                type="text"
                label="Family Code"
                placeholder="Family Code"
                v-model="family.familyCode"
                :disabled="!hasPermission('ALERT_FAMILY_PROFILE')"
              >
              </base-input>
            </template>
            <template v-else>
              <base-input
                type="text"
                label="Family Code"
                placeholder="Family Code"
                v-model="noviewCode"
                :disabled="!hasPermission('ALERT_FAMILY_PROFILE')"
              >
              </base-input>
            </template>
          </div>
          <div style="margin-left: 8px" class="col-md-6">
            <base-input
              type="text"
              label="Manager"
              placeholder="Manager Name"
              v-model="creatorName"
              :disabled="true"
            >
            </base-input>
          </div>
          <div
            v-if="hasPermission('INVITE_MEMBER')"
            style="margin-left: 8px"
            class="col-md-6"
          >
            <el-button
              type="primary"
              plain
              size="medium"
              @click="copyFamilyCode"
            >
              点此复制家庭组编码
            </el-button>
          </div>
        </div>

        <div class="text-center" v-if="hasPermission('ALERT_FAMILY_PROFILE')">
          <button
            type="submit"
            class="btn btn-info btn-fill float-right"
            @click.prevent="updateProfile"
          >
            更新信息
          </button>
        </div>
        <div class="clearfix"></div>
      </form>
    </card>
    <el-button plain @click="drawer = true" type="primary">
      成员信息
    </el-button>
    <!-- :before-close="handleClose" 关闭组件前提示-->
    <el-drawer
      title="成员信息"
      :visible.sync="drawer"
      direction="ttb"
      size="70%"
    >
      <div class="tableContainer" style="margin-left: 40px">
        <el-table
          :data="tableData"
          style="width: 100%"
          :stripe="true"
          max-height="650"
        >
          <el-table-column label="成员名称" width="200">
            <template slot-scope="scope">
              <span
                style="color: black; font-family: \5E7C\5706; font-size: 20px"
                >{{ scope.row.userName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="角色" width="600">
            <template slot-scope="scope">
              <span
                style="color: black; font-family: \5E7C\5706; font-size: 17px"
                >{{ scope.row.role }}</span
              >
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="420">
            <template slot-scope="scope">
              <template v-if="!isCurUser(scope.row) || !isManager"
                ><el-button
                  v-if="isManager"
                  @click.native.prevent="openPermissionDialog(scope.row)"
                  type="text"
                  size="medium"
                >
                  权限管理
                </el-button>
                <el-button
                  v-if="isManager"
                  @click.native.prevent="removePeople(scope.row)"
                  type="text"
                  size="medium"
                >
                  移除成员
                </el-button>
                <el-button
                  v-else
                  @click.native.prevent="openPermissionDialog(scope.row)"
                  type="text"
                  size="medium"
                >
                  权限查看
                </el-button></template
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>

    <!-- 权限管理/查看对话框 -->
    <el-dialog
      :visible.sync="permissionDialogVisible"
      width="50%"
      title="成员权限页面"
    >
      <el-checkbox-group v-model="selectedPermissions">
        <el-row>
          <el-col
            v-for="permission in allPermissions"
            :key="permission.code"
            :span="24"
          >
            <el-checkbox :label="permission.code" :disabled="!isManager">{{
              permission.name
            }}</el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permissionDialogVisible = false">取消</el-button>
        <el-button
          v-if="isManager"
          type="primary"
          @click="updateUserPermissions"
        >
          修改
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Card from "src/components/Cards/Card.vue";
import { hasPermission } from "@/utils/permission";
import axios from "axios";
export default {
  mounted() {
    this.getUserInfo();
    this.getFamilyInfoOfUser();
    this.getUserCurRole();
    this.getAllPermission();
    this.getUserAllPermission();
  },
  computed: {
    // 计算属性：判断 user.family 是否为空
    isFamilyEmpty() {
      return !this.user.family || this.user.family.trim() === "";
    },
    isManager() {
      return this.curRole == 1;
    },
  },
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
      allPermissions: [
        { code: "EDIT_BUDGET", name: "编辑预算" },
        { code: "INVITE_MEMBER", name: "邀请成员" },
        { code: "VIEW_RECORD", name: "查看收支记录" },
        // 添加更多权限
      ],
      viewUserPermissions: [
        { code: "EDIT_BUDGET", name: "编辑预算" },
        { code: "INVITE_MEMBER", name: "邀请成员" },
        { code: "VIEW_RECORD", name: "查看收支记录" },
      ],
      userAllPermissions: [
        { code: "EDIT_BUDGET", name: "编辑预算" },
        { code: "INVITE_MEMBER", name: "邀请成员" },
        { code: "VIEW_RECORD", name: "查看收支记录" },
      ],
      permissionDialogVisible: false,
      creatorName: "",
      curRole: 2,
      drawer: false,
      family: {
        familyId: "",
        familyName: "temp",
        familyCode: "",
        creatorId: "",
        currentBudget: "",
        createAt: "",
        updateAt: "",
      },
      tableData: [
        {
          userId: "1",
          userName: "temp",
          role: "用户",
        },
      ],
      selectedPermissions: [],
      selectedUserId: null,
    };
  },
  methods: {
    updateProfile() {
      axios({
        method: "post",
        url:
          "/api/family/updateProfile?familyId=" +
          this.family.familyId +
          "&familyName=" +
          this.family.familyName +
          "&familyCode=" +
          this.family.familyCode,
      }).then((resp) => {
        this.getFamilyInfoOfUser();
        this.$message.success("修改家庭组信息成功!");
      });
    },
    hasPermission,
    isCurUser(user) {
      console.log("icCurUser方法的user.userId：", user.userId);
      console.log(
        "icCurUser方法的localStorage：",
        localStorage.getItem("userId")
      );
      return user.userId == localStorage.getItem("userId");
    },
    copyFamilyCode() {
      navigator.clipboard
        .writeText(this.family.familyCode)
        .then(() => {
          this.$message.success("家庭组编码已复制");
        })
        .catch(() => {
          this.$message.error("复制失败，请重试");
        });
    },
    openPermissionDialog(user) {
      console.log("当前用户角色 curRole:", this.curRole);
      this.selectedUserId = user.userId; // 假设有 userId 字段
      axios({
        method: "get",
        url:
          "/api/permission/getUserAllPermission?userId=" + this.selectedUserId,
      }).then((resp) => {
        this.viewUserPermissions = resp.data.content;
        // 设置已选中的权限 code 列表
        this.selectedPermissions = this.viewUserPermissions.map((p) => p.code);
        this.permissionDialogVisible = true;
      });
    },
    removePeople(user) {
      axios({
        method: "post",
        url: "/api/family/removePeople?userId=" + user.userId,
      }).then((resp) => {
        this.getFamilyMemberInfo();
        this.$message.success("移除用户成功!");
      });
    },
    updateUserPermissions() {
      console.log(
        "修改权限，updateUserPermissions方法参数：selectedPermissions：",
        this.selectedPermissions
      );
      axios({
        method: "post",
        url:
          "/api/permission/updateUserPermissions?userId=" + this.selectedUserId,
        data: this.selectedPermissions,
      }).then((resp) => {
        this.getUserAllPermission();
        this.$message.success("权限修改成功");
      });
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    getUserAllPermission() {
      axios({
        method: "get",
        url:
          "/api/permission/getUserAllPermission?userId=" +
          localStorage.getItem("userId"),
      }).then((resp) => {
        this.userAllPermissions = resp.data.content;
      });
    },
    getAllPermission() {
      axios({
        method: "get",
        url: "/api/permission/getAllPermission",
      }).then((resp) => {
        this.allPermissions = resp.data.content;
      });
    },
    getUserCurRole() {
      axios({
        method: "get",
        url:
          "/api/user/getUserCurRole?userId=" + localStorage.getItem("userId"),
      }).then((resp) => {
        console.log("用户信息:" + resp);
        this.curRole = resp.data.content;
        console.log("当前用户角色 curRole:", this.curRole);
      });
    },
    getFamilyMemberInfo() {
      axios({
        method: "get",
        url: "/api/family/getFamilyMemberInfo?familyId=" + this.family.familyId,
      }).then((resp) => {
        console.log("用户信息:" + resp);
        this.tableData = resp.data.content;
        console.log("当前tableData：", this.tableData);
      });
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
    getManagerName() {
      axios({
        method: "get",
        url: "/api/user/userInfo?userId=" + this.family.creatorId,
      }).then((resp) => {
        console.log("用户信息:" + resp);
        this.creatorName = resp.data.content.username;
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
          this.getManagerName();
          this.getFamilyMemberInfo();
          console.log("当前tableData：", this.tableData);
        } else {
          console.log("当前用户没有家庭组");
        }
      });
    },
  },
};
</script>
<style>
</style>
