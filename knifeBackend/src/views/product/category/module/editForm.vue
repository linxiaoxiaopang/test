<template>
  <BaseDialog
    minHeight="200px"
    :dialogVisible.sync="dialog"
    width="600px"
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
        <template #parentSlot="{ scoped: { prop } }">
          <ProtoTypeTreeSelect
            ref="imageTypeTreeSelect"
            :selectedValue.sync="form[prop]"
            :maxHeight="100"
          />
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
import ProtoTypeTreeSelect from "@/components/protoTypeTreeSelect";
import { editProtoCateFiled as formField } from "../../field";
import { commonFromMixin } from "@/mixins";
import { edit } from "@/api/product/protoCateApi";

export default {
  mixins: [commonFromMixin],
  components: {
    ProtoTypeTreeSelect,
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
      this.doEdit();
    },
    async doEdit() {
      const { id, parent, ...form } = this.form;
      const { code } = await edit(
        id,
        Object.assign({}, form, { parent: parent ? parent : null })
      );
      if ($SUC({ code })) {
        this.success();
      }
    },
  },
};
</script>