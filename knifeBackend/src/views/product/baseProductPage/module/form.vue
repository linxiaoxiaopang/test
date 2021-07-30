<template>
  <BaseDialog
    style="text-align: left"
    :dialogVisible.sync="dialog"
    :append-to-body="false"
    :modal-append-to-body="false"
    width="700px"
    maxHeight="50vh"
    :title="title"
  >
    <template>
      <Basis
        style="padding-top: 0; padding-bottom: 0"
        ref="basis"
        :showTitle="false"
        @loadEnd="initBasisForm"
      />
    </template>
    <template #footer>
      <LoadingBtn type="primary" @click="doSubmit"> 确认 </LoadingBtn>
      <LoadingBtn @click="cancel"> 取消 </LoadingBtn>
    </template>
  </BaseDialog>
</template>
<script>
import Basis from './basis'
import { commonFromMixin } from '@/mixins'
import { edit } from '@/api/product/protoBasisApi'

export default {
  mixins: [commonFromMixin],
  components: {
    Basis
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },

  methods: {
    initBasisForm() {
      const { name, prod_period, category, sex, season, level, detail } =
        this.data || {}
      const { basis } = this.$refs
      if (!basis) return
      basis.form = {
        name,
        prod_period,
        category,
        sex,
        season,
        level,
        detail
      }
    },
    async doSubmit() {
      const { basis } = this.$refs
      const form = await basis.save()
      if (!form) return
      this.doEdit(form)
    },
    async doEdit(form) {
      const { id } = this.data
      const { code } = await edit(id, {
        ...form,
        level: Number(form.level)
      })
      if ($SUC({ code })) {
        this.success()
      }
    },
    cancel() {
      this.dialog = false
    },
    resetForm() {
      //重置mixin中的resetForm方法
    }
  }
}
</script>
<style lang="scss">
.tox-tinymce-aux {
  z-index: 5000 !important;
}
</style>
