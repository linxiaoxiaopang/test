<template>
  <header class="layoutHeader">
    <div class="head-logo">
      <el-image fit="contain" :src="require('@/assets/images/white_logo.png')"></el-image>
    </div>
    <ul class="navs">
      <li
        v-for="{ id, pid, meta: { title: name } = {}, path } in navsRoutes"
        :class="['item', id == curRouterPid && 'active']"
        :key="id"
        @click="toggeleRouterId(id, pid)"
      >
        <router-link class="link" :to="path">
          <p>{{ name }}</p>
        </router-link>
      </li>
    </ul>
    <!-- <SearchBox
      :keyword.sync="search"
      placeholder="尝试“T恤”"
      style="margin-right: 30px"
    /> -->
    <div class="design-btn" @click="toDesignPage">
      <el-image :src="require('@/assets/images/design.png')"></el-image>
      创建设计
    </div>
    <!-- <span class="icon-wrapper">
      <i class="fa fa-question-circle-o" aria-hidden="true"></i>
    </span> -->
    <!-- <span class="icon-wrapper">
      <span class="dot"></span>
      <i class="el-icon-shopping-cart-1"></i>
    </span>
    <span class="icon-wrapper">
      <span class="dot"></span>
      <i class="fa fa-bell-o" aria-hidden="true"></i>
    </span> -->
    <avatar />
  </header>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { PERSONAL_CENTER_NAME, NAV_DESIGN_NAME, MENUS_NAME } from '@/utils/constant'

import Avatar from './avatar'

export default {
  data() {
    return {
      PERSONAL_CENTER_NAME,
      search: '',
      routerUrl: ''
    }
  },
  components: {
    Avatar
  },
  watch: {
    $route: {
      handler(newVal) {
        this.routerUrl = newVal.fullPath
        const { matched: [{ path: pPath }] = [{}] } = newVal
        const routers = this.permission_routers
        //第一个路由重置为首页路由，path 未 '/'或''
        if (pPath === '' || pPath === '/') {
          const fitersRoutes = routers.filter(
            ({ hidden, name }) => !hidden && name != PERSONAL_CENTER_NAME
          )

          return this.toggeleRouterId(fitersRoutes[0].id)
        }
        if (!pPath) return
        const curPRoute = routers.filter(({ path }) => {
          return path === pPath
        })
        curPRoute[0] && this.toggeleRouterId(curPRoute[0].id)
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['permission_routers', 'curRouterPid']),
    navsRoutes() {
      console.log('permission_routers', this.permission_routers)
      const hiddenNames = [PERSONAL_CENTER_NAME, NAV_DESIGN_NAME, MENUS_NAME]
      return this.permission_routers.filter(
        ({ hidden, name }) => !hidden && !hiddenNames.includes(name)
      )
    }
  },
  created() {
    this.toggeleRouterId(this.curRouterPid)
  },
  methods: {
    ...mapMutations(['SET_CUR_ROUTER_PID']),
    toDesignPage() {
      this.$router.push('/design/index')
    },
    toggeleRouterId(id) {
      this.SET_CUR_ROUTER_PID(id)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.el-popover {
  box-shadow: 0px 3px 10px 0px rgba(47, 72, 124, 0.14);
  border-radius: 4px;
  padding: 0;
  border: none;
  .add-product {
    margin-top: 22px;
    margin-right: 22px;
  }
}
.layoutHeader.layoutHeader {
  display: flex;
  min-width: $w-size;
  width: 100vw;
  height: 72px;
  padding: 0 40px;
  background: #171e95;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  margin-bottom: 10px;
  .head-logo {
    width: 116px;
    height: 27px;
    display: flex;
    margin-right: 64px;
    align-items: center;
    white-space: nowrap;
    .el-image {
      width: 100%;
      height: 100%;
    }
    h5 {
      margin-left: 10px;
      color: #fff;
      padding: 0;
    }
  }
  .navs {
    display: flex;
    align-items: center;
    flex: 1;

    .item {
      text-align: center;
      line-height: 60px;
      width: 80px;
      position: relative;
      font-size: 14px;
      color: rgba($color: #fff, $alpha: 0.5);
      white-space: nowrap;
    }
    .item.active {
      color: #fff;
      .link p {
        content: '';
        position: absolute;
        line-height: 40px;
        height: 40px;
        width: 80px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        border-radius: 2px;
        background: rgba($color: #232ba7, $alpha: 0.7);
      }
    }
  }
  .icon-wrapper {
    position: relative;
    .dot {
      position: absolute;
      top: -3px;
      right: 11px;
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: $color-warning;
    }
    i {
      display: inline-block;
      font-size: 20px;
      margin: 0 10px;
      color: $color-gray;
    }
  }
  .design-btn {
    font-size: 18px;
    margin-right: 20px;
    padding: 0px 10px;
    height: 36px;
    line-height: 36px;
    color: $color-primary;
    background: #fff;
    font-weight: 600;
    border-radius: 4px;
    font-weight: 400;
    cursor: pointer;
    .el-image {
      position: relative;
      top: 2px;
      margin-right: 5px;
      width: 15px;
      height: 15px;
    }
  }
  .el-avatar {
    width: 36px;
    height: 36px;
    border: 1px solid $border-color;
    border-radius: 50%;
    background: $bg-color;
    cursor: pointer;
  }
}
.personBody {
  margin-left: 20px;
  .line {
    margin-left: -20px;
    border: 1px solid #f0f2f5;
    margin-bottom: 21px;
  }
}
.personHeader {
  background-color: #3841db;
  color: #fff;
  display: flex;
  align-items: center;
  margin-bottom: 19px;
  height: 59px;
  .personName {
    margin-left: 14px;
  }
  .el-avatar {
    margin-left: 8px;
  }
}

.personFoot {
  .line {
    border: 1px solid #f0f2f5;
  }
  .log-out {
    text-align: center;
    cursor: pointer;
    height: 43px;
    line-height: 43px;
  }
}
.flex {
  display: flex;
  flex-wrap: wrap;
  span {
    display: inline-block;

    padding: 0 10px;
    color: #495060;
    margin-bottom: 10px;
    cursor: pointer;
    height: 33px;
    line-height: 33px;
    font-size: 14px;
    &:hover {
      color: #495060;
      background: rgb(237, 238, 252);
    }
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
}
.flexItem1 {
  padding: 0 0 0 10px;
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 10px;
}
.spanColor.spanColor.spanColor {
  color: blue;
}
</style>
