<template>
  <section class="app-container page-height design-index flex-column">
    <EHeader :query="query" :sup_this="sup_this" />
    <div v-loading="tableLoading">
      <el-row :gutter="15">
        <el-col :span="1" :key="index" v-for="(item, index) in data">
          <ProtoCard
            :sup_this="sup_this"
            :data="item"
            @linkToDetail="linkToDetail"
            @successInfo="successInfo"
          />
        </el-col>
      </el-row>
    </div>
    <PaginationBar
      ref="paginationBar"
      @refreshTableEventFun="refreshTableEventFun"
      :total="total"
      :fSize="resetSizes"
    />
    <message v-show="isSuccess" ref="messageRef" class="messageStyle"></message>
  </section>
</template>

<script>
import ProtoCard from './module/protoCard'
import EHeader from './module/header'
import { initDataMixin } from '@/mixins'
import { mapGetters, mapMutations } from 'vuex'
import message from './module/info/message.vue'
export default {
  name: 'prototypeList',
  mixins: [initDataMixin],
  components: {
    ProtoCard,
    EHeader,
    message
  },
  data() {
    return {
      sup_this: this,
      query: {},
      resetSizes: [14, 28, 42, 56],
      size: 14,
      url: '/api/prim_prod/selling_prim_product/',
      tableLoading: false,
      initBool: false,
      isSuccess: false
    }
  },
  computed: {
    ...mapGetters(['categoryQuery', 'permission_routers', 'curRouterPid']),
    curRoutes() {
      const routes = Array.isArray(this.permission_routers)
        ? this.permission_routers
        : []
      return routes.find(({ id }) => id == this.curRouterPid)
    }
  },
  watch: {
    categoryQuery: {
      handler(newVal) {
        if (!newVal) return
        this.url = `/api/prim_prod/selling_prim_product/`
        if (newVal !== 'all') this.url += `?category=${newVal}`
        if (this.curRoutes.name !== '业务端-在线定制') return
        this.searchChange()
      },
      immediate: true
    }
  },
  activated() {
    if (this.categoryQuery) {
      this.searchChange()
    }
  },
  methods: {
    ...mapMutations(['SET_PROTO_OBJ']),
    linkToDetail(item) {
      const { id } = item || {}
      this.SET_PROTO_OBJ(item)
      this.$router.push(`/design/detail?id=${id}`)
    },
    successInfo() {
      const _this = this
      this.isSuccess = true
      const cusBox = this.$refs.messageRef.$el
      cusBox.style.top = '10%'
      setTimeout(() => {
        console.log(1)
        _this.isSuccess = false
      }, 3000)
    }
  }
}
</script>

<style lang="scss">
.design-index.flex-column {
  overflow-y: auto;
  overflow-x: hidden;

  .el-col-1 {
    width: calc(100% / 7) !important;
  }
}
.messageStyle {
  position: fixed;
  top: -10%;
  left: 50%;
  transform: translateX(-50%);
  transition: all 1s;
}
</style>
