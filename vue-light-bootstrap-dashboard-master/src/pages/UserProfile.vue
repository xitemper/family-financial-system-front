<!-- <template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-8">
          <edit-profile-form @info-updated="handleInfoUpdated">
          </edit-profile-form>
        </div>
        <div class="col-md-4">
          <user-card :key="cardKey"> </user-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EditProfileForm from "./UserProfile/EditProfileForm.vue";
import UserCard from "./UserProfile/UserCard.vue";

export default {
  components: {
    EditProfileForm,
    UserCard,
  },
  data() {
    return {
      cardKey: 0, // 控制 UserCard 重新加载的 key
    };
  },
  methods: {
    handleInfoUpdated() {
      this.cardKey += 1; // 每次更新 key，强制重新渲染 UserCard
    },
  },
};
</script>
<style>
</style> -->

<template>
  <div class="content">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-8">
          <edit-profile-form @user-updated="onUserUpdated" />
        </div>
        <div class="col-md-4">
          <user-card :username="username" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EditProfileForm from "./UserProfile/EditProfileForm.vue";
import UserCard from "./UserProfile/UserCard.vue";

export default {
  components: { EditProfileForm, UserCard },
  data() {
    return {
      username: localStorage.getItem("username") || "",
    };
  },
  methods: {
    onUserUpdated(newUsername) {
      this.username = newUsername;
      localStorage.setItem("username", newUsername); // 可选
    },
  },
};
</script>

