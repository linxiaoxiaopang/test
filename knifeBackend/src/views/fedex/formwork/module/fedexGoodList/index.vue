<template>
  <div class="fedex-good-list-component">
    <div :key="index" v-for="(val, key, index) in data">
      <FedexGoodDetail :isBatch="true" :resetData="val" :countryName="key" />
    </div>
  </div>
</template>

<script>
import FedexGoodDetail from '../fedexGoodDetail'
export default {
  components: {
    FedexGoodDetail
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.fedex-good-list-component {
}
</style>
