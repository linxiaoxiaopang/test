<template>
  <keep-alive :include="cachedViews">
    <!-- key是为了有路由参数时可以更新缓存页面 -->
    <!-- 以及从其他页面进入maintain的子路由时，可以加载路由所在的组件，而不是加载上次离开maintain时的子路由组件 -->
    <router-view :key="key" />
  </keep-alive>
</template>
<script>
export default {
  name: 'maintain',
  data() {
    return {
      key: '',
      // 是否离开缓存组件maintain（为了控制key值更新时机）
      deactivated: false
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    }
  },
  watch: {
    $route: {
      handler() {
        // 只有当前路由为orderManage的子路由才会更新key值
        // 防止在其他路由时，更新key值（离开缓存组件orderManage时，该$route watcher仍然会执行监听）
        // 在其他路由更新key会使离开时的子路由组件重新加载
        if (this.$route.matched[1]?.components.default.name === 'orderManage') {
          let key = this.$route.fullPath
          if (this.$route.matched.length > 3) {
            key = this.$route.matched[2].path
          }
          if (this.deactivated) {
            // 进入这里说明路由是从其他路由进入orderManage子路由，延迟更新key
            // 防止orderManage子路由加载的组件不更新，直接调用上次离开orderManage组件时的子路由组件
            // 在orderManage组件复用后，更新key
            this.$once('hook:activated', function () {
              this.key = key
              this.deactivated = false
            })
          } else {
            // 进入这里说明路由是在orderManage子路由之间跳转，直接更新key
            this.key = key
          }
        }
      },
      // 进入orderManage组件时$route watcher立即执行一次
      immediate: true,
      deep: true
    }
  },
  deactivated() {
    // 离开缓存组件orderManage时，deactivated设置为true
    this.deactivated = true
  }
}
</script>
