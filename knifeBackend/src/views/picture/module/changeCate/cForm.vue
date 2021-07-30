<template>
  <BaseDialog
    ref="baseDialog"
    top="5vh"
    width="500px"
    :dialogVisible.sync="dialog"
    :title="title"
  >
    <template>
      <BaseForm
        v-loading="loading"
        ref="form"
        label-width="100px"
        :cols="formField"
        :form="form"
        :formVisible="dialog"
      >
        <template #thumbnail_pathSlot="{ scoped: { prop } }">
          <ImgUpload
            ref="imgUpload"
            action="#"
            :hideDialog="true"
            :showFileName="true"
            :hiddenUploadBtn="true"
            :limit="1"
            :files.sync="form[prop]"
          />
        </template>
        <template #categorySlot="{ scoped: { prop } }">
          <ImageTypeTreeSelect
            ref="imageTypeTreeSelect"
            :selectedValue.sync="form[prop]"
            :maxHeight="200"
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
import ImgUpload from "@/components/fileUpload/imgUpload";
import formField from "./field";
import { update, publicUpdate } from "@/api/imageApi";
import { commonFromMixin } from "@/mixins";

export default {
  mixins: [commonFromMixin],
  components: {
    ImgUpload,
    ImageTypeTreeSelect,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    form: {
      type: Object,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formField,
      loading: false,
    };
  },

  methods: {
    async doSubmit() {
      const valid = await this.$refs["form"].validate();
      if (!valid) return;
      const { category } = this.form;

      this.loading = true;
      const { id } = this.data;
      try {
        const api = this.isPublic ? publicUpdate : update;
        const { code } = await api(id, {
          category,
        });
        if ($SUC({ code })) {
          this.success();
        }
      } catch (err) {
        console.log("err", err);
      }
      this.loading = false;
    },
  },
};
</script>