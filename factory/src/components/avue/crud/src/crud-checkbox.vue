<template>
  <el-checkbox-group v-model="text" @change="handleChange">
    <el-checkbox v-for="(item,index) in dic" :label="item.value || item.dictValue" :key="index">{{item.label || item.dictLabel}}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
export default {
  name: "AvueCrudCheckbox",
  data() {
    return {
      text: []
    };
  },
  props: {
    value: {
      default: () => {
        return [];
      }
    },
    dic: {
      default: () => {
        return [];
      }
    }
  },
  watch: {
    value: function(n, o) {
      this.text = this.value;
    }
  },
  created() {
    this.text = this.value;
  },
  mounted() {},
  methods: {
    handleChange(value) {
      this.$emit("input", value);
    }
  }
};
</script>

<style>

</style>
