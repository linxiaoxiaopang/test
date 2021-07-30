<template>
  <div class="basisProtoComponent" id="basis">
    <div class="title" v-if="showTitle">基础信息</div>
    <BaseForm
      customClass="customClass"
      ref="form"
      label-width="100px"
      :cols="formField"
      :form="form"
    >
      <template #english_nameSlot="{ scoped: { prop, placeholder } }">
        <el-input v-model="form[prop]" :placeholder="placeholder" size="small"> </el-input>
      </template>

      <template #categorySlot="{ scoped: { prop, placeholder } }">
        <ProtoTypeTreeSelect
          style="width: 300px"
          :placeholder="placeholder"
          :selectedValue.sync="form[prop]"
          :maxHeight="150"
          @dataLoadEnd="dataLoadEnd"
        />
        <color-text-btn type="warning">
          准确选择原型类目有助于完善原型信息与数据分析，原型类目及类目细项 。
        </color-text-btn>
      </template>

      <template #sexSlot="{ scoped: { prop, placeholder } }">
        <selectList
          :placeholder="placeholder"
          :options="SEX_LIST"
          :keyword.sync="form[prop]"
        />
      </template>

      <template #seasonSlot="{ scoped: { prop, placeholder } }">
        <selectList
          :placeholder="placeholder"
          :options="SEASONS_LSIT"
          :keyword.sync="form[prop]"
        />
      </template>

      <!-- <template #levelSlot="{ scoped: { prop, placeholder } }">
        <selectList
          :placeholder="placeholder"
          :options="LEVEL_LSIT"
          :keyword.sync="form[prop]"
        />
      </template> -->

      <template #detailSlot="{ scoped: { prop, placeholder } }">
        <Editor
          id="basisEditor"
          :val.sync="form[prop]"
          :placeholder="placeholder"
          :height="300"
          serverUrl="serverUrl"
          useObjectStr="CONTENT_UEDITOR_FILE"
        />
      </template>
    </BaseForm>
  </div>
</template>

<script>
import ProtoTypeTreeSelect from '@/components/protoTypeTreeSelect'
import Editor from '@/components/editor'

import { protoBasisField as formField } from '../field'
import { objBeArray } from '@/utils'
import { SEX_LIST, LEVEL_LSIT, SEASONS_LSIT } from '@/utils/constant'

export default {
  components: {
    ProtoTypeTreeSelect,
    Editor
  },
  props: {
    showTitle: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      formField,
      SEX_LIST: objBeArray(SEX_LIST),
      LEVEL_LSIT: objBeArray(LEVEL_LSIT),
      SEASONS_LSIT: objBeArray(SEASONS_LSIT),
      form: {
        category: '',
        sex: 0,
        season: 0
      }
    }
  },
  mounted() {
    this.watchForm()
    //组件加载完成
    this.loadEnd()
  },
  methods: {
    dataLoadEnd(data) {
      if (!data.length) return
      this.$set(this.form, 'category', data[0] && data[0].id)
    },
    loadEnd() {
      this.$emit('loadEnd')
    },
    watchForm() {
      this.$watch('form.detail', () => {
        const { form } = this.$refs
        if (form) {
          form.validateField('detail')
        }
      })

      this.$watch('form.category', () => {
        const { form } = this.$refs
        if (form) {
          form.validateField('category')
        }
      })
    },
    async validate() {
      return await this.$refs['form'].validate()
    },
    async save() {
      try {
        const valid = await this.validate()
        if (!valid) {
          return false
        }
      } catch (err) {
        return false
      }

      return this.form
    }
  }
}
</script>

<style lang="scss" scoped>
.basisProtoComponent {
  ::v-deep {
    .el-input {
      width: 400px;
    }
    .el-select.el-select {
      .el-input {
        width: 300px;
      }
    }
  }
  .title {
    line-height: 40px;
    height: 40px;
    border-bottom: 1px solid $border-color;
  }
  .customClass {
    ::v-deep {
      .el-form {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
  padding: 20px;
  background: #fff;
}
</style>
