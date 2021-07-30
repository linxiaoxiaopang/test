<template>
  <div class="list-state-group">
    <el-radio-group v-model="query.orderStatus" size="mini" @change="changeSize">
      <el-radio-button v-for="({ label, value }, index) in orderStateData" :label="value" :key="index">{{
        label
      }}</el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
import { commonEheaderMixin } from '@/mixins'
import {
  WAIT_RELATION,
  WAIT_GENERATE_WAYBILL,
  EXPIRED,
  WAIT_DISPATCH,
  IN_DISPATCH,
  IN_PRODUCTION,
  DELIVER,
  RETURN_GOODS,
  CANCEL,
  FINISH
} from '@/utils/constant'
export default {
  mixins: [commonEheaderMixin],
  props: {
    query: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      orderStatus: IN_DISPATCH,
      orderStateData: [
        {
          value: WAIT_RELATION,
          label: '待关联'
        },
        {
          value: WAIT_DISPATCH,
          label: '待排单'
        },
        {
          value: WAIT_GENERATE_WAYBILL,
          label: '待生成运单'
        },
        {
          value: IN_DISPATCH,
          label: '排单中'
        },
        {
          value: CANCEL,
          label: '已取消'
        },
        {
          value: IN_PRODUCTION,
          label: '生产中'
        },
        {
          value: DELIVER,
          label: '已发货'
        },
        {
          value: EXPIRED,
          label: '已过期'
        },

        {
          value: FINISH,
          label: '已完成'
        },
        {
          value: RETURN_GOODS,
          label: '退货中'
        }
      ]
    }
  },
  watch: {
    'query.orderStatus'(newVal) {
      this.sup_this.page = 1
      this.toQuery()
    }
  },
  methods: {
    changeSize(Status) {
      this.$emit('takeStatus', Status)
      // console.log('this.orderStatus',this.orderStatus);
    }
  }
}
</script>

<style lang="scss" scoped></style>
