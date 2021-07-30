<template>
  <div>
    <el-button size="mini" type="primary" @click="to">选择组</el-button>
    <ChooseGroupForm ref="form" :permissions="permissions" :sup_this="sup_this" :is-add="false"/>
  </div>
</template>
<script>
import ChooseGroupForm from './chooseGroupForm'
export default {
  components: { ChooseGroupForm },
  props: {
    data: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    },
    permissions: {
      type: Array,
      required: true
    }
  },
  methods: {
    to() {
      const _this = this.$refs.form
      _this.form = { id: this.data.id, name: this.data.name, method: this.data.method, pid: this.data.pid }
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
