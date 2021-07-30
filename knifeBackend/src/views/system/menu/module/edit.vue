<template>
  <div>
    <el-button :disabled="data.id === 1" size="mini" type="success" @click="to"
      >编辑</el-button
    >
    <eForm ref="form" :menus="menus" :sup_this="sup_this" :is-add="false" />
  </div>
</template>
<script>
import eForm from "./form";
export default {
  components: { eForm },
  props: {
    data: {
      type: Object,
      required: true,
    },
    sup_this: {
      type: Object,
      required: true,
    },
    menus: {
      type: Array,
      required: true,
    },
  },
  methods: {
    to() {
      const _this = this.$refs.form;
      const component =
        this.data.component === "Layout" ? "" : this.data.component;
      _this.form = {
        id: this.data.id,
        component,
        name: this.data.name,
        sort: this.data.sort,
        pid: this.data.pid || null,
        path: this.data.path.replace(/^\//, ""),
        is_show: this.data.is_show,
        is_frame: this.data.is_frame,
        icon: this.data.icon,
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
