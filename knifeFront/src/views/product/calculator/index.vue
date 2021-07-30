<template>
  <div class="app-container personalInfoPage product-calculator">
    <div class="title">成本计算器</div>
    <calculatorForm @submit="onsubmit" @reset="onreset"></calculatorForm>
    <calculatorTable :visible.sync="visible" :data="data"></calculatorTable>
  </div>
</template>

<script>
import calculatorForm from '@/views/product/calculator/module/calculatorForm'
import calculatorTable from '@/views/product/calculator/module/calculatorTable'

export default {
  components: {
    calculatorForm,
    calculatorTable
  },
  data() {
    return {
      data: {},
      visible: false
    }
  },
  methods: {
    onsubmit(data) {
      this.data = data
      this.visible = true
    },
    onreset(data) {
      this.data = data
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
.product-calculator.app-container {
  font-size: 14px;
  color: #636C78;
  .title {
    font-size: 14px;
    color: #333333;
  }
  .content {
    overflow: auto;
  }
}
</style>
