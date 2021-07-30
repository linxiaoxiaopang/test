<template>
  <BaseDialog :dialogVisible.sync="dialog" width="800px" :title="title">
    <template>
      <div class="tableInfo">
        <table>
          <tr>
            <td>收货人</td>
            <td>{{ data.consigneeName }}</td>
            <td>国家</td>
            <td>{{ data.consigneeCountryCode }}</td>
          </tr>
          <tr>
            <td>州/省</td>
            <td>{{ data.consigneeProvince }}</td>
            <td>城市</td>
            <td>{{ data.consigneeCity }}</td>
          </tr>
          <tr>
            <td>电话</td>
            <td>{{ data.consigneeContactPhone }}</td>
            <td>手机号码</td>
            <td>{{ data.consigneeContactMobilePhone }}</td>
          </tr>
          <tr>
            <td>邮编</td>
            <td>{{ data.consigneePostcode }}</td>
            <td>地址</td>
            <td>{{ data.consigneeDetailAddress }}</td>
          </tr>
        </table>
      </div>
      <ProCard
        v-for="item in data.orderItemDTOList"
        :key="item.id"
        :data="item"
        style="padding: 0 30px"
        :productData="data"
      />
      <BaseForm
        style="width: 50%"
        ref="form"
        label-width="100px"
        size="mini"
        :cols="formField"
        :form="form"
        :formVisible="dialog"
      >
        <template #expressCompanyIdSlot="{ scoped: { prop, placeholder } }">
          <el-select
            size="mini"
            style="width: 100%"
            v-model="form[prop]"
            filterable
            :placeholder="placeholder"
          >
            <el-option
              style="padding: 0 10px"
              v-for="item in fedexData"
              :key="item.id"
              :label="item.companyName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </template>

        <template #expressWaybillFilePathSlot="{ scoped: { prop } }">
          <FileUpload
            ref="imgUpload"
            action="#"
            accept=".pdf"
            :beforeUploadFunc="beforeUploadFunc"
            :limit="1"
            :files.sync="file"
          >
            <div class="change-order-upload-component">
              <i class="el-icon-upload"></i>
              <div class="el-upload-text">点击上传面单文件</div>
              <div class="el-upload-tip">( 文件不超过5M)</div>
            </div>
          </FileUpload>
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
import FileUpload from '@/components/fileUpload/fileUpload'

import ProCard from '../proCard'

import { changeWaybillFiled as formField } from './field'
import { commonFromMixin } from '@/mixins'
import { changeWaybill } from '@/api/order/changeWaybill'
import { list } from '@/api/order/orderList'
import { list as fedexList } from '@/api/order/fedexApi'
import { systemUploadFile as uploadFile } from '@/api/order/orderListUp'
import { mapGetters } from 'vuex'
const SIZE = 5 //文件大小限制
export default {
  mixins: [commonFromMixin],
  components: {
    FileUpload,
    ProCard
  },
  props: {
    title: {
      type: String,
      default: '提示'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      formField,
      dialog: this.dialogVisible,
      fedex: [],
      oldExpressWaybillCode: '',
      form: {
        expressWaybillCode: '',
        expressWaybillFilePath: [],
        expressCompanyId: ''
      },
      file: []
    }
  },
  computed: {
    ...mapGetters(['fedexData'])
  },
  watch: {
    dialog(newVal) {
      this.$emit('update:dialogVisible', newVal)
    },
    dialogVisible: {
      handler(newVal) {
        this.dialog = newVal
      },
      immediate: true
    }
  },
  created() {
    this.fedexList()
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    async fedexList() {
      const res = await fedexList({})
      const { detail, code } = res
      if ($SUC({ code })) {
        this.$store.commit('SET_DIC_DATA', { prop: 'expressCompanyId', dicData: detail })
      }
    },
    beforeUploadFunc(file) {
      const isMoreSize = file.size / 1024 / 1024 < SIZE
      const type = file.type
      if (type.indexOf('pdf') === -1) {
        this.$message.error(`上传PDF格式的文件`)
        return false
      }
      if (!isMoreSize) {
        this.$message.error(`上传文件大小不能超过 ${SIZE}MB!`)
        return isMoreSize
      }
    },
    async doSubmit() {
      this.form.expressWaybillFilePath = this.file
      const valid = await this.$refs['form'].validate()
      if (!valid) return
      await this.changeWaybill()
    },
    async getFilePath() {
      const { expressWaybillFilePath } = this.form
      const isFile = expressWaybillFilePath[0] instanceof File
      if (!isFile) {
        return true
      }

      const formData = new FormData()
      formData.append('file', expressWaybillFilePath[0])
      const { detail, code } = await uploadFile({
        data: formData
      })
      if ($SUC({ code })) {
        return detail
      }
      return false
    },
    async changeWaybill() {
      const filePath = await this.getFilePath()
      if (!filePath) {
        this.$message.warning('请先上传文件后，再进行此操作！')
        return
      }
      const { expressWaybillFilePath, ...params } = this.form

      if (this.form.expressWaybillCode === this.data.expressWaybillCode) {
        return this.$message.warning('运单号不变，无法换单')
      }

      return changeWaybill({
        ...params,
        expressWaybillFilePath: filePath
      }).then((res) => {
        if ($SUC(res)) {
          this.resetForm()
          this.$message({
            showClose: true,
            type: 'success',
            message: '换单成功',
            duration: 2500
          })
          this.sup_this.init()
          this.$store.dispatch('GetOrderCount')
        }
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
    },
    async list() {
      const { detail: { results = [] } = {} } =
        (await list({
          size: 500
        })) || {}
      this.fedex = results
      this.$set(this.form, 'fedexId', results[0] && results[0].id)
    }
  }
}
</script>
<style lang="scss" scoped>
.change-order-upload-component {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  height: 100%;
  line-height: 1;
  .el-icon-upload {
    color: $color-primary;
    font-size: 40px;
  }
  .el-upload-text {
    font-size: 14px;
    color: #000;
    max-width: 100%;
  }
  .el-upload-tip {
    margin-top: 5px;
    font-size: 12px;
    color: $color-gray;
  }
}
.tableInfo {
  table {
    width: 100%;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-collapse: collapse;
    td {
      height: 30px;
      border: 1px solid #ccc;
      padding: 8px 15px;
      &:nth-child(2n - 1) {
        white-space: nowrap;
      }
      &:nth-child(2n) {
        width: 50%;
      }
      span {
        font-weight: 600;
      }
    }
  }
}
</style>
