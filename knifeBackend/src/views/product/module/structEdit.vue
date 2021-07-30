<template>
  <div class="line inline-block">
    <el-button
      icon="el-icon-edit-outline"
      type="text"
      size="mini"
      class="filter-item"
      @click="to"
    >
      编辑款式
    </el-button>
    <StructForm
      ref="form"
      v-if="dialogVisible"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :data="cData"
      title="编辑款式"
    />
  </div>
</template>
<script>
import StructForm from "./structForm";
import cloneDeep from "lodash/cloneDeep";
import { STRUCR_ITEM, CUSTOM } from "@/utils/constant";
import { createRandomNum } from "@/utils";

export default {
  components: { StructForm },
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
  methods: {
    to() {
      const data = cloneDeep(this.data);
      if (!data.prim_struct.length) {
        data.prim_struct.push({
          ...STRUCR_ITEM,
          id: `${CUSTOM}-${createRandomNum()}`,
        });
      }
      this.cData = data;

      this.dialogVisible = true;
      this.$nextTick(() => {
        const _this = this.$refs.form;
        _this.activeName = data.prim_struct[0].id.toString();
        _this.oStructs = cloneDeep(this.data).prim_struct;
        console.log('_this.oStructs', _this.oStructs)
      });
    },
  },
};
</script>
