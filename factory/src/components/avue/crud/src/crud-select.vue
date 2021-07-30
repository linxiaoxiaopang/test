<template>
  <el-select v-model="text"
             :size="size"
             :placeholder="placeholder || '请选择'+label"
             @change="handleChange"
             :disabled="disabled || readonly"
             clearable
             :class="{'is-readonly': readonly}"
             v-on="$listeners"
  >
    <span v-if="dic && dic[0] && dic[0].options">
      <el-option-group
        v-for="group in dic"
        :key="group[dictLabel] || group.label"
        :label="group[dictLabel] || group.label">
        <el-option
          v-for="item in group.options"
          :key="item[dictValue] || item.value"
          :label="item[dictLabel] || item.label"
          :value="item[dictValue] || item.value">
        </el-option>
      </el-option-group>
    </span>
    <span v-else>
      <el-option v-for="(item,index) in dic"
                 :key="index"
                 :label="item[dictLabel] || item.label"
                 :value="item[dictValue] || item.value"
                 :disabled="item.disabled"
      ></el-option>
    </span>
  </el-select>
</template>

<script>
  export default {
    name: "AvueCrudSelect",
    data() {
      return {
        text: ""
      };
    },
    props: {
      label: {
        type: String,
        default: ''
      },
      value: {
        default: ""
      },
      placeholder: {
        type: String,
        default: ""
      },
      size: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      readonly: {
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
    computed: {
      dictLabel() {
        return this.props.label || 'dictLabel'
      },
      dictValue() {
        return this.props.value || 'dictValue'
      },
    },
    watch: {
      value: function(n, o) {
        this.text = this.value;
      },
      // text(n) {
      //   console.log(n, typeof n);
      // },
      // dic: {
      //   handler(n, o) {
      //     console.log(this.label, n, this.text);
      //   },
      //   immediate: true
      // }
    },
    created() {
      this.text = this.value;
    },
    mounted() {},
    methods: {
      handleChange(value) {
        this.$emit("input", value);
        this.$emit("change", value);
        this.$emit('search-change')
      }
    }
  };
</script>

<style>
  .is-readonly .el-input.is-disabled .el-input__inner{
    color: #606266;
    background-color: #fff;
    cursor: pointer;
  }
  .is-readonly .el-input.is-disabled .el-input__icon{
    cursor: pointer;
  }
</style>
