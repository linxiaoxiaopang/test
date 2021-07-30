<template>
  <div>
    <el-button class="filter-item" size="mini" type="primary" icon="el-icon-plus" @click="to">添加分销商</el-button>
    <div class="head-container bg">
      <div class="inline-block user-component-header">
        <el-form :model="query" inline>
          <el-form-item label="分销商名称">
            <el-input
              v-model="query.nick_name"
              clearable
              placeholder="输入分销商名称"
              style="width: 200px"
              class="filter-item"
              @keyup.native.enter="toQuery"
            />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="query.date_joined"
              type="daterange"
              value-format="yyyy-MM-dd"
              placeholder="请选择创建时间"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 300px"
              @change="toQuery"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="登录账号">
            <el-input
              v-model="query.username"
              clearable
              placeholder="输入登录账号搜索"
              style="width: 200px"
              class="filter-item"
              @keyup.native.enter="toQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="toQuery" class="el-icon-search" size="mini" type="primary"></el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 新增 -->

      <eForm ref="form" v-bind="$attrs" :is-add="true" />
      <!-- 导出 -->
      <!-- <el-button
      :loading="downloadLoading"
      size="mini"
      class="filter-item"
      type="primary"
      icon="el-icon-download"
      @click="download">导出</el-button> -->
    </div>
  </div>
</template>

<script>
// 权限判断函数
import { getOrganizationUserTree } from '@/api/organization'
import cloneDeep from 'lodash/cloneDeep'
import { parseCharacterTime } from '@/utils'
import eForm from './form'
// 查询条件
export default {
  components: { eForm },
  props: {
    sup_this: {
      type: Object,
      required: true
    },
    query: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      orgusers: [],
      downloadLoading: false,
      enabledTypeOptions: [
        { key: 'true', display_name: '激活' },
        { key: 'false', display_name: '锁定' }
      ]
    }
  },
  methods: {
    // 去查询
    toQuery() {
      this.$parent.page = 1
      console.log(this.query);
      let params = cloneDeep(this.query)
      let params1 = cloneDeep(this.query)
      const tmpArr = params.date_joined
      if (tmpArr) {
        const timeProp = 'date_joined'
        delete params.date_joined
        params[`${timeProp}_after`] = parseCharacterTime(
          new Date(`${tmpArr[0]} 00:00:00`).toString().replace(' GMT', '')
        )
        params[`${timeProp}_before`] = parseCharacterTime(
          new Date(`${tmpArr[1]} 23:59:59`).toString().replace(' GMT', '')
        )
      }
      this.sup_this.query = params
      this.$parent.init()
      this.sup_this.query = params1
    },
    async to() {
      this.$router.push('/user/addUser')
    },
    // 导出
    getOrgUserTree() {
      getOrganizationUserTree().then((res) => {
        this.orgusers = res.detail
      })
    },
    download() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then((excel) => {
        const tHeader = ['ID', '用户名', '邮箱', '头像地址', '状态', '注册日期', '最后修改密码日期']
        const filterVal = ['id', 'username', 'email', 'avatar', 'is_active', 'createTime', 'lastPasswordResetTime']
        const data = this.formatJson(filterVal, this.$parent.data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    // 数据转换
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) =>
        filterVal.map((j) => {
          if (j === 'is_active') {
            return v[j] ? '启用' : '禁用'
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.bg {
  background: #f7f8fa;
  margin: 20px 0;
  .el-form--inline {
    height: 40px;
  }

  .user-component-header {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: flex-start;
  }
}
</style>
