<template>
  <div
    :class="[
      'checkInputComponent',
      'el-form-item',
      errMsg ? 'is-error' : 'is-success',
    ]"
  >
    <el-input
      v-bind="$attrs"
      type="text"
      size="mini"
      v-model="inputVal"
    ></el-input>
    <div class="el-form-item__error" v-if="errMsg">{{ errMsg }}</div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
    },
    label: String,
    validFunc: Function,
  },
  data() {
    return {
      inputVal: "",
      errMsg: "",
    };
  },
  watch: {
    inputVal: {
      handler(newVal) {
        this.$emit("update:value", newVal);
        if (!this.validFunc) {
          return this.isInteger(newVal);
        }
        const { errMsg } = this.validFunc(newVal);
        this.errMsg = errMsg;
      },
      immediate: true,
    },
    value(newVal) {
      this.inputVal = newVal;
    },
  },
  methods: {
    isInteger(value) {
      if (!value) {
        return (this.errMsg = `${this.label}必填`);
      }
      const re = /^[1-9][0-9]*$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        this.errMsg = "请输入正整数";
      } else {
        this.errMsg = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.checkInputComponent {
  position: relative;
  margin: 20px 0;
  .el-form-item__error {
    margin-top: 2px;
  }
}
</style>