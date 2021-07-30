<template>
  <div class="line inline-block">
    <color-text-btn size="mini" type="primary" @click="to"
      >上传附件</color-text-btn
    >
    <EForm
      v-if="dialogVisible"
      ref="form"
      title="上传附件"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :data="data"
      :is-add="false"
      v-bind="$attrs"
      v-on="$listeners"
    />
  </div>
</template>
<script>
import EForm from "./form";
import { commonEheaderMixin } from "@/mixins";
export default {
  mixins: [commonEheaderMixin],
  components: { EForm },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {

    }
  },
  methods: {
    to() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        const _this = this.$refs.form;
        _this.form = {
          id: this.data.id,
          expressWaybillFilePath: [],
        };
      });
    },
  },
};
</script>
