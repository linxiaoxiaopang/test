<template>
  <BaseDialog
    :dialogVisible.sync="dialog"
    minHeight="220px"
    width="700px"
    :title="title"
  >
    <template>
      <BaseForm
        ref="form"
        label-width="60px"
        :cols="formField"
        :form="form"
        :formVisible="dialog"
      >
        <template #titleSlot="{ scoped: { prop } }">
          <el-tag size="mmini" type="primary">
            {{ form[prop] }}
          </el-tag>
        </template>
        <template #categorySlot="{ scoped: { prop } }">
          <ImageTypeTreeSelect
            ref="imageTypeTreeSelect"
            :selectedValue.sync="form[prop]"
            :maxHeight="100"
          />
        </template>
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
import ImageTypeTreeSelect from "@/components/imageTypeTreeSelect";
import { reditPicField as formField } from "../../field";
import { commonFromMixin } from "@/mixins";
import { edit } from "@/api/imageApi";

export default {
  mixins: [commonFromMixin],
  components: {
    ImageTypeTreeSelect,
  },
  data() {
    return {
      formField,
      form: {},
    };
  },

  methods: {
    async doSubmit() {
      const valid = await this.validate();
      if (!valid) return;
      this.doEdit();
    },
    async doEdit() {
      const { id, ...form } = this.form;
      const { code } = await edit(id, form);
      if ($SUC({ code })) {
        this.success();
      }
    },
  },
};
</script>