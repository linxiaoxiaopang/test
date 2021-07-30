<template>
  <div class="baseListComponent">
    <CateAndSearch :sup_this="sup_this" :query="query" searchKey="prod_info" />
    <div
      class="loading-wrapper"
      v-loading="tableLoading"
      v-if="tableLoading"
    ></div>
    <div class="row-wrapper">
      <InfiniteScroll
        v-if="data.length"
        :data="data"
        :total="total"
        @load="load"
      >
        <template v-slot="{ data }">
          <AutoImg
            @click="toggleDesign(data)"
            fit="contain"
            :active="active(data)"
            :src="cover(data)"
          ></AutoImg>
        </template>
      </InfiniteScroll>
      <Empty v-if="data.length == 0">
        <span> 暂无产品 </span>
      </Empty>
    </div>
  </div>
</template>

<script>
import InfiniteScroll from '@/components/infiniteScroll'
import CateAndSearch from '../../../cateAndSearch'
import { initDataMixin } from '@/mixins'

export default {
  inject: ['resetData'],
  mixins: [initDataMixin],
  props: {
    resetUrl: {
      type: String,
      required: true
    }
  },
  components: {
    CateAndSearch,
    InfiniteScroll
  },
  data() {
    return {
      sup_this: this,
      size: 15,
      tableLoading: false,
      url: this.resetUrl,
      infiniteScroll: true
    }
  },
  computed: {
    cover() {
      return (data) => {
        try {
          const { prim_struct = [] } = data
          const { figures } = prim_struct[0]
          return figures[0].path || require('@/assets/images/default.png')
        } catch (err) {
          return require('@/assets/images/default.png')
        }
      }
    },
    active() {
      return ({ id }) => {
        return id == this.$route.query.protoId
      }
    }
  },
  methods: {
    load() {
      this.page++
      this.init()
    },
    toggleDesign(item) {
      const { base_sizes } = item
      const id = this.$route.query.id
      if (!id) return
      try {
        if (base_sizes[0] == id) {
          this.$message.warning('当前产品已被选中！')
          return
        }
        this.$router.replace(
          `/design/designContainer?id=${base_sizes[0]}&protoId=${item.id}`
        )
        this.resetData()
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.baseListComponent {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px 10px;
  padding-top: 0;
  height: 100%;
  padding-bottom: 0;
  box-sizing: border-box;
  .loading-wrapper {
    position: absolute;
    height: 50px;
    top: 300px;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    z-index: 1000;
  }
  .row-wrapper {
    position: relative;
    margin-top: 10px;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 10px;
  }

  .el-image {
    width: 100%;
    height: 100%;
    background: #f8fafc;
    border: 1px solid $border-color;
  }
}
</style>
