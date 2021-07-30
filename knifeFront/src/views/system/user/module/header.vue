<template>
  <div class="head-container">
    <div class="inline-block user-component-header">
      <el-button
        class="filter-item"
        size="mini"
        type="primary"
        icon="el-icon-plus"
        @click="to"
        v-p="['rbac:common_users:create']"
        >添加子账号</el-button
      >

      <el-input
        v-model="query.username"
        clearable
        placeholder="输入登录账号搜索"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="toQuery"
      />
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
</template>

<script>
// 权限判断函数
import { getOrganizationUserTree } from '@/api/organization'
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
      this.$parent.init()
    },
    async to() {
      this.$router.push('/personalCenter/permission/system/user/addUser')
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
.user-component-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
}
</style>
