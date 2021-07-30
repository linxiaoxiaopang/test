<template>
  <div class="allMenuPage app-container">
    <el-tabs v-model="activeName" v-loading="loading">
      <el-tab-pane label="后台端管理系统" name="first">
        <Menu />
      </el-tab-pane>
      <el-tab-pane
        :label="label"
        :key="index"
        :name="name"
        v-for="({ label, url, name, target }, index) in navs"
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
import Menu from "../menu";

export default {
  components: {
    Menu,
  },
  data() {
    return {
      activeName: "first",
      activeIndex: 0,
      loading: false,
      navs: [
        {
          url:
            process.env.NODE_ENV === "production"
              ? "http://dev.zhengdingyunshang.com:8100/#/menus"
              : "http://192.168.10.13:8080/#/menus",
          label: "业务端菜单管理",
          name: "second",
        },
        {
          url:
            process.env.NODE_ENV === "production"
              ? "http://dev.zhengdingyunshang.com:8102/#/menus"
              : "http://192.168.10.13:8081/#/menus",
          label: "工厂端菜单管理",
          name: "third",
        },
      ],
    };
  },
  methods: {
    onLoad() {
      this.loading = false;
    },
  },
};
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