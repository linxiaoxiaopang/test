<template>
  <div class="line inline-block">
    <color-text-btn type="danger" size="mini" class="filter-item" @click="to">
      {{ isOff ? `下架` : `${prefix}上架` }}
    </color-text-btn>
    <OffShelvesForm
      ref="form"
      v-if="dialogVisible"
      :showSearch="false"
      :isOff="isOff"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :cData="cData"
      :title="isOff ? '下架原型' : `${prefix}上架原型`"
    />
  </div>
</template>
<script>
import cloneDeep from "lodash/cloneDeep";
import OffShelvesForm from "./offShelvesForm";
import { formatPutOnAndOffData } from "@/utils";
export default {
  components: { OffShelvesForm },
  props: {
    sup_this: {
      type: Object,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
    isOff: {
      type: Boolean,
      required: true,
    },
    prefix: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dialogVisible: false,
      cData: [],
    };
  },
  methods: {
    to() {
      const data = [cloneDeep(this.data)];
      this.cData = formatPutOnAndOffData(data);
      this.dialogVisible = true;
    },
  },
};
</script>
