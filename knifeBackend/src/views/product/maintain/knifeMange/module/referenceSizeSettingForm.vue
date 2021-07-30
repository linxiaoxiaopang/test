<template>
  <BaseDialog :dialogVisible.sync="dialog" :title="title">
    <div class="referenceSizeSettingFormComponent" v-loading="loading">
      <div class="header">
        <div class="label">原型名称：</div>
        <div class="name">
          {{ name }}
        </div>
        <template v-if="baseData.length">
          <div class="label" style="margin-left: 15px">当前标准码：</div>
          <el-tag type="priamry" size="mini">
            {{ baseData[0].size_name || '' }}
          </el-tag>
        </template>
      </div>

      <div class="table-wrapper">
        <CommonTable height="auto" :selection="false" :cols="cols" :infoData="data">
          <template #kl_docsSlot="{ scoped }">
            <span v-if="fileName(scoped)"> {{ fileName(scoped) }}</span>
            <ColorTextBtn v-else type="warning"> 缺少psd文件 </ColorTextBtn>
          </template>

          <template #kl_groupsSlot="{ scoped }">
            <el-tag type="success" v-if="isSafe(scoped)"> 是 </el-tag>
            <el-tag type="info" v-else> 否 </el-tag>
          </template>
          <slot>
            <el-table-column align="center" label="操作" width="280px">
              <template slot-scope="{ row }">
                <ColorTextBtn class="line" v-if="isReferenceSize(row)" type="success"> 标准码 </ColorTextBtn>

                <ColorTextBtn @click="doAdd(row, (type = 'update'))" v-if="isReferenceSize(row)" type="primary">
                  更新标准码
                </ColorTextBtn>
                <template v-else>
                  <ColorTextBtn v-if="isSafe(row)" type="primary" @click="doAdd(row, (type = 'set'))">
                    设置为参考尺码
                  </ColorTextBtn>

                  <ColorTextBtn v-if="!isSafe(row)" type="danger"> 缺少安全线，无法设置标准码。 </ColorTextBtn>
                </template>
              </template>
            </el-table-column>
          </slot>
        </CommonTable>
      </div>
    </div>

    <template #footer>
      <LoadingBtn @click="cancel"> 取消 </LoadingBtn>
      <el-button @click="cancel" type="primary"> 确定 </el-button>
    </template>
  </BaseDialog>
</template>
<script>
import { referenceSizeSettingCols as cols } from '../../../cols'
import { commonFromMixin } from '@/mixins'
import { setKlProd as add } from '@/api/product/protoSizeApi'
import { getPicName } from '@/utils'

export default {
  mixins: [commonFromMixin],
  props: {
    name: String,
    isAdd: {
      type: Boolean,
      default: true
    },
    cData: {
      type: Array,
      required: true
    },
    baseData: {
      type: Array,
      required: true
    },
    protoId: {
      required: true
    }
  },
  data() {
    return {
      cols,
      data: this.cData,
      loading: false
    }
  },
  computed: {
    fileName() {
      return (row) => {
        try {
          return getPicName(row.kl_docs[0].url)
        } catch (err) {
          return ''
        }
      }
    },
    isSafe() {
      return (row) => {
        return this.existSafeLine(row)
      }
    },
    isReferenceSize() {
      return (row) => {
        if (!this.baseData.length) return false
        const { size_name: b_size_name } = this.baseData[0]
        return b_size_name == row.size_name
      }
    }
  },
  methods: {
    existSafeLine(row) {
      try {
        if (!row.kl_groups.length) {
          return false
        }
        return row.kl_groups.every(({ safe_line }) => safe_line)
      } catch (err) {
        return false
      }
    },
    async doAdd(row, type) {
      let message = type === 'update' ? '此操作将更新标准尺码, 是否继续?' : '此操作将设置标准尺码, 是否继续?'
      if (!this.existSafeLine(row)) {
        return this.$message.error('缺少安全线，无法更新标准码，请重新上传psd文件。')
      }
      const bool = await this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          return true
        })
        .catch(() => {
          this.$message.info('已取消操作')
          return false
        })
      if (!bool) return
      const { id: sizeId } = row
      this.loading = true
      try {
        const { code } = await add({
          sizeId,
          protoId: this.protoId
        })
        if ($SUC({ code })) {
          this.success()
        }
      } catch (err) {}
      this.loading = false
    },
    async doEdit(params) {
      this.loading = true
      try {
        const { code } = await bulkOff(params)
        if ($SUC({ code })) {
          this.success()
        }
      } catch (err) {}
      this.loading = false
    },
    success() {
      this.$message.success('操作成功')
      this.init()
      this.$nextTick(() => {
        this.dialog = false
        this.sup_this && this.sup_this.init()
      })
    },
    init() {
      this.$emit('updateData')
    },
    cancel() {
      this.dialog = false
    }
  }
}
</script>
<style lang="scss" scoped>
.referenceSizeSettingFormComponent {
  display: flex;
  flex-direction: column;
  height: 100%;
  .header {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 15px;
    align-items: center;
    .name {
    }
  }
  .table-wrapper {
    flex: 1;
    overflow: auto;
    .el-table {
      border: 1px solid #ebeef5;
      border-right: none;
      ::v-deep {
        td {
          border-right: none;
        }
      }
    }
  }
}
</style>
