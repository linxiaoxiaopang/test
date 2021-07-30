<template>
  <BaseDialog :dialogVisible.sync="dialog" width="700px" :title="title">
    <template>
      <BaseForm
        ref="form"
        label-width="60px"
        :cols="formField"
        :form="form"
        :formVisible="dialog"
      >
        >
        <template #isShareSlot="{ scoped: { prop } }">
          <el-radio-group v-model="form[prop]">
            <el-radio :label="false">私有</el-radio>
            <el-radio :label="true">公开</el-radio>
          </el-radio-group>
        </template>
      </BaseForm>
    </template>
    <template #footer>
      <LoadingBtn type="primary" @click="doSubmit"> 确认 </LoadingBtn>
      <LoadingBtn @click="cancel"> 取消 </LoadingBtn>
    </template>
  </BaseDialog>
</template>
<script>
import { batchIsshareField as formField } from "./field";
import { commonFromMixin } from "@/mixins";
const KEY  = 'isShare'
export default {
  mixins: [commonFromMixin],
  props: {
    selectedData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      formField,
      form: {
        isShare: false,
      },
    };
  },

  methods: {
    async doSubmit() {
      const valid = await this.validate();
      if (!valid) return;
      this.doEdit();
    },
    async doEdit() {
      this.$emit('updateSelectedData', {
        key: KEY,
        val: this.form[KEY]
      })
      this.$message.success('设置成功')
      this.resetForm()
    },
  },
};
</script>