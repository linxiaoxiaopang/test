<template>
  <div class="gotoDetailBtn">
    <el-button type="text" @click="gotoDetail(row, url)">{{ label }}</el-button>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    row: {
      type: Object,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  components: {},
  methods: {
    gotoDetail(row, url) {
      const { id } = row;
      this.$router.push(`${url}?id=${id}`);
    },
  },
};
</script>

<style scoped lang="scss">
.gotoDetailBtn {
  display: inline-block;
}
</style>
