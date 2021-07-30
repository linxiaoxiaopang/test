<template>
  <BaseDialog minHeight="200px" :title="title" :dialogVisible.sync="dialog" width="80vw">
    <template>
      <FedexGoodList :data="data" />
    </template>
    <template #footer>
      <el-button :loading="loading" type="primary" @click="doSubmit"> 确认 </el-button>
      <LoadingBtn @click="cancel"> 取消 </LoadingBtn>
    </template>
  </BaseDialog>
</template>
<script>
import FedexGoodList from '../fedexGoodList'

import { editImageTypeFiled as formField } from './field'
import { commonFromMixin } from '@/mixins'
import { bulkUpdate } from '@/api/template'

export default {
  mixins: [commonFromMixin],

  components: {
    FedexGoodList
  },

  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formField,
      form: {
        name: ''
      }
    }
  },

  methods: {
    async doSubmit() {
      this.doEdit()
    },
    async doEdit() {
      const data = Object.values(this.data)
      let list = []
      data.map((item) => {
        const fristObj = item[0]
        item.map((sItem) => {
          for (let key in fristObj) {
            if (!sItem[key] && key != 'id') {
              sItem[key] = fristObj[key]
            }
          }
        })
        list = list.concat(item)
      })

      const countryIdList = [...new Set(list.map(({ countryId }) => countryId))].filter(Boolean)
      const templateId = [...new Set(list.map(({ templateId }) => templateId))].filter(Boolean)

      this.loading = true
      try {
        const { code } = await bulkUpdate({
          countryIdList,
          templateId: templateId[0],
          list
        })
        if ($SUC({ code })) {
          this.success()
        }
      } catch (err) {
        console.log('err', err)
      }
      this.loading = false
    }
  }
}
</script>
