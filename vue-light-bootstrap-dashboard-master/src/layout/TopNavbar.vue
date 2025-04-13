<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <span class="navbar-brand">{{ this.user.username }}</span>
      <button
        type="button"
        class="navbar-toggler navbar-toggler-right"
        :class="{ toggled: $sidebar.showSidebar }"
        aria-controls="navigation-index"
        aria-expanded="false"
        aria-label="Toggle navigation"
        @click="toggleSidebar"
      >
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end">
        <ul class="nav navbar-nav mr-auto">
          <!-- <li class="nav-item">
            <a class="nav-link" href="#" data-toggle="dropdown">
              <i class="nc-icon nc-palette"></i>
            </a>
          </li> -->
          <!-- <base-dropdown tag="li">
            <template slot="title">
              <i class="nc-icon nc-planet"></i>
              <b class="caret"></b>
              <span class="notification">5</span>
            </template>
            <a class="dropdown-item" href="#">Notification 1</a>
            <a class="dropdown-item" href="#">Notification 2</a>
            <a class="dropdown-item" href="#">Notification 3</a>
            <a class="dropdown-item" href="#">Notification 4</a>
            <a class="dropdown-item" href="#">Another notification</a>
          </base-dropdown> -->
          <base-dropdown tag="li">
            <template #title>
              <i class="nc-icon nc-planet"></i>
              <b class="caret"></b>
              <span class="notification" v-if="unreadCount > 0">{{
                unreadCount
              }}</span>
            </template>

            <template v-if="notifications.length">
              <a
                v-for="notification in notifications"
                :key="notification.id"
                class="dropdown-item"
                href="#"
                @click.prevent="readNotification(notification)"
              >
                {{ typeMap[notification.type] || "未知类型" }}
              </a>
            </template>
            <template v-else>
              <a class="dropdown-item disabled" href="#">暂无通知</a>
            </template>
          </base-dropdown>
          <!-- <li class="nav-item">
            <a href="#" class="nav-link">
              <i class="nc-icon nc-zoom-split"></i>
              <span class="d-lg-block">&nbsp;Search</span>
            </a>
          </li> -->
        </ul>
        <ul class="navbar-nav ml-auto">
          <!-- <li class="nav-item">
            <a class="nav-link" href="#"> Account </a>
          </li>
          <base-dropdown title="Dropdown">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item" href="#">Something</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item" href="#">Something</a>
            <div class="divider"></div>
            <a class="dropdown-item" href="#">Separated link</a>
          </base-dropdown> -->
          <li class="nav-item">
            <a href="/login" class="nav-link"> Log out </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
import axios from "axios";
import { EventBus } from "@/utils/event-bus";
export default {
  mounted() {
    this.getUserInfo();
    this.getUserUnReadNotification();
    EventBus.$on("username-updated", this.handleUsernameUpdated);
  },
  beforeDestroy() {
    EventBus.$off("username-updated", this.handleUsernameUpdated); // 避免内存泄漏
  },
  computed: {
    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    },
    unreadCount() {
      return this.notifications.length;
    },
  },
  data() {
    return {
      activeNotifications: false,
      user: {
        id: "",
        username: "temp",
        phone: "123456",
        family: "",
      },
      notifications: [],
      typeMap: {
        1: "通用消息",
        2: "家庭组消息",
        3: "还款计划提醒",
        4: "理财计划提醒",
        5: "预算提醒",
      },
    };
  },
  methods: {
    handleUsernameUpdated(newUsername) {
      this.user.username = newUsername;
    },
    getUserInfo() {
      axios({
        method: "get",
        url: "/api/user/userInfo?userId=" + localStorage.getItem("userId"),
      }).then((resp) => {
        console.log("用户信息:" + resp);
        this.user = resp.data.content;
      });
    },
    readNotification(notification) {
      this.$alert(
        notification.message,
        this.typeMap[notification.type] || "未知类型",
        {
          confirmButtonText: "确定",
          callback: (action) => {
            // this.$message({
            //   type: 'info',
            //   message: '提醒已读'
            // });
            axios({
              method: "post",
              url:
                "/api/notify/readNotification?userId=" +
                localStorage.getItem("userId") +
                "&notificationId=" +
                notification.id,
            }).then((resp) => {
              console.log("用户阅读了当前提醒，提醒id:" + notification.id);
              this.getUserUnReadNotification();
            });
          },
        }
      );
    },
    getUserUnReadNotification() {
      axios({
        method: "get",
        url:
          "/api/notify/getUserUnReadNotification?userId=" +
          localStorage.getItem("userId"),
      }).then((resp) => {
        console.log("当前用户unreadnotify:" + resp.data.content);
        this.notifications = resp.data.content;
      });
    },
    exitLogin() {
      localStorage.setItem("userId", null);
      this.$router.push("/login");
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    hideSidebar() {
      this.$sidebar.displaySidebar(false);
    },
  },
};
</script>
<style>
</style>
