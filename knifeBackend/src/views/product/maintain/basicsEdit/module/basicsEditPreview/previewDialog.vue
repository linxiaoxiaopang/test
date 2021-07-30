<template>
  <BaseDialog :dialogVisible.sync="dialog" :dialogDraggable="false" width="1280px" top="10px" :title="title">
    <productDetail v-bind="$attrs"></productDetail>
    <span slot="footer"></span>
  </BaseDialog>
</template>

<script>
import { commonFromMixin } from '@/mixins'
import productDetail from './detail'

export default {
  mixins: [commonFromMixin],
  components: {
    productDetail
  }
}
</script>
<style lang="scss" scoped>

</style>