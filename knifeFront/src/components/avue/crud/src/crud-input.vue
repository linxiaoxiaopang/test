<template>
  <el-input :size="size"
            :clearable="clearable"
            v-model="text"
            :type="typeParam"
            :autosize="{ minRows: minRows, maxRows: maxRows}"
            :placeholder="placeholder || '请输入'+label"
            :disabled="disabled"
            :readonly="readonly"
            :show-password="showPassword"
            v-bind="$attrs"
            @input="handleChange"
            @keyup.enter.native="searchChange"
            v-on="$listeners"
  >
    <template slot="suffix">
      <slot name="suffix"></slot>
    </template>
  </el-input>
</template>

<script>
  export default {
    name: 'AvueCrudInput',
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
      clearable: {
        type: Boolean,
        default: true
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
      },
      size: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: ''
      },
      minRows: {
        type: String|Number,
        default: '3'
      },
      maxRows: {
        type: String|Number,
        default: '4'
      },
      showPassword: {
        type: Boolean,
        default: false,
      }
    },
    watch: {
      value: function(n, o) {
        this.text = this.value
      }
    },
    computed: {
      typeParam: function() {
        if (this.type == 'textarea') {
          return 'textarea'
        } else if (this.type == 'password') {
          return 'password'
        } else {
          return 'text'
        }
      }
    },
    created() {
      this.text = this.value
    },
    mounted() {},
    methods: {
      handleChange(value) {
        this.$emit('input', value)
      },
      searchChange() {
        this.$emit('search-change')
      }
    }
  }
</script>

<style>
</style>
