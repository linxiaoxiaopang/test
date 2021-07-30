<template>
  <div class="line inline-block">
    <el-button size="small" @click="to" :loading="loading"> 批量编辑 </el-button>
    <EditForm
      ref="form"
      v-if="dialogVisible"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :isAdd="false"
      :data="data"
      title="编辑国家/地区"
    />
  </div>
</template>

<script>
import EditForm from './editForm'
import { commonEheaderMixin } from '@/mixins'
import { getCreatedTemplateByCountryId } from '@/api/template'

export default {
  mixins: [commonEheaderMixin],
  components: { EditForm },
  data() {
    return {
      data: {},
      loading: false
    }
  },
  methods: {
    async to() {
      const selectedData = this.sup_this.selectedData
      const templateId = this.sup_this.mergeData.templateId
      if (!selectedData.length) {
        this.$message({
          type: 'warning',
          message: '请先选择需要的数据，再进行此操作'
        })
        return
      }
      const countryIdList = [...new Set(selectedData.map(({ countryId }) => countryId))]
      this.loading = true
      try {
        const { code, detail } = await getCreatedTemplateByCountryId({
          countryIdList,
          templateId
        })
        if ($SUC({ code })) {
          console.log('detail', detail)
          this.data = this.formatResult(detail)
          this.$nextTick(() => {
            this.showDialog()
          })
        }
      } catch (err) {}
      this.loading = false
    },

    formatResult(results) {
      const tmpObj = {}
      results.map((item) => {
        const { countryName } = item
        if (!tmpObj[countryName]) {
          tmpObj[countryName] = []
        }
        //编辑时设置最小
        // if (Array.isArray(item)) {
        //   item.map((item) => {
        //     item.minEndWeight = item.startWeight
        //   })
        // }
        tmpObj[countryName].push(item)
      })
      return tmpObj
    }
  }
}
</script>

<style></style>
