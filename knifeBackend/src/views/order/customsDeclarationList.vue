<template>
  <div class="app-container">
    <formPart :query="query" :sup_this="sup_this"></formPart>
    <exportBtn :sup_this="sup_this" :selectedData="selectedData" v-p="['order:order:batchUpdate']"></exportBtn>
    <tablePart :orderListData="data" @updateSelectedData="updateSelectedData"></tablePart>
    <PaginationBar
      ref="paginationBar"
      @refreshTableEventFun="refreshTableEventFun"
      :total="total"
    />
  </div>
</template>

<script>
import formPart from "./module/customsModule/formPart";
import exportBtn from "./module/customsModule/exportBtn";
import tablePart from "./module/customsModule/tablePart";
import pagination from "./module/customsModule/pagination";
import { initDataMixin } from "@/mixins";
export default {
  mixins: [initDataMixin],
  data() {
    return {
      sup_this: this,
      url: "/order/order/customsDeclareList",
      method: "post",
      query: {
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
      }
    }
  },
  created(){},
  components: {
    formPart,
    exportBtn,
    tablePart,
    pagination,
  },
  methods: {
    updateSelectedData (data) {
      this.selectedData = data
    }
  }
};
</script>

<style lang="scss" scoped></style>
