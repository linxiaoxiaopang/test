<template>
  <div class="treeBoxComponent">
    <div class="tree-box-title">
      {{ title }}
    </div>
    <el-tree
      ref="tree"
      :data="data"
      :props="defaultProps"
      :empty-text="$attrs['empty-text'] || '暂无数据'"
      v-bind="$attrs"
      @node-click="handleNodeClick"
    ></el-tree>
  </div>
</template>

<script>
import { list } from "@/api/imageTypeApi";
export default {
  props: {
    title: {
      type: String,
      default: "我的图库",
    },
    defaultProps: {
      type: Object,
      default: () => ({
        children: "children",
        label: "name",
      }),
    },
  },
  data() {
    return {
      data: [],
    };
  },
  watch: {
    data(newVal) {
      if (!this.isFirstFresh && newVal.length) {
        this.$nextTick(() => {
          this.$refs.tree.$el.firstChild.classList.add("is-current");
        });
        this.isFirstFresh = true;
      }
    },
  },
  created() {
    this.list();
  },
  methods: {
    handleNodeClick(data) {
      this.$refs.tree.$el.firstChild.classList.remove("is-current");
      this.$emit("updateImageList", data);
    },
    async list() {
      const { detail, code } = await list();
      if ($SUC({ code })) {
        this.data = detail;
        this.$emit("updateImageList", detail[0]);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.treeBoxComponent {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  margin-right: 10px;
  height: 100%;
  border: 1px solid $border-color;

  .tree-box-title {
    flex: 0 0 32px;
    padding: 0 10px;
    height: 32px;
    line-height: 32px;
    text-align: left;
    font-size: 14px;
    border-bottom: 1px solid $border-color;
    background: #fff;
  }
  .el-tree {
    overflow-y: auto;
    flex: 1;
    padding: 10px;
    ::v-deep {
      .el-tree-node {
        padding: 5px 0;
      }
      .el-tree-node__content:hover,
      .is-current > .el-tree-node__content {
        background-color: $color-primary;
        color: #fff;
        border-radius: 4px;
        .el-tree-node__expand-icon {
          color: #fff;
        }
        .el-tree-node__expand-icon.is-leaf {
          color: transparent;
        }
      }
    }
  }
}
</style>