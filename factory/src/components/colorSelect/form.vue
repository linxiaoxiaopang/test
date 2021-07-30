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
        v-loading="loading"
      >
        <template #color_valueSlot="{ scoped: { prop } }">
          <ColorSketchPicker
            style="width: 80%"
            v-model="form[prop]"
            :class="['sketch-picker']"
            :presetColors="[]"
            :disableAlpha="true"
          />
        </template>
      </BaseForm>
    </template>
    <template #footer>
      <el-button :loading="loading" type="primary" @click="doSubmit">
        确认
      </el-button>
      <LoadingBtn @click="cancel"> 取消 </LoadingBtn>
    </template>
  </BaseDialog>
</template>
<script>
import ColorSketchPicker from "@/components/colorSketchPicker";

import { colorsFiled as formField } from "./field";
import { commonFromMixin } from "@/mixins";
import { add } from "@/api/product/colorApi";

export default {
  mixins: [commonFromMixin],
  components: {
    ColorSketchPicker,
  },
  data() {
    return {
      formField,
      form: {
        color_value: "#ffffff",
      },
      loading: false,
    };
  },

  methods: {
    async doSubmit() {
      const valid = await this.validate();
      if (!valid) return;
      this.doAdd();
    },
    async doAdd() {
      this.loading = true;
      try {
        let { color_name, color_value } = this.form;
        color_value =
          typeof color_value === "string" ? color_value : color_value.hex;

        const { code } = await add({
          color_name,
          color_value,
        });
        if ($SUC({ code })) {
          this.success();
        }
      } catch (err) {}
      this.loading = false;
    },
  },
};
</script>