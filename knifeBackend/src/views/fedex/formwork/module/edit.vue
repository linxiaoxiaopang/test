<template>
  <div class="line inline-block">
    <ColorTextBtn size="small" @click="to" :loading="loading"> 编辑 </ColorTextBtn>
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
import EditForm from './batchEdit/editForm'
import { commonEheaderMixin } from '@/mixins'
import { getCreatedTemplateByCountryId } from '@/api/template'

export default {
  mixins: [commonEheaderMixin],
  components: { EditForm },
  props: {
    row: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      data: {},
      loading: false
    }
  },
  methods: {
    async to() {
      const templateId = this.sup_this.mergeData.templateId
      const countryIdList = [this.row.countryId]
      this.loading = true
      try {
        const { code, detail } = await getCreatedTemplateByCountryId({
          countryIdList,
          templateId
        })
        if ($SUC({ code })) {
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
        tmpObj[countryName].push(item)
      })
      return tmpObj
    }
  }
}
</script>

<style></style>
