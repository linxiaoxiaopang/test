<template>
  <color-text-btn
    :type="data.check_sizes.length === 0 ? 'info' : 'danger'"
    size="mini"
    class="filter-item line"
    v-if="data.base_sizes.length > 0"
    @click="create"
  >
    <span v-if="data.check_sizes.length === 0">生成参考图</span>
    <span v-else>更新参考图</span>
  </color-text-btn>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    create() {
      const row = this.data
      const { prim_struct = [], base_sizes: [{id: referenceId}] = [{}]} = row || {}
      if(!referenceId) {
        this.$message.warning('请先设置参考尺码再进行此操作！')
        return
      }
      this.$router.push(
        `/product/maintain/createReference?structId=${prim_struct.map(({ id }) => id)}&protoId=${row.id}&referenceId=${referenceId}&isUpdate=${
          this.data.check_sizes.length
        }`
      )
    }
  }
}
</script>

<style></style>
