<template>
  <div class="app-container">
    <avue-crud
      ref="crud"
      class="search-form non-expand-icon"
      :option="tableOption"
      :data="tableData"
      :page="tablePage"
      :tableLoading="tableLoading"
      :span-method="spanMethod"
      :row-class-name="rowClassName"
      @size-change="sizeChange"
      @current-change="pageChange"
      @search-change="searchChange"
    >
      <template #expressCompanyId="{ row }">
        <template v-if="row.tableLevel === '1'">
          <el-button
            type="text"
            v-if="!row.tableExpanded || loading[row.customId]"
            :loading="loading[row.customId]"
            size="small"
            class="view-btn"
            @click="viewChildren(row)"
          >
            <template v-if="loading[row.customId]"> 加载中... </template>
            <template v-else> 查看<i class="el-icon-plus"></i> </template>
          </el-button>
          <div class="text">{{ row.companyName }}</div>

          <Authorize :sup_this="sup_this" :data="row" />
        </template>
        <template v-else-if="row.tableLevel === '2'">
          <el-button
            type="text"
            size="small"
            class="view-btn"
            :loading="loading[row.customId]"
            :class="{ 'is-expanded': row.tableExpanded }"
            @click="viewChildren(row)"
          >
            <template v-if="loading[row.customId]"> 加载中... </template>
            <template v-else>
              {{ row.tableExpanded ? '收起' : '展开' }}
              <i class="el-icon-d-arrow-right"></i>
            </template>
          </el-button>
          <div class="text">{{ row.accountName }}</div>
        </template>
        <template v-else-if="row.tableLevel === '3'">
          <avue-crud :data="channelDataFilter(channelAccountEnabledData[row.accountId], row.accountId)" :option="channelOption">
            <template #cnNameHeader="scope">
              <el-input
                v-model="search[row.accountId]"
                size="mini"
                placeholder="搜索物流方式"
                suffix-icon="el-icon-search"
              />
            </template>
            <template #isEnabled="{ row: { isEnabled } }">
              <status-button :valid="isEnabled === SYS_YES" validText="已启用" invalidText="未启用"></status-button>
            </template>
            <template #menu="{ row: channelRow }">
              <color-text-btn
                size="medium"
                :type="channelRow.isEnabled === SYS_YES ? 'danger' : ''"
                :loading="loading[`channel${row.accountId}${channelRow.id}AuthBtn`]"
                @click="
                  handleAccountChannelAuth(
                    {
                      id: channelRow.id,
                      relationId: channelRow.relationId,
                      companyId: channelRow.companyId,
                      accountId: channelRow.accountId,
                      isEdt: 0
                    },
                    channelRow.isEnabled === SYS_YES
                  )
                "
              >
                {{ channelRow.isEnabled === SYS_YES ? '停用' : '启用' }}
              </color-text-btn>
              <el-divider direction="vertical" v-if="channelRow.isEnabled === SYS_YES"></el-divider>
              <!-- <shipperAddressSetting
                :sup_this="sup_this"
                :data="channelRow"
                v-if="channelRow.isEnabled === SYS_YES"
              ></shipperAddressSetting> -->
              <ColorTextBtn v-if="channelRow.isEnabled === SYS_YES" style="font-size: 14px;" @click="handleAccountChannelAuth(
                    {
                      id: channelRow.id,
                      relationId: channelRow.relationId,
                      companyId: channelRow.companyId,
                      accountId: channelRow.accountId,
                      isEdt: 1
                    },
                    channelRow.isEnabled === SYS_NO
                  )" >设置</ColorTextBtn>
            </template>
          </avue-crud>
        </template>
        <template v-else> 暂无数据 </template>
      </template>
      <template #isAuthorized="{ row: { isAuthorized } }">
        <status-button :valid="isAuthorized === SYS_YES" validText="已授权" invalidText="未授权"></status-button>
      </template>
      <template #menu="{ row }">
        <UpdateAuthorize v-if="row.id" :sup_this="sup_this" :data="row" />
        <el-divider direction="vertical"></el-divider>
        <color-text-btn
          size="medium"
          :type="row.isAuthorized === SYS_YES ? 'danger' : ''"
          :loading="loading[row.customId + 'AuthBtn']"
          @click="handleAccountAuth(row, row.isAuthorized === SYS_YES)"
        >
          {{ row.isAuthorized === SYS_YES ? '取消授权' : '重新授权' }}
        </color-text-btn>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import avueCrud from '@/mixins/avueCrud'
import { mapGetters } from 'vuex'
import { tableOption, channelOption } from './const'
import { SYS_YES, SYS_NO } from '@/utils/constant'
import {
  getList,
  getAccountById,
  getChannelById,
  getChannelByCompanyId,
  changeAuthorize,
  changeChannelIsEnabled
} from '@/api/expressAccount'

import Authorize from '../module/authorize'
import statusButton from '../module/statusButton'
import UpdateAuthorize from '../module/updateAuthorize'
import shipperAddressSetting from '../module/shipperAddressSetting'
import formField from '../module/shipperAddressSetting/field'
export default {
  mixins: [
    avueCrud({
      tableOption,
      getList
    })
  ],
  components: {
    Authorize,
    statusButton,
    UpdateAuthorize,
    shipperAddressSetting
  },
  data() {
    return {
      SYS_YES,
      resetMergeData: {
        isDeleted: SYS_NO,
        isDockApi: SYS_YES,
        // cnName: undefined,
        // isAuthorized: undefined,
        expressCompanyId: undefined
      },
      sup_this: this,
      channelOption,
      channelData: {},
      channelAccountEnabledData: {},
      search: {},
      loading: {}
    }
  },
  computed: {
    ...mapGetters(['expressCompanyId'])
  },
  watch: {
    expressCompanyId: {
      handler(n) {
        let dicData = n
        if (Array.isArray(dicData)) {
          this.tableOption.column[1].dicData = dicData.filter((item) => item.isDockApi === SYS_YES)
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
    Object.assign(this.search, this.searchForm)
  },
  methods: {
    beforeInit() {
      this.searchForm.expressCompanyId && (this.postData.idList = [this.searchForm.expressCompanyId])
    },
    afterInit() {
      this.tableData.forEach((row) => {
        this.$set(row, 'customId', 'company' + row.id)
        this.$set(row, 'tableLevel', '1')
        this.$set(row, 'tableExpanded', false)
        this.$set(row, 'children', [
          {
            customId: 'account' + row.id,
            companyId: row.id
          }
        ])
        this.$refs.crud.toggleRowExpansion(row, false)
      })
    },
    async viewChildren(row) {
      this.$set(this.loading, row.customId, true)

      try {
        switch (row.tableLevel) {
          case '1':
            await this.getAccountList(row)
            break

          case '2':
            await this.getChannelList(row)
            break
        }
      } catch (e) {
        console.log(e)
      }

      row.tableExpanded = !row.tableExpanded
      this.$refs.crud.toggleRowExpansion(row, row.tableExpanded)
      this.loading[row.customId] = false
    },
    async getAccountList(row) {
      let { isAuthorized } = this.search
      let [err, { detail }] = await awaitWrap(
        getAccountById({
          companyId: row.id,
          isAuthorized: isAuthorized === 'all' ? undefined : isAuthorized
        })
      )

      if (detail) {
        detail.forEach((accountItem) => {
          accountItem.customId = 'account' + accountItem.id + row.id
          accountItem.tableLevel = '2'
          accountItem.tableExpanded = false
          accountItem.children = [
            {
              companyId: row.id,
              accountId: accountItem.id,
              customId: 'channel' + accountItem.id,
              tableLevel: '3',
              tableExpanded: false
            }
          ]
        })
        row.children = detail
      }
      return detail
    },
    async getChannelList({ id, companyId }) {
      let channelData = this.channelData[companyId]
      if (channelData === undefined) {
        channelData = (
          (await getChannelByCompanyId({
            companyId
          })) || {}
        ).detail
        this.$set(this.channelData, companyId, channelData)
      }

      await this.getAccountEnabledChannelList({ id, companyId })
    },
    async getAccountEnabledChannelList({ id: accountId, companyId }) {
      let enabledData = this.channelAccountEnabledData[accountId]
      if (enabledData === undefined) {
        let [err, res] = await awaitWrap(getChannelById({
          accountId,
          companyId
        }))
        if ($SUC(res)) {
          enabledData = res.detail || []
          enabledData.forEach((item) => (item.cnName = ''))
        
          enabledData = this.channelData[companyId].map((channel) => {
            let tempObj = enabledData.find(({ shippingMethodId }) => shippingMethodId === channel.id) || {}
            tempObj.relationId = tempObj.id
            Object.assign(tempObj, channel)
            return tempObj
          })
        
          this.$set(this.channelAccountEnabledData, accountId, enabledData)
        }
      }
    }
    ,
    refreshChannelList({ accountId, companyId }) {
      this.channelAccountEnabledData[accountId] = undefined
      this.getAccountEnabledChannelList({
        id: accountId,
        companyId
      })
    },
    async handleAccountAuth({ id: accountId, companyId, customId }, isAuth) {
      this.$set(this.loading, customId + 'AuthBtn', true)
      const api = changeAuthorize
      const [err, res] = await awaitWrap(
        api({
          accountId,
          companyId,
          isAuthorized: isAuth ? SYS_NO : SYS_YES
        })
      )
      if ($SUC(res)) {
        this.$message.success('操作成功')
        // await this.getAccountList(this.tableData.find(company => company.id === companyId))
        this.pageChange(1)
      }
      this.loading[customId + 'AuthBtn'] = false
    },
    async handleAccountChannelAuth({ id, relationId, companyId, accountId, isEdt }, isEnabled) {
      if (isEnabled === false) {
        this.$router.push({
          path: '/fedex/startLogistics',
          query: { id, companyId, accountId, relationId, isEdt}
        })
        return
      }
      try {
        this.$set(this.loading, `channel${accountId}${id}AuthBtn`, true)
        const api = changeChannelIsEnabled
        const res = await api({
          companyId,
          accountId,
          shippingMethodId: id,
          isEnabled: isEnabled ? SYS_NO : SYS_YES
        })
        if ($SUC(res)) {
          // this.$message.success('操作成功')
          this.channelAccountEnabledData[accountId] = undefined
          // console.log(accountId, companyId)
          await this.getAccountEnabledChannelList({ id: accountId, companyId })
        }
      } catch (err) {
        console.log('err', err)
      }
      this.loading[`channel${accountId}${id}AuthBtn`] = false
    },
    channelDataFilter(data, accountId) {
      let { cnName = '', [accountId]: accountCnName = '' } = this.search
      // console.log(cnName)
      return (data || [])
        .filter((channel) => channel.cnName.includes(cnName))
        .filter((channel) => channel.cnName.includes(accountCnName))
    },
    searchChange() {
      Object.assign(this.search, this.searchForm)
      this.init()
    },
    spanMethod({ row: { tableLevel }, columnIndex }) {
      if ((['1', '3'].includes(tableLevel) || !tableLevel) && columnIndex === 0) {
        return [1, 4]
      }
      if (['1', '3'].includes(tableLevel) || !tableLevel) {
        return [0, 0]
      }
    },
    rowClassName({ row: { tableLevel } }) {
      let className = ''
      switch (tableLevel) {
        case '1':
          className += 'fedex-header bg-grey'
          break
        case '2':
          className += 'fedex-header fedex-sub-header'
          break
        case '3':
          className += 'fedex-table'
          break
      }
      return className
    }
  }
}
</script>

<style lang="scss">
.fedex-header {
  .is-center:first-child {
    text-align: left !important;

    .cell {
      display: flex;
      align-items: center;
    }
  }
  .el-button.view-btn {
    position: absolute;
    left: 33px;
  }

  .text {
    display: inline-block;
    min-width: 88px;
    margin-left: 100px;
  }
}

.fedex-sub-header {
  .cell {
    line-height: 1;
  }

  .el-button.view-btn {
    padding: 0;

    .el-icon-d-arrow-right {
      transform: rotate(90deg);
    }

    &.is-expanded {
      .el-icon-d-arrow-right {
        transform: rotate(-90deg);
      }
    }
  }
}

.fedex-table {
  > td {
    background-color: transparent !important;

    > .cell {
      padding-left: 100px !important;
      padding-right: 100px !important;
    }
  }
}
</style>
