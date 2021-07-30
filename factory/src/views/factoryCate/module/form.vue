<template>
  <BaseDialog :dialogVisible.sync="dialog" width="500px" :title="title">
    <template>
      <BaseForm
        ref="form"
        label-width="120px"
        :cols="formField"
        :form="form"
        :formVisible="dialog"
      >
      </BaseForm>
    </template>
    <template #footer>
      <LoadingBtn type="primary" @click="doSubmit"> 确认 </LoadingBtn>
      <LoadingBtn @click="cancel"> 取消 </LoadingBtn>
    </template>
  </BaseDialog>
</template>
<script>
import { factoryCateFiled as formField } from "./field";
import { add, edit } from "@/api/product/factoryCateApi";
export default {
  props: {
    title: {
      type: String,
      default: "提示",
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
      dialog: false,
      form: {},
    };
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    async doSubmit() {
      const valid = await this.$refs["form"].validate();
      if (!valid) return;
      if (this.isAdd) {
        console.log(1);
        await this.doAdd();
      } else {
        console.log(2);
        await this.doEdit();
      }
    },
    doAdd() {
      const form = {
        ...this.form,
        name: this.form.name,
      };

      return add(form)
        .then((res) => {
          const { code } = res;
          if ($SUC({ code })) {
            this.$message({
              type: "success",
              message: "添加成功!",
            });
            this.resetForm();
            this.sup_this.init();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    doEdit() {
      console.log('edit', edit)
      const { id, ...params } = this.form;
      return edit(
        this.form.id,
        Object.assign({}, params, { name: params.name })
      )
        .then((res) => {
          const { code } = res;
          if (code >= 200 && code < 300) {
            this.$message({
              showClose: true,
              type: "success",
              message: "修改成功!",
              duration: 2500,
            });
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