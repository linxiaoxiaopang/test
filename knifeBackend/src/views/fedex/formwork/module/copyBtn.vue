<template>
  <div class="line inline-block">
    <AddCountryButton
      v-bind="$attrs"
      :sup_this="sup_this"
      ref="addCountryButton"
      style="text-align: left"
      :resetData="data"
    >
      <template #btn="{ scoped: { showDialog } }">
        <ColorTextBtn type="primary" :loading="loading" @click="to(showDialog)">复制</ColorTextBtn>
      </template>
    </AddCountryButton>
  </div>
</template>

<script>
import AddCountryButton from './addCountryButton.vue'

import { getCreatedTemplateByCountryId } from '@/api/template'

export default {
  components: {
    AddCountryButton
  },

  props: {
    sup_this: {
      tyep: Object,
      required: true
    },
    row: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      data: [],
      loading: false
    }
  },

  methods: {
    async to(showDialog) {
      const templateId = this.sup_this.mergeData.templateId
      const countryIdList = [this.row.countryId]
      this.loading = true
      try {
        const { code, detail } = await getCreatedTemplateByCountryId({
          countryIdList,
          templateId
        })
        if ($SUC({ code })) {
          const { addCountryButton } = this.$refs
          this.data = detail.map((item) => {
            delete item.id
            delete item.countryName
            delete item.countryId
            return item
          })
          console.log('this.$attrs.data', this.$attrs.list)
          addCountryButton.li = this.$attrs.list
          addCountryButton.disabledList = this.$attrs.list.map((item) => {
            return item.countryId
          })
          this.$nextTick(() => {
            showDialog()
          })
        }
      } catch (err) {}
      this.loading = false
    }
  }
}
</script>

<style></style>
