<template>
  <el-drawer
    custom-class="detailOrEditComponent-common-class"
    size="1000px"
    :visible.sync="visible"
    :withHeader="false"
    :append-to-body="true"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <BaseRole
      :isEdit="true"
      :detailId="$attrs.detailId"
      @back="visible = false"
    />
  </el-drawer>
</template>

<script>
import BaseRole from "../baseRole";
export default {
  components: {
    BaseRole,
  },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      visible: this.dialogVisible,
    };
  },
  watch: {
    visible(newVal) {
      this.$emit("update:dialogVisible", newVal);
    },

    dialogVisible(newVal) {
      this.visible = newVal;
    },
  },
};
</script>

<style>
</style>