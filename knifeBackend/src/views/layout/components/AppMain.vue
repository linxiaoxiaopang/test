<template>
  <section class="app-main">
    <transition :name="animationName" mode="out-in">
      <keep-alive :include="cachedViews" :max="8">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews.concat(['protoManage', 'formwork'])
      // return ['protoManage']
    },
    key({ $route }) {
      // 设置key为$route.fullPath是为了在路由参数变化时更新组件而不是直接复用缓存的组件
      let key = $route.fullPath
      // 当前路由为多层级路由时，设置key为$route.matched[1].path
      if ($route.matched.length > 2) {
        return $route.matched[1].path
      }
      return key
    }
  },
  data() {
    return {
      animationName: 'fade-transform'
    }
  },
  watch: {
    $route() {
      this.addViewTags()
    }
  },
  mounted() {
    this.addViewTags()
  },
  methods: {
    addViewTags() {
      const { name } = this.$route
      if (name) {
        this.$store.dispatch('addView', this.$route)
      }
      return false
    }
  }
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
