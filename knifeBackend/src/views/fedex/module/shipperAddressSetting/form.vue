<template>
  <BaseDialog
    ref="baseDialog"
    width="666px"
    :dialogVisible.sync="dialog"
    :title="title"
  >
    <template>
      <BaseForm
        v-loading="loading"
        ref="form"
        label-width="100px"
        :cols="formField"
        :form="form"
        :formVisible="dialog"
      >
        <template #administrativeAreaSlot="{ prop, placeholder }">
          <el-cascader
              :placeholder="placeholder"
              :options="administrativeArea"
              :props="administrativeAreaProps"
              filterable
              :value="[form.provinceCode, form.cityCode]"
              @input="val => {[form.provinceCode, form.cityCode] = val}"
          >
          </el-cascader>
        </template>
      </BaseForm>
    </template>
    <template #footer>
      <LoadingBtn type="primary" @click="doSubmit"> 确认 </LoadingBtn>
      <LoadingBtn @click="cancel"> 取消 </LoadingBtn>
    </template>
  </BaseDialog>
</template>
<script>
import formField from './field'
import { updateAccountShippingMethod as update } from '@/api/expressAccount'
import { commonFromMixin } from '@/mixins'
import {deepClone, getDiffData} from '@/components/avue/utils/util'
import {mapGetters} from 'vuex'

export default {
  mixins: [commonFromMixin],
  props: {
    data: {
      type: Object,
      default: () => {return {}}
    }
  },
  data() {
    return {
      formField,
      form: {}
    }
  },
  computed: {
    ...mapGetters(['administrativeArea', 'administrativeAreaProps'])
  },
  watch: {
    data: {
      handler(n) {
        this.form = deepClone(n)
        console.log(this.form)
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    autoTest() {
      this.$message.success('成功')
    },
    async doSubmit() {
      const valid = await this.$refs['form'].validate()
      if (!valid) return

      this.loading = true
      let params = getDiffData(this.form, this.data)
      params.id = this.data.relationId
      // params.companyId = this.data.companyId
      // params.accountId = this.data.accountId
      // params.shippingMethodId = this.data.id
      const api = update
      const [err, res] = await awaitWrap(api(params))
      if ($SUC(res)) {
        this.success()
      }
      this.loading = false
    },
    init() {
      let { sup_this } = this
      sup_this && sup_this.refreshChannelList(this.form)
    }
  }
}
</script>
