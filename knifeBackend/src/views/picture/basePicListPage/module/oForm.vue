<template>
  <BaseDialog :dialogVisible.sync="dialog" width="700px" minHeight="330px" :title="title">
    <template>
      <BaseForm
        ref="form"
        label-width="100px"
        :cols="formField"
        :form="form"
        :formVisible="dialog"
      >
        >
        <template #titleSlot="{ scoped: { prop } }">
          <el-tag type="primary" size="mini">
            {{ form[prop] }}
          </el-tag>
        </template>

        <template #category_nameSlot="{ scoped: { prop } }">
          <el-tag type="primary" size="mini">
            {{ form[prop] }}
          </el-tag>
        </template>

        <template #pathSlot="{ scoped: { prop } }">
          <ImgUpload :files.sync="form[prop]" :limit="1" />
          <div class="common-tip">更换后的原图名称必须与之前的原图名称一致</div>
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
import ImgUpload from "@/components/fileUpload/imgUpload";
import { originChangeField as formField } from "../../field";
import { commonFromMixin } from "@/mixins";
import { updateImage as edit } from "@/api/imageApi";
import { compressFile, getPicName } from "@/utils";

export default {
  mixins: [commonFromMixin],

  components: {
    ImgUpload,
  },

  data() {
    return {
      formField,
      form: {
        path: [],
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
      const { id, path, title } = this.form;
      if (path[0] && path[0].url) {
        return this.success();
      }
      const file = path[0];
      if (getPicName(file.name) != title) {
        return this.$message.warning("更换原图名称必须与原始原图名称一致");
      }
      const formData = new FormData();
      const thumbnailPath = ((await compressFile(file)) || {}).file;
      formData.append("path", file);
      formData.append("thumbnail_path", thumbnailPath, file.name);
      const { code } = await edit(id, formData);
      if ($SUC({ code })) {
        this.success();
      }
    },
  },
};
</script>