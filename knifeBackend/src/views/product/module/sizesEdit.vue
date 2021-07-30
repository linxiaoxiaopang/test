<template>
  <div class="line inline-block">
    <el-button
      icon="el-icon-edit-outline"
      type="text"
      size="mini"
      class="filter-item"
      @click="editSizes"
    >
      编辑尺码
    </el-button>
    <SizesForm
      ref="form"
      v-if="dialogVisible"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :data="cData"
      title="编辑尺码"
    />
  </div>
</template>
<script>
import SizesForm from "./sizesForm";
import cloneDeep from "lodash/cloneDeep";
import { SIZE_DETAIL, CUSTOM } from "@/utils/constant";
import { createRandomNum } from "@/utils";

export default {
  components: { SizesForm },
  props: {
    sup_this: {
      type: Object,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
      cData: [],
    };
  },
  computed: {
    structId() {
      const { prim_struct = [] } = this.data;
      return prim_struct.map(({ id }) => id);
    },
  },
  methods: {
 
    editSizes() {
      const data = cloneDeep(this.data);
      if (!data.sizes.length) {
        data.sizes.push({
          ...SIZE_DETAIL,
          id: `${CUSTOM}-${createRandomNum()}`,
        });
      }
      this.cData = data;
      this.dialogVisible = true;
      this.$nextTick(() => {
        const _this = this.$refs.form;
        _this.activeName = data.sizes[0].id.toString();
        _this.oSizes = cloneDeep(this.data).sizes;
      });
    },
  },
};
</script>
