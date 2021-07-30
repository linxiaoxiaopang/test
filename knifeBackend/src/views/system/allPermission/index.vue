<template>
  <div class="allPermission app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="python权限管理" name="first">
        <Permission />
      </el-tab-pane>
      <el-tab-pane label="java权限管理" name="second">
        <JavaPermission />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Permission from "./permission";
import JavaPermission from "./javaPermission";

export default {
  components: {
    Permission,
    JavaPermission,
  },
  data() {
    return {
      activeName: "first",
    };
  },
};
</script>

<style lang="scss" scoped>
.allPermission.allPermission {
  height: calc(100vh - 80px);
  .app-container {
    height: auto;
  }
  .el-tabs {
    display: flex;
    flex-direction: column;
    background: #fff;
    width: 100%;
    height: 100%;
    overflow: hidden;
    ::v-deep {
      .el-tabs__content {
        flex: 1;
        overflow: auto;
        .el-tab-pane {
          width: 100%;
            .el-table {
              max-height: 33.333%!important;
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