<template>
  <BaseDialog max-height="50vh" width="800px" :dialogVisible.sync="dialog" :title="title">
    <div class="bulkDisableFormomponent" v-loading="loading">
      <div class="header" v-if="type == 0">
        <div class="label">禁用备注：</div>
        <div class="name">
          <el-input style="width: 400px" size="small" placeholder="请输入禁用备注" v-model="form.reason" />
        </div>
      </div>

      <div class="table-wrapper">
        <CommonTable height="auto" :selection="false" :cols="cols" :infoData="data">
          <template #mergeSlot="{ scoped }">
            <div class="merge-wrapper">
              <el-image
                fit="contain"
                :src="scoped.thumbnail_path"
                :preview-src-list="scoped.thumbnail_path | prvFormatUrl"
              >
              </el-image>
              <div class="name">{{ scoped.title }}</div>
            </div>
          </template>
          <slot>
            <el-table-column align="center" label="操作" width="100px">
              <template slot-scope="{ $index }">
                <ColorTextBtn type="info" @click="remove($index)"> 取消{{ typeText }} </ColorTextBtn>
              </template>
            </el-table-column>
          </slot>
        </CommonTable>
      </div>
    </div>

    <template #footer>
      <LoadingBtn @click="cancel"> 取消 </LoadingBtn>
      <el-button @click="doSubmit" type="primary">批量{{ typeText }}</el-button>
    </template>
  </BaseDialog>
</template>
<script>
import { bulkDisableCols as cols } from './cols'
import { commonFromMixin } from '@/mixins'
import disableProviteMixin from '../mixins/disableProviteMixin'

export default {
  mixins: [disableProviteMixin, commonFromMixin],
  props: {
    cData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      cols,
      data: this.cData,
      form: {
        reason: null
      },
      loading: false
    }
  },
  computed: {
    typeText() {
      return this.type == 1 ? '下架' : '禁用'
    }
  },
  methods: {
    remove(index) {
      this.data.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.bulkDisableFormomponent {
  .header {
    padding: 1rem;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 15px;
    align-items: center;
    border: 1px solid $border-color;
  }
  .merge-wrapper {
    display: flex;
    align-items: center;
    .el-image {
      flex: 0 0 44px;
      width: 44px;
      height: 44px;
      background: $bg-color;
    }
    .name {
      margin-left: 10px;
      flex: 1;
    }
  }
}
</style>
