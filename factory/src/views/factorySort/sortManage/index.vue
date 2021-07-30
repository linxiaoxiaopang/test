<template>
  <div class="app-container">
    <avue-crud ref="crud"
               class="in-production sort-manage-table"
               :data="tableData"
               :option="tableOption"
               :page="tablePage"
               :tableLoading="tableLoading"
               @size-change="sizeChange"
               @current-change="pageChange"
               @search-change="searchChange"
    >
      <template #menuLeft>
        <el-button type="primary" icon="el-icon-plus" size="small" @click="addSort">添加分类</el-button>
        <el-card shadow="never">
          <div class="mb20 text-normal">未分配款式</div>
          <el-tag v-for="tag in design"
                  :key="tag.id">{{ tag.structure }}</el-tag>
        </el-card>
      </template>
      <template #design="{ row }">
        <el-tag v-for="(tag) in row.prim_structs"
                :key="tag.id">{{ tag.structure }}</el-tag>
      </template>
      <template #menu="{ row }">
        <el-button type="text" @click="distributionDesign(row)">分配款式</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-button type="text" @click="editBtn(row)">编辑</el-button>
      </template>
    </avue-crud>


    <el-dialog
            :title="dialogOption.title"
            :visible.sync="dialogVisible"
            width="50%"
    >
      <avue-form ref="form"
                 v-model="dialogForm"
                 :option="dialogOption.option"
                 @submit="dialogFormSubmit"
                 @reset-change="dialogFormReset"></avue-form>
    </el-dialog>

    <design-dialog :visible.sync="designDialogVisible"
                   v-model="designDialogForm"
    ></design-dialog>
  </div>
</template>

<script>
  import designDialog from "@/views/factorySort/designDialog";
  import { tableOption, sortOption } from "./tablePartData";
  import {
    facCategoryList as getList,
    addFacCategory as add,
    editFacCategory as edit,
    noCateStructList
  } from "@/api/factorySort/sortManage";
  import { avueCrudMixin } from "@/mixins";
  export default {
    components: {
      designDialog
    },
    mixins: [
      avueCrudMixin({
        getList,
        tableOption,
        request: 'python',
      })
    ],
    data() {
      return {
        design: [
          {
            name: 'D001',
            id: 0
          },
          {
            name: 'D002',
            id: 1
          },
          {
            name: 'D003',
            id: 2
          },
          {
            name: 'D004',
            id: 3
          },
          {
            name: 'D005',
            id: 4
          },
        ],

        // 当前行数据
        currentRowData: {},

        // 添加/编辑分类弹窗
        dialogType: '',
        dialogForm: {},
        dialogVisible: false,
        dialogOptions: {
          add: {
            title: '添加分类',
            option: sortOption
          },
          edit: {
            title: '编辑分类',
            option: sortOption
          },
        },

        // 分配款式
        designDialogVisible: false,
        designDialogForm: {}
      }
    },
    computed: {
      dialogOption() {
        return this.dialogOptions[this.dialogType] || {}
      }
    },
    created() {
      noCateStructList().then(({ detail })  => {
        console.log(detail);
        this.design = detail.results;
      })
    },
    methods: {
      async init() {
        this.tableData = [];
        this.tableLoading = true;
        await getList(this.postData).then(res => {
          this.tableData = res.detail.results || [];
        }).finally(() => {
          this.tableLoading = false;
        })
      },
      addSort() {
        this.dialogType = 'add';
        this.dialogForm = {};
        this.dialogVisible = true;
      },
      editBtn(row) {
        this.dialogType = 'edit';
        this.currentRowData = row;
        this.dialogForm = JSON.parse(JSON.stringify(row));
        this.dialogVisible = true;
      },
      dialogFormSubmit() {
        if (this.dialogType === 'add'){
          add(this.dialogForm).then(({detail}) => {
            this.init();
          })
        } else if (this.dialogType === 'edit'){
          edit(this.dialogForm.id, this.dialogForm).then(({detail}) => {
            this.init();
          })
        }
        this.dialogVisible = false;
      },
      dialogFormReset() {
        this.dialogVisible = false;
      },
      distributionDesign(row) {
        console.log(row);
        this.currentRowData = row;
        this.designDialogForm = JSON.parse(JSON.stringify(row));
        this.designDialogVisible = true;
      },
    }
  };
</script>

<style lang="scss"></style>
