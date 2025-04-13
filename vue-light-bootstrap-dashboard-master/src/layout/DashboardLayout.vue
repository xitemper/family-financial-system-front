<template>
  <div class="wrapper">
    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link :to="`/admin/overview/${userId}`">
        <i class="nc-icon nc-chart-pie-35"></i>
        <p>用户数据中心</p>
      </sidebar-link>
      <sidebar-link
        v-if="!isFamilyEmpty"
        :to="`/admin/familyOverview/${userId}`"
      >
        <i class="nc-icon nc-chart-pie-36"></i>
        <p>家庭组数据中心</p>
      </sidebar-link>
      <sidebar-link to="/admin/user">
        <i class="nc-icon nc-circle-09"></i>
        <p>用户信息</p>
      </sidebar-link>
      <sidebar-link v-if="!isFamilyEmpty" to="/admin/family">
        <i class="nc-icon nc-single-02"></i>
        <p>家庭组信息</p>
      </sidebar-link>
      <sidebar-link to="/admin/table-list">
        <i class="nc-icon nc-notes"></i>
        <p>用户账单信息</p>
      </sidebar-link>
      <sidebar-link v-if="!isFamilyEmpty" to="/admin/familytable-list">
        <i class="nc-icon nc-credit-card"></i>
        <p>家庭组账单信息</p>
      </sidebar-link>
      <sidebar-link v-if="!isFamilyEmpty" to="/admin/familyscore">
        <i class="nc-icon nc-credit-card"></i>
        <p>家庭组财务健康状况评分</p>
      </sidebar-link>
      <sidebar-link to="/admin/ai">
        <i class="nc-icon nc-atom"></i>
        <p>智能AI</p>
      </sidebar-link>
      <sidebar-link to="/admin/typography">
        <i class="nc-icon nc-paper-2"></i>
        <p>帮助文档</p>
      </sidebar-link>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click="toggleSidebar"> </dashboard-content>

      <!-- <content-footer></content-footer> -->
    </div>
  </div>
</template>
  <style lang="scss">
</style>
  <script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu.vue";
export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
    MobileMenu,
  },
  data() {
    return {
      familyCode: localStorage.getItem("family") || "",
    };
  },
  computed: {
    userId() {
      return localStorage.getItem("userId");
    },
    isFamilyEmpty() {
      return !this.familyCode || this.familyCode.trim() === "";
    },
  },
  created() {
    this.$bus.$on("family-updated", this.updateFamilyCode);
  },
  beforeDestroy() {
    this.$bus.$off("family-updated", this.updateFamilyCode);
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    },
    updateFamilyCode() {
      this.familyCode = localStorage.getItem("family") || "";
      console.log("侧边栏收到家族更新通知，现在 familyCode =", this.familyCode);
      this.$forceUpdate();
    },
  },
};
</script>