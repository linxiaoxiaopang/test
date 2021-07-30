<template>
  <div class="line inline-block" >
    <color-text-btn type="primary" @click="showDialog">
      新增子分类
    </color-text-btn>
    <CForm
      ref="form"
      v-if="dialogVisible"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :is-add="true"
      :data="data"
      title="添加子分类"
    />
  </div>
</template>

<script>
import CForm from "./cForm";
import { commonEheaderMixin } from "@/mixins";
export default {
  mixins: [commonEheaderMixin],
  components: { CForm },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    showDialog() {
      console.log("data", this.data);
      this.dialogVisible = true;
    },
  },
};
</script>

<style>
</style>