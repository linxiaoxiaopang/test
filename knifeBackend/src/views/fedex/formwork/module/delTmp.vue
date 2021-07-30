<template>
  <Popover @sureHandler="delByCountryId($event)">
    <template #tip>
      <p>确定要删除此模板吗！</p>
    </template>
    <template #reference="{ scope: loading }">
      <color-text-btn class="update-btn" :loading="loading" size="mini" type="danger">删除</color-text-btn>
    </template>
  </Popover>
</template>

<script>
import { delMixin } from '@/mixins'
import { deleteCreatedTemplate as delApi, getCreatedTemplateByCountryId } from '@/api/template'
export default {
  mixins: [delMixin],
  props: {
    data: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    }
  },
  methods: {
    delApi,
    async delByCountryId($event) {
      const templateId = this.sup_this.mergeData.templateId
      const countryIdList = [this.data.countryId]
      try {
        const { code, detail } = await getCreatedTemplateByCountryId({
          countryIdList,
          templateId
        })
        if ($SUC({ code })) {
          this.del(
            {
              idList: detail.map(({ id }) => id)
            },
            $event
          )
        }
      } catch (err) {}
    },
    init() {
      this.sup_this && this.sup_this.init()
    }
  }
}
</script>

<style></style>
