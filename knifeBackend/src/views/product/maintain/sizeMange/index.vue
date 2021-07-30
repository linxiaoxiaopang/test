<template>
  <section>
    <BaseProductPage :cols="cols" :formField="formField" :resetUrl="url">
      <template #top="{ sup_this }">
        <listStateGroup v-model="status" :list="list" class="mb20"></listStateGroup>
      </template>
      <template #tips>
        <el-alert title="上架的尺码无法修改 psd 文件与刀版图校验结果" type="warning" show-icon> </el-alert>
      </template>
      <template v-slot="{ sup_this }">
        <el-table-column fixed="right" align="center" label="操作" width="300px">
          <template slot-scope="{ row }">
            <template v-if="showByStatus(0)">
              <ReferenceSizeSetting
                :data="row"
                :sup_this="sup_this"
                v-if="showBtn(row) > 0 && row.status != 1"
                v-p="['product:get_size_info:list', 'set_kl_prod:create']"
              />

              <verifyBtn
                :data="row"
                v-if="showBtn(row) > 1"
                v-p="['prim_prod:kl_group_info:list', 'prim_prod:change_kl_group:create']"
              ></verifyBtn>

              <SetUpBtn :data="row" v-if="showBtn(row) > 1" />
            </template>
            <template v-if="showByStatus(1)">
              <createReference :data="row" />
              <checkReference :data="row" />
            </template>

            <template v-if="showByStatus(2)">
              <site-psd-btn :data="row" :status="showBtn(row)" v-if="showBtn(row) > 1 && row.status != 1"></site-psd-btn>
              <SetUpBtn :data="row" :isPosRefer="true" v-if="showBtn(row) > 2" />
            </template>
          </template>
        </el-table-column>
      </template>
    </BaseProductPage>
  </section>
</template>

<script>
import BaseProductPage from '../../baseProductPage'
import listStateGroup from '@/views/components/listStateGroup'
import verifyBtn from '../knifeMange/module/verifyBtn'
import sitePsdBtn from '../knifeMange/module/sitePsdBtn'
import ReferenceSizeSetting from '../knifeMange/module/referenceSizeSetting'
import createReference from '../knifeMange/module/createReferenceBtn'
import checkReference from '../knifeMange/module/checkReferenceBtn'

//显示设置
import SetUpBtn from './module/setUpBtn.vue'

import { sizeMangeField as formField } from './field'
import { referenceSizeCols as cols } from './cols'
export default {
  name: 'sizeMange',
  components: {
    SetUpBtn,
    BaseProductPage,
    listStateGroup,
    verifyBtn,
    ReferenceSizeSetting,
    createReference,
    checkReference,
    sitePsdBtn
  },
  data() {
    return {
      cols,
      formField,
      status: 0,
      list: [
        {
          label: '参考尺码设置',
          value: 0
        },
        {
          label: '刀版图校验',
          value: 1
        },
        {
          label: '一键设计',
          value: 2
        }
      ],
      url: '/api/prim_prod/prim_prod_info/'
    }
  },
  computed: {
    showByStatus() {
      return (status) => {
        return status === this.status
      }
    }
  },
  methods: {
    showBtn({ id, sizes, base_sizes }) {
      let { showBtnCache } = this
      if (!showBtnCache) this.showBtnCache = showBtnCache = {}
      
      setTimeout(() => {
        showBtnCache[id] = undefined
      }, 1000)
      
      if (showBtnCache[id] !== undefined) return showBtnCache[id]
      if (sizes.every(({ psd_file }) => !psd_file)) {
        showBtnCache[id] = 0
        return 0
      }
      if (base_sizes.length === 0) {
        showBtnCache[id] = 1
        return 1
      }
      if (base_sizes[0]?.quick_design_combinations?.length === 0) {
        showBtnCache[id] = 2
        return 2
      }
      showBtnCache[id] = 3
      return 3
    }
  }
}
</script>

<style scoped>
.el-alert {
  margin-top: -20px;
  margin-bottom: 20px;
}
</style>
