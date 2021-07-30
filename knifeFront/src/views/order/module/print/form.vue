<template>
  <el-row :id="id" class="print-wrapper tablePrint">
    <el-col :span="24">
      <h3>
        <span> 业务员： </span>
        <span style="margin-right: 15px; color: #1890ff">
          {{ data.userName }}
        </span>
        <span>订单号：</span>
        <canvas ref="canvas"/>
      </h3>
      <h5 v-if="data.remark"><span> 备注：</span>{{ data.remark }}</h5>
      
      <table>
        <thead>
        <tr>
          <th v-for="(item, index) in tableColumn" :key="index">{{ item.label }}</th>
          <template v-if="productData.length > 1">
            <th v-for="item in tableColumn" :key="item.label">{{ item.label }}</th>
          </template>
        </tr>
        </thead>
        <tbody>
        <tr :key="index" v-for="({ SKU, SKU1, size, size1, cover, cover1, count, count1 },
            index) in tableData">
          <td style="width: 120px">
            <el-image :src="cover" v-if="cover"/>
          </td>
          <td style="width: 17%">{{ SKU }}</td>
          <td style="width: 10%">
              <span v-if="size !== undefined">
                {{ size || '均码' }}
              </span>
          </td>
          <td style="width: 8%; color: #ff4949">{{ count }}</td>
          
          <template v-if="productData.length>1">
            <td style="width: 120px">
              <el-image :src="cover1 || cover" :style="{ opacity: cover1 ? 1 : 0 }"/>
            </td>
            <td style="width: 17%">{{ SKU1 }}</td>
            <td style="width: 10%">
                <span v-if="size1 !== undefined">
                  {{ size1 || '均码' }}
                </span>
            </td>
            <td style="width: 8%; color: #ff4949">{{ count1 }}</td>
          </template>
        </tr>
        </tbody>
      </table>
    </el-col>
  </el-row>
</template>
<script>
  const JsBarcode = require('jsbarcode')
  
  export default {
    props: {
      data: {
        type: Object,
        requird: true
      },
      sup_this: {
        type: Object,
        default: null
      },
      id: {
        type: String,
        default: 'tablePrint'
      },
      productData: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        tableColumn: [
          {
            label: '图片'
          },
          {
            label: '货号'
          },
          {
            label: '尺码'
          },
          {
            label: '数量'
          }
        ]
      }
    },
    watch: {
      data: {
        handler() {
          this.createBarcode()
        },
        immediate: true,
        deep: true
      }
    },
    computed: {
      tableData() {
        const data = this.productData
        const tmp1 = []
        data.map(
          (
            {
              productCount: count,
              productShowCover: cover,
              productSizeName: size,
              productCustomSkuCode: SKU
            },
            index
          ) => {
            SKU = SKU ?? '暂无'
            console.log('cover', cover)
            if (index % 2 == 0) {
              tmp1.push(
                Object.assign(
                  {},
                  {
                    count,
                    size,
                    cover: cover ? cover : require('@/assets/images/default.png'),
                    SKU
                  }
                )
              )
              return
            }
            Object.assign(tmp1.slice(-1)[0], {
              SKU1: SKU,
              cover1: cover ? cover : require('@/assets/images/default.png'),
              count1: count,
              size1: size
            })
          }
        )
        return tmp1
      }
    },
    methods: {
      createBarcode() {
        const waybill = this.data.orderCode
        if (waybill) {
          const { canvas } = this.$refs
          if (canvas) {
            JsBarcode(canvas, waybill, {
              height: 30
            })
          }
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .tablePrint {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    clip: rect(0, 0, 0, 0);
  }
</style>
