<template>
  <div class="head-container head-form-container shelves-header">
    <BaseForm
      customClass="customClass"
      ref="form"
      label-width="80px"
      :cols="formField"
      :form="query"
    >
      <template #nameSlot="{ scoped: { prop, placeholder } }">
        <el-input v-model="query[prop]" :placeholder="placeholder"></el-input>
      </template>

      <template #categorySlot="{ scoped: { prop, placeholder } }">
        <ProtoTypeTreeSelect
          size="mini"
          style="width: 100%"
          :placeholder="placeholder"
          :selectedValue.sync="query[prop]"
          :maxHeight="150"
        />
      </template>
      <template #sexSlot="{ scoped: { prop, placeholder } }">
        <selectList
          :placeholder="placeholder"
          :options="SEX_LIST"
          :keyword.sync="query[prop]"
        />
      </template>

      <template #seasonSlot="{ scoped: { prop, placeholder } }">
        <selectList
          :placeholder="placeholder"
          :options="SEASONS_LSIT"
          :keyword.sync="query[prop]"
        />
      </template>
      <template #saleTimeSlot="{ scoped: { prop } }">
        <SaleDateTime :time.sync="query[prop]" />
      </template>

      <template #levelSlot="{ scoped: { prop, placeholder } }">
        <selectList
          :placeholder="placeholder"
          :options="LEVEL_LSIT"
          :keyword.sync="query[prop]"
        />
      </template>

      <template #doneSlot>
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-search"
          @click="toQuery"
        ></el-button>
      </template>
    </BaseForm>
  </div>
</template>

<script>
import ProtoTypeTreeSelect from "@/components/protoTypeTreeSelect";
import SaleDateTime from "@/components/saleDateTime";

import { commonEheaderMixin } from "@/mixins";

import { objBeArray } from "@/utils";
import { SEX_LIST, LEVEL_LSIT, SEASONS_LSIT } from "@/utils/constant";
import { shelvesField as formField } from "../field";

export default {
  mixins: [commonEheaderMixin],

  components: {
    ProtoTypeTreeSelect,
    SaleDateTime,
  },

  data() {
    return {
      formField,
      SEX_LIST: objBeArray(SEX_LIST),
      LEVEL_LSIT: objBeArray(LEVEL_LSIT),
      SEASONS_LSIT: objBeArray(SEASONS_LSIT),
    };
  },
};
</script>
<style lang="scss" lang="scss">
.shelves-header {
  .customClass {
    .el-form.el-form {
      padding: 0;
    }
    .el-form-item {
      margin-bottom: 0;
    }
    .el-form-item__label {
      white-space: nowrap;
    }
  }
}
</style>
