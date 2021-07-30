<template>
  <el-input-number v-model="text"
                   :controls="controls"
                   :controls-position="controlsPosition"
                   :precision="precision"
                   :step="step"
                   :size="size"
                   :min="minRows"
                   :max="maxRows"
                   :label="placeholder || '请输入'+label"
                   :disabled="disabled"
                   @change="handleChange"
  ></el-input-number>
</template>

<script>
export default {
  name: 'AvueCrudInputNumber',
  data() {
    return {
      text: 0
    }
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: Number|String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    precision: {
      type: Number,
      default: 0
    },
    step: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    controls: {
      type: Boolean,
      default: true
    },
    controlsPosition: {
      type: String,
    },
    minRows: {
      type: Number,
      default: -Infinity
    },
    maxRows: {
      type: Number,
      default: Infinity
    }
  },
  watch: {
    value: {
      handler(n) {
        this.text = this.value
      },
      immediate: true
    },
  },
  created() {
    this.text = this.value
  },
  mounted() {},
  methods: {
    handleChange(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style>
</style>
