<template>
  <div class="inline-block line">
    <color-text-btn size="mini" type="warning" @click="to"
      >分配款式</color-text-btn
    >
    <cForm
      v-if="dialogVisible"
      ref="form"
      title="分配款式"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :is-add="false"
      :menus="structData"
      v-bind="$attrs"
    />
  </div>
</template>
<script>
import cForm from "./cForm";
export default {
  components: { cForm },
  props: {
    data: {
      type: Object,
      required: true,
    },
    sup_this: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
      structData: [],
    };
  },
  methods: {
    to() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        const _this = this.$refs.form;
        const { id, name, prim_structs = [] } = this.data;
        this.structData = prim_structs;
        _this.form = {
          id,
          name,
          prim_structs: prim_structs.map(({ id }) => id),
        };
        _this.menus = prim_structs || [];
      });
    },
  },
};
</script>

<style scoped>
</style>
