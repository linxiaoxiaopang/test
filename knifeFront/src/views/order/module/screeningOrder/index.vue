<template>
  <div>
    <div class="header">
      <div class="slot-wrapper">
        <slot name="orderStatus"> </slot>
      </div>

      <el-button
        class="import-order"
        type="primary"
        @click="importOrder"
        v-if="orderImportBtn"
      >
        <i class="el-icon-upload2" />
        订单导入</el-button
      >
    </div>

    <div class="batch-operation screen">
      <div class="batchCancelBtn">
        <!-- 批量操作 -->
        <el-dropdown
          trigger="click"
          v-show="cancelBatchBtn || logisticsBtn || syncDataBtn"
        >
          <el-button class="batch" type="primary" size="mini">
            批量操作<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown" class="batch-menu">
            <el-dropdown-item>
              <el-button size="mini" @click="batchCancel" v-if="cancelBatchBtn"
                >批量取消</el-button
              >
            </el-dropdown-item>
            <el-dropdown-item>
              <selectExpressCompanyName :sup_this="sup_this" v-if="logisticsBtn"
                >批量申请运单号</selectExpressCompanyName
              >
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- 订单导出 -->
        <el-button size="mini" @click="orderExport" :loading="exportBtnLoading"
          >订单导出</el-button
        >
        <el-button size="mini" @click="showsyncDataDialog" v-if="syncDataBtn"
          >发送排单</el-button
        >
        <el-checkbox
          class="checkbox-large"
          :indeterminate="checkAllStatus === 'indeterminate'"
          :disabled="sup_this.total === 0"
          :value="checkAllStatus === 'all'"
          @change="checkAllChange"
        >全选</el-checkbox>
      </div>
      <div class="screenBox">
        <el-button size="mini" @click="refresh"
          >刷新 <i class="el-icon-refresh-right"></i
        ></el-button>
        <div class="select">
          <el-select
            size="mini"
            v-model="value"
            @change="changeScreen(value)"
            placeholder="请选择升序降序"
            clearable
          >
            <el-option
              v-for="{ value, label } in options"
              :key="value"
              :value="value"
              :label="label"
            ></el-option>
          </el-select>
        </div>
      </div>
      <!-- 发送排单对话框 -->
      <el-dialog
        title="确认同步"
        :visible.sync="syncDataDialogVisible"
        width="50%"
      >
        <span>是否让这些订单同步到后台？</span>
        <el-table border :data="orderListData">
          <el-table-column
            v-for="{ prop, label } in tableColData"
            :key="prop"
            :prop="prop"
            :label="label"
          >
          </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="syncDataDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="syncDataDialog" :loading="loading"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import selectExpressCompanyName from '../selectExpressCompanyName'
import { cancell } from '@/api/order/cancell'
import { list as orderList } from '@/api/order/orderList'
import { exportForCustoms } from '@/api/order'
import { syncToSupplier } from '@/api/order'
import saveAs from 'jszip/vendor/FileSaver.js'
export default {
  props: {
    sup_this: {
      type: Object,
      default() {
        return {}
      }
    },
    cancelBatchBtn: {
      type: Boolean,
      default() {
        return true
      }
    },
    selectionData: {
      type: Array,
      default() {
        return []
      }
    },
    logisticsBtn: {
      type: Boolean,
      default() {
        return false
      }
    },
    syncDataBtn: {
      type: Boolean,
      default() {
        return false
      }
    },
    orderImportBtn: {
      type: Boolean,
      default() {
        return false
      }
    },
    optionsTypes: {
      type: Array,
      default: () => [0, 1, 2, 3]
    }
  },
  data() {
    return {
      loading: false,
      orderItem: [
        [
          {
            asc: true,
            column: 'import_time'
          },
          {
            asc: false,
            column: 'id'
          }
        ],
        [
          {
            asc: false,
            column: 'import_time'
          },
          {
            asc: false,
            column: 'id'
          }
        ],
        [
          {
            asc: true,
            column: 'express_expire_time'
          },
          {
            asc: false,
            column: 'id'
          }
        ],
        [
          {
            asc: false,
            column: 'express_expire_time'
          },
          {
            asc: false,
            column: 'id'
          }
        ],
        [
          {
            asc: true,
            column: 'delivery_time'
          },
          {
            asc: false,
            column: 'id'
          }
        ],
        [
          {
            asc: false,
            column: 'delivery_time'
          },
          {
            asc: false,
            column: 'id'
          }
        ],
        [
          {
            asc: true,
            column: 'cancel_time'
          },
          {
            asc: false,
            column: 'id'
          }
        ],
        [
          {
            asc: false,
            column: 'cancel_time'
          },
          {
            asc: false,
            column: 'id'
          }
        ],
        [
          {
            asc: true,
            column: 'return_apply_time'
          },
          {
            asc: false,
            column: 'id'
          }
        ],
        [
          {
            asc: false,
            column: 'return_apply_time'
          },
          {
            asc: false,
            column: 'id'
          }
        ],
        [
          {
            asc: true,
            column: 'change_time'
          },
          {
            asc: false,
            column: 'id'
          }
        ],
        [
          {
            asc: false,
            column: 'change_time'
          },
          {
            asc: false,
            column: 'id'
          }
        ]
      ],
      value: '',
      // 选择的订单id列表
      idArr: [],
      // 是否显示发送到后台对话框
      syncDataDialogVisible: false,
      // 表格数据
      orderListData: [],
      // 物流表格列
      tableColData: [
        { prop: 'orderCode', label: '订单号' },
        { prop: 'consigneeCountryCode', label: '收件国家' },
        { prop: 'consigneeName', label: '收件人' },
        { prop: 'totalWeight', label: '总重量' },
        { prop: 'totalVolume', label: '总体积' },
        { prop: 'internalTotalPrice', label: '货款总额' }
      ],
      exportBtnLoading: false
    }
  },
  watch: {
    // 监听选择的订单id的改变
    selectionData: {
      handler(newVal) {
        this.idArr = []
        newVal.map((item) => {
          let { id } = item
          this.idArr.push(id)
        })
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    options() {
      const options = [
        {
          value: 0,
          label: ' 按导入时间升序'
        },
        {
          value: 1,
          label: ' 按导入时间降序'
        },
        {
          value: 2,
          label: ' 按到期时间升序'
        },
        {
          value: 3,
          label: ' 按到期时间降序'
        },
        {
          value: 4,
          label: ' 按发货时间升序'
        },
        {
          value: 5,
          label: ' 按发货时间降序'
        },
        {
          value: 6,
          label: ' 按取消时间升序'
        },
        {
          value: 7,
          label: ' 按取消时间降序'
        },
        {
          value: 8,
          label: ' 按退货时间升序'
        },
        {
          value: 9,
          label: ' 按退货时间降序'
        },
        {
          value: 10,
          label: ' 按换单时间升序'
        },
        {
          value: 11,
          label: ' 按换单时间降序'
        }
      ]
      const tmpArr = []
      this.optionsTypes.map((type) => {
        tmpArr.push(options[type])
      })
      return tmpArr
    },
    checkAllStatus({ sup_this, selectionData }) {
      if (selectionData.length < sup_this.total && selectionData.length > 0) return 'indeterminate'
      if (selectionData.length === sup_this.total || sup_this.selectedAll) return 'all'
    }
  },
  components: {
    selectExpressCompanyName
  },
  methods: {
    // 刷新按钮
    refresh() {
      this.sup_this.refreshPage()
    },
    // 更改排序方式
    changeScreen(value) {
      this.sup_this.mergeData.orderItems = this.orderItem[value]
      this.sup_this.init()
    },
    //批量取消订单
    batchCancel() {
      if (!this.idArr.length) {
        this.$message.warning('请先选择订单')
      } else {
        const idList = []
        this.selectionData.map((item) => {
          let { id } = item
          idList.push(id)
        })
        // console.log(idList)
        this.$confirm(
          `<div>确定取消这些订单吗？已取消的订单，可以在已取消订单中恢复原订单状态。`,
          '提醒',
          {
            confirmButtonText: '确认取消',
            cancelButtonText: '放弃',
            dangerouslyUseHTMLString: true,
            callback: async (action) => {
              if (action === 'confirm') {
                await this.cancell({ idList })
                this.$store.dispatch('GetOrderCount')
                return
              } else {
                this.$message.info('已放弃')
              }
            }
          }
        )
      }
    },
    // 取消订单
    async cancell(params) {
      this.loading = true
      try {
        const res = await cancell(params)
        const { detail, code } = res
        if ($SUC({ code })) {
          this.$message.success('取消成功')
          this.sup_this && this.sup_this.init()
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
      return true
    },
    // 打开同步到后台对话框
    async showsyncDataDialog() {
      if (!this.idArr.length) {
        this.$message.warning('请先选择订单')
      } else {
        const { code: code2, detail: res2 } = await orderList({
          idList: this.idArr
        })
        this.orderListData = res2
        this.syncDataDialogVisible = true
      }
    },
    async syncDataDialog() {
      this.loading = true
      try {
        const { code } = await syncToSupplier({
          idList: this.idArr
        })
        if ($SUC({ code })) {
          this.sup_this && this.sup_this.init()
          this.$message.success('操作成功')
          this.syncDataDialogVisible = false
          this.$store.dispatch('GetOrderCount')
        }
      } catch (err) {}
      this.loading = false
    },
    importOrder() {
      this.$router.push('/order/orderImport')
    },
    orderExport() {
      // console.log('selectionData',this.selectionData);
      if (this.selectionData.length !== 0) {
        const idList = this.selectionData.map((item) => item.id)
        this.exportBtnLoading = true
        exportForCustoms({
          idList,
          isFirstExport: 0,
          // isCustomsDeclaredExported: 0,
          exportType: 1
        })
          .then((res) => {
            saveAs(res, '订单')
            this.$message.success('导出成功')
          })
          .finally(() => {
            this.exportBtnLoading = false
          })
      } else {
        this.$message.warning('请选择订单')
      }
    },
  
    checkAllChange(checked) {
      this.sup_this.selectedAllChange(checked)
      if (checked) {
        this.sup_this.getAllData()
      }
    }
  }
}
</script>

<style lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 15px 15px 5px 15px;
  .batch-menu {
  }
  .import-order {
    height: 32px !important;
    line-height: 32px !important;
    padding: 0 15px !important;
  }
}
.order-status-change {
  font-size: 16px;
  color: #636c78;
  .item-wrapper {
    display: inline-flex;
    align-items: center;
    height: 33px;
    background: #f6f7fb;
    border-radius: 17px;
    padding: 0 20px;
  }
  .item {
    margin-right: 20px;
    cursor: pointer;
  }
  .active {
    color: #3841db;
  }
}
.batch-operation.screen {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 5px 15px;
  display: flex;
  justify-content: space-between;
  .screenBox {
    .el-button {
      margin-right: 10px;
    }
    .select {
      display: inline-block;
    }
  }
}
.batchCancelBtn {
  .el-button {
    margin-right: 10px;
  }
}
.el-dialog {
  .el-table {
    margin-top: 10px;
  }
}
</style>
