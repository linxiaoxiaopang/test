<template>
  <div style="display: inline-block">
    <el-button type="primary" size="mini" @click="showDialog">
      添加分类
    </el-button>
    <EForm
      ref="form"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :is-add="true"
      title="添加父类"
    />
  </div>
</template>

<script>
import EForm from "./form";
import { commonEheaderMixin } from "@/mixins";
export default {
  mixins: [commonEheaderMixin],
  components: { EForm },
};
</script>

<style>
</style>