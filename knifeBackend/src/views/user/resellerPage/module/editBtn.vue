<template>
  <ColorTextBtn class="line" type="primary" @click="to">编辑</ColorTextBtn>
</template>

<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
    }
  },
  components: {

  },
  methods: {
    async to() {
      this.$router.push({
        path: `/user/editUser?`,
        query: {
          id: this.data.id
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">

</style>
