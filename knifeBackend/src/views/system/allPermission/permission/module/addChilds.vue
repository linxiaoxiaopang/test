<template>
  <div>
    <el-button  size="mini" type="warning" @click="to">添加子权限</el-button>
    <GroupPushChildren ref="form" v-bind="$attrs" :sup_this="sup_this" />
  </div>
</template>
<script>
import GroupPushChildren from "./groupPushChildren";

export default {
components: { GroupPushChildren },
  props: {
    data: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    },
  },
  methods: {
    to() {
        console.log('this.data', this.data)
      const _this = this.$refs.form
      _this.form = { id: this.data.id, name: this.data.name, method: []}
      _this.dialog = true
    }
  }
}
</script>

<style scoped>
  div{
    display: inline-block;
    margin-right: 3px;
  }
</style>
