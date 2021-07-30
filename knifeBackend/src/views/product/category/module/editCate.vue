<template>
  <div class="line inline-block">
    <color-text-btn type="primary" @click="showDialog">
      编辑分类
    </color-text-btn>
    <EditForm
      ref="form"
      v-if="dialogVisible"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :isAdd="false"
      title="编辑分类"
    />
  </div>
</template>

<script>
import EditForm from "./editForm";
import { commonEheaderMixin } from "@/mixins";
export default {
  mixins: [commonEheaderMixin],
  components: { EditForm },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    showDialog() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        const { id, name, parent } = this.data;
        const _this = this.$refs.form;
        _this.form = {
          id,
          parent,
          name,
        };
      });
    },
  },
};
</script>

<style>
</style>