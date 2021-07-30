<template>
  <div class="inline-block">
    <el-button size="small" type="primary" @click="showDialog"
      >添加授权</el-button
    >
    <EForm
      v-if="dialogVisible"
      ref="form"
      title="添加授权"
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
