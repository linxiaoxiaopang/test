<template>
  <div class="sharedPicLibraryComponent">
    <CateAndSearch
      :sup_this="sup_this"
      :query="query"
      searchKey="title"
      componentName="ImageTypeTreeSelect"
    />
    <div
      class="loading-wrapper"
      v-loading="tableLoading"
      v-if="tableLoading"
    ></div>
    <div class="row-wrapper">
      <InfiniteScroll
        :data="data"
        :total="total"
        @load="load"
        v-if="total"
        @scroll.native="onScroll"
      >
        <template
          v-slot="{ data: { title, path, thumbnail_path, id, width, height } }"
        >
          <AutoImg
            @click="
              themeClckHandler({ thumbnail_path, path, id, width, height })
            "
            :active="active(id)"
            fit="contain"
            crossOrigin="Anonymous"
            :src="thumbnail_path || path"
          ></AutoImg>
        </template>
      </InfiniteScroll>
      <Empty v-else> 暂无共享图片 </Empty>
    </div>
  </div>
</template>

<script>
import CateAndSearch from '../cateAndSearch'
import InfiniteScroll from '@/components/infiniteScroll'
import { initDataMixin } from '@/mixins'
import { fabricInstanceMixin } from '../../mixins'
import { createRandomNum } from '@/utils'

export default {
  inject: ['canvasModifiedHandler'],
  mixins: [initDataMixin, fabricInstanceMixin],
  components: {
    InfiniteScroll,
    CateAndSearch
  },
  data() {
    return {
      sup_this: this,
      size: 15,
      tableLoading: false,
      url: '/api/image/public_image/',
      infiniteScroll: true
    }
  },
  computed: {
    active() {
      return (id) => {
        if (this.instance) {
          const objects = this.instance.getObjects()
          const oIds = objects.map(({ id }) => {
            if (!id) return null
            return id.split('_').slice(-1)[0]
          })
          return oIds.includes(id + '')
        }
        return false
      }
    }
  },
  methods: {
    themeClckHandler({ thumbnail_path, path, id, width, height }) {
      this.instance.createImage(thumbnail_path, {
        id: `${createRandomNum()}@${width}@${height}@_${id}`
      })
      this.$nextTick(() => {
        this.canvasModifiedHandler()
      })
    },

    load() {
      this.page++
      this.init()
    },
    onScroll(e) {
      this.el = e
      this.top = e.target.scrollTop
      this.top > 0 ? (this.gotop = true) : (this.gotop = false)
    }
  }
}
</script>

<style lang="scss" scoped>
.sharedPicLibraryComponent {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px 10px;
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
    margin-top: 10px;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>
