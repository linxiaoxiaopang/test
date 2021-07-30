<template>
  <div class="header-warpper">
    <div class="content">
      <div class="left">
        <el-image fit="contain" class="logo" :src="logo"></el-image>
        <div class="navs">
          <span class="nav">首页</span>
          <!-- <router-link to="/design/index" class="nav">在线定制</router-link> -->
          <span class="nav" @click="linkToDesign">在线定制</span>
        </div>
      </div>
      <div class="right">
        <span v-if="isLogin" class="myWorkspace" @click="linkToDesign"
          ><el-image
            :src="require('../images/workbench.svg')"
            class="workbench"
          ></el-image>
          工作台</span
        >
        <avatar v-if="isLogin" />
        <el-button v-else @click="$router.push('/login')">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Avatar from '@/views/layout/components/LayoutHeader/avatar'
import { mapGetters } from 'vuex'
import { shakingChildren } from '@/utils'

export default {
  data() {
    return {
      logo: require('../images/colorful-logo.png')
    }
  },
  components: {
    Avatar
  },
  computed: {
    ...mapGetters(['token', 'addRouters', 'is_super']),
    isLogin() {
      return !!this.token
    }
  },
  methods: {
    linkToDesign() {
      const url = '/design/index'
      const routes = shakingChildren(this.addRouters)
      const canLink = routes.find((item) => {
        return item.path == url
      })
      if (!canLink && !this.is_super) {
        return this.$message.error('暂无访问权限，请联系管理员添加！')
      }
      this.$router.push('/design/index')
    }
  }
}
</script>

<style lang="scss" scoped>
.header-warpper {
  background: #fff;
  .content {
    width: 1200px;
    height: 64px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      .logo {
        width: 124px;
        height: 27px;
        .img {
          height: 100%;
          width: 100%;
        }
      }
      .navs {
        margin-left: 100px;
        .nav {
          font-size: 14px;
          color: #666666;
          cursor: pointer;
          &:not(:first-child) {
            margin-left: 50px;
          }
        }
      }
    }
    .right {
      .myWorkspace {
        font-size: 14px;
        color: #666666;
        margin-right: 20px;
        display: inline-block;
        width: 88px;
        height: 30px;
        background: #ffffff;
        border: 1px solid #dcdee0;
        border-radius: 4px;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        &:hover {
          border: 1px solid blue;
          color: blue;
          background: rgb(235, 236, 251);
        }
        .workbench {
          width: 19px;
          height: 17px;
          vertical-align: middle;
        }
      }
      .el-button {
        height: 30px;
        font-size: 14px;
        padding-top: 7px;
      }
    }
  }
}
</style>
