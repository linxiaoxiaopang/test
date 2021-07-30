<template>
  <BaseDialog  minHeight="260px" :dialogVisible.sync="dialog" width="700px" :title="title">
    <template>
      <BaseForm
        ref="form"
        label-width="60px"
        :cols="formField"
        :form="form"
        :formVisible="dialog"
      >
        >
        <template #categorySlot="{ scoped: { prop } }">
          <ImageTypeTreeSelect
            ref="imageTypeTreeSelect"
            :selectedValue.sync="form[prop]"
            :maxHeight="200"
            :alwaysOpen="true"
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
import { batchCateField as formField } from "../../field";
import { commonFromMixin } from "@/mixins";
import { bulkAddCategory as edit } from "@/api/imageApi";

export default {
  mixins: [commonFromMixin],
  components: {
    ImageTypeTreeSelect,
  },
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
        category: '',
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