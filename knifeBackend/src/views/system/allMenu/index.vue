<template>
  <div class="allMenuPage app-container">
    <el-tabs v-model="activeName" v-loading="loading">
      <el-tab-pane label="后台端管理系统" name="first">
        <Menu />
      </el-tab-pane>
      <el-tab-pane
        v-for="({ label, url, name, target }, index) in navs"
        :key="index"
        :label="label"
        :name="name"
        :lazy="true"
      >
        <vue-friendly-iframe
          className="vue-friendly-iframe-className"
          :src="url"
          :target="target || '_parent'"
          @load="onLoad"
        ></vue-friendly-iframe>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Menu from '../menu'
import { mapGetters } from 'vuex'

export default {
  components: {
    Menu
  },
  data() {
    return {
      activeName: 'first',
      activeIndex: 0,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['token']),
    navs({ token }) {
      const tmpObj = {
        serve: [`http://192.168.10.87:8080/#/menus`, `http://192.168.10.87:8081/#/menus`],
        dev: ['http://www.dev.zdcustom.com/#/menus', 'http://factory.dev.zdcustom.com/#/menus'],
        test: ['http://www.test.zdcustom.com/#/menus', 'http://factory.test.zdcustom.com/#/menus'],
        uat: ['http://www.uat.zdcustom.com/#/menus', 'http://factory.uat.zdcustom.com/#/menus'],
        pro: ['http://www.zdcustom.com/#/menus', 'http://factory.zdcustom.com/#/menus']
      }
      const navs = [
        {
          url: tmpObj[process.env.VUE_APP_ENV_STAGE][0],
          label: '业务端菜单管理',
          name: 'second'
        },
        {
          url: tmpObj[process.env.VUE_APP_ENV_STAGE][1],
          label: '工厂端菜单管理',
          name: 'third'
        }
      ]
      return navs
    }
  },
  methods: {
    onLoad() {
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.allMenuPage.allMenuPage {
  height: calc(100vh - 80px);

  .el-tabs {
    display: flex;
    flex-direction: column;
    background: #fff;
    width: 100%;
    height: 100%;

    ::v-deep {
      .el-tabs__content {
        flex: 1;
        .el-tab-pane {
          height: 100%;
          width: 100%;
          overflow: auto;
          .vue-friendly-iframe {
            height: 100%;
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
<style>
.vue-friendly-iframe-className {
  height: 100%;
  width: 100%;
}
</style>
