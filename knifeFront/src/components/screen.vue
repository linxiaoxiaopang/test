<template>
  <div class="screenComponent">
    <div class="label">{{ label }}：</div>
    <div class="fields">
      <el-radio-group size="mini" v-model="radio">
        <el-radio-button
          :label="filed"
          :key="index"
          v-for="(filed, index) in fields"
        ></el-radio-button>
      </el-radio-group>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      required: true,
    },
    fields: {
      type: Array,
      required: true,
    },
    value: {
      required: true,
    },
  },
  data() {
    return {
      radio: this.value,
    };
  },
  watch: {
    value(newVal) {
      this.radio = newVal;
    },
    radio(newVal) {
      this.$emit("update:value", newVal);
    },
  },
};
</script>

<style lang="scss" scoped>
.screenComponent {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .label {
    flex: 0 0 70px;
    min-width: 70px;
    white-space: nowrap;
    font-size: 14px;
  }
  .fields {
    margin-right: 20px;

    .el-radio-button {
      ::v-deep {
        .el-radio-button__inner {
          border: none;
          padding: 2px 5px;
          border-radius: 0;
          font-size: 14px;
        }
      }
    }
  }
}
::v-deep .el-radio-button__inner {
    background: transparent;
  }
</style> 
