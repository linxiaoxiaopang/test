<template>
  <div class="line inline-block" style="margin-right: 15px">
    <el-button size="mini" @click="to" v-if="showBtn">
      <slot>选择物流方式</slot>
    </el-button>
    <el-dialog
      :visible.sync="dialogVisible"
      title="选择物流方式"
      width="800px"
      top="10vh"
      append-to-body
      v-loading="loading"
      @close="handleClose"
    >
      <div>
        <avue-form ref="form" v-model="form" :option="formOption"></avue-form>
        <avue-crud
            ref="avueCrud"
            :data="tableData"
            :option="tableOption"
            :page="tablePage"
            @size-change="sizeChange"
            @current-change="pageChange"
            @selection-change="selectionChange"
        >
          <template #totalWeight="{ row }">
            {{ row.totalWeight || '暂无' }}
          </template>
          <template #totalVolume="{ row }">
            {{ row.totalVolume || '暂无' }}
          </template>
        </avue-crud>
      </div>
      <span slot="footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="onsubmit" :loading="loading"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { dialogComponentsMixin } from '@/mixins'
import { validatenull } from '@/components/avue/utils/validate'
import {
  orderExpressBatchUpdate,
  getChannelByCompanyId,
  getChannel,
  getChannelTwo
} from '@/api/express'
import { SYS_YES } from '@/utils/constant'
import { formOption } from './const'
import { mapGetters } from 'vuex'
import { orderList } from '@/api/order'

export default {
  mixins: [dialogComponentsMixin],
  props: {
    sup_this: {
      type: Object,
      default: null
    },
    showBtn: {
      type: Boolean,
      default: true
    },
    beforeSubmit: Function,
    afterSubmit: Function
  },
  data() {
    this.$store.dispatch('HandleOption', formOption)
    return {
      form: {},
      formOption,
      allTableData: [],
      tableData: [],
      tableOption: {
        menu: false,
        selection: true,
        column: [
          {
            label: '订单号',
            prop: 'orderCode'
          },
          {
            label: '收件国家',
            prop: 'consigneeCountryCode'
          },
          {
            label: '收件人',
            prop: 'consigneeName'
          },
          {
            label: '总重量',
            prop: 'totalWeight',
            slot: true
          },
          {
            label: '总体积',
            prop: 'totalVolume',
            slot: true
          },
          {
            label: '备注',
            prop: 'remark'
          }
        ]
      },
      tablePage: {
        pageIndex: 1,
        pageSize: 10,
        total: 0
      },
      selectionData: [],
      selectionDataAll: {},
      loading: false,
      orderIdList: '',
      channelData: []
    }
  },
  computed: {
    ...mapGetters(['expressCompanyId']),
    selectionDataAllArr({ selectionDataAll }) {
      let tempArr = []
      for (const key in selectionDataAll) {
        tempArr = tempArr.concat(selectionDataAll[key])
      }
      return tempArr
    }
  },
  watch: {
    channelData: {
      handler(n) {
        this.formOption.column[0].dicData = this.channelData
      },
      immediate: true,
      deep: true
    },
    selectionData: {
      handler(n) {
        if (!this.isPageChange) {
          this.$set(this.selectionDataAll, this.tablePage.pageIndex, n)
        }
        // console.log(this.selectionDataAll)
      },
      deep: true
    },
    // 选择物流公司后，获取物流渠道列表
    'form.expressCompanyId'(companyId, o) {
      if (!validatenull(companyId) && companyId !== o) {
        let company = this.channelData.find(
          (channel) => channel.id === companyId
        )
        this.formOption.column[1].dicData = company.children
        // console.log(company)
      }
    }
  },
  methods: {
    async to() {
      if (validatenull(this.sup_this.selectionDataAllArr)) {
        this.$message.warning('请先选择数据')
        return
      }
      
      this.dialogVisible = true
      this.loading = true
  
      let { tablePage } = this
      tablePage.pageIndex = 1
      await this.init(true)
      let selectionData = this.allTableData

      const countryCodeList = selectionData.map(({ consigneeCountryCode }) => {
        return consigneeCountryCode
      })
      const [, res] = await awaitWrap(getChannelTwo({ countryCodeList }))

      if (res) {
        // console.log('detail', res.detail)
        this.channelData = res.detail
      }

      this.loading = false
      // this.$nextTick(() => {
      //   this.$refs.avueCrud.toggleSelection(selectionData, true)
      // })
    },
    async onsubmit() {
      console.log('orderIdList', this.selectionDataAllArr.map(({ id }) => {
        return id
      }))
      let [err, valid] = await awaitWrap(this.$refs.form.validate())
      if (valid) {
        if (validatenull(this.selectionData)) {
          this.$message.warning('请先选择数据')
          return
        }

        if (typeof this.beforeSubmit === 'function') await this.beforeSubmit()

        this.loading = true
  
        const orderIdList = this.selectionDataAllArr.map(({ id }) => {
          return id
        })
        // console.log('orderIdList', orderIdList)
        
        let [err, res] = await awaitWrap(
          orderExpressBatchUpdate({
            companyId: this.form.expressCompanyId,
            shippingMethodId: this.form.shippingMethodId,
            orderIdList
          })
        )
        if ($SUC(res)) {
          // 申请运单后，订单状态改变，订单统计重新请求
          this.$store.dispatch('GetOrderCount')
          this.$message.success('运单生成中')
        }

        if (typeof this.afterSubmit === 'function') await this.afterSubmit()

        this.sup_this && this.sup_this.init()
        this.dialogVisible = false
        this.loading = false
      }
    },
    cancel() {
      this.dialogVisible = false
      this.$emit('cancel')
    },
    selectionChange(val) {
      this.selectionData = val
    },
    
    handleClose() {
      this.$refs.form.resetForm()
    },
    async init(isInit) {
      let { sup_this, tablePage, allTableData, selectionDataAll } = this
      if (isInit) {
        selectionDataAll = {}
        this.allTableData = allTableData = sup_this.selectionDataAllArr
        
        let len = Math.ceil(allTableData.length / tablePage.pageSize)
        for (let i = 1; i <= len; i++) {
          this.$set(
            selectionDataAll,
            i,
            allTableData
              .slice((i - 1) * tablePage.pageSize, i * tablePage.pageSize)
          )
        }
        this.selectionDataAll = selectionDataAll
        this.isPageChange = true
        // console.log(selectionDataAll)
      }
      
      let tableData = []
      tableData = allTableData
        .slice((tablePage.pageIndex - 1) * tablePage.pageSize, tablePage.pageIndex * tablePage.pageSize)
      tablePage.total = allTableData.length
      this.tableData = tableData
      // console.log(tableData, allTableData, sup_this.selectionDataAllArr)
  
      if (this.isPageChange) {
        clearTimeout(this.isPageChangeTimer)
        this.isPageChangeTimer = setTimeout(() => this.isPageChange = false, 500)
      }
  
      // console.log(selectionDataAll[tablePage.pageIndex])
      this.$nextTick(() => {
        this.$refs.avueCrud.toggleSelection(selectionDataAll[tablePage.pageIndex], true)
      })
      
      return tableData
    },
    async pageChange(e) {
      this.isPageChange = true
      this.tablePage.pageIndex = e
      await this.init()
    },
    async sizeChange(e) {
      this.isPageChange = true
      this.tablePage.pageIndex = 1
      this.tablePage.pageSize = e
      await this.init()
    }
  }
}
</script>
