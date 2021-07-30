<template>
  <BaseDialog
    :dialogVisible.sync="dialog"
    width="500px"
    :title="title"
  >
    <template>
      <BaseForm
        ref="form"
        label-width="100px"
        :cols="formField"
        :form="form"
        :formVisible="dialog"
      >
        <template #parentNameSlot>
          <el-tag type="warning"> {{ data.name }} </el-tag>
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
import { childProtoCateFiled as formField } from "../../field";
import { commonFromMixin } from "@/mixins";
import { add } from "@/api/product/protoCateApi";

export default {
  mixins: [commonFromMixin],
  props: {
    data: Object,
  },
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
      this.doAdd();
    },
    async doAdd() {
      const { code } = await add(
        Object.assign({}, { parent: this.data.id }, this.form)
      );
      if ($SUC({ code })) {
        this.success();
      }
    },
  },
};
</script>