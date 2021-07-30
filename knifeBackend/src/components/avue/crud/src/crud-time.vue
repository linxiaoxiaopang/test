<template>
  <el-time-picker :size="size" v-model="text" type="date" :format="format" :value-format="valueFormat" :placeholder="placeholder || '请输入'+label" @change="handleChange" :disabled="disabled"> </el-time-picker>
</template>

<script>
export default {
  name: 'AvueCrudTime',
  data() {
    return {
      text: ''
    }
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    valueFormat: {
      default: ''
    },
    format: {
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  watch: {
    value: function(n, o) {
      this.text = this.value
    }
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

<style scoped>
</style>

