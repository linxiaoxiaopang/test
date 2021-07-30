<template>
  <div>
    <top />
    <banner />
    <tab />
    <step />
    <product />
    <design />
    <store />
    <support />
    <bottom />
  </div>
</template>

<script>
import top from '../topic/moudules/header'
import banner from '../topic/moudules/banner'
import step from '../topic/moudules/step'
import product from '../topic/moudules/product'
import design from '../topic/moudules/design'
import tab from '../topic/moudules/tab'
import store from '../topic/moudules/store'
import support from '../topic/moudules/support'
import bottom from '../topic/moudules/bottom'

export default {
  components: {
    top,
    banner,
    step,
    product,
    design,
    tab,
    store,
    support,
    bottom
  }
}
</script>

<style lang="scss" scoped></style>
