<template>
  <BaseDialog
    :dialogVisible.sync="dialog"
    :width="isAdd ? '700px' : '500px'"
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
        <template #nameSlot="{ scoped: { prop } }">
          <el-tag size="mini">
            {{ form[prop] }}
          </el-tag>
        </template>
        <template #prim_structsSlot="{ scoped: { prop } }">
          <div>
            <el-tag
              style="margin: 5px; margin-left: 0"
              type="primary"
              :key="id"
              v-for="{ id, structure } in menus"
            >
              {{ structure }}
            </el-tag>
          </div>
          <el-button type="text" @click="initDialog"> 选择款式 </el-button>
          <DialogField
            :menus="menus"
            :category="form.id"
            ref="dialogField"
            @bulkChoose="bulkChoose"
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
import DialogField from "./dialogField";
import formField from "./field";
import { update as edit } from "@/api/product/productCateApi";

export default {
  components: {
    DialogField,
  },
  props: {
    title: {
      type: String,
      default: "提示",
    },
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    sup_this: {
      type: Object,
      default: null,
    },
    isAdd: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      formField,
      dialog: this.dialogVisible,
      menus: [],
      form: {
        prim_structs: [],
        name: "",
      },
    };
  },
  watch: {
    dialog(newVal) {
      this.$emit("update:dialogVisible", newVal);
    },
    dialogVisible(newVal) {
      this.dialog = newVal;
    },
    menus(newVal) {
      if (!newVal) return;
      this.form.prim_structs = (newVal || []).map(({ id }) => id);
    },
  },

  methods: {
    initDialog() {
      const _this = this.$refs.dialogField;
      _this.dialog = true;
    },
    cancel() {
      this.resetForm();
    },
    bulkChoose(selectedData) {
      this.menus = JSON.parse(JSON.stringify(selectedData));
    },
    async doSubmit() {
      console.log("this.form", this.form);
      const valid = await this.$refs["form"].validate();
      if (!valid) return;
      await this.doEdit();
    },
    doEdit() {
      const { id, prim_structs } = this.form;

      return edit({
        cate: id,
        structs: prim_structs,
      })
        .then((res) => {
          const { code } = res;
          if ($SUC({ code })) {
            this.$message.success("添加成功!");
            this.resetForm();
            this.sup_this.init();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
    },
  },
};
</script>