<template>
  <BaseDialog :title="title" :dialogVisible.sync="dialog" width="500px">
    <template>
      <div class="disableComponent-wrapper" v-loading="loading">
        <div class="title">
          <i class="el-icon-warning" />
          <span v-if="!isDiable">确定{{type == 1 ? '下架' : '禁用'}}该图片？{{type == 1 ? '下架' : '禁用'}}后，销售端则不再展示该图片。</span>
          <span v-else>确定{{type == 1 ? '上架' : '启用'}}该图片？</span>
        </div>
        <BaseForm
          v-if="!isDiable&&type==0"
          size="mini"
          ref="form"
          customClass="disableComponent-customClass"
          label-width="auto"
          label-postion="left"
          :cols="formField"
          :form="form"
        >
        </BaseForm>
      </div>
    </template>
    <template #footer>
      <el-button @click="cancel"> 取消 </el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">
        {{ title }}
      </el-button>
    </template>
  </BaseDialog>
</template>
<script>
import { commonFromMixin } from "@/mixins";
import { disableField as formField } from "./field";
import disableProviteMixin from '../mixins/disableProviteMixin'

export default {
  mixins: [disableProviteMixin, commonFromMixin],
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
    isDiable: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      formField,
      form: {},
      loading: false,
    };
  },
  methods: {
    
  },
};
</script>
<style lang="scss" scoped>
.disableComponent-wrapper {
  padding: 0 1rem;
  .title {
    margin-bottom: 1rem;
    i {
      position: relative;
      top: 2px;
      color: $color-warning;
      font-size: 20px;
      margin-right: 8px;
    }
  }
}
.disableComponent-customClass.disableComponent-customClass {
  .el-form {
    padding: 0;
  }
}
</style>