<template>
  <div class="navbar">
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />
    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <el-tooltip content="全屏" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item" />
        </el-tooltip>
      </template>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <el-button type="text" class="user-avatar">{{
            name || "暂无"
          }}</el-button>
          <!-- <img :src="avatar" class="user-avatar"> -->
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display: block" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import checkPermission from "@/utils/permission";

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
  },
  data() {
    return {
      sup_this: this,
      data: [],
    };
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device", "name"]),
  },

  methods: {
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    logout() {
      this.$store.dispatch('LogOut')
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  box-shadow: 0 0 5px 1px #666;
  z-index: 100;
  position: relative;
  background: #fff;

  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container {
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    float: right;
    display: flex;
    align-items: center;
    height: 100%;
    &:focus {
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international {
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;
        .user-avatar {
          cursor: pointer;
          // width: 40px;
          // height: 40px;
          // border-radius: 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
  ::v-deep {
    .el-dropdown-menu__item {
      padding: 0 20px !important;
    }
  }

  .message-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    cursor: pointer;
    max-height: 60vh;
  }
  .message-wrapper .text {
    margin-left: 5px;
    color: #606266;
    font-size: 14px;
    margin-right: 10px;
  }
  .message-wrapper .radius {
    position: absolute;
    top: 12px;
    right: -0px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 18px;
    height: 18px;
    color: #fff;
    font-size: 12px;
    line-height: 1;
    background: rgba(255, 87, 51, 1);
    border-radius: 50%;
  }
}
</style>
<style>
.notice-popper {
  max-height: 50vh;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
