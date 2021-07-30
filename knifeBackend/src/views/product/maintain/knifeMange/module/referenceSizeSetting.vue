<template>
  <div class="line inline-block">
    <color-text-btn
      :loading="loading"
      :type="isEdit ? 'primary' : 'info'"
      @click="to"
    >
      {{ isEdit ? '编辑参考尺码' : '设置参考尺码' }}
    </color-text-btn>
    <ReferenceSizeSettingForm
      ref="form"
      v-if="dialogVisible"
      :title="isEdit ? '编辑参考尺码' : '设置参考尺码'"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :cData="sizes"
      :name="data.name"
      :protoId="protoId"
      :baseData="baseSizes"
      @updateData="list"
    />
  </div>
</template>
<script>
import ReferenceSizeSettingForm from './referenceSizeSettingForm'
import { getSizesAndPsds as list } from '@/api/product/productApi'
export default {
  components: { ReferenceSizeSettingForm },
  props: {
    sup_this: {
      type: Object,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      dialogVisible: false,
      sizes: [],
      baseSizes: [],
      protoId: '',
    }
  },
  computed: {
    isEdit() {
      try {
        return this.data.base_sizes.length
      } catch (err) {
        return false
      }
    },
  },

  methods: {
    async to() {
      try {
        await this.list()
        this.$nextTick(() => {
          this.dialogVisible = true
        })
      } catch (err) {}
    },
    async list() {
      this.loading = true
      try {
        const { code, detail } = await list(this.data.id)
        if ($SUC({ code })) {
          const { size = [], base = [] } = detail
          this.sizes = size
          this.baseSizes = base
          this.protoId = this.data.id
        }
      } catch (err) {}
      this.loading = false
      return true
    },
  },
}
</script>
