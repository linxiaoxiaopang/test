<template>
  <div class="batchOperation">
    <slot />
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.batchOperation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
  border: 1px solid $border-color;
  padding: 10px 20px;
  height: 40px;
}
</style>