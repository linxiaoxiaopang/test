<template>
  <BaseDialog
    ref="baseDialog"
    width="500px"
    :dialogVisible.sync="dialog"
    :title="title"
  >
    <template>
      <AuthorizeInfo :data="data" />
      <BaseForm
        v-loading="loading"
        ref="form"
        label-width="100px"
        :cols="formField"
        :form="form"
        :formVisible="dialog"
      >
      </BaseForm>
    </template>
    <template #footer>
      <LoadingBtn type="primary" @click="doSubmit"> 确认 </LoadingBtn>
      <LoadingBtn @click="cancel"> 取消 </LoadingBtn>
    </template>
  </BaseDialog>
</template>
<script>
import AuthorizeInfo from './authorizeInfo'

import formField from './field'
import { updateAuth } from '@/api/expressAccount'
import { commonFromMixin } from '@/mixins'

export default {
  mixins: [commonFromMixin],
  components: {
    AuthorizeInfo
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formField,
      form: {}
    }
  },
  watch: {
    data: {
      handler() {
        this.form.id = this.data.id
        formField.map(({prop}) => {
          this.$set(this.form, prop, this.data[prop])
        })
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    async doSubmit() {
      const valid = await this.$refs['form'].validate()
      if (!valid) return

      this.loading = true
      let {companyId} = this.data
      try {
        const api = updateAuth
        const { code } = await api(this.form)
        if ($SUC({ code })) {
          this.$message.success('操作成功')
          await this.sup_this.getAccountList(this.sup_this.tableData.find(company => company.id === companyId))
          this.dialog = false
        }
      } catch (err) {
        console.log('err', err)
      }
      this.loading = false
    }
  }
}
</script>
