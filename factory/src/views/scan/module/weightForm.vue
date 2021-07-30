<template>
  <BaseDialog class="weightFormComponent" width="80vw" maxHeight="60vh" :dialogVisible.sync="dialog" :title="title">
    <div class="head-container">
      <div class="scan-order-title">{{ title }}</div>
      <el-input
        v-model="query.weight"
        clearable
        style="width: 300px"
        class="filter-item"
        ref="wInput"
        @blur="blurHandler"
        @keyup.enter.native="toQuery"
      />
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-truck"
        @click="toQuery"
        :disabled="sup_this.data[0].orderStatus === 29"
      >发货</el-button
      >
      <div v-if="!validExpressCompanyId.valid" class="el-form-item__error el-loading-parent--relative">
        {{ validExpressCompanyId.errorText }}
      </div>
      <div v-if="this.sup_this.data[0].orderStatus === 29" class="info">该订单为过期订单</div>
    </div>
    <WeightFormTable v-bind="$attrs" v-on="$listeners" />

    <!--    <KnifeList v-bind="$attrs" />-->
    <template #footer>
      <LoadingBtn @click="cancel"> 取消 </LoadingBtn>
    </template>
  </BaseDialog>
</template>
<script>
import { scanOut } from '@/api/order/orderApi'
import cloneDeep from 'lodash/cloneDeep'
import WeightFormTable from './weightFormTable'
import KnifeList from './knifeList'
import { getLabel } from '@/components/avue/utils/util'
export default {
  components: {
    WeightFormTable,
    KnifeList
  },
  props: {
    query: {
      type: Object,
      required: true
    },
    weightWaybill: {
      required: true
    },
    title: {
      type: String,
      default: '提示'
    },
    dialogVisible: {
      type: Boolean,
      default: false
    },
    sup_this: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      dialog: this.dialogVisible
    }
  },
  computed: {
    validExpressCompanyId({
      sup_this: { companyId },
      $attrs: {
        data: [{ expressCompanyId }]
      }
    }) {
      return {
        errorText: `订单物流方式(${getLabel('expressCompanyId', expressCompanyId)})
          和
          所选物流方式(${getLabel('expressCompanyId', companyId)})
          不匹配
          `,
        valid: companyId === expressCompanyId
      }
    }
  },
  watch: {
    dialog(newVal) {
      this.$emit('update:dialogVisible', newVal)
    },
    dialogVisible: {
      handler(newVal) {
        this.dialog = newVal
      },
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.wInput && this.$refs.wInput.focus()
    })
  },
  methods: {
    cancel() {
      this.dialog = false
    },
    blurHandler() {
      this.$nextTick(() => {
        this.$refs.wInput && this.$refs.wInput.focus()
      })
    },
    beforeQuery() {
      const query = cloneDeep(this.query)
      query.waybill = this.weightWaybill
      const params = {}
      const tmpObj = {}
      for (let key in query) {
        if (query[key]) {
          tmpObj[key] = query[key]
        }
      }
      if (Object.keys(tmpObj).length) {
        for (let key in tmpObj) {
          params[key] = tmpObj[key]
        }
      }
      return params
    },
    async toQuery() {
      console.log('我被调用了', this.sup_this.data[0])
      if (!this.validExpressCompanyId.valid) {
        return this.$message.warning('请选择正确的物流方式')
      }

      const params = this.beforeQuery()
      const weight = parseFloat(params.weight)
      if (!this.sup_this.companyId) return this.$message.warning('物流方式不能为空')
      if (!params.weight) {
        return this.$message.warning('重量不能为空')
      }
      if (isNaN(weight)) {
        return this.$message.warning('重量必须是数字')
      }
      console.log('weight', weight)
      console.log('params', params)
      const { code, detail } = await scanOut({
        id: this.$attrs.data[0].id,
        sendOutWeight: params.weight,
        expressCompanyId: this.sup_this.companyId
      })
      if ($SUC({ code })) {
        this.$emit('success')
        this.$message.success('发货成功！')
        console.log('toQuery', this.weightWaybill)
        this.$nextTick(() => {
          this.query.weight = ''
          this.cancel()
          this.query.expressWaybillCode = this.weightWaybill
          this.$parent.init(true)
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.info {
  font-weight: bold;
  color: red;
  font-size: 30px;
  position: absolute;
  top: 65%;
  left: 35%;
  z-index: 9999;
}
.weightFormComponent {
  .head-container {
    text-align: center;
  }
  .scan-order-title {
    color: $color-primary;
    text-align: center;
    line-height: 2rem;
    padding-bottom: 1rem;
    font-size: 1.25rem;
    font-size: 35px;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid $border-color;
  }
}
</style>
