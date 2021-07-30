<template>
  <div v-if="!item.hidden && item.children" class="menu-wrapper">
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        item.children &&
        item.children.filter(({ hidden }) => !hidden).length === 1
      "
    >
      <template v-if="onlyOneChild.children && onlyOneChild.children.filter(({ hidden }) => !hidden).length == 0">
        <app-link :to="resolvePath(onlyOneChild.path)">
          <el-menu-item
            :index="resolvePath(onlyOneChild.path)"
            :class="{
              'submenu-title-noDropdown': !isNest,
              'menu-hidden-is-active': onlyOneChild.id === activeId
            }"
          >
            <item
              v-if="onlyOneChild.meta"
              :icon="onlyOneChild.meta.icon || item.meta.icon"
              :title="onlyOneChild.meta.title"
            />
          </el-menu-item>
        </app-link>
      </template>

      <sidebar-item
        v-else
        :is-nest="true"
        :item="onlyOneChild"
        :key="onlyOneChild.path"
        :base-path="resolvePath(onlyOneChild.path)"
        class="nest-menu"
        :class="[onlyOneChild.id === activeId && 'menu-hidden-is-active']"
      />
    </template>
    <template v-else-if="!item.pid">
      <template v-for="child in item.children" v-if="!child.hidden">
        <sidebar-item
          v-if="child.children && child.children.length > 0"
          :is-nest="true"
          :item="child"
          :key="child.path"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
        <app-link v-else :to="resolvePath(child.path)" :key="child.name">
          <el-menu-item
            :class="{
              'menu-hidden-is-active': child.id === activeId,
              'is-last': child.isLast
            }"
            :index="resolvePath(child.path)"
          >
            <item v-if="child.meta" :icon="child.meta.icon" :title="title(child)" />
          </el-menu-item>
        </app-link>
      </template>
    </template>
    <template v-else-if="item.children && item.children.filter(({ hidden }) => !hidden).length === 0"></template>
    <el-submenu v-else ref="submenu" :index="resolvePath(item.path)">
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta.icon" :title="item.meta.title" />
      </template>

      <template v-for="child in item.children" v-if="!child.hidden">
        <sidebar-item
          v-if="child.children && child.children.length > 0"
          :is-nest="true"
          :item="child"
          :key="child.path"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />

        <app-link v-else :to="resolvePath(child.path)" :key="child.name">
          <el-menu-item
            :class="{
              'menu-hidden-is-active': child.id === activeId,
              'is-last': child.isLast
            }"
            :index="resolvePath(child.path)"
          >
            <item v-if="child.meta" :icon="child.meta.icon" :title="title(child)" />
          </el-menu-item>
        </app-link>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import path from 'path'
import { debounce, isExternal } from '@/utils'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'
import { getOrderStatusStatistics } from '@/api/order'
import { ORDER_STATUS_ROUTE_LIST } from '@/utils/constant'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: null,
      logo: '',
      activeId: null
    }
  },
  computed: {
    // ...mapGetters([
    //   'sidebar'
    // ])
    ...mapState({
      orderStatusStatistics(state) {
        let orderCount = state.bus.orderCount
        let tempObj = {}
        for (const key in ORDER_STATUS_ROUTE_LIST) {
          let tempArr = ORDER_STATUS_ROUTE_LIST[key]
          if (key === 'allOrder') continue
          tempObj[key] = tempArr.reduce((total, curVal) => {
            total += orderCount[curVal]
            return total
          }, 0)
        }
        return tempObj
      }
    }),
    title({ orderStatusStatistics, isOrderPage }) {
      return (view) => {
        let count = orderStatusStatistics[view.path]
        if (isOrderPage && /^\d+$/.test(count)) {
          return `${view.meta.title} ${count}`
        }
        return view.meta.title
      }
    }
  },
  // mounted: function() {
  //   this.initLogo()
  // },
  watch: {
    $route: {
      handler(newVal) {
        this.showHiddenMenuActive(newVal)

        this.isOrderPage = newVal.path.includes('order')
        if (this.isOrderPage) {
          // 订单状态改变，订单统计重新请求
          this.$store.dispatch('GetOrderCount')
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    showHiddenMenuActive(data) {
      this.activeId = null
      try {
        const { meta: { hidden, activeId } = {} } = data
        if (hidden) {
          this.activeId = activeId
        }
      } catch (err) {
        return false
      }
    },
    hasOneShowingChild(children, parent) {
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item

          return true
        }
      })
      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        this.onlyOneChild.noShowingChildren = true
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true }
        return true
      }

      return false
    },
    resolvePath(routePath) {
      if (this.isExternalLink(routePath)) {
        return routePath
      }
      return path.resolve(this.basePath, routePath)
    },
    isExternalLink(routePath) {
      return isExternal(routePath)
    },
    getOrderStatusStatistics: debounce(async function () {
      let [err, res] = await awaitWrap(getOrderStatusStatistics())
      if (res && $SUC(res)) {
        let { orderStatusStatistics } = this
        let tempObj = {}
        res.detail.orderStatusListMap.forEach((item) => {
          tempObj[item.orderStatus] = item.count
        })
        for (const key in ORDER_STATUS_ROUTE_LIST) {
          let tempArr = ORDER_STATUS_ROUTE_LIST[key]
          this.$set(
            orderStatusStatistics,
            key,
            tempArr.reduce((total, curVal) => {
              total += tempObj[curVal]
              return total
            }, 0)
          )
        }
      }
    })
    // initLogo() {
    //   if (this.sidebar.opened) {
    //     this.logo = require('../../../../assets/logo/logo1.png')
    //   } else {
    //     this.logo = require('../../../../assets/logo/logo2.png')
    //   }
    // }
  }
}
</script>
<style lang="scss" scoped>
.menu-hidden-is-active,
.is-active {
  color: #3841db !important;
}
.el-menu-item:focus,
.el-menu-item:hover,
.el-menu-item.is-active {
  background-color: #f0f6ff;
}
.el-menu-item.is-last {
  border-bottom: 1px solid #dcdee0;
}
</style>
