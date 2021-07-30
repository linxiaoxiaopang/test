<template>
  <BaseDialog :dialogVisible.sync="dialog" width="1000px" :title="title">
    <div v-if="dialog" v-loading="loading">
      <el-tabs
        class="structFormComponent"
        closable
        type="border-card"
        v-model="activeName"
        @tab-remove="remove"
      >
        <el-tab-pane
          :label="form.structure || '暂无款式'"
          :name="form.id | paneName"
          :key="form.id | paneName"
          v-for="(form, index) in data.prim_struct"
        >
          <template>
            <BaseForm
              ref="form"
              label-width="70px"
              :cols="formField"
              :form="form"
              :formVisible="dialog"
            >
              <template #colorSlot="{ scoped: { prop } }">
                <el-color-picker v-model="form[prop]"></el-color-picker>
              </template>
              <template #figuresSlot="{ scoped: { prop } }">
                <ImgUpload :files.sync="form[prop]" multiple :limit="5" />
              </template>
              <template #detailSlot="{ scoped: { prop } }">
                <Editor
                  :id="`structEditor_${index}`"
                  :val.sync="form[prop]"
                  placeholder="请输入款式详情"
                  :height="200"
                  serverUrl="serverUrl"
                  useObjectStr="CONTENT_UEDITOR_FILE"
                />
              </template>
            </BaseForm>
          </template>
        </el-tab-pane>

        <el-tab-pane name="addNewTab" disabled>
          <span slot="label">
            <el-button
              @click="addNewStruct"
              icon="el-icon-plus"
              size="mini"
              type="primary"
            >
              添加款式
            </el-button></span
          >
        </el-tab-pane>
      </el-tabs>
    </div>
    <template #footer>
      <el-button :loading="loading" type="primary" @click="doSubmit">
        确认
      </el-button>
      <LoadingBtn @click="cancel"> 取消 </LoadingBtn>
    </template>
  </BaseDialog>
</template>
<script>
import ImgUpload from "@/components/fileUpload/imgUpload";
import Editor from "@/components/editor";

import cloneDeep from "lodash/cloneDeep";
import { structField as formField } from "../field";
import { commonFromMixin } from "@/mixins";
import { createRandomNum, file2Base64 } from "@/utils";
import { STRUCR_ITEM, CUSTOM } from "@/utils/constant";
import { edit, del, add } from "@/api/product/protoStructApi";
import {
  edit as figuresEdit,
  del as figuresDel,
  add as figuresAdd,
} from "@/api/product/primFigureApi";
export default {
  mixins: [commonFromMixin],
  components: {
    ImgUpload,
    Editor,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formField,
      activeName: "",
      oStructs: [],
      loading: false,
    };
  },
  filters: {
    paneName(id) {
      return id && id.toString();
    },
  },
  methods: {
    existSameSizeName() {
      const prim_struct = this.data.prim_struct;
      const set = [
        ...new Set(prim_struct.map(({ structure }) => structure.toUpperCase())),
      ];
      return set.length < prim_struct.length;
    },
    remove(name) {
      const prim_struct = this.data.prim_struct;
      if (prim_struct.length <= 1) {
        return this.$message.warning("尺码至少需要存在一个！");
      }
      const nameIndex = this.data.prim_struct.findIndex(({ id }) => id == name);
      if (nameIndex >= 0) {
        const sIndex = Math.max(0, nameIndex - 1);
        this.$delete(prim_struct, nameIndex);
        this.activeName = prim_struct[sIndex].id.toString();
      }
    },

    addNewStruct() {
      const tmpObj = {
        ...STRUCR_ITEM,
        id: `${CUSTOM}-${createRandomNum()}`,
      };

      this.data.prim_struct.push(tmpObj);
      this.activeName = tmpObj.id;
    },
    resetForm() {
      this.$nextTick(() => {
        this.dialog = false;
      });
    },
    async validate() {
      const { form } = this.$refs;
      const forms = Array.isArray(form) ? form : [form];
      const successData = await Promise.all(
        forms.map(async (node) => {
          try {
            return await node.validate();
          } catch (err) {
            return false;
          }
        })
      );
      return successData;
    },
    async doSubmit() {
      const validData = await this.validate();
      const validIndex = validData.findIndex((bool) => {
        return bool == false;
      });
      if (validIndex >= 0) {
        this.activeName = this.data.prim_struct[validIndex].id.toString();
        return;
      }
      if (this.existSameSizeName()) {
        return this.$message.warning("存在两个一样的款式，款式名称必须唯一。");
      }
      this.doFunc();
    },
    async doFunc() {
      this.loading = true;
      try {
        const { id, prim_struct } = this.data || {};
        const delRes = await Promise.all([...this.doDel(prim_struct)]);
        const delSuccessBool = delRes.every(({ code }) => $SUC({ code }));
        if (!delSuccessBool) {
          return this.$message.error("发生错误");
        }
        const res = await Promise.all([
          ...this.doAdd(id, prim_struct),
          ...this.doEdit(prim_struct),
        ]);
        const successBool = res.every(({ code }) => $SUC({ code }));
        if (successBool) {
          const fPArr = prim_struct.map(({ figures }, index) => {
            return this.doFiguresFunc(figures, index);
          });
          const res = await Promise.all(fPArr);
          const allSuccess = res.every((bool) => bool);
          if (!allSuccess) {
            return this.$message.error("图片编辑发生错误");
          }
          this.success();
        }
      } catch (err) {
        this.$message.error(err.msg || err || "发生错误");
      }
      this.loading = false;
    },

    doDel(prim_struct) {
      const delArr = this.oStructs.filter(({ id }) => {
        return prim_struct.every((item) => item.id != id);
      });
      return delArr.map(({ id }) => del(id));
    },

    doAdd(id, prim_struct) {
      const addArr = prim_struct.filter(({ id }) => {
        if (!id) return true;
        return id.toString().indexOf(CUSTOM) >= 0;
      });
      return addArr.map(async (form) => {
        const copyFrom = cloneDeep(form);
        const pArr = copyFrom.figures.map(async (row) => {
          return await file2Base64(row);
        });
        const res = await Promise.all(pArr);
        const figures = res.map((base64, index) => {
          return {
            isCover: index == 0,
            path: base64,
          };
        });
        return add({
          ...form,
          id: undefined,
          prim_prod: id,
          figures,
        });
      });
    },
    doEdit(prim_struct) {
      const editArr = prim_struct.filter(({ id }) => {
        return this.oStructs.some((item) => {
          if (id.toString().indexOf(CUSTOM) >= 0) return false;
          return item.id == id;
        });
      });
      return editArr.map(({ id, psd_file, figures, ...form }) => {
        return edit(id, {
          ...form,
        });
      });
    },
    async doFiguresFunc(figures, index) {
      if (!this.oStructs[index]) {
        return true;
      }
      if (!Array.isArray(this.oStructs[index].figures)) {
        return true;
      }
      const oFigures = this.oStructs[index].figures || [];
      const res = await Promise.all([
        ...this.doFiguresDel(figures, oFigures),
        ...this.doFiguresAdd(figures, oFigures, index),
      ]);
    
      return res.every(({ code }) => $SUC({ code }));
    },
    doFiguresDel(figures, oFigures) {
      const delArr = oFigures.filter(({ id }) => {
        return figures.every((item) => item.id != id);
      });
      return delArr.map(({ id }) => figuresDel(id));
    },
    doFiguresAdd(figures, oFigures, index) {
      const [firstAdd, ...otherAdd] = figures;
      const addArr = otherAdd.filter(({ id }) => {
        return !id;
      });
      const tmpArr = [];
      const prim_struct =
        this.data &&
        this.data.prim_struct &&
        this.data.prim_struct[index] &&
        this.data.prim_struct[index].id;
      if (firstAdd.id && !firstAdd.isCover) {
        const { id } = firstAdd;
        const formData = new FormData();
        formData.append("isCover", true);
        formData.append("prim_struct", prim_struct);
        tmpArr.push(figuresEdit(id, formData));
      }
      if (!firstAdd.id) {
        const formData = new FormData();
        formData.append("isCover", true);
        formData.append("prim_struct", prim_struct);
        formData.append("path", firstAdd);
        tmpArr.push(figuresAdd(formData));
      }
      addArr.map((row) => {
        const formData = new FormData();
        formData.append("isCover", false);
        formData.append("prim_struct", prim_struct);
        formData.append("path", row);
        tmpArr.push(figuresAdd(formData));
      });
      return tmpArr;
    },
  },
};
</script>
<style lang="scss" scoped>
.structFormComponent {
  ::v-deep {
    .is-disabled {
      .el-icon-close {
        opacity: 0;
      }
    }
  }
}
</style>