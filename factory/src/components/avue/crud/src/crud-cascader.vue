<template>
  <el-cascader :options="dic"
               v-model="text"
               :size="size"
               :placeholder="placeholder || '请选择'+placeholder"
               :disabled="disabled"
               :clearable="clearable"
               :show-all-levels="showAllLevels"
               :props="cascaderProps"
               @change="handleChange"
  >
  </el-cascader>
</template>

<script>
  import propsMixin from '../../mixins/propsMixin'
  export default {
    name: "AvueCrudCascader",
    mixins: [propsMixin],
    props: {
      emitPath: {
        type: Boolean,
        default: true
      },
      checkStrictly: {
        type: Boolean,
        default: false
      },
      showAllLevels: {
        type: Boolean,
        default: true
      },
      expandTrigger: {
        type: String
      }
    },
    computed: {
      cascaderProps({ props, expandTrigger, emitPath, checkStrictly }) {
        return {
          ...props,
          expandTrigger,
          emitPath,
          checkStrictly
        }
      }
    }
  };
</script>

<style>

</style>
