<template>
  <BaseDialog
    minHeight="200px"
    :title="title"
    :dialogVisible.sync="dialog"
    width="500px"
  >
    <template>
      <BaseForm
        ref="form"
        label-width="100px"
        :cols="formField"
        :form="form"
        :formVisible="dialog"
      >
        <template #parentSlot="{ scoped: { prop, placeholder } }">
          <ImageTypeTreeSelect
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
import ImageTypeTreeSelect from "@/components/imageTypeTreeSelect";
import { editImageTypeFiled as formField } from "../../field";
import { commonFromMixin } from "@/mixins";
import { edit } from "@/api/imageTypeApi";

export default {
  mixins: [commonFromMixin],
  components: {
    ImageTypeTreeSelect,
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