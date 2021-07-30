<template>
  <el-popover placement="bottom" width="260" trigger="hover" :visible-arrow="false">
    <!-- <el-button slot="reference">click 激活</el-button> -->
    <el-avatar
      :src="avatar || require('@/assets/images/avatar.png')"
      @click.native="linkToPersonalCenter"
      slot="reference"
    ></el-avatar>
    <div class="personHeader">
      <el-avatar :src="avatar || require('@/assets/images/avatar.png')"></el-avatar>
      <span class="personName">用户: {{ name }}</span>
    </div>
    <div class="personBody">
      <div class="account">
        <div class="accountTitle flexItem1">账户管理</div>
        <div class="accountNews flex">
          <span
            type="text"
            v-for="{ prop, url } in personProp.slice(0, 4)"
            @click="goToUrl(url, prop)"
            :class="{ spanColor: url == routerUrl }"
            :key="prop"
            >{{ prop }}</span
          >
        </div>
      </div>
      <div class="line"></div>
      <div class="root">
        <div class="rootTitle flexItem1">权限管理</div>
        <div class="rootNews flex">
          <span
            type="text"
            v-for="{ prop, url } in personProp.slice(4, 6)"
            @click="goToUrl(url)"
            :class="{ spanColor: url == routerUrl }"
            :key="prop"
            >{{ prop }}</span
          >
        </div>
      </div>
    </div>
    <div class="personFoot">
      <div class="line"></div>
      <div @click="logOut" class="log-out">退出登录</div>
    </div>
  </el-popover>
</template>

<script>
import { PERSONAL_CENTER_NAME } from '@/utils/constant'
import { mapGetters, mapMutations } from 'vuex'
import { personProp } from '../personProp'
export default {
  data() {
    return {
      personProp,
      routerUrl: ''
    }
  },

  watch: {
    $route: {
      handler(newVal) {
        this.routerUrl = newVal.fullPath
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['permission_routers', 'avatar', 'name'])
  },
  methods: {
    ...mapMutations(['SET_CUR_ROUTER_PID']),

    linkToPersonalCenter() {
      const personalCenterId = (this.permission_routers.filter(({ name }) => name == PERSONAL_CENTER_NAME)[0] || {}).id
      console.log('personalCenterId', personalCenterId)
      if (!personalCenterId) return
      this.$router.push('/personalCenter')
      this.SET_CUR_ROUTER_PID(personalCenterId)
    },
    logOut() {
      this.$store.dispatch('LogOut')
    },
    goToUrl(url) {
      this.$router.push(url)
    }
  }
}
</script>

<style></style>
