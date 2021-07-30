<template>
  <BaseDialog
    minHeight="260px"
    :dialogVisible.sync="dialog"
    width="700px"
    :title="title"
  >
    <template>
      <BaseForm
        ref="form"
        label-width="120px"
        :cols="formField"
        :form="form"
        :formVisible="dialog"
      >
        <template #categorySlot="{ scoped: { prop } }">
          <ImageTypeTreeSelect
            ref="imageTypeTreeSelect"
            :alwaysOpen="true"
            :selectedValue.sync="form[prop]"
            :maxHeight="200"
            @selectNodeHandler="selectNodeHandler"
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
import { batchCateField as formField } from "../../../../field";
import { commonFromMixin } from "@/mixins";
import {mapGetters} from 'vuex'
const ID_KEY = "category";
const NAME_KEY = "category_name";
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
  computed: {
    ...mapGetters(['category']),
  },
  watch: {
    category: {
      handler(n) {
        this.$set(this.form, 'category', n[0].id)
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    selectNodeHandler({ name }) {
      this.form.category_name = name;
    },
    async doSubmit() {
      const valid = await this.validate();
      if (!valid) return;
      this.doEdit();
    },
    async doEdit() {
      this.$emit("updateSelectedData", {
        key: ID_KEY,
        val: this.form[ID_KEY],
      });

      this.$emit("updateSelectedData", {
        key: NAME_KEY,
        val: this.form[ID_KEY] ? this.form[NAME_KEY] : undefined,
      });
      this.$message.success("设置成功");
      this.resetForm();
    },
  },
};
</script>