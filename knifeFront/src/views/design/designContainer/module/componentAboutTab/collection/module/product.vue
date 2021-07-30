<template>
  <baseList :resetUrl="resetUrl" />
</template>

<script>
import BaseList from './baseList'
export default {
  components: {
    BaseList
  },
  data () {
    return {
      resetUrl: '/api/prim_prod/selling_prim_product/'
    }
  }
}
</script>

<style>

</style>