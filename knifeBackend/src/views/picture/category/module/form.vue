<template>
  <BaseDialog :dialogVisible.sync="dialog" width="500px" :title="title">
    <template>
      <BaseForm
        ref="form"
        label-width="120px"
        :cols="formField"
        :form="form"
        :formVisible="dialog"
      >
        <!-- <template #parentNameSlot>
          <el-tag type="warning"></el-tag>
        </template> -->
      </BaseForm>
    </template>
    <template #footer>
      <LoadingBtn type="primary" @click="doSubmit"> 确认 </LoadingBtn>
      <LoadingBtn @click="cancel"> 取消 </LoadingBtn>
    </template>
  </BaseDialog>
</template>
<script>
import { imageTypeFiled as formField } from "../../field";
import { commonFromMixin } from "@/mixins";
import { add, edit } from "@/api/imageTypeApi";

export default {
  mixins: [commonFromMixin],
  data() {
    return {
      formField,
      form: {
        name: "",
      },
    };
  },

  methods: {
    async doSubmit() {
      const valid = await this.validate();
      if (!valid) return;
      if (this.isAdd) {
        this.doAdd();
      } else {
        this.doEdit();
      }
    },
    async doAdd() {
      const { code } = await add(this.form);
      if ($SUC({ code })) {
        this.success();
      }
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