<template>
  <ColorTextBtn type="primary" class="line" @click="to">分销商信息</ColorTextBtn>
</template>

<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {}
  },
  components: {},
  methods: {
    to() {
      this.$router.push({
        path: '/user/resellerPage',
        query: {
          id: this.data.id
        }
      })
    }
  }
}
</script>

<style scoped lang="scss"></style>
