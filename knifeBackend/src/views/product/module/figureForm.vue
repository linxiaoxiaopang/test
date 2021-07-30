<template>
  <BaseDialog :dialogVisible.sync="dialog" width="900px" :title="title">
    <template>
      <BaseForm
        ref="form"
        label-width="100px"
        :cols="formField"
        :form="form"
        :formVisible="dialog"
      >
        >
        <template #structureSlot="{ scoped: { prop } }">
          <el-tag type="primary" size="mini">
            {{ form[prop] }}
          </el-tag>
        </template>

        <template #pathSlot="{ scoped: { prop } }">
          <ImgUpload :files.sync="form[prop]" mutiple />
        </template>
      </BaseForm>
    </template>
    <template #footer>
      <el-button :loading="loading" type="primary" @click="doSubmit"> 确认 </el-button>
      <LoadingBtn @click="cancel"> 取消 </LoadingBtn>
    </template>
  </BaseDialog>
</template>
<script>
import ImgUpload from "@/components/fileUpload/imgUpload";
import { figureEditField as formField } from "../field";
import { commonFromMixin } from "@/mixins";
import { add, del, edit } from "@/api/product/primFigureApi";

export default {
  mixins: [commonFromMixin],

  components: {
    ImgUpload,
  },

  data() {
    return {
      formField,
      loading: false,
      form: {
        path: [],
      },
      oForm: {},
    };
  },

  methods: {
    async doSubmit() {
      const valid = await this.validate();
      if (!valid) return;
      this.doEdit();
    },
    async doEdit() {
      this.loading = true;
      try {
        const { path = [] } = this.form || {};
        const res = await Promise.all([
          ...this.doDel(path),
          ...this.doAdd(path),
        ]);
        const successBool = res.every(({ code }) => $SUC({ code }));
        if (successBool) {
          this.success();
        } else {
          this.$message.warning('部分图片存在错误，请重新编辑。')
        }

      } catch (err) {
        this.$message.error(err.msg || err || '发生错误')
      }
      this.loading = false;
    },
    doDel(allPath) {
      const { path = [] } = this.oForm || {};
      const delArr = path.filter(({ id }) => {
        return allPath.every((item) => item.id != id);
      });
      return delArr.map(({ id }) => del(id));
    },
    doAdd(allPath) {
      const [firstAdd, ...otherPath] = allPath;
      const addArr = otherPath.filter(({ id }) => {
        return !id;
      });
      const tmpArr = [];
      if (firstAdd.id && !firstAdd.isCover) {
        const formData = new FormData();
        formData.append("prim_struct", this.form.struct);
        formData.append("isCover", true);
        tmpArr.push(edit(firstAdd.id, formData));
      }
      if (!firstAdd.id) {
        const formData = new FormData();
        formData.append("path", firstAdd);
        formData.append("isCover", true);
        formData.append("prim_struct", this.form.struct);
        tmpArr.push(add(formData));
      }
      addArr.map((row) => {
        const formData = new FormData();
        formData.append("path", row);
        formData.append("prim_struct", this.form.struct);
        formData.append("isCover", false);
        tmpArr.push(add(formData));
      });
      return tmpArr;
    },
  },
};
</script>