<template>
  <div class="emptyComponent">
    <el-image fit="contain" :src="require('@/assets/design/pic_empty.png')">
    </el-image>
    <div class="txt">
      <slot> 你还没有上传过图片哟！ </slot>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.emptyComponent {
  padding: 30px 10%;
  .el-image {
    width: 100%;
  }
  .txt {
    text-align: center;
    font-size: 12px;
    color: #bbbbbb;
  }
}
</style>