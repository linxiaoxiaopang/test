<template>
  <div class="distribution-design">
    <el-dialog
      title="分配款式"
      :visible.sync="dialogVisible"
      width="50%"
    >

      <avue-form ref="distributionForm"
                 v-model="form"
                 :option="distributionOption"
                 @submit="distributionSubmit"
                 @reset-change="distributionReset"
      >
        <template #name="{ value }">
          {{ value }}
        </template>
        <template #design="{ value }">
          <el-tag v-for="(tag,index) in value"
                  :key="index">{{ tag && tag.name }}</el-tag>
        </template>
        <template #btn="{ value }">
          <el-button type="text" @click="selectVisible = true">选择款式</el-button>
        </template>
        <template #menuForm>
          <el-button plain size="small" @click="dialogVisible = false">取消</el-button>
        </template>
      </avue-form>

      <!--  选择款式  -->
      <el-dialog
              title="选择款式"
              :visible.sync="selectVisible"
              append-to-body
              class="select-design"
      >
        <el-input v-model="designName"
                  placeholder="输入款式名称搜索"
                  size="small"
                  style="width: 200px;"
                  class="ml40 mr15 mb20"
        ></el-input>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="search">搜索</el-button>

        <avue-form ref="distributionForm"
                   v-model="form"
                   :option="selectOption"
                   @submit="distributionSubmit"
                   @reset-change="distributionReset"
        >
          <template #design="{ value }">
            <el-tag v-for="(tag,index) in value"
                    :key="index"
                    closable
                    @close="handleClose(value, tag)"
            >{{ tag && tag.name }}</el-tag>
          </template>
          <template #btn>
            <el-card shadow="never">
              <el-checkbox-group v-model="checkedDesigns" @change="handleCheckedChange">
                <el-checkbox v-for="(design,index) in designs" :label="design.id" :key="index">{{design.name}}</el-checkbox>
              </el-checkbox-group>
            </el-card>
          </template>
          <template #menuForm>
            <el-button plain size="small" @click="selectVisible = false">取消</el-button>
          </template>
        </avue-form>
      </el-dialog>

    </el-dialog>
  </div>
</template>

<script>
import { dialogComponents, formComponents } from '@/mixins'
export default {
  mixins: [
    dialogComponents,
    formComponents
  ],
  data() {
    return {
      distributionForm: {},
      distributionOption: {
        emptyBtn: false,
        labelWidth: 100,
        span: 24,
        column: [
          {
            label: '分类名称',
            prop: 'name',
            type: 'text',
            rules: {
              required: true,
              message: '请输入分类名称',
            }
          },
          {
            label: '款式',
            prop: 'design',
            formslot: true,
            rules: {
              required: true,
              message: '请输入分类名称',
            }
          },
          {
            label: '',
            prop: 'btn',
            formslot: true,
          },
        ]
      },

      selectVisible: false,
      selectOption: {
        submitText: '提交选中数据',
        emptyBtn: false,
        labelWidth: 100,
        span: 24,
        column: [
          {
            label: '款式',
            prop: 'design',
            formslot: true,
            rules: {
              required: true,
              message: '请输入分类名称',
            }
          },
          {
            label: '',
            prop: 'btn',
            formslot: true,
          },
        ]
      },
      designName: '',
      designs: [
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
      checkedDesigns: [],
    }
  },
  methods: {
    distributionSubmit() {

    },
    distributionReset() {

    },
    selectDesign() {

    },
    search() {

    },
    handleClose(tags, tag) {
      tags.splice(tags.indexOf(tag), 1);
    },
    handleCheckedChange() {},
  }
};
</script>

<style lang="scss">
  .select-design {
    .el-card__body {
      padding: 0 8px;
    }
  }
</style>
