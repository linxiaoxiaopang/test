<template>
  <el-date-picker
    :size="size"
    :type="type"
    v-model="text"
    :format="format"
    :value-format="valueFormat"
    :placeholder="placeholder || '请输入'+label"
    range-separator="-"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    @change="handleChange"
    :disabled="disabled"
    :readonly="readonly"
  ></el-date-picker>
</template>

<script>
import {validatenull} from "@/components/avue/utils/validate";

export default {
  name: 'AvueCrudDate',
  data() {
    return {
      text: ''
    }
  },
  props: {
    label: {
      type: String
    },
    value: {
      default: ''
    },
    size: {
      type: String
    },
    type: {
      default: 'date'
    },
    valueFormat: {
      default: ''
    },
    format: {
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
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
    },
  },
  created() {
    this.text = this.value
  },
  mounted() {},
  methods: {
    handleChange(value) {
      if (this.type==='daterange' && validatenull(value)) {
        this.$emit('input', [])
        this.$emit('search-change')
        return
      }
      this.$emit('input', value)
      this.$emit('search-change')
    }
  }
}
</script>

<style>
</style>
