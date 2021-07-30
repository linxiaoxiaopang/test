<template>
  <div class="baseDesign">
    <div class="header">
      <div class="title">
        <slot name="title" />
      </div>
      <i class="el-icon-close" @click="closeHandler" />
    </div>
    <div class="content" :style="{ height: $attrs.contentHeight || '300px' }">
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    closeHandler() {
      this.$emit('closeHandler')
    }
  }
}
</script>

<style lang="scss" scoped>
.baseDesign {
  border-radius: 4px;
  // background-color: rgb(253, 253, 253);
  // box-shadow: 0px 0px 4px 0px rgba(199, 214, 219, 0.57);
  width: 100%;
  // border-style: solid;
  // border-width: 1px;
  // border-color: rgb(209, 206, 203);

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgb(235, 235, 235);
    height: 36px;
    line-height: 36px;
    padding: 0 10px;
    .title {
      slot {
      }
    }
    .el-icon-close {
      font-size: 20px;
      cursor: pointer;
    }
  }
  .content {
    padding: 10px;
    height: 300px;
    overflow: auto;
  }
  .content::-webkit-scrollbar-track {
    border-radius: 0.75rem;
    background-color: #fff;
  }
  .content::-webkit-scrollbar {
    width: 0rem;
    height: 0.75rem;
    background-color: #f5f5f5;
  }
  .content::-webkit-scrollbar-thumb {
    border-radius: 0.75rem;
    background-color: #bec5db;
  }
}
</style>
