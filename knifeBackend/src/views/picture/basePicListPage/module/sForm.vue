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
import { batchIsshareField as formField } from "../../field";
import { commonFromMixin } from "@/mixins";
import { bulkShare as edit } from "@/api/imageApi";

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
      const ids = this.selectedData.map(({ id }) => id);
      const { code } = await edit(Object.assign({}, { ids }, this.form));
      if ($SUC({ code })) {
        this.success();
      }
    },
  },
};
</script>