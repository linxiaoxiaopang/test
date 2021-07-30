<template>
  <div class="line inline-block">
    <el-button size="small" @click="bulkDelTmp" :loading="tableLoading"> 批量删除 </el-button>
  </div>
</template>

<script>
import { deleteCreatedTemplate as bulkDelApi, getCreatedTemplateByCountryId } from '@/api/template'
import { delMixin } from '@/mixins'

export default {
  mixins: [delMixin],

  props: {
    sup_this: {
      type: Object,
      required: true
    },
    selectedData: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      tableLoading: false
    }
  },

  methods: {
    bulkDelApi,
    async bulkDelTmp() {
      this.selectedData = this.selectedData
      const templateId = this.sup_this.mergeData.templateId

      const countryIdList = this.selectedData.map(({ countryId }) => countryId)
      this.tableLoading = true
      try {
        const { code, detail } = await getCreatedTemplateByCountryId({
          countryIdList,
          templateId
        })
        if ($SUC({ code })) {
          this.bulkDel('id', 'idList', detail)
        }
      } catch (err) {
        this.tableLoading = false
      }
    }
  }
}
</script>

<style></style>
