<template>
  <div class="settingFormComponent">
    <BaseForm
      customClass="settingCustomClass"
      ref="form"
      label-width="80px"
      label-position="left"
      :topPosition="true"
      :cols="formField"
      :form="form"
    >
      <template #structsSlot="{ scoped: { prop, placeholder } }">
        <el-button
          size="mini"
          icon="el-icon-plus"
          type="primary"
          class="add-struct"
          @click="addNewItem"
        >
          添加款式项
        </el-button>

        <div
          style="display: inline-block"
          :key="index"
          v-for="(struct, index) in form[prop]"
        >
          <BaseForm
            ref="structForm"
            label-width="180px"
            customClass="structCommonClass"
            :topPosition="false"
            :cols="structField"
            :form="struct || {}"
          >
            <template #prim_colorSlot="{ scoped: { prop } }">
              <ColorSelect :color.sync="struct[prop]" :sup_this="sup_this" />
              <!-- <el-color-picker v-model="struct[prop]"></el-color-picker> -->
              <el-button
                v-if="form['structs'].length > 1"
                size="mini"
                icon="el-icon-delete"
                type="text"
                class="reduce-item"
                @click="reduceNewItem(index)"
              >
                刪減款式项
              </el-button>
            </template>
            <template #figuresSlot="{ scoped: { prop } }">
              <ImgUpload :files.sync="struct[prop]" multiple :limit="10" />
            </template>
            <!-- <template #detailSlot="{ scoped: { prop } }">
              <Editor
                :id="`structEditor_${index}`"
                :val.sync="struct[prop]"
                :placeholder="placeholder"
                :height="200"
                serverUrl="serverUrl"
                useObjectStr="CONTENT_UEDITOR_FILE"
              />
            </template> -->
          </BaseForm>
        </div>
      </template>
    </BaseForm>
  </div>
</template>

<script>
import ImgUpload from "@/components/fileUpload/imgUpload";
import ColorSelect from "@/components/colorSelect";

// import Editor from "@/components/editor";

import cloneDeep from "lodash/cloneDeep";
import { settingField as formField, structField } from "../../../field";
import { STRUCT_ITEKM } from "@/utils/constant";
const STRUCTS_PROP = "structs";
const PATHS_PROP = "paths";

export default {
  components: {
    ImgUpload,
    ColorSelect
    // Editor,
  },
  props: {
    form: {
      type: Object,
      requird: true,
    },
  },
  data() {
    return {
      sup_this: this,
      formField: cloneDeep(formField),
      structField,
    };
  },
  created() {
    this.updateFormFieldRules();
  },

  computed: {
    showBtnOfAddItem() {
      const form = this.form;
      return form.structs.every(({ struct, name }) => struct && name);
    },
  },

  methods: {
    updateFormFieldRules() {
      const formField = this.formField;
      this.formField = formField.map((item) => {
        if (item.prop == STRUCTS_PROP) {
          item.rule = item.rule.concat({
            validator: this.checkStructs,
          });
        }
        if (item.prop == PATHS_PROP) {
          item.rule = item.rule.concat({
            validator: this.checkPaths,
          });
        }
        return item;
      });
    },
    checkStructs(rule, value, callback) {
      const valid = value.every(({ name, struct }) => name && struct);
      if (!valid) {
        return callback(new Error("所有的款式和款式名称都是必填项"));
      }
      return callback();
    },
    checkPaths(rule, value, callback) {
      const errArr = [];
      value.map((item, index) => {
        if (!item.length) {
          errArr.push(index + 1);
        }
      });
      if (errArr.length) {
        return callback(
          new Error(`第${errArr.join("，")}个款式所对应的原型图不能空`)
        );
      }
      return callback();
    },
    checkSizes(rule, value, callback) {
      const valid = value.every((size) => size);
      if (!valid) {
        return callback(new Error("尺码不能为空"));
      }
      return callback();
    },
    addNewItem() {
      this.form.structs.push({
        ...STRUCT_ITEKM,
      });
    },
    reduceNewItem(index) {
      this.$emit("delFormByIndex", index);
    },
    async validate() {
      const { structForm } = this.$refs;
      const structForms = Array.isArray(structForm) ? structForm : [structForm];
      try {
        return structForms.every((form) => form.validate());
      } catch (err) {
        return false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.settingFormComponent {
  .settingCustomClass {
    position: relative;
    left: -65px;
    top: 40px;
    margin-bottom: 30px;
    padding: 10px 15px;
    padding-bottom: 30px;
    border: 1px solid $border-color;
    ::v-deep {
      .el-form {
        padding: 0;
      }
      .el-form-item {
        margin-bottom: 8px;
      }
    }
    .structCommonClass {
      padding: 0px 15px;
      border: 1px solid $border-color;
    }
  }
  .add-struct {
    top: -36px;
    left: 50px;
    position: absolute;
  }
  .struct-name {
    margin-right: 5px;
  }
  .reduce-item {
    position: absolute;
    right: 0;
    top: -35px;
    color: $color-danger;
  }
}
</style>