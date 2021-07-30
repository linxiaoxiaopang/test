<template>
  <!-- 物流列表 -->
  <section class="app-container app-flex-col-container">
    <BatchOperation class="head-container" style="margin-top: 0" v-p="['system:expressCompany:create']">
      <LoadingBtn type="primary" size="mini" @click="showDialog(0)">添加物流</LoadingBtn>
    </BatchOperation>

    <div class="flex-col-content">
      <CommonTable :selection="false" :tableLoading="tableLoading" :cols="cols" :infoData="data">
        <template #need_declareSlot="{ scoped: row }">
          <el-tag :type="(row[row.prop] && 'primary') || 'danger'">
            {{ ['无需报关', '需报关'][Number(row[row.prop])] }}
          </el-tag>
        </template>

        <slot>
          <el-table-column fixed="right" label="操作" width="200px" align="center">
            <template slot-scope="{ row }">
              <color-text-btn
                class="line"
                type="primary"
                size="mini"
                @click="showDialog(1, row)"
                v-p="['order:expressCompany:update']"
                >编辑</color-text-btn
              >

              <Popover content="确定删除该物流方式？" @sureHandler="del(row.id, $event)" v-p="['order:expressCompany:delete']">
                <template #reference="{ scope: loading }">
                  <color-text-btn class="line" :loading="loading" type="danger" size="mini">删除</color-text-btn>
                </template>
              </Popover>
            </template>
          </el-table-column>
        </slot>
      </CommonTable>
    </div>

    <!-- 图片编辑弹出层 -->
    <BaseDialog v-if="dialogVisible" :dialogVisible.sync="dialogVisible" :title="title" width="500px">
      <template>
        <BaseForm ref="form" label-width="100px" :cols="formField" :form="form" :formVisible="dialogVisible">
          <template #nameSlot>
            <el-tag type="warning">
              {{ form.name }}
            </el-tag>
          </template>
          <template #isCustomsDeclareSlot>
            <el-radio-group v-model="form.isCustomsDeclare">
              <el-radio :label="0">无需报关</el-radio>
              <el-radio :label="1">需报关</el-radio>
            </el-radio-group>
          </template>
        </BaseForm>
      </template>
      <template #footer>
        <LoadingBtn type="primary" @click="doneFunc"> 确定 </LoadingBtn>
        <LoadingBtn @click="dialogVisible = false"> 关闭 </LoadingBtn>
      </template>
    </BaseDialog>
  </section>
</template>

<script>
import initDataMixin from '@/mixins/initData'
import delMixin from '@/mixins/delMixin'
import { fedexListCols as cols } from './cols'
import { addFedexFiled, reditFedexFiled } from './field'
import { mapActions } from 'vuex'
import {
  list, //获取物流信息列表
  add, //创建物流信息列表
  edit, //修改物流信息列表详情
  del as delApi //删除物流信息
} from '@/api/fadexApi'

export default {
  mixins: [delMixin, initDataMixin],
  data() {
    return {
      sup_this: this,
      cols,
      formField: addFedexFiled,
      form: {},
      title: '新增物流',
      dialogVisible: false,
      type: 0,
      url: '/system/expressCompany/list/',
      method: 'post',
      mergeData: {
        isDeleted: 0,
        isDockApi: 0
      },
      size: 1000
    }
  },
  methods: {
    delApi,
    showDialog(type, row) {
      this.form = {}
      const titleArr = ['新增物流', '编辑物流']
      this.title = titleArr[type]
      this.type = type
      this.formField = addFedexFiled
      if (type === 0) {
        this.$set(this.form, 'isCustomsDeclare', 0)
      }
      //type === 1,编辑
      if (type === 1) {
        this.formField = reditFedexFiled
        this.form = JSON.parse(JSON.stringify(row))
      }
      this.dialogVisible = true
    },
    //添加物流方式
    async doneFunc() {
      const valid = await this.$refs.form.validate()
      if (!valid) return
      const apis = [add, edit]
      let args = [this.form]
      if (this.type == 1) {
        const { id, ...form } = this.form
        args = [id, form]
      }
      const { code } = await apis[this.type].apply(this, args)
      if ($SUC({ code })) {
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.init()
      }
    }
  }
}
</script>

<style></style>
