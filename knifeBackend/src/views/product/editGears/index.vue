<template>
  <div class="shelvesPage">
    <BaseProductPage :cols="cols" :isEdit="true" :resetUrl="url" :formField="fields">
      <template #batchOperation="{ sup_this }">
        <div>
          <el-button type="primary" size="small" @click="addGearsCategory(sup_this)" class="add-button">
            +新增分类</el-button
          >
        </div>
      </template>
      <template v-slot="{ sup_this }">
        <el-table-column fixed="right" align="center" label="操作" width="180px">
          <template slot-scope="{ row }">
            <el-button type="text" size="mini" class="filter-item line" @click="gearsManage(row)"> 管理档位</el-button>
            <el-button type="text" size="mini" class="filter-item" @click="editGears(row, sup_this)">编辑 </el-button>
          </template>
        </el-table-column>
      </template>
    </BaseProductPage>
    <BaseDialog
      style="text-align: left"
      @closeHandle="handleClosed"
      :dialogVisible.sync="showDialog"
      :append-to-body="false"
      :modal-append-to-body="false"
      width="600px"
      height="100px"
      title="添加分类"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="95px" class="demo-ruleForm">
        <el-form-item label="分类名称：" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入分类名称" size="small"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <LoadingBtn type="primary" @click="handleConfirmed" :loading="addLoading"> 确认 </LoadingBtn>
        <LoadingBtn @click="handleCanceled"> 取消 </LoadingBtn>
      </template>
    </BaseDialog>
    <BaseDialog
      style="text-align: left"
      @closeHandle="handleDialogClosed"
      :dialogVisible.sync="showEditDialog"
      :append-to-body="false"
      :modal-append-to-body="false"
      width="600px"
      height="100px"
      title="编辑分类"
    >
      <el-form label-width="95px" class="demo-ruleForm">
        <el-form-item label="分类名称：" prop="name">
          <el-input v-model="gearName" placeholder="请输入分类名称" size="small"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <LoadingBtn
          type="primary"
          @click="handleEditConfirmed"
          :disabled="gearName.trim() === ''"
          :loading="editLoading"
        >
          确认
        </LoadingBtn>
        <LoadingBtn @click="handleEditCanceled"> 取消 </LoadingBtn>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import { addGearsCategory, updateGearsCategoryList } from '@/api/product/productApi'
import { gearsCategoryCols as cols } from '../cols'
import BaseProductPage from '../baseProductPage'

export default {
  name: 'gearsManage',
  components: { BaseProductPage },
  data() {
    return {
      cols,
      editLoading: false,
      addLoading: false,
      sup_this: null,
      sup_that: null,
      gearName: '',
      fields: [
        {
          label: '档位分类',
          prop: 'search',
          name: 'search',
          placeholder: '请输入档位分类名称',
          colNum: 6
        },
        {
          label: '',
          prop: 'done',
          name: 'done',
          colNum: 1,
          slotName: 'doneSlot'
        }
      ],
      url: '/api/price_conf/gear_category',
      categoryName: '',
      originalName: '',
      gear: {},
      showDialog: false,
      showEditDialog: false,
      ruleForm: {
        name: ''
      },
      rules: {
        name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      }
    }
  },
  methods: {
    gearsManage(row) {
      this.$router.push(`/product/gearsManage/${row.id}`)
    },
    editGears(gear, sup_this) {
      this.sup_that = sup_this
      this.gear = gear
      this.gearName = gear.cate_name
      this.originalName = gear.cate_name
      this.showEditDialog = true
    },
    addGearsCategory(sup_this) {
      this.sup_this = sup_this
      this.showDialog = true
    },
    handleClosed() {},
    handleDialogClosed() {},
    async handleEditConfirmed() {
      this.editLoading = true
      //如果没有修改名称，则不请求接口
      if (this.gearName === this.originalName) {
        this.showEditDialog = false
      } else {
        await updateGearsCategoryList(this.gear.id, { cate_name: this.gearName }).then(() => {
          this.sup_that.init()
          this.showEditDialog = false
          this.$message({
            type: 'success',
            message: '修改档位分类名称成功!'
          })
        })
      }
      this.editLoading = false
    },
    handleEditCanceled() {
      this.showEditDialog = false
      this.$message({
        type: 'warning',
        message: '您取消了操作!'
      })
    },
    handleConfirmed() {
      this.addLoading = true
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return
        const data = {
          cate_name: this.ruleForm.name
        }
        await addGearsCategory(data).then(() => {
          this.sup_this.init()
          this.$message({
            type: 'success',
            message: '成功新增档位分类!'
          })
          this.showDialog = false
        })
      })
      this.addLoading = false
      this.ruleForm.name = ''
    },
    handleCanceled() {
      this.ruleForm.name = ''
      this.showDialog = false
      this.$message({
        type: 'warning',
        message: '您取消了操作!'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.add-button {
  margin: 35px 0 35px 0;
}
</style>
