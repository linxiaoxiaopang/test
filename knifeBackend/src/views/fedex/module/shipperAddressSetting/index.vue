<template>
  <div class="inline-block">
    <color-text-btn size="medium" type="primary" @click="showDialog">设置</color-text-btn>
    <EForm
      v-if="dialogVisible"
      ref="form"
      title="寄件人地址设置"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :is-add="true"
      v-bind="$attrs"
    />
  </div>
</template>
<script>
import { commonEheaderMixin } from '@/mixins'
import EForm from './form'
export default {
  mixins: [commonEheaderMixin],
  components: { EForm }
}
</script>
