<template>
  <div class="app-container app-flex-col-container">
    <slot name="top" :sup_this="sup_this"></slot>
    <EHeader :sup_this="sup_this" :query="query" :formField="formField" />
    <slot name="batchOperation" :sup_this="sup_this"> </slot>
    <div class="flex-col-content">
      <CommonTable
              @sort-change="sortChange"
              height="100%"
              :tableLoading="tableLoading"
              :cols="cols"
              :infoData="data"
              :selection="selection"
              @selection-change="handleSelectionChange"
      >
        <template #importTimeSlot="{ scoped }">
          <span>{{ parseTime(scoped[scoped.prop]) }}</span>
        </template>

        <template #moneySlot="{ scoped }">
          <span>{{ parsePrice(scoped[scoped.prop]) }}</span>
        </template>

        <template #expressWaybillIsUploadedSlot="{ scoped }">
          <span>{{ scoped[scoped.prop] ? "是" : "否" }}</span>
        </template>

        <template #isAttachmentUploadedSlot="{ scoped }">
          <span>{{ scoped[scoped.prop] ? "是" : "否" }}</span>
        </template>

        <template #doingOrderStatusSlot="{ scoped: { allStatus } }">
          <color-text-btn
                  :key="index"
                  :style="{ color: value && value.split('@')[1] }"
                  v-for="(value, key, index) in allStatusData(allStatus)"
                  style="display: block; margin-left: 10px"
                  type="info"
          >
            {{ key }} * {{ value && value.split("@")[0] }}</color-text-btn
          >

          <!-- {{}} -->
        </template>

        <slot :sup_this="sup_this"></slot>
      </CommonTable>
    </div>
    <PaginationBar
            ref="paginationBar"
            @refreshTableEventFun="refreshTableEventFun"
            :total="total"
    />
  </div>
</template>

<script>
  import { ORDER_STATUS_LIST, ORDER_STATUS_COLOR } from "@/utils/constant";
  import { initDataMixin } from "@/mixins";
  import EHeader from "../header";
  import { parseTime, parsePrice } from "@/utils";

  export default {
    mixins: [initDataMixin],
    components: {
      EHeader,
    },
    props: {
      cols: {
        type: Array,
        required: true,
      },
      formField: {
        type: Array,
        // required: true,
        default: () => [],
      },
      resetMergeData: {
        type: Object,
        default: () => ({}),
      },
      resetUrl: {
        type: String,
        default: "/order/importGroup/listByOrderStatus",
      },
      selection: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        sup_this: this,
        method: "post",
        url: this.resetUrl,
      };
    },
    created() {
      this.initMergeData();
    },
    computed: {
      allStatusData() {
        return (data) => {
          let temObj = {};
          let valObj = {};
          data.map((value) => {
            if (!temObj[value]) {
              temObj[value] = 0;
            }
            temObj[value]++;
          });
          for (let key in temObj) {
            valObj[
                    ORDER_STATUS_LIST[key]
                    ] = `${temObj[key]}@${ORDER_STATUS_COLOR[key]}`;
          }
          // console.log(data);
          return valObj;
        };
      },
    },
    methods: {
      parseTime,
      parsePrice,
      sortChange({ column, prop, order }) {
        if (order === "descending") {
          this.initMergeData(prop, false);
        } else {
          this.initMergeData(prop, true);
        }
        this.init();
      },
      initMergeData(prop = "import_time", asc = false) {
        this.mergeData = Object.assign({
          orderItems: [
            {
              asc,
              column: prop.replace(/([A-Z])/g, "_$1").toLowerCase(),
            },
            {
              asc: false,
              column: 'id'
            }
          ],
        }, this.mergeData);
      },
      // initCallBack() {
      //   this.data = [
      //     {
      //       groupCode: "订单组号",
      //       groupName: "订单组名",
      //       importUserName: "业务员",
      //       importTime: new Date(),
      //     },
      //     {
      //       groupCode: "订单组号1",
      //       groupName: "订单组名1",
      //       importUserName: "业务员",
      //       importTime: new Date(),
      //     },
      //   ];
      // },
    },
  };
</script>
