<template>
  <div class="app-container">
    <avue-crud
      ref="crud"
      class="in-production"
      :data="tableData"
      :option="tableOption"
      :page="tablePage"
      :tableLoading="tableLoading"
      @size-change="sizeChange"
      @current-change="pageChange"
      @search-change="searchChange"
      @selection-change="handleSelectionChange"
      @hook:updated="initCallBack"
    >
      <template #design="{ row }">
        <el-button
          v-for="(tag, index) in row.prim_struct"
          :key="tag.id"
          type="text"
          class="m5 ptb0"
          @click="handleTagClick(row, index)"
          >{{ tag.structure }}
        </el-button>
      </template>
      <template #menuLeft>
        <el-button size="mini" type="primary" @click="batchUpload">批量下载</el-button>
      </template>
      <template #menu="{ row }">
        <color-text-btn>
          <a class="thunder-link" :href="row.coord_kl">
            下载坐标图
          </a>
        </color-text-btn>
        <el-divider direction="vertical"></el-divider>
        <color-text-btn>
          <a class="thunder-link" :href="row.white_kl">
            下载白板图
          </a>
        </color-text-btn>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { tableOption } from './tablePartData'
import { parseCharacterTime } from '@/utils'
import { downloadByPath } from '@/utils/download'
import { coordinateList as getList } from '@/api/coordinate'
import { avueCrudMixin } from '@/mixins'
import { validatenull } from '@/components/avue/utils/validate'
import { initCallBack } from '@/utils/download'

export default {
  mixins: [
    avueCrudMixin({
      getList,
      tableOption,
      request: 'python'
    })
  ],
  data() {
    return {
      multipleSelection: []
    }
  },
  methods: {
    initCallBack,
    afterInit() {
      this.tableData.forEach((row) => this.handleTagClick(row, 0))
    },
    handleTagClick(row, index) {
      let prim_struct = row.prim_struct[index]
      let prim_show_group = prim_struct.prim_show_groups ? prim_struct.prim_show_groups[0] : {}
      row.coord_kl = prim_show_group.coord_kl
      row.white_kl = prim_show_group.white_kl
      row.factory_name = prim_struct.factory_category && prim_struct.factory_category.name
      row.create_time = parseCharacterTime(prim_show_group.create_time)
      return row
    },
    batchUpload() {
      if (validatenull(this.multipleSelection)) {
        this.$message.error('请先选择产品')
        return
      }
      let paths = []
      this.multipleSelection.forEach((row) => {
        row.prim_struct.forEach((struct) => {
          paths.push(struct.prim_show_groups[0].coord_kl)
          paths.push(struct.prim_show_groups[0].white_kl)
        })
      })
      console.log('paths', paths, paths.length)
      this.downloadByPath(paths)
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    downloadByPath,
    parseCharacterTime
  }
}
</script>

<style lang="scss" scoped></style>
