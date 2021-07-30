<template>
  <div class="changeStateBtn line">
    <ColorTextBtn type="text" @click="showChangeStateDialogVisible" style="font-size: 12px">修改订单状态</ColorTextBtn>
    <BaseDialog title="修改订单状态" :dialogVisible.sync="changeStateDialogVisible" width="30%">
      <div class="changeStateDialogContent" style="padding-top: 12px">
        <span>订单编号: {{ data.orderCode }}</span>
        <span>物流渠道: {{ getLabel('expressCompanyId', data.expressCompanyId) }}</span>
        <span>运单号: {{ data.expressWaybillCode }}</span>
        <span>业务员: {{ data.userName }}</span>
        <div style="margin: 16px 0 9px 0">
          当前状态:
          <span class="changeStateBtn-color" v-if="data.orderStatus == 11">待关联</span>
          <span class="changeStateBtn-color" v-else-if="data.orderStatus == 20">生成运单</span>
          <span class="changeStateBtn-color" v-else-if="data.orderStatus == 29">已过期</span>
          <span class="changeStateBtn-color" v-else-if="data.orderStatus == 40">待排单</span>
          <span class="changeStateBtn-color" v-else-if="data.orderStatus == 41">排单中</span>
          <span class="changeStateBtn-color" v-else-if="data.orderStatus == 42">生产中</span>
          <span class="changeStateBtn-color" v-else-if="data.orderStatus == 70">已发货</span>
          <span class="changeStateBtn-color" v-else-if="data.orderStatus == 72">退货中</span>
          <span class="changeStateBtn-color" v-else-if="data.orderStatus == 80">已取消</span>
        </div>
      </div>
      <el-form class="changeStateBtn-from" size="mini">
        <el-form-item label="修改订单状态" :model="data">
          <el-select v-model="data.orderStatus" placeholder="请选择">
            <el-option
              v-for="({ label, value }, index) in changeState"
              :key="index"
              :label="label"
              :value="value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancellChange">取 消</el-button>
        <el-button type="primary" @click="changeStateDialog">确 定</el-button>
      </span>
    </BaseDialog>
  </div>
</template>

<script>
import { listUpdate } from '@/api/order/orderListData'
import { getLabel } from '@/components/avue/utils/util'
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      changeStateDialogVisible: false,
      changeState: [
        {
          label: '排单中',
          value: 41
        },
        {
          label: '待关联',
          value: 11
        },
        {
          label: '生成运单',
          value: 20
        },
        {
          label: '待排单',
          value: 40
        },
        {
          label: '生产中',
          value: 42
        },
        {
          label: '已发货',
          value: 70
        },
        {
          label: '退货中',
          value: 72
        },
        {
          label: '已取消',
          value: 80
        },
        {
          label: '已过期',
          value: 29
        }
      ]
    }
  },
  created() {},
  methods: {
    getLabel,
    showChangeStateDialogVisible() {
      this.changeStateDialogVisible = true
    },
    cancellChange() {
    this.changeStateDialogVisible = false
    this.sup_this.init()
    },
    async changeStateDialog() {
      const { code } = await listUpdate({
        orderStatus: this.data.orderStatus,
        id: this.data.id
      })
      if (code == 0) {
        if (this.sup_this) {
          this.sup_this.init()
        }
        this.$message.success('更改状态成功')
      } else {
        this.$message.error('更改状态失败')
      }
      this.changeStateDialogVisible = false
    }
  }
}
</script>

<style lang="scss">
.changeStateBtn {
  display: inline-block;
}
.changeStateDialogContent {
  background-color: #ebf0f8;
  padding: 5px;
  span {
    margin-right: 20px;
  }
}
.changeStateBtn-from {
  margin-top: 20px;
}

.changeStateBtn-color {
  color: orange;
}
</style>
