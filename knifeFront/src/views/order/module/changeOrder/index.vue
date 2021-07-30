<template>
  <div class="line inline-block">
    <color-text-btn :type="btnType" @click="to">换单</color-text-btn>
    <cForm
      v-if="dialogVisible"
      ref="form"
      title="换单"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :is-add="false"
      v-bind="$attrs"
      :data="data"
    />
  </div>
</template>
<script>
import { commonEheaderMixin } from '@/mixins'
import cForm from './cForm'

export default {
  mixins: [commonEheaderMixin],
  components: { cForm },
  props: {
    data: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      default: null
    },
    btnType: {
      type: String,
      default: 'info'
    }
  },
  methods: {
    to() {
      this.dialogVisible = true
      const { expressWaybillCode, expressWaybillFilePath } = this.data
      this.$nextTick(() => {
        const _this = this.$refs.form
        _this.form = {
          orderId: this.data.id,
          expressWaybillCode,
          expressCompanyId: '',
          expressWaybillFilePath: expressWaybillFilePath ? [{ url: expressWaybillFilePath }] : []
        }
      })
    }
  }
}
</script>
