<template>
  <div class="avue-tabs">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="(item,index) in option.column"
                   :key="index"
                   :label="item.label"
                   :name="index+''"
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { validatenull } from '../../utils/validate.js'
export default {
  name: 'AvueTabs',
  data() {
    return {
      activeName: ''
    }
  },
  watch: {
    option: {
      handler() {
        if (validatenull(this.activeName)) {
          this.activeName = '0';
        }
      },
      immediate: true,
      deep: true
    },
    activeName(val) {
      this.$emit('change', JSON.parse(JSON.stringify(this.option.column[this.activeName])));
    }
  },
  props: {
    option: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
