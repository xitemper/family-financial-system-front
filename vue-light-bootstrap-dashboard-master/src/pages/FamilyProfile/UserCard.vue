<template>
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
    <!-- <div slot="footer" class="text-center d-flex justify-content-center">
      <button href="#" class="btn btn-simple">
        <i class="fa fa-facebook-square"></i>
      </button>
      <button href="#" class="btn btn-simple">
        <i class="fa fa-twitter"></i>
      </button>
      <button href="#" class="btn btn-simple">
        <i class="fa fa-google-plus-square"></i>
      </button>
    </div> -->
  </card>
</template>
<script>
import Card from "src/components/Cards/Card.vue";
export default {
  mounted() {
    this.username = localStorage.getItem("username");
  },
  components: {
    Card,
  },
  data() {
    return {
      username: "",
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
    };
  },
  methods: {
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
  },
};
</script>
<style>
</style>
