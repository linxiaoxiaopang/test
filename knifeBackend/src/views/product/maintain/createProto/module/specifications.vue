<template>
  <div class="specificationsProtoComponent" id="specifications">
    <div class="title">规格信息</div>
    <BaseForm
      customClass="customClass"
      ref="form"
      label-width="100px"
      :cols="formField"
      :form="form"
    >
      <template #settingSlot>
        <SettingForm
          ref="settingForm"
          :form="settingForm"
          @delFormByIndex="delFormByIndex"
        />
      </template>

      <template #infoSlot>
        <SettingTable
          ref="settingTable"
          class="setting-table-wrapper"
          :data="settingForm"
          @delFormByIndex="delFormByIndex"
        />
      </template>
    </BaseForm>
  </div>
</template>

<script>
import SettingForm from "./settingForm";
import SettingTable from "./settingTable";

import { protoSpecificationsField as formField } from "../../../field";
import { STRUCT_ITEKM } from "@/utils/constant";

export default {
  components: {
    SettingForm,
    SettingTable,
  },
  data() {
    return {
      formField,
      form: {},
      settingForm: {
        curStruct: 0,
        structs: [
          {
            ...STRUCT_ITEKM,
          },
        ],
        sizes: [],
      },
    };
  },
  methods: {
    delFormByIndex(index) {
      this.settingForm.structs.splice(index, 1);

      if (!this.settingForm.structs.length) {
        this.settingForm.structs.push({ ...STRUCT_ITEKM });
      }
      if (this.settingForm.curStruct == index) {
        this.$set(this.settingForm, "curStruct", Math.max(0, index - 1));
      }
    },
    async save() {
      const { settingForm, settingTable } = this.$refs;
      const res = await Promise.all([
        settingForm.validate(),
        settingTable.validate(),
      ]);
      const success = res.every((bool) => bool);
      if (!success) {
         return false
         
      }
      return this.settingForm
    },
  },
};
</script>

<style lang="scss" scoped>
.specificationsProtoComponent {
  margin-top: 15px;
  padding: 20px;
  background: #fff;
  .title {
    line-height: 40px;
    height: 40px;
    border-bottom: 1px solid $border-color;
  }
  .customClass {
    ::v-deep {
      .el-form {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }

  .setting-table-wrapper {
    position: relative;
    left: -65px;
    top: 40px;
    margin-bottom: 30px;
  }
}
</style>