<template>
  <div class="priceTableBox">
    <table class="priceTable" v-if="priceData.length">
      <tr class="priceColor">
        <td rowspan="2" class="firstTd">{{ "￥" + priceData[0].price }}</td>
        <td class="fontColor">价格</td>
        <td v-for="({ price },index) in priceData" :key="index">{{ "￥" + price }}</td>
      </tr>
      <tr>
        <td class="fontColor">起批量</td>
        <td v-for="({ batch },index) in priceData" :key="index">{{ batch }}</td>
      </tr>
    </table>
    <div v-else class="tips">暂无价格</div>
  </div>
</template>

<script>
export default {
  props: {
    priceData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
    
    };
  },
  components: {},
};
</script>

<style scoped lang="scss">
.priceTableBox {
  .priceTable {
    width: 100%;
    height: 60px;
    border: 1px solid #ddd;
    border-collapse: collapse;
    background-color: #f4f5f9;
    border-radius: 5px;
    .priceColor {
      td {
        color: #f43131;
      }
      .firstTd {
        color: #f43131;
        font-size: 18px;
        width: 90px;
      }
      .fontColor {
        color: #636c78;
      }
    }

    tr td {
      border: 1px solid #ddd;
      align-content: center;
      text-align: center;
      color: #636c78;
      font-size: 14px;
    }
  }
  .tips {
    font-size: 20px;
    color: red;
    font-weight: 600;
  }
}
</style>
