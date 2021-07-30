<template>
  <div class="previewTable">
    <div class="firstPart">
      <span
        ><b>上传产品:</b> <i>{{ statusInfo.uploadedCount }}</i></span
      >
      <span
        ><b>产品解析成功:</b> <i>{{ statusInfo.successCount }}</i></span
      >
      <!--<span
            ><b>产品解析失败:</b> <i>{{ statusInfo.failCount }}</i></span
            >-->
      <span
        ><b>不可导入:</b> <i>{{ statusInfo.failCount }}</i></span
      >
    </div>
    <slot name="center"></slot>
    <div class="secondPart">
      <div class="tableHead">
        <span>产品信息</span>
        <span>收货人</span>
        <span>收货地址</span>
        <span>物流</span>
        <span>销售总计</span>
      </div>
      <div class="tableBody">
        <template v-for="(item, index) in fileListData">
          <div class="news" :key="index">
            <div class="newsHead" :class="{ failed: validateOrderValue(item, index, 'orderCode') }">
              <span>订单号: </span>
              <span>{{ item.orderCode }}</span>
            </div>
            <div class="newsBody">
              <div class="pos-relative">
                <div class="cNewsBody cNewsBody1">
                  <p :class="{ failed: validateOrderValue(item, index, 'sku') }">
                    <b>SKU:</b> <b>{{ item.sku }}</b>
                  </p>
                  <p
                    :class="{
                      failed: validateOrderValue(item, index, 'productCount')
                    }"
                  >
                    <span>产品数量:</span> <i>{{ item.productCount }}</i>
                  </p>
                  <p
                    :class="{
                      failed: validateOrderValue(item, index, 'salesman')
                    }"
                  >
                    <span>业务员:</span> <i>{{ item.salesman }}</i>
                  </p>
                  <p :class="{ failed: validateOrderValue(item, index, 'dept') }">
                    <span>部门:</span> <i>{{ item.dept }}</i>
                  </p>
                </div>
                <div class="cNewsBody cNewsBody2">
                  <p
                    :class="{
                      failed: validateOrderValue(item, index, 'consigneeName')
                    }"
                  >
                    <b>姓名:</b> <b>{{ item.consigneeName }}</b>
                  </p>
                  <p
                    :class="{
                      failed: validateOrderValue(item, index, 'consigneeContactPhone')
                    }"
                  >
                    <span>收货人电话:</span>
                    <i>{{ item.consigneeContactPhone }}</i>
                  </p>
                  <p
                    :class="{
                      failed: validateOrderValue(item, index, 'consigneeContactMobilePhone')
                    }"
                  >
                    <span>收货人手机号码:</span>
                    <i>{{ item.consigneeContactMobilePhone }}</i>
                  </p>
                </div>
                <div class="cNewsBody cNewsBody3">
                  <p
                    :class="{
                      failed: validateOrderValue(item, index, 'consigneeCountryCode')
                    }"
                  >
                    <span>国家:</span> <i>{{ item.consigneeCountryCode }}</i>
                  </p>
                  <p
                    :class="{
                      failed: validateOrderValue(item, index, 'consigneeProvince')
                    }"
                  >
                    <span>州/省:</span> <i>{{ item.consigneeProvince }}</i>
                  </p>
                  <p
                    :class="{
                      failed: validateOrderValue(item, index, 'consigneeCity')
                    }"
                  >
                    <span>城市:</span> <i>{{ item.consigneeCity }}</i>
                  </p>
                  <p
                    :class="{
                      failed: validateOrderValue(item, index, 'consigneePostcode')
                    }"
                  >
                    <span>邮编:</span> <i>{{ item.consigneePostcode }}</i>
                  </p>
                  <p
                    :class="{
                      failed: validateOrderValue(item, index, 'consigneeDetailAddress')
                    }"
                  >
                    <span>地址:</span> <i>{{ item.consigneeDetailAddress }}</i>
                  </p>
                </div>
                <div class="cNewsBody cNewsBody4">
                  <p
                    :class="{
                      failed: validateOrderValue(item, index, 'expressWaybillCode')
                    }"
                  >
                    <b>运单号:</b> <b>{{ item.expressWaybillCode }}</b>
                  </p>
                  <p
                    :class="{
                      failed: validateOrderValue(item, index, 'expressCompanyName')
                    }"
                  >
                    <span>物流方式:</span> <i>{{ item.expressCompanyName }}</i>
                  </p>
                </div>
                <div class="cNewsBody cNewsBody5">
                  <p
                    :class="{
                      failed: validateOrderValue(item, index, 'totalPrice')
                    }"
                  >
                    <b>销售金额:</b> <b>{{ parsePrice(item.totalPrice) }}</b>
                  </p>
                  <p
                    :class="{
                      failed: validateOrderValue(item, index, 'externalFreight')
                    }"
                  >
                    <span>运费:</span>
                    <i>{{ parsePrice(item.externalFreight) }}</i>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { ORDER_CODE_NON_UNIQUE_KEYS } from '@/utils/constant'
import { parsePrice } from '@/utils'

export default {
  props: {
    fileListData: {
      type: Array,
      required: true
    },
    errData: {
      type: Object
    }
  },
  data() {
    return {}
  },
  computed: {
    statusInfo({ errData: { failCount }, fileListData }) {
      const uploadedCount = fileListData.length
      return {
        uploadedCount,
        successCount: uploadedCount - failCount,
        failCount
      }
    },
    errKey({ errData: { errKey } }) {
      return errKey
    }
  },
  methods: {
    parsePrice,
    validateOrderValue(item, index, key) {
      let currentErrObj
      if (item.orderCode) {
        currentErrObj = this.errKey.orderCode[item.orderCode]
      } else {
        currentErrObj = this.errKey.index[index]
      }

      if (ORDER_CODE_NON_UNIQUE_KEYS.includes(key)) return currentErrObj[key][index]

      return currentErrObj[key]
    }
  }
}
</script>

<style scoped lang="scss">
.firstPart {
  height: 50px;
  min-width: 460px;

  span {
    display: inline-block;
    width: 25%;
    line-height: 50px;

    i {
      color: orange;
    }
  }
}

.secondPart {
  border: 1px solid rgba($color: #000000, $alpha: 0.2);

  .tableHead {
    background-color: #f7f8fa;
    height: 30px;
    padding-left: 20px;

    span {
      display: inline-block;
      line-height: 30px;
      width: 20%;
    }
  }

  .tableBody {
    height: 300px;
    overflow: auto;

    .news {
      .newsHead {
        height: 30px;
        background-color: #f0f2f5;
        padding-left: 20px;
        margin-bottom: 15px;

        span {
          line-height: 30px;
        }
      }

      .newsBody {
        padding-left: 20px;
        height: 160px;
        position: relative;

        .cNewsBody {
          position: absolute;
          top: 0;
          display: inline-block;
          width: 20%;

          p {
            padding-left: 5px;
            margin-bottom: 5px;

            i {
              font-style: normal;
              color: rgba($color: #000000, $alpha: 0.5);
            }
          }
        }

        .cNewsBody2 {
          left: 20%;
        }

        .cNewsBody3 {
          left: 40%;
        }

        .cNewsBody4 {
          left: 60%;
        }

        .cNewsBody5 {
          left: 80%;
        }
      }
    }
  }
}

.failed {
  border: 1px solid $color-danger;
}
</style>
