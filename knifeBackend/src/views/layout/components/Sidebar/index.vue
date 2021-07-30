<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#22243E"
      text-color="#fff"
      active-text-color="#fff"
    >
      <div style="background-color: #22243E">
        <!-- <img :src="logo" style="height: 50px" /> -->
        <h5 class="company-title">{{logo}}</h5>
      </div>
      <sidebar-item
        v-for="route in permission_routers"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";

export default {
  components: { SidebarItem },
  data() {
    return {
      logo: "",
    };
  },
  computed: {
    ...mapGetters(["permission_routers", "sidebar"]),
    isCollapse() {
      //侧边栏的展开和收缩
      this.initLogo();
      return !this.sidebar.opened;
    },
  },

  // mounted: function () {
  //   this.initLogo();
  // },

  methods: {
    initLogo() {
      if (this.sidebar.opened) {
        // this.logo = require("../../../../assets/logo/logo1.png");
        this.logo = '正丁后台管理系统'
      } else {
        // this.logo = require("../../../../assets/logo/logo2.png");
        this.logo = '正'
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.company-title {
  margin: 0;
  padding: 20px 0;
  color: #fff;
  font-size: 1.25rem;
  text-align: center;
  // border-bottom: 1px solid #eee;
}

</style>