<template>
  <div class="system-add-page system-add-role">
    <div class="app-container system-add-title">
      添加角色
    </div>

    <div class="app-container system-add-form">
      <avue-form v-model="form"
                 :option="formOption"
                 @submit="onsubmit"
                 @reset="onreset"
      >
        <template #roleRight="{ value }">
          <avue-crud ref="crud"
                     :data="tableData"
                     :option="tableOption"
                     class="in-production"
                     @selection-change="handleSelectionChange"
          >
            <template #operateRight="{ row }">
              <el-checkbox-group v-model="multipleSelection" @change="handleCheckedChange">
                <el-checkbox v-for="item in row.operateRight" :label="item.label" :key="item.value">{{item.label}}</el-checkbox>
              </el-checkbox-group>
            </template>
          </avue-crud>
        </template>
      </avue-form>
    </div>
  </div>
</template>

<script>
  import { formOption } from "./constData";
  export default {
    data() {
      return {
        formOption,
        form: {},
        tableData: [
          {
            id: 3,
            date: '2016-05-01',
            pageRight: '王小虎',
            operateRight: [
              {
                label: '添加分类',
                value: '1',
              },
              {
                label: '分配款式',
                value: '2',
              },
              {
                label: '编辑',
                value: '3',
              },
            ],
            children: [{
              id: 31,
              date: '2016-05-01',
              pageRight: '王小虎',
              operateRight: []
            }, {
              id: 32,
              date: '2016-05-01',
              pageRight: '王小虎',
              operateRight: []
            }]
          }
        ],
        tableOption: {
          selection: true,
          rowKey: 'id',
          menu: false,
          column: [
            {
              label: '页面权限',
              prop: 'pageRight'
            },
            {
              label: '操作权限',
              prop: 'operateRight',
              slot: true,
            },
          ]
        },
        multipleSelection: [],
      }
    },
    methods: {
      addUser(){
        this.$router.push({
          path: '/system/user/addUser'
        })
      },
      onsubmit() {

      },
      onreset() {

      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleCheckedChange(value) {
        console.log(value);
      }
    }
  };
</script>

<style lang="scss">
  .system-add-role {
    .avue-form__group > .el-col:nth-child(3) .el-form-item__content {
      width: calc(100% - 120px);
    }
  }
</style>
