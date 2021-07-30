<template>
  <div class="protoInfoOfRichtextComponent">
    <div class="label">{{ label }}：</div>
    <div v-html="htmlStr"></div>
  </div>
</template>

<script>
export default {
  props: {
    label: String,
    htmlStr: String,
  },
};
</script>

<style lang="scss" scoped>
.protoInfoOfRichtextComponent {
  display: flex;
  padding: 30px 15px;
  min-height: 120px;
  border: 1px solid $border-color;
  margin-top: 20px;
  border-radius: 4px;
  .label {
    flex: 0 0 80px;
    margin-right: 10px;
  }
}
</style>