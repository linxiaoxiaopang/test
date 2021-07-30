<template>
  <el-button v-bind="$attrs" :loading="loading" v-on="$listeners">
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  data() {
    return {
      loading: false
    }
  },
  watch: {
    $listeners: {
      handler() {
        this.updateListeners()
      },
      deep: true
    }
  },
  created() {
    this.updateListeners()
  },
  methods: {
    updateListeners() {
      if (!this.$listeners.click) return
      const func = this.$listeners.click.fns
      this.$listeners.click.fns = async () => {
        if (this.loading) return
        this.loading = true
        try {
          await func()
        } catch (err) {
          console.log(err)
        }
        this.loading = false
      }
    }
  }
}
</script>

<style>
</style>