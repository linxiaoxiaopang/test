<template>
  <div class="head-form-container design-page">
    <BaseForm
      size="small"
      customClass="customClass"
      ref="form"
      label-width="auto"
      :cols="formField"
      :form="query"
    >
      <template #priceSlot="{ scoped: { prop, placeholder } }">
        <selectList
          :placeholder="placeholder"
          :options="[]"
          :keyword.sync="query[prop]"
        />
      </template>

      <template #nameSlot="{ scoped: { prop, placeholder } }">
        <el-input
          prefix-icon="el-icon-search"
          :placeholder="placeholder"
          v-model="query[prop]"
          clearable
        >
        </el-input>
      </template>
    </BaseForm>
    <color-text-btn type="info" class="total">
      {{ sup_this.total | numFormat }}产品
    </color-text-btn>
  </div>
</template>

<script>
import { headerField as formField } from "./field";
import { commonEheaderMixin } from "@/mixins";
import throttle from "lodash/throttle";
export default {
  mixins: [commonEheaderMixin],
  data() {
    return {
      formField,
    };
  },
  watch: {
    query: {
      handler() {
        this.throttle();
      },
      deep: true,
    },
  },
  methods: {
    throttle: throttle(
      function () {
        this.toQuery();
      },
      500,
      {
        leading: false,
        trailing: true,
      }
    ),
  },
};
</script>
<style lang="scss" scoped>
.design-page {
  padding-left: 0;
  padding-right: 0;
  .total {
    position: absolute;
    right: 0;
    top: 15px;
    right: 40px;
    font-size: 14px;
  }
}
</style>