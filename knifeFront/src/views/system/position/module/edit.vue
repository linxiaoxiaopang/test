<template>
  <div>
    <el-button size="mini" type="success" @click="to">编辑</el-button>
    <eForm ref="form" :sup_this="sup_this" :is-add="false" />
  </div>
</template>
<script>
import eForm from "./form";
import { getOrganizationUserTree } from "@/api/organization";
export default {
  components: { eForm },
  props: {
    data: {
      type: Object,
      required: true,
    },
    // index.vue 的this 可用于刷新数据
    sup_this: {
      type: Object,
      required: true,
    },
  },

  methods: {
    to() {
      const _this = this.$refs.form;
      console.log('data', this.data)
      _this.form = {
        id: this.data.id,
        name: this.data.name,
        description: this.data.description
      };
      _this.dialog = true
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
