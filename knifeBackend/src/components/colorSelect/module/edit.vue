<template>
  <div class="color-select-edit-component">
    <i class="el-icon-edit-outline close" @click="to"></i>
    <EForm
      ref="form"
      v-if="dialogVisible"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :isAdd="false"
      :data="data"
      title="编辑顔色"
    />
  </div>
</template>

<script>
import { commonEheaderMixin } from '@/mixins'
import EForm from '../form'
export default {
  mixins: [commonEheaderMixin],
  components: {
    EForm,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  methods: {
    to() {
      console.log(this.data)
      this.dialogVisible = true
    },
  },
}
</script>

<style></style>
