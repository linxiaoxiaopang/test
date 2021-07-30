<template>
  <div :class="{ 'is-product-page': isProductPage }">
    <CategoryType
      @nodeClickHandler="nodeClickHandler"
      :data="data"
      class="sidebar-container"
      v-loading="loading"
      :key="$route.path"
    >
      <div v-if="isProductPage">
        <div class="title my-product">
          <svg-icon
            :icon-class="myProductRoute ? myProductRoute.meta.icon : ''"
          />
          {{ myProductRoute ? myProductRoute.meta.title : '' }}
        </div>
      </div>
      <template #footer v-if="isProductPage">
        <el-menu>
          <el-menu-item
            class="other-item"
            v-for="item in filterCurRoutes"
            :key="item.id"
            @click="toOtherPage(item.path)"
          >
            <svg-icon :icon-class="item.meta.icon" />
            {{ item.meta.title }}
          </el-menu-item>
        </el-menu>
      </template>
    </CategoryType>
  </div>
</template>

<script>
import CategoryType from '@/components/categoryType'
// import { list } from "@/api/product/proCateApi";
import { mapMutations, mapGetters } from 'vuex'
import { deepClone } from '@/components/avue/utils/util'
import SidebarItem from '@/views/layout/components/Sidebar/SidebarItem'
import cloneDeep from 'lodash/cloneDeep'
export default {
  components: {
    CategoryType,
    SidebarItem
  },
  data() {
    return {
      data: [],
      loading: true
    }
  },
  created() {
    this.init()
  },
  computed: {
    ...mapGetters(['permission_routers', 'curRouterPid']),
    isProductPage() {
      return this.curRoutes.name === '业务端-我的产品'
    },
    curRoutes() {
      const routes = Array.isArray(this.permission_routers)
        ? this.permission_routers
        : []
      return routes.find(({ id }) => id == this.curRouterPid)
    },
    filterCurRoutes() {
      if (this.isProductPage) {
        const curRoutes = cloneDeep(this.curRoutes)
        return curRoutes.children.filter(
          (item) => !item.hidden && item.id !== this.myProductRoute.id
        )
      }
      return []
    },
    myProductRoute() {
      let myProductRoute = null
      this.curRoutes.children.map((item) => {
        if (item.name === '业务端-产品列表') {
          myProductRoute = item
        }
      })
      return myProductRoute
    }
  },
  methods: {
    ...mapMutations(['SET_CATEGORY']),
    nodeClickHandler({ id, children = [] }) {
      // if (children.length > 0) return
      this.SET_CATEGORY(id)
    },
    async init() {
      this.loading = true
      try {
        // const { detail = [] } = await list();
        const detail = deepClone(
          await this.$store.dispatch('GetDic', 'proCategory')
        )
        detail.unshift({
          children: [],
          id: 'all',
          name: '全部分类'
        })
        this.data = detail
        this.SET_CATEGORY(detail[0].id)
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    toOtherPage(path) {
      this.$router.push(`${this.curRoutes.path}/${path}`)
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  display: block;
  height: 50px;
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.is-product-page ::v-deep {
  .el-menu {
    height: 200px !important;
  }
}
</style>
