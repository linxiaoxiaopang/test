<template>
  <span>
    <el-input
      ref="input"
      v-model="curValue"
      class="auto-width-input input-text disabled-normal"
      :style="style"
      :disabled="curDisabled"
      v-bind="$attrs"
      v-on="$listeners"
      @change="handleChange"
      @blur="curDisabled = hasEditBtn"
    ></el-input>
    <slot name="unit"></slot>
    <i v-if="hasEditBtn" class="el-icon-edit text-primary ml10" @click="handleEdit"></i>
  </span>
</template>

<script>
export default {
  props: {
    value: String|Number,
    disabled: Boolean,
    hasEditBtn: Boolean
  },
  data() {
    return {
      curValue: '',
      curDisabled: false,
      inputFontSize: 14
    }
  },
  computed: {
    style({ curValue, inputFontSize }) {
      let strLen = typeof curValue === 'string' ? curValue.length : 0
      return {
        width: inputFontSize * strLen + 10 + 'px'
      }
    }
  },
  watch: {
    value: {
      handler(n) {
        this.curValue = n
      },
      immediate: true
    },
    disabled: {
      handler(n) {
        this.curDisabled = n
      },
      immediate: true,
      deep: true
    },
    hasEditBtn: {
      handler(n) {
        if (n) {
          this.curDisabled = true
        }
      },
      immediate: true,
      deep: true
    }
  },
  updated() {
    this.inputFontSize = getComputedStyle(
      this.$refs.input.$el.getElementsByClassName('el-input__inner')[0]
    ).fontSize.replace('px', '')
  },
  methods: {
    handleChange(val) {
      this.curValue = val
      this.$emit('input', val)
      this.$emit('change', val)
    },
    handleEdit() {
      this.curDisabled = false
      this.$nextTick(function () {
        this.$refs.input.select()
      })
    }
  }
};
</script>

<style lang="scss">
.auto-width-input {
  $border-bottom: 1px dashed $color-primary;
  $input-height: 25px;
  
  &.el-input {
    height: $input-height;
    border-bottom: $border-bottom;
    &.is-disabled {
      border-bottom: none;
    }
  }
  .el-input__inner {
    height: $input-height;
    padding: 0;
    text-align: center;
    background-color: transparent;
  }
}
</style>
