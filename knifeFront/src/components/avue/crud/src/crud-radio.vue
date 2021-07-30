<template>
  <el-radio-group v-model="text"
                  @change="handleChange"
                  :disabled="disabled"
                  :size="size"
  >
    <el-radio v-for="(item,index) in dic"
              :label="item[dictValue] || item.value"
              :key="index"
              :border="border"
    >
      {{item[dictLabel] || item.label}}
    </el-radio>
  </el-radio-group>
</template>

<script>
  export default {
    name: "AvueCrudRadio",
    props: {
      value: {
        default: ""
      },
      size: {
        type: String,
        default: ''
      },
      border: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      dic: {
        type: Array,
        default: () => {
          return [];
        }
      },
      props: {
        default: () => {
          return {};
        }
      }
    },
    data() {
      return {
        text: ""
      };
    },
    computed: {
      dictLabel() {
        return this.props.label || 'dictLabel'
      },
      dictValue() {
        return this.props.value || 'dictValue'
      },
    },
    watch: {
      value: {
        handler() {
          this.text = this.value;
        },
        immediate: true
      },
      // dic: {
      //   handler(n, o) {
      //     console.log(n);
      //   },
      //   immediate: true
      // }
    },
    methods: {
      handleChange(value) {
        this.$emit("input", value)
        this.$emit('search-change')
      }
    }
  };
</script>

<style>

</style>
