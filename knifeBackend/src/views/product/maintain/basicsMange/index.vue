<template>
  <section>
    <BaseProductPage
      :cols="cols"
      :formField="formField"
      :isEdit="true"
      :resetUrl="url"
    >
      <template v-slot:top>
        <div class="page-title-tip">
          <i class="el-icon-delete"></i>
          已上架的尺码或款式无法进行修改！
        </div>
        <BatchOperation
          class="batch-operation-wrapper"
          style="margin-top: -10px"
          v-p="['prim_prod:prim_prod_info:create_complete_product']"
        >
          <div class="g-left-operation">
            <el-button
              type="primary"
              size="small"
              @click="goInfoPage('add')"
              class="el-icon-plus"
            >
              新增原型基础信息
            </el-button>
          </div>
        </BatchOperation>
      </template>
      <template v-slot:batchOperation="{ sup_this }">
        <BatchOperation
          class="batch-operation-wrapper"
          style="margin-top: 0"
          v-p="['prim_prod:change_prod_category:create']"
        >
          <div class="g-left-operation">
            <UpdateCate
              :sup_this="sup_this"
              :data="sup_this.selectedData || []"
            />
          </div>
        </BatchOperation>
      </template>
      <template v-slot="{ sup_this }">
        <el-table-column
          fixed="right"
          style="z-index: 100"
          align="center"
          label="操作"
          width="180px"
        >
          <template slot-scope="{ row }">
            <el-button
                v-p="['prim_prod:prim_prod_info:partial_update']"
                type="text"
                size="mini"
                class="line inline-block"
                @click="goInfoPage('edit', row)"
            >
              编辑
            </el-button>
            <del-btn
              :id="row.id"
              :sup_this="sup_this"
              type="prim_prod_info"
              v-p="['prim_prod:prim_prod_info:delete']"
            ></del-btn>
          </template>
        </el-table-column>
      </template>
    </BaseProductPage>
  </section>
</template>

<script>
import UpdateCate from '@/components/updateCate'

import BaseProductPage from '../../baseProductPage'

import Edit from '../../module/edit'
import delBtn from '@/views/components/delBtn'

import { baseInfoField as formField } from '../../field'
import { basicCols as cols } from '../../cols'

export default {
  name: 'basicsMange',
  components: {
    UpdateCate,
    BaseProductPage,
    Edit,
    delBtn
  },
  data() {
    return {
      cols,
      formField,
      url: '/api/prim_prod/prim_prod_info/'
    }
  },
  methods: {
    goInfoPage(type, row) {
      this.$store.commit('SET_BUS', {
        basicsEdit: row
      })
      this.$router.push('/product/maintain/basicsEdit?type=' + type)
    }
  }
}
</script>

<style lang="scss"></style>
