<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="false"
      mode="vertical"
      text-color="#495060"
      active-text-color="#495060"
    >
      <sidebar-item
        v-for="route in curRoutes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import { menuGroups } from '../personProp'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(["permission_routers", "curRouterPid"]),
    curRoutes() {
      let routes = Array.isArray(this.permission_routers)
        ? this.permission_routers
        : []
      routes = routes.filter(({ id }) => id == this.curRouterPid)
      
      routes.forEach(route => {
        let menuGroup = menuGroups[route.path]
        if (menuGroup) {
          let tempArr = []
          route.children = route.children.filter(childRoute => {
            let groupIndex = menuGroup[childRoute.path]
            if (groupIndex > -1) {
              if (!tempArr[groupIndex]) tempArr[groupIndex] = []
              tempArr[groupIndex].push(childRoute)
              return false
            }
            return true
          })
          route.children =
            tempArr
              .filter(group => group)
              .reduce((prev, next) => {
                next[next.length - 1].isLast = true
                prev = prev.concat(next)
                return prev
              }, [])
              .concat(route.children)
        }
      })
      
      return routes
    },
  },
};
</script>
