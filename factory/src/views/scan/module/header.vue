<template>
  <div class="head-container" style="text-align: center">
    <!-- 搜索 -->
    <div v-if="type === 0">
      <el-input
        v-model="query.expressWaybillCode"
        clearable
        style="width: 300px"
        class="filter-item"
        ref="input"
        @blur="blurHandler"
        @focus="focusHandler"
        @keyup.enter.native="toQuery"
      />
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-truck" @click="toQuery">查询</el-button>
    </div>
    <!-- 搜索 -->
    <div v-else>
      <span class="el-dropdown-link el-dropdown" @click="statisticsDialogVisible = true">
        出库统计<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <!--<el-dropdown trigger="click" placement="bottom-start">
        <span class="el-dropdown-link" @click="getOutboundStatistics">
          出库统计<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" style="padding: 0">
          <el-row :gutter="20" class="p10">
            <el-col :span="12">
              <el-input
                ref="statisticsInput"
                size="mini"
                placeholder=""
                @click.native="statisticsClick"
                @blur="sup_this.canFocus = true"
              ></el-input>
            </el-col>
            <el-col :span="12">
              <avue-crud-date type="daterange" size="mini"></avue-crud-date>
            </el-col>
          </el-row>
          <el-table :data="outStorageData" v-loading="tableLoading" border class="text-center">
            <el-table-column prop="companyId" width="180">
              <template slot-scope="{ row }">
                {{ row.companyName || getLabel('expressCompanyId', row.companyId) }}
              </template>
            </el-table-column>
            <el-table-column prop="count" label="出库数量（条）" width="180" />
          </el-table>
        </el-dropdown-menu>
      </el-dropdown>-->
      <el-select v-model="companyId" style="width: 25%; margin-right: 10px" placeholder="请选择物流方式">
        <el-option
          v-for="{ companyName, id } in fedexData"
          :value="id"
          :label="companyName"
          :key="id"
        ></el-option>
      </el-select>
      <el-input
        v-model="query.expressWaybillCode"
        clearable
        style="width: 300px"
        class="filter-item"
        ref="input"
        @blur="blurHandler"
        @focus="focusHandler"
        @keyup.enter.native="toQuery"
      />
      <el-button class="filter-item" size="mini" type="primary" icon="el-icon-truck" @click="toQuery">发货</el-button>
    </div>
  
    <outboundStatistics :visible.sync="statisticsDialogVisible"></outboundStatistics>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getLabel } from '@/components/avue/utils/util'
import { getOutboundStatistics } from '@/api/order/order'
import outboundStatistics from '@/views/scan/module/outboundStatistics'
const FOCUSERRMSG = '输入框失去焦点'
export default {
  components: {
    outboundStatistics
  },
  props: {
    type: {
      type: [Number, String],
      required: true
    },
    query: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      default: null
    },
    canFocus: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      tableLoading: false,
      keydownTimer: false,
      companyId: '',
      outStorageData: [],
      statisticsDialogVisible: false
    }
  },
  computed: {
    ...mapGetters(['fedexData'])
  },
  watch: {
    canFocus(newVal) {
      if (newVal) {
        this.blurHandler()
      }
    }
  },
  mounted() {
    this.$refs.input && this.$refs.input.focus()
  },
  methods: {
    getLabel,
    async getOutboundStatistics() {
      this.statisticsDialogVisible = true
      this.tableLoading = true
      let {
        detail: { outboundStatisticsListMap }
      } = await getOutboundStatistics()
      this.outStorageData = outboundStatisticsListMap
      this.outStorageData.unshift({
        companyName: '今日出库总数',
        count: this.outStorageData.reduce((total, { count }) => total + count, 0)
      })
      this.tableLoading = false
    },
    async toQuery() {
      this.$emit('search')
      if (this.type === 1) {
        if (this.companyId === undefined || this.companyId === '') {
          return this.$message.warning('物流方式不能为空')
        }
      }
      if (this.query.expressWaybillCode === undefined || this.query.expressWaybillCode === '') {
        return this.$message.warning('运单号不能为空')
      }
      await this.$parent.init()
      this.$emit('takeCompanyId', this.companyId)
      this.$nextTick(() => {
        this.query.expressWaybillCode = ''
      })
    },
    blurHandler() {
      if (!this.canFocus) return
      this.focus = false
      this.$nextTick(() => {
        const _this = this.sup_this
        this.$refs.input && this.$refs.input.focus()
        this.focusTimer = setTimeout(() => {
          _this.errMsg = FOCUSERRMSG
        }, 100)
      })
    },
    focusHandler() {
      const _this = this.sup_this
      this.$nextTick(() => {
        if (_this.errMsg === FOCUSERRMSG) {
          _this.errMsg = ''
          if (!this.query.expressWaybillCode) return
          // this.$parent.init();
        }
        this.focusTimer && clearTimeout(this.focusTimer)
      })
    },
    statisticsClick() {
      this.sup_this.canFocus = false
      this.$nextTick(function () {
        this.$refs.statisticsInput.focus()
      })
    }
  }
}
</script>
