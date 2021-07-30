<template>
  <div class="inline-block line">
    <color-text-btn size="mini" type="success" @click="to">编辑</color-text-btn>
    <eForm
      ref="form"
      v-bind="$attrs"
      :sup_this="sup_this"
      :is-add="false"
      title="编辑尺码"
    />
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
  },
  methods: {
    to() {
      const _this = this.$refs.form;
      _this.form = {
        id: this.data.id,
        name: this.data.name,
        type: this.data.type,
      };
      _this.dialog = true;
    },
  },
};
</script>

