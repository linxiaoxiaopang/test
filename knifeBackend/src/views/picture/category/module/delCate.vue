<template>
  <Popover @sureHandler="del(data.id, $event)">
    <template #tip>
      <p>如果该分类存在子分类，请先删除子分类，再进行此操作！</p>
    </template>
    <template #reference="{ scope: loading }">
      <color-text-btn class="update-btn" :loading="loading" size="mini" type="danger">删除</color-text-btn>
    </template>
  </Popover>
</template>

<script>
import { delMixin } from '@/mixins'
import { del as delApi } from '@/api/imageTypeApi'
export default {
  mixins: [delMixin],
  props: {
    data: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    }
  },
  methods: {
    delApi,
    init() {
      this.sup_this && this.sup_this.init()
    }
  }
}
</script>

<style></style>
