<template>
  <div>
    <el-button size="mini" type="success" @click="to">编辑组</el-button>
    <eForm
      ref="form"
      :permissions="permissions"
      v-bind="$attrs"
      :sup_this="sup_this"
      :is-add="true"
      :isReditGroup="true"
    />
  </div>
</template>
<script>
import eForm from "./form";
export default {
  components: { eForm },
  props: {
    sup_this: {
      type: Object,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    permissions: {
      type: Array,
      required: true,
    },
  },
  methods: {
    to() {
      console.log('this.data', this.data)
      const _this = this.$refs.form;
      _this.form = {
        id: this.data.id,
        name: this.data.name
      };
      _this.dialog = true;
    },
  },
};
</script>

<style scoped>
div {
  display: inline-block;
  margin-right: 3px;
}
</style>
