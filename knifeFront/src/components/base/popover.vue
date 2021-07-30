<template>
  <el-popover
    style="display: inline-block"
    ref="popover"
    placement="top"
    :width="$attrs.width || 200"
    v-model="visible"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot name="tip" >
      <p>确定删除吗,如果存在下级节点则节点上升，此操作不能撤销！</p>
    </slot>
    <div style="text-align: right; margin: 0" v-if="showBtn">
      <el-button size="mini" type="text" @click="visible = false"
        >取消</el-button
      >
      <el-button type="primary" size="mini" @click="sureHandler"
        >确定</el-button
      >
    </div>
    <div slot="reference">
      <slot name="reference" :scope="loading">
        <el-button>删除</el-button>
      </slot>
    </div>
  </el-popover>
</template>

<script>
export default {
  props: {
    showBtn: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      loading: false
    };
  },
  methods: {
    sureHandler() {
      this.$emit("sureHandler", this);
    },
    doClose() {
      this.visible = false
    }
  },
};
</script>

<style>
</style>