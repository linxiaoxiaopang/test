<template>
  <div class="messageSuccess">
    <div class="info">
      <img src="./ic_toast.svg" />
      <span>操作成功</span>
    </div>
    <button @click="to">查看</button>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  components: {},
  methods: {
    to() {
      this.$router.push('/personalCenter/account/myCollect')
    }
  }
}
</script>

<style scoped lang="scss">
.messageSuccess{
  color: white;
  line-height: 52px;
  width: 324px;
  height: 52px;
  background-color: #293039;
  border-radius: 5px;
  .info {
    position: absolute;
    left: 30px;
    img {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  button {
    border-radius: 20px;
    width: 76px;
    height: 32px;
    outline: none;
    font-size: 12px;
    border: none;
    position: absolute;
    right: 30px;
    top: 10px;
    background-color: #3f454d;
    color: white;
    cursor: pointer;
  }
}
</style>
