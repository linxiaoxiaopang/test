<template>
  <BaseDialog ref="baseDialog" width="500px" :dialogVisible.sync="dialog" :title="title">
    <template>
      <BaseForm v-loading="loading" ref="form" label-width="100px" :cols="formField" :form="form" :formVisible="dialog">
      </BaseForm>
      <el-button type="primary" style="margin-left: 25px" size="mini" plain @click="autoTest" v-if="testBtn" :disabled="!isDisabled">
        授权状态测试
      </el-button>
    </template>
    <template #footer>
      <LoadingBtn type="primary" @click="doSubmit" :isDisabled="isDisabled"> 确认 </LoadingBtn>
      <LoadingBtn @click="cancel"> 取消 </LoadingBtn>
    </template>
  </BaseDialog>
</template>
<script>
import { normalFile, emsFile, yotoFile, disifangFile} from './field'
import { addAuth, testAuth, disifangAuth } from '@/api/expressAccount'
import { commonFromMixin } from '@/mixins'
import { POST_OFFICE, YOTO, DI_SIFANG } from './companyCode'
import { deepClone } from '@/components/avue/utils/util'
export default {
  mixins: [commonFromMixin],
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      form: {},
      isDisabled: true,
      POST_OFFICE,
      YOTO,
      DI_SIFANG,
      normalFile,
      emsFile,
      yotoFile,
      disifangFile,
      companyCode: this.data.companyCode,
      testBtn: true
    }
  },
  computed: {
    formField() {
      if (this.companyCode == this.POST_OFFICE) {
        return this.emsFile
      } else if(this.companyCode == this.YOTO){
        return this.yotoFile
      } else if(this.companyCode == this.DI_SIFANG){
        this.testBtn = false
        this.isDisabled = false
        return this.disifangFile
      } else {
        return this.normalFile
      }
    }
  },
  methods: {
    async autoTest() {
      try {
        const valid = await this.$refs['form'].validate()
        if (!valid) return
        const testForm = deepClone(this.form)
        // 邮政 云途
        delete testForm.accountName
        testForm.companyId = this.data.id
        const { detail: data } = await testAuth(testForm)
        if (data) {
          this.isDisabled = false
          this.$message.success('检测成功')
        } else {
          this.$message.error('检测失败')
        }

      } catch (e) {
        console.log(e)
      }
    },
    async doSubmit() {
      const valid = await this.$refs['form'].validate()
      if (!valid) return
      this.loading = true
      const addForm = deepClone(this.form)
      addForm.companyId = this.data.id
      try {
        const api = addAuth
        const { code, detail: accountId } = await api(addForm)
        if(this.companyCode == this.DI_SIFANG) {
          delete addForm.accountName
          addForm.accountId = accountId
          const {detail: data} = await disifangAuth(addForm)
          window.open(data)
        } 
          
        if ($SUC({ code })) {
          this.success()
          this.isDisabled = true
          this.dialog = false
        }
    
      } catch (err) {
        console.log('err', err)
      }
      this.loading = false
    },
    cancel() {
      this.isDisabled = true
      this.dialog = false
    }
  }
}
</script>
