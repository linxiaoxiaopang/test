<template>
  <section class="app-main">
    <transition :name="animationName" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key"/>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      // return this.$store.state.tagsView.cachedViews.concat(['knifeBaseInfo'])
      return ['prototypeList']
    },
    key() {
      return this.$route.fullPath
    }
  },
  data() {
    return {
      animationName: 'fade-transform'
    }
  },
}
</script>

<style scoped>
  .app-main {
    /*84 = navbar + tags-view = 50 +34 */
    min-height: calc(100vh - 84px);
    width: 100%;
    position: relative;
    overflow: hidden;
  }
</style>

