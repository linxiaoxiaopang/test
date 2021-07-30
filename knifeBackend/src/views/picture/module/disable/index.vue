<template>
  <div class="line inline-block disableComponent">
    <color-text-btn
      v-if="isDisable"
      size="mini"
      type="primary"
      @click="showDialog"
    >
      {{type == 1 ? '上架' : '启用'}}
    </color-text-btn>
    <color-text-btn v-else size="mini" type="danger" @click="showDialog">
     {{type == 1 ? '下架' : '禁用'}}
      
    </color-text-btn>
    <EForm
      ref="form"
      :isDiable="isDisable"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :data="data"
      :title="isDisable ? type == 1 ? '上架' : '启用' : type == 1 ? '下架' : '禁用'"
      :type="type"
    />
  </div>
</template>

<script>
import EForm from "./form";
import { commonEheaderMixin } from "@/mixins";
import { PIC_ENABLE, PIC_DISABLE } from "@/utils/constant";

export default {
  mixins: [commonEheaderMixin],
  components: {
    EForm,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    type: {
      type: [String, Number],
      default: 0,
    },
  },
  computed: {
    isDisable() {
      const { disable } = this.data || {};
      return disable == PIC_DISABLE;
    },
  },
  methods: {
    to() {
      this.dialog = true;
    },
  },
};
</script>