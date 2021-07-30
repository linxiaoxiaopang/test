<template>
  <div class="app-container">
    <orderState :query="query" :sup_this="sup_this" @takeStatus="takeStatus"></orderState>
    <formPart :query="query" :sup_this="sup_this"></formPart>
    <sendFactory
      :orderStatus="orderStatus"
      :factoryData="factoryData"
      :sup_this="sup_this"
      v-p="['order:order:sendToFactory']"
    ></sendFactory>
    <tablePart
      :sup_this="sup_this"
      :tableLoading="tableLoading"
      :orderListData="data"
      :orderStatus="orderStatus"
      @takeFactory="takeFactory"
    ></tablePart>
    <PaginationBar ref="paginationBar" @refreshTableEventFun="refreshTableEventFun" :total="total" />
  </div>
</template>

<script>
import orderState from './module/orderListModule/orderState'
import formPart from './module/orderListModule/formPart'
import sendFactory from './module/orderListModule/sendFactory'
import tablePart from './module/orderListModule/tablePart'
import pagination from './module/orderListModule/pagination'
import { initDataMixin } from '@/mixins'
export default {
  mixins: [initDataMixin],
  data() {
    return {
      sup_this: this,
      url: '/order/order/list',
      method: 'post',
      query: {
        orderStatus: 41,
        orderItems: [
          {
            asc: false,
            column: 'import_time'
          },
          {
            asc: false,
            column: 'id'
          }
        ]
      },
      orderStatus: '0',
      factoryData: []
    }
  },
  components: {
    orderState,
    formPart,
    sendFactory,
    tablePart,
    pagination
  },
  methods: {
    takeStatus(data) {
      this.orderStatus = data
    },
    takeFactory(data) {
      this.factoryData = data
      // console.log(this.factoryData);
    }
  }
}
</script>

<style lang="scss" scoped></style>
