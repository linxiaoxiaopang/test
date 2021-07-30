<template>
  <div class="app-container orderImport">
    <div class="importPart">
      <XlsxTable
        @on-select-all-file="selectExcelData"
        @getFileName="(fileName) => (moreForm.groupName = fileName.replace(/\.[a-zA-Z]+$/, ''))"
      >
        <div class="xlsx-wrapper">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text" style="margin-bottom: 5px">点击上传订单文件</div>
          <div class="el-upload__text" style="color: #ccc; font-size: 12px">( 文件不超过50M)</div>
        </div>
      </XlsxTable>

      <div class="downFile">
        <p class="wenxin"><b>温馨提示</b></p>
        <p>
          <span>1.请先下载订单导入模板，按规范填写后导入</span>
          <el-button type="primary" plain size="mini" :loading="loading" @click="doLoading">
            <a
              class="download-btn"
              href="https://zdys1688test.oss-cn-hangzhou.aliyuncs.com/media/waybill_pdf/template.xls"
            >
              <i class="el-icon-download" ref="aLink"></i> 下载订单模板
            </a>
          </el-button>
        </p>
      </div>
    </div>

    <el-dialog title="订单导入预览" :visible.sync="previewDialogVisible" width="900px">
      <previewTable :fileListData="fileList" :errData="errData">
        <template #center>
          <avue-form v-model="moreForm" :option="moreFormOption"></avue-form>
        </template>
      </previewTable>
      <span slot="footer" class="dialog-footer">
        <el-button @click="previewDialogVisible = false">取 消</el-button>
        <el-button
          :loading="orderLoading"
          type="primary"
          @click="previewDialog"
          v-p="['order:order:batchImport']"
          >确定导入</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import XlsxTable from '@/components/xlsxTable'
import previewTable from './module/previewTable'
import {
  ORDER_KEYS,
  ORDER_RULES,
  ORDER_CODE_UNIQUE_KEYS,
  ORDER_CODE_NON_UNIQUE_KEYS
} from '@/utils/constant'
import { changeArrKey, getDicValue, handleFormRules, uniqueArray } from '@/utils'
import { orderBatchCreate } from '@/api/order'
import { validatenull } from '@/components/avue/utils/validate'
import { mapGetters } from 'vuex'
import { list as fedexList } from '@/api/order/fedexApi'

export default {
  components: {
    previewTable,
    XlsxTable
  },
  data() {
    return {
      loading: false,
      orderLoading: false,
      previewDialogVisible: false,
      fileList: [],
      errData: {
        failCount: 0,
        errMsg: []
      },
      moreForm: {
        groupName: ''
      },
      moreFormOption: {
        submitBtn: false,
        emptyBtn: false,
        span: 8
      },
      AllOrderCode: []
    }
  },
  created() {
    this.fedexList()
  },
  computed: {
    ...mapGetters(['fedexData', 'expressCompanyIdProps'])
  },
  watch: {
    previewDialogVisible(newVal) {
      if (!newVal) {
        this.moreForm = {
          groupName: '',
          remark: ''
        }
      }
    }
  },
  methods: {
    doLoading() {
      this.loading = true
      const { aLink } = this.$refs
      if (aLink) {
        console.log('aLink', aLink)
        aLink.click()
      }
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    check(data) {
      let errData = []
      if (data.length === 0) {
        errData.push('上传表格无数据')
        setTimeout(() => {
          this.errData = {
            errData, // 错误信息集合 array
            failCount: 0, // 产品错误数量
            errMsg: '上传表格无数据', // 错误信息字符串 - 用于this.$message.error(this.errData.errMsg)
            // 错误字段集合
            errKey: {
              orderCode: {}, // 多个产品时，唯一值不同全为failed
              index: {} // 无订单号时，视为单一产品
            }
          }
          this.$message.error('上传表格无数据')
        })
        return false
      }

      // 产品数据错误数量
      let failCount = 0
      // 键为运单号
      // 值为同一运单号的订单号数组
      let waybillCode = {}
      // 键为订单号
      // 值为对象（键值对）：键为对订单号唯一字段名，值为字段值数组
      let codeObj = {}
      // 物流方式不存在或已删除
      let withoutExpressCompanyName = []
      let errKey = {
        orderCode: {}, // 多个产品时，唯一值不同全为failed
        index: {} // 无订单号时，视为单一产品
      }

      data.map((item, index) => {
        let { orderCode, expressWaybillCode, expressCompanyName, expressCompanyId } = item

        // 有两种值
        // 对订单号唯一字段（键值对）：
        // 键：系统字段
        // 值：false表示字段正确，true则表示错误
        // 对订单号非唯一字段（键值对）：
        // 键：系统字段
        // 值（键值对）：键：订单下标  值：false表示字段正确，true则表示错误
        let currentErrObj
        if (orderCode) {
          if (!errKey.orderCode[orderCode]) errKey.orderCode[orderCode] = {}
          currentErrObj = errKey.orderCode[orderCode]
        } else {
          if (!errKey.index[index]) errKey.index[index] = {}
          currentErrObj = errKey.index[index]
        }

        // 非唯一项 每个订单号可能对应多个不同值
        ORDER_CODE_NON_UNIQUE_KEYS.map((key) => {
          if (!currentErrObj[key]) currentErrObj[key] = {}
          currentErrObj[key][index] = false
        })

        handleFormRules(ORDER_RULES, item, (errMsg, key) => {
          if (errMsg) {
            errData.push(errMsg)
            if (ORDER_CODE_NON_UNIQUE_KEYS.includes(key)) {
              currentErrObj[key][index] = true
            } else {
              currentErrObj[key] = true
            }
          }
        })

        // 该物流方式未在系统中注册或已删除
        if (expressCompanyName && validatenull(expressCompanyId)) {
          withoutExpressCompanyName.push(expressCompanyName)
          currentErrObj.expressCompanyName = true
        }

        if (orderCode) {
          // 运单号一对多个订单号
          if (expressWaybillCode) {
            if (!waybillCode[expressWaybillCode]) {
              waybillCode[expressWaybillCode] = []
            }
            let tempArr = waybillCode[expressWaybillCode]
            // 将不同的值push进数组
            if (!tempArr.includes(orderCode)) {
              tempArr.push(orderCode)
            }
          }

          // 订单号相同时，规定字段对应的值必须唯一
          if (!codeObj[orderCode]) {
            codeObj[orderCode] = {}
          }
          // 对订单号唯一字段 数组ORDER_CODE_UNIQUE_KEYS
          ORDER_CODE_UNIQUE_KEYS.map((key) => {
            if (!codeObj[orderCode][key]) {
              codeObj[orderCode][key] = []
            }
            let tempArr = codeObj[orderCode][key]
            // 将不同的值push进数组
            if (!tempArr.includes(item[key])) {
              tempArr.push(item[key])
            }
          })
        }
      })
      for (let key in waybillCode) {
        let tempArr = waybillCode[key]
        // 大于1表示有多个不同订单号
        if (tempArr.length > 1) {
          tempArr.map((orderCode) => {
            errKey.orderCode[orderCode].expressWaybillCode = true
          })
          errData.push(`${key}运单号对应${tempArr.join('，')}多个订单号`)
        }
      }
      for (let orderCode in codeObj) {
        for (let key in codeObj[orderCode]) {
          let tempArr = codeObj[orderCode][key]
          // 大于1表示有多个不同字段值
          if (tempArr.length > 1) {
            errKey.orderCode[orderCode][key] = true
            let cnKey = ORDER_KEYS[key]
            errData.push(
              `${orderCode}订单号对应${tempArr.join('，')}多个${
                Array.isArray(cnKey) ? cnKey[0] : cnKey
              }`
            )
          }
        }
      }
      withoutExpressCompanyName = uniqueArray(withoutExpressCompanyName)
      if (withoutExpressCompanyName.length) {
        errData.push(`物流方式不存在或已删除：${withoutExpressCompanyName.join('，')}`)
      }

      for (const type in errKey) {
        for (const value in errKey[type]) {
          // errKey[type][value] 当前订单（包括所有产品）
          let currentOrder = errKey[type][value]
          let indexes = Object.keys(currentOrder[ORDER_CODE_NON_UNIQUE_KEYS[0]])
          // 订单号下的产品数量
          let proCount = indexes.length

          // 唯一值有一个为true，则该订单号下的所有产品解析失败
          if (ORDER_CODE_UNIQUE_KEYS.some((key) => currentOrder[key])) {
            failCount += proCount
            continue
          }

          let proFailedObj = {}
          let proFailedCount = 0
          ORDER_CODE_NON_UNIQUE_KEYS.map((key) => {
            indexes.map((index) => {
              if (proFailedObj[index]) {
                return
              }
              if (currentOrder[key][index]) {
                proFailedObj[index] = true
                proFailedCount++
              }
            })
          })
          // console.log(isFailed, proCount, proFailedCount)
          failCount += proFailedCount
        }
      }

      // console.log(errData);
      errData = uniqueArray(errData)
      let errMsg = errData.join('；')
      if (errData.length) {
        setTimeout(() => {
          this.$message.error(`${errMsg}`)
        })
      }
      this.errData = {
        errMsg,
        errData,
        failCount,
        errKey
      }
      // console.log(this.errData)
      return failCount === 0
    },
    selectExcelData(excelData) {
      const { body = [] } = excelData
      this.previewDialogVisible = true
      this.fileList = []
      // 获取字段转换后的数据
      this.fileList = changeArrKey(body, ORDER_KEYS)
      this.fileList.forEach((item) => {
        item.expressCompanyId = getDicValue(
          item.expressCompanyName,
          this.fedexData,
          this.expressCompanyIdProps
        )
      })
      this.check(this.fileList)
    },
    async previewDialog() {
      if (this.errData.errMsg) {
        this.$message.error(this.errData.errMsg)
        return
      }
      // 确定导入按钮
      this.orderLoading = true
      try {
        let res = await orderBatchCreate({
          ...this.moreForm,
          groupCode: new Date().getTime(),
          list: this.fileList
        })
        if ($SUC(res)) {
          this.$store.dispatch('GetOrderCount')
          this.$message.success('订单导入成功！')
          this.previewDialogVisible = false
          this.$router.back()
        }
      } catch (e) {
        console.log(e)
      }
      this.orderLoading = false
    },
    async fedexList() {
      const res = await fedexList({})
      const { detail, code } = res
      if ($SUC({ code })) {
        this.$store.commit('SET_DIC_DATA', { prop: 'expressCompanyId', dicData: detail })
      }
    }
  }
}
</script>

<style scoped lang="scss">
.orderImport {
  height: 90vh;
  .importPart {
    width: 50%;
    height: 200px;
    border-radius: 5px;
    position: absolute;
    left: 50%;
    top: 20%;
    transform: translateX(-50%);
    padding: 10px;
    box-shadow: 0px 0px 3px 3px rgba($color: #000000, $alpha: 0.1);
  }
  .xlsx-wrapper {
    width: 100%;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .el-icon-upload {
      font-size: 60px;
      color: $color-primary;
    }
  }
  ::v-deep {
    .el-upload-dragger {
      width: 80vh;
    }
  }
  .downFile {
    left: 0;
    margin-top: 2em;
    position: absolute;
    .wenxin {
      margin-bottom: 10px;
      color: #0e1318;
      font-size: 16px;
    }
    p {
      span {
        font-size: 14px;
        color: #666666;
      }
      .el-button {
        margin-left: 15px;
      }
    }
  }
}
</style>
