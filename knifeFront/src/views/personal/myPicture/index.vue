<template>
  <div class="app-container personalInfoPage">
    <div class="title">我的图片</div>
    <div class="content">
      <div class="mb20 flex-middle">
        <span class="nowrap">≡ 图片分类</span>
        <avue-form v-model="searchForm" :option="formOption"></avue-form>
      </div>
      <div class="mb20 buttonBox">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          class="size-large"
          @change="handleCheckAllChange"
        ></el-checkbox>
        <el-button plain size="mini" class="ml10" @click="batchEditImg" v-p="['image:image:partial_update']"
          >批量修改分类</el-button
        >
        <UploadImg :sup_this="sup_this" style="margin-left: 10px" v-p="['image:image:create']" class="UploadImg" />
      </div>
      <el-checkbox-group v-model="checkedList" class="checkbox-img" v-loading="loading" @change="handleCheckedChange">
        <el-row :gutter="20">
          <el-col v-for="img in imgList" :key="img.id" :span="1.5">
            <el-checkbox :label="img.id" class="size-large">
              <div class="img-wrapper">
                <el-image :src="img.thumbnail_path" fit="contain">
                  <div slot="error" class="image-slot">
                    <img src="@/assets/images/default.png" fit="contain" alt="" class="block" />
                  </div>
                </el-image>
                <div class="img-mask" @click.prevent="handleImgClick(img)"></div>
              </div>
              <div class="img-name text-cut">{{ img.title }}</div>
              <div class="text-mini">
                {{ parseCharacterTime(img.create_time) }}
              </div>
              <el-dropdown @command="handleCommand($event, img)">
                <el-button plain size="mini" icon="el-icon-more"></el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="edit" v-p="['image:image:partial_update']">编辑</el-dropdown-item>
                  <el-dropdown-item command="forbidden" v-p="['image:image:disable']">{{ img.disable === 1 ? '启用' : '禁用' }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-checkbox>
          </el-col>
        </el-row>
      </el-checkbox-group>

      <PaginationBar
        ref="paginationBar"
        @refreshTableEventFun="refreshTableEventFun"
        :page="page.page"
        :total="page.total"
        :fSize="[12]"
      />
    </div>

    <preview-img-dialog :visible.sync="previewImgDialogVisible" :data="previewImgData"></preview-img-dialog>

    <img-edit-dialog
      :sup_this="sup_this"
      :visible.sync="imgEditDialogVisible"
      v-model="imgEditForm"
      :isImgEditBulk="isImgEditBulk"
    ></img-edit-dialog>
  </div>
</template>

<script>
import UploadImg from './module/uploadImg'
import previewImgDialog from '../module/previewImgDialog'
import imgEditDialog from '../module/imgEditDialog'
import { list, edit, bulkEdit, disable } from '@/api/image/imageApi'
import { debounce, parseCharacterTime } from '@/utils'
import { validatenull } from '@/components/avue/utils/validate'
import disableProviteMixin from '@/views/personal/mixins/disableProviteMixin'
import { SYS_NO } from '@/utils/constant'

export default {
  mixins: [disableProviteMixin],
  components: {
    previewImgDialog,
    imgEditDialog,
    UploadImg
  },
  data() {
    let formOption = {
      submitBtn: false,
      emptyBtn: false,
      labelWidth: 20,
      span: 5,
      column: [
        {
          prop: 'category',
          placeholder: '请选择分类',
          type: 'cascader',
          emitPath: false,
          checkStrictly: true,
          showAllLevels: false
        },
        {
          prop: 'create_time',
          placeholder: '上传时间',
          type: 'daterange',
          valueFormat: 'yyyy-MM-dd',
          span: 8
        },
        {
          prop: 'title',
          placeholder: '输入图片名称',
          prefixIcon: 'el-icon-search',
          span: 8
        }
      ]
    }
    this.$store.dispatch('HandleOption', formOption)
    return {
      formOption,
      sup_this: this,
      searchForm: {
        category: '',
        title: '',
        create_time: []
      },
      postData: {},

      loading: false,
      imgList: [],
      page: {
        page: 1,
        size: 12,
        total: 0
      },
      isIndeterminate: false,
      checkAll: false,
      checkedList: [],

      previewImgData: {},
      previewImgDialogVisible: false,

      imgEditForm: {},
      isImgEditBulk: false,
      imgEditDialogVisible: false
    }
  },
  watch: {
    searchForm: {
      handler() {
        if (!Array.isArray(this.searchForm.create_time)) this.searchForm.create_time = []
        this.init()
      },
      deep: true
    },
    checkedList: {
      handler(n) {
        this.imgEditForm.ids = n
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    parseCharacterTime,
    getList: debounce(
      async function () {
        this.getPostData()
        this.loading = true
        this.isIndeterminate = false
        this.checkAll = false
        this.checkedList = []
        try {
          let { detail } = await list(this.postData)
          this.imgList = detail.results
          this.page.total = detail.count
        } catch (e) {
          console.log(e)
        }
        this.loading = false
      },
      200,
      false
    ),
    handleSearchTime(key, value) {
      if (!Array.isArray(value)) return { [key]: value }
      let searchTime
      if (key.includes('Time')) {
        searchTime = {
          [this.getJavaDirTime(key, 'Start')]: value[0] + ' 00:00:00',
          [this.getJavaDirTime(key, 'End')]: value[1] + ' 23:59:59'
        }
      }
      if (key.includes('_time')) {
        searchTime = {
          [key + '_after']: parseCharacterTime(new Date(`${value[0]} 00:00:00`).toUTCString().replace(' GMT', '')),
          [key + '_before']: parseCharacterTime(new Date(`${value[1]} 23:59:59`).toUTCString().replace(' GMT', ''))
        }
      }
      return searchTime
    },
    handleSearchForm() {
      let form = {}
      let { searchForm, handleSearchTime } = this
      for (const key in searchForm) {
        let value = searchForm[key]
        if (!validatenull(value) && value !== 'all') {
          if (key.includes('Time') || key.includes('_time')) {
            Object.assign(form, handleSearchTime(key, value))
            continue
          }

          form[key] = value
        }
      }
      return form
    },
    getPostData() {
      if (this.isPageChange) {
        Object.assign(this.postData, this.page)
      } else {
        this.postData = {
          ...this.page,
          ...this.handleSearchForm()
        }
      }
      this.isPageChange = false
    },
    init() {
      this.page.page = 1
      this.getList()
    },
    refreshTableEventFun({ page, size }) {
      this.isPageChange = true
      this.page.page = page
      this.page.size = size
      this.getList()
    },
    async imgEditSubmit(form) {
      this.imgEditDialogVisible = false
      if (this.isImgEditBulk) {
        bulkEdit({
          ids: this.checkedList,
          category: form.category
        }).then(() => {
          this.init()
        })
      } else {
        edit(form.id, form).then(() => {
          this.init()
        })
      }
    },
    batchEditImg() {
      if (this.checkedList.length) {
        this.isImgEditBulk = true
        this.$set(this.imgEditForm, 'category', this.searchForm.category)
        this.imgEditDialogVisible = true
        return
      }
      this.$message.error('请先选择图片')
    },
    async handleCommand(command, img) {
      if (command === 'edit') {
        // 编辑
        this.imgEditForm = JSON.parse(JSON.stringify(img))
        this.isImgEditBulk = false
        this.imgEditDialogVisible = true
      } else if (command === 'forbidden') {
        // 禁用
        // disable(img);
        this.isDiable = img.disable
        this.form = {}
        this.data = img
        if (Number(img.disable) === SYS_NO) {
          let [, res] = await awaitWrap(this.$prompt('禁用备注', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }))
          if (res) {
            this.form.reason = res.value || '2'
          } else {
            this.$message({
              type: 'info',
              message: '取消禁用'
            })
            return
          }
        }
        await this.doSubmit()
      }
    },
    handleImgClick(img) {
      this.previewImgData = img
      this.previewImgDialogVisible = true
    },
    handleCheckAllChange(val) {
      this.checkedList = []
      if (val) {
        this.imgList.forEach((img) => this.checkedList.push(img.id))
      }
      this.imgEditForm.ids = this.checkedList
      this.isIndeterminate = false
    },
    handleCheckedChange(value) {
      console.log(value)
      let checkedCount = value.length
      this.checkAll = checkedCount === this.imgList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.imgList.length
    },
  
    async validate() {
      return true
    },
    success() {
      this.$message.success('操作成功')
      this.init()
    }
  }
}
</script>

<style lang="scss">
.buttonBox {
  position: relative;
  .UploadImg {
    position: absolute;
    right: 5%;
  }
}
</style>
