<template>
  <div class="line inline-block">
    <color-text-btn type="warning" @click="showDialog">更换原图</color-text-btn>
    <cForm
      v-if="dialogVisible"
      ref="form"
      title="更换原图"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :form="form"
      :data="data"
      :is-add="false"
      v-bind="$attrs"
    />
  </div>
</template>
<script>
import { commonEheaderMixin } from "@/mixins";
import cForm from "./cForm";
export default {
  mixins: [commonEheaderMixin],
  components: { cForm },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        thumbnail_path: [
          {
            path: this.data.thumbnail_path,
          },
        ],
        path: [],
      },
    };
  },
};
</script>
