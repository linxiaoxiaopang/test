<template>
  <div class="treeBoxComponent">
    <!-- slot -->
    <slot></slot>
    <el-tree
      ref="tree"
      :data="data"
      node-key="id"
      :props="defaultProps"
      :empty-text="$attrs['empty-text'] || '暂无数据'"
      v-bind="$attrs"
      @node-click="handleNodeClick"
    ></el-tree>
    <slot name="footer"></slot>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String|Number
    },
    data: {
      type: Array,
      default: () => []
    },
    defaultProps: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'name'
      })
    }
  },
  watch: {
    data: {
      handler(newVal) {
        if (!this.isFirstFresh && newVal.length) {
          this.$nextTick(() => {
            let currentKey = this.value
            currentKey = currentKey || currentKey === 0 ? currentKey : newVal[0].id
            this.$refs.tree.setCurrentKey(currentKey)
            this.handleNodeClick(newVal[0])
          })
          this.isFirstFresh = true
        }
      },
      immediate: true
    }
  },
  methods: {
    handleNodeClick(data) {
      this.$emit('nodeClickHandler', data)
    }
  }
}
</script>
<style lang="scss" scoped>
.treeBoxComponent {
  display: flex;
  flex-direction: column;
  // margin-left: 10px;
  // margin-right: 10px;

  border: 1px solid $border-color;

  .tree-box-title {
    flex: 0 0 32px;
    padding: 0 10px;
    height: 32px;
    line-height: 32px;
    text-align: left;
    font-size: 14px;
    border-bottom: 1px solid $border-color;
  }
  .el-tree {
    overflow-y: auto;
    // flex: 1;
    padding: 10px;
    ::v-deep {
      .el-tree-node {
        padding: 5px 0;
      }

      .is-current > .el-tree-node__content {
        height: 40px;
      }
      .el-tree-node__content:hover,
      .is-current > .el-tree-node__content {
        background-color: $tree-color;
        color: $--color-primary;
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
