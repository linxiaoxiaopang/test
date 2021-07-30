<template>
  <div class="head-container head-form-container basePicListPage-header">
    <BaseForm customClass="customClass" ref="form" label-width="100px" :cols="formField" :form="query" @change="to">
      <template #nameSlot="{ scoped: { prop, placeholder } }">
        <el-input v-model="query[prop]" :placeholder="placeholder" @keyup.enter.native="to"></el-input>
      </template>

      <template #categorySlot="{ scoped: { prop, placeholder } }">
        <ImageTypeTreeSelect
          size="mini"
          style="width: 100%"
          :placeholder="placeholder"
          :selectedValue.sync="query[prop]"
          :maxHeight="150"
          @change="to"
        />
      </template>
      <template #sexSlot="{ scoped: { prop, placeholder } }">
        <selectList :placeholder="placeholder" :options="SEX_LIST" :keyword.sync="query[prop]" @change="to" />
      </template>

      <template #disableSlot="{ scoped: { prop, placeholder } }">
        <selectList :placeholder="placeholder" :options="PIC_DISABLE_LIST" :keyword.sync="query[prop]" @change="to" />
      </template>

      <template #shelvesSlot="{ scoped: { prop, placeholder } }">
        <selectList :placeholder="placeholder" :options="PIC_SHELVES_LIST" :keyword.sync="query[prop]" @change="to" />
      </template>

      <template #seasonSlot="{ scoped: { prop, placeholder } }">
        <selectList :placeholder="placeholder" :options="SEASONS_LSIT" :keyword.sync="query[prop]" @change="to" />
      </template>
      <template #timeSlot="{ scoped: { prop } }">
        <SaleDateTime :time.sync="time" @change="to" />
      </template>
      <template #designedTimeSlot="{ scoped: { prop } }">
        <SaleDateTime :time.sync="time" @change="to" />
      </template>
      <template #levelSlot="{ scoped: { prop, placeholder } }">
        <selectList :placeholder="placeholder" :options="LEVEL_LSIT" :keyword.sync="query[prop]" @change="to" />
      </template>
      <template #size_psdSlot="{ scoped: { prop, placeholder } }">
        <selectList
          :placeholder="placeholder"
          :options="[
            {
              id: 0,
              name: '未上传pds'
            },
            { id: 1, name: '已上传pds' }
          ]"
          :keyword.sync="query[prop]"
          @change="to"
        />
      </template>
      <template #doneSlot>
        <el-button size="mini" type="primary" icon="el-icon-search" @click="to"></el-button>
      </template>
    </BaseForm>
  </div>
</template>

<script>
import ImageTypeTreeSelect from '@/components/imageTypeTreeSelect'
import SaleDateTime from '@/components/saleDateTime'

import { commonEheaderMixin } from '@/mixins'

import { objBeArray } from '@/utils'
import { SEX_LIST, LEVEL_LSIT, SEASONS_LSIT, PIC_DISABLE_LIST, PIC_SHELVES_LIST } from '@/utils/constant'

export default {
  props: {
    formField: {
      type: Array,
      required: true
    }
  },
  mixins: [commonEheaderMixin],

  components: {
    ImageTypeTreeSelect,
    SaleDateTime
  },

  data() {
    return {
      SEX_LIST: objBeArray(SEX_LIST),
      LEVEL_LSIT: objBeArray(LEVEL_LSIT),
      SEASONS_LSIT: objBeArray(SEASONS_LSIT),
      PIC_DISABLE_LIST: objBeArray(PIC_DISABLE_LIST),
      PIC_SHELVES_LIST: objBeArray(PIC_SHELVES_LIST),
      time: []
    }
  },
  methods: {
    to() {
      this.$nextTick(() => {
        this.toQuery()
      })
    }
  }
}
</script>
