<template>
  <div class="app-wrapper">
    <LayoutHeader />
    <div class="app-main-content">
      <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
      <div v-show="hiddenSidebar">
        <sidebar class="sidebar-container" v-if="changeSidebar" />
        <ProCate v-show="!changeSidebar" />
      </div>

      <div :class="['main-container', !hiddenSidebar && 'full-container']">
        <!-- <navbar /> -->
        <!-- <tags-view/> -->
        <app-main />
        <back-to-top
          :custom-style="myBackToTopStyle"
          :visibility-height="300"
          :back-position="50"
          transition-name="fade"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import LayoutHeader from './components/LayoutHeader/index'
import ResizeMixin from './mixin/ResizeHandler'
import BackToTop from '@/components/BackToTop'
import ProCate from '@/components/proCate'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    ProCate,
    AppMain,
    TagsView,
    BackToTop,
    LayoutHeader
  },
  mixins: [ResizeMixin],
  data() {
    return {
      myBackToTopStyle: {
        right: '4px',
        bottom: '20px',
        width: '35px',
        height: '35px',
        'border-radius': '4px',
        'line-height': '35px', // 请保持与高度一致以垂直居中 Please keep consistent with height to center vertically
        background: '#e7eaf1' // 按钮的背景颜色 The background color of the button
      }
    }
  },
  computed: {
    changeSidebar() {
      const changeRoutes = ['/design/index', '/product/private']
      return !changeRoutes.includes(this.$route.fullPath)
    },
    hiddenSidebar() {
      const routeNames = ['业务端-原型详情']
      return !routeNames.includes(this.$route.name)
    },
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '~@/styles/mixin.scss';
.app-wrapper {
  @include clearfix;
  position: relative;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  overflow: hidden;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
  .app-main-content {
    height: calc(100vh - 90px);
    overflow-y: auto;
  }
}
.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>
