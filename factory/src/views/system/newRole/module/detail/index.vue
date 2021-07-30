<template>
  <div class="line inline-block">
    <colorTextBtn type="info" @click="to"> 详情 </colorTextBtn>
    <DetailForm :detailId="data.id"  :dialogVisible.sync="dialogVisible" />
  </div>
</template>

<script>
import DetailForm from "./detailForm";
export default {
  components: {
    DetailForm,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    to() {
      this.dialogVisible = true;
    },
  },
};
</script>

<style>
</style>