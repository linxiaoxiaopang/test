<template>
  <div class="uploadDesignPicComponent" @mousemove.prevent>
    <div class="add-pic-btn-wrapper" v-if="!fileList.length">
      <FileUpload
        class="fileUpload-wrapper"
        list-type="text"
        accept="image/jpeg, image/png, image/jpg"
        @updateFiles="picsReadyHandler"
      >
        <el-button type="primary" size="mini" class="upload-button">上传本地图片</el-button>
      </FileUpload>
      <p class="tip">小于20M的图片（jpge、jpg、png、gif)</p>
    </div>

    <div class="upload-wrapper" v-show="fileList.length" v-loading="fileListLoading">
      <Scroll :scrollX="true" :data="fileList">
        <div class="wrapper">
          <Progress
            v-loading="row.loading"
            class="progress"
            v-for="(row, index) in fileList"
            :commonStyle="{ display: 'inline-block' }"
            :key="index"
            :percentage="row.exist ? 100 : percentage(row)"
            :status="row.exist ? 'warning' : undefined"
          >
            <div class="img-wrapper" :key="index">
              <CacheImg :raw="row.raw" />
              <!-- <el-image fit="contain" :src="row.raw | getSrc"></el-image> -->
              <div class="name">{{ row.name }}</div>
            </div>
            <div class="exist" v-if="row.exist">已存在</div>
            <div class="error" v-else-if="row.success === false">失败</div>
          </Progress>
        </div>
        <div class="clear-btn" v-if="clearStatus" @click="clear">清空</div>
      </Scroll>
    </div>

    <CateAndSearch searchKey="find_uploads" :sup_this="sup_this" :query="query" componentName="ImageTypeTreeSelect" />
    <div class="loading-wrapper" v-loading="tableLoading" v-if="tableLoading"></div>
    <div class="row-wrapper" ref="rowBox">
      <el-image
        :src="src"
        @mouseout="onMouseOut"
        @mouseover="onMouseOver"
        @click="handleIconClicked"
        v-if="gotop"
        ref="topIcon"
        style="position: absolute; z-index: 99999; right: 12px; bottom: 40px"
      ></el-image>
      <InfiniteScroll :data="data" :total="total" @load="load" v-if="total" @scroll.native="onScroll">
        <template v-slot="{ data: { title, path, thumbnail_path, id, width, height } }">
          <!-- <AutoImg
            @click="
              themeClckHandler({ thumbnail_path, path, id, width, height })
            "
            :active="active(id)"
            fit="contain"
            crossOrigin="Anonymous"
            :src="thumbnail_path || path"
          ></AutoImg>-->

          <AutoImg
            @click="themeClckHandler({ thumbnail_path, path, id, width, height })"
            :active="active(id)"
            fit="contain"
            crossorigin="Anonymous"
            :src="isPro ? `${thumbnail_path}` : path + COMPRESS_ORIGIN_MAX_LONG_STR"
          ></AutoImg>

          <!-- <AutoImg
            @click="
              themeClckHandler({ thumbnail_path, path, id, width, height })
            "
            :active="active(id)"
            fit="contain"
            crossOrigin="Anonymous"
            :src="path"
          ></AutoImg>-->
        </template>
      </InfiniteScroll>
      <Empty v-else />
    </div>
  </div>
</template>

<script>
import CateAndSearch from '../cateAndSearch'
import Scroll from '@/components/scroll'
import InfiniteScroll from '@/components/infiniteScroll'
import CacheImg from '@/components/cacheImg'
import Progress from '@/components/progress'
import FileUpload from '@/components/fileUpload/fileUploadBtn'

import { fabricInstanceMixin } from '../../mixins'
import { initDataMixin } from '@/mixins'
import { createRandomNum, compressFile, getPicName } from '@/utils'
import { COMPRESS_ORIGIN_MAX_LONG_STR } from '@/utils/constant'
import { check, add } from '@/api/image/imageApi'

export default {
  inject: ['canvasModifiedHandler'],
  mixins: [initDataMixin, fabricInstanceMixin],
  components: {
    CateAndSearch,
    Scroll,
    Progress,
    FileUpload,
    InfiniteScroll,
    CacheImg
  },
  data() {
    return {
      COMPRESS_ORIGIN_MAX_LONG_STR,
      el: null,
      top: 0,
      gotop: false,
      src: require('@/assets/images/top.png'),
      sup_this: this,
      tableLoading: false,
      size: 15,
      url: '/api/image/image/',
      dialogVisible: false,
      fileList: [],
      fileListLoading: false,
      infiniteScroll: true
    }
  },
  filters: {
    getSrc(raw) {
      return URL.createObjectURL(raw)
    }
  },
  computed: {
    isPro() {
      return process.env.VUE_APP_ENV_STAGE == 'pro'
    },

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
    },

    percentage() {
      return (row) => {
        return row.total && row.loaded && Number(((row.loaded / row.total) * 100).toFixed(2))
      }
    },
    clearStatus() {
      if (this.fileList.every(({ exist }) => exist)) {
        return true
      }
      const finish = this.fileList.every(({ loading, exist }) => {
        return loading === false || exist
      })
      if (finish) {
        return this.fileList.some(({ success, exist }) => {
          return success === false || exist
        })
      }
      return false
    },

    uploadPicsToCanvas({ data, newUploadPicNames = [] }) {
      return { data, newUploadPicNames }
    }
  },
  watch: {
    uploadPicsToCanvas: {
      handler(n) {
        let { data, newUploadPicNames } = n
        if (newUploadPicNames.length) {
          data.map((pic) => {
            let findIndex = newUploadPicNames.findIndex((name) => pic.title === name)
            if (findIndex > -1) {
              this.themeClckHandler(pic)
              newUploadPicNames.splice(findIndex, 1)
            }
          })
        }
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    load() {
      this.page++
      this.init()
    },

    resetInit() {
      this.page = 1
      this.init()
    },

    searchUploadPics(fileList) {
      if (!fileList.length) return
      const searchNames = fileList.map(({ name }) => getPicName(name))
      this.page = 1
      this.$set(this.query, 'find_uploads', searchNames.join(','))
      this.$set(this.query, 'category', null)
    },

    async picsReadyHandler(fileList) {
      this.newUploadPicNames = fileList.map(({ name }) => getPicName(name))
      try {
        fileList = fileList.map((raw) => {
          const { name, size, type } = raw
          const o = {
            raw,
            name,
            size,
            type
          }
          return o
        })
        this.fileList = fileList
        const success = await this.check(fileList)
        if (!success) {
          //搜索上传图片
          this.searchUploadPics(fileList.filter(({ exist }) => exist))
          return
        }

        const data = fileList.filter(({ exist }) => !exist)
        let allP = data.map((form) => {
          return this.proAdd(form)
        })
        const res = await Promise.all(allP)

        if (res.every((bool) => bool)) {
          if (!this.clearStatus) {
            this.fileList = []
          }
          this.resetInit()
          //存在已存在图片，搜索上传图片
          if (fileList.some(({ exist }) => exist)) {
            this.searchUploadPics(fileList)
          }
          return this.$message.success('上传处理成功')
        }
        this.resetInit()
        this.$message.warning('上传处理完成，部分图片处理失败，请核查。')
      } catch (err) {
        this.resetInit()
        console.log(err)
      }
    },

    themeClckHandler({ thumbnail_path, path, id, width, height }) {
      // this.instance.createImage(thumbnail_path, {
      //   id: `${createRandomNum()}@${width}@${height}@_${id}`
      // })

      this.instance.createImage(path + COMPRESS_ORIGIN_MAX_LONG_STR, {
        id: `${createRandomNum()}@${width}@${height}@_${id}`
      })

      // this.instance.createImage(path, {
      //   id: `${createRandomNum()}@${width}@${height}@_${id}`
      // })

      // this.instance.createImage(path + '?x-oss-process=image/format,webp', {
      //   id: `${createRandomNum()}@${width}@${height}@_${id}`
      // })
      this.$nextTick(() => {
        this.canvasModifiedHandler()
      })
    },
    async check(data) {
      this.fileListLoading = true
      const titles = data.map(({ name }) => getPicName(name))
      try {
        const { code, detail } = (await check({ titles })) || {}

        if ($SUC({ code })) {
          const thumP = []
          titles.map((title, index) => {
            if (detail.includes(title)) {
              this.$set(data[index], 'exist', true)
              thumP.push(false)
            } else {
              thumP.push(compressFile(data[index].raw))
            }
          })
          const thumData = await Promise.all(thumP)
          thumData.map((item, index) => {
            if (!item) return
            const { file, naturalWidth, naturalHeight } = item || {}
            if (!item) return
            this.$set(data[index], 'thumbnail_path', file)
            this.$set(data[index], 'width', naturalWidth)
            this.$set(data[index], 'height', naturalHeight)
          })
          if (detail.length >= data.length) {
            this.fileListLoading = false
            this.$message.warning('处理完成，图片为已存在图片。')
            return false
          }
          this.fileListLoading = false
          return true
        }
      } catch (err) {
        console.log(err)
        this.$message.error((err && err.msg) || err)
        this.fileListLoading = false
        return false
      }
    },
    async proAdd(form) {
      const { name, thumbnail_path, raw, width, height } = form || {}
      const formData = new FormData()
      formData.append('path', raw)
      formData.append('title', getPicName(name))
      formData.append('isShare', false)
      formData.append('thumbnail_path', thumbnail_path, name)
      formData.append('width', width)
      formData.append('height', height)
      this.updateForm(form, {
        status: '0'
      })
      try {
        const res = await add(formData, {
          onUploadProgress: (progressEvent) => {
            const { total = 0.000001, loaded = 0 } = progressEvent || {}
            this.updateForm(form, {
              loaded,
              total,
              status: total == loaded ? '2' : '1'
            })
            if (loaded >= total) {
              this.updateForm(form, {
                loading: true
              })
            }
          }
        })
        this.updateForm(form, {
          ...res,
          loading: false,
          success: $SUC(res)
        })
        return $SUC(res)
      } catch (err) {
        err = typeof err === 'string' ? { msg: err } : err
        this.updateForm(form, {
          ...err,
          ...{ status: '4' },
          loading: false,
          success: false
        })
        return false
      }
    },
    clear() {
      this.fileList = []
    },
    updateForm(form, uForm) {
      for (let key in uForm) {
        this.$set(form, key, uForm[key])
      }
    },
    handleIconClicked() {
      this.el.target.scrollTop = 0
      this.top = 0
    },
    onMouseOver() {
      this.src = require('@/assets/images/top-actived.png')
    },
    onMouseOut() {
      this.src = require('@/assets/images/top.png')
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
.uploadDesignPicComponent {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px 10px;
  padding-bottom: 0;
  box-sizing: border-box;
  .loading-wrapper {
    position: absolute;
    height: 50px;
    top: 400px;
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
  }

  .add-pic-btn-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    width: 100%;
    height: 120px;
    border: 1px dashed $border-color;
    .fileUpload-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      .upload-button {
        width: 300px;
        height: 40px;
        background: #eeefff;
        border-radius: 4px;
        font-size: 14px;
        border: none;
        color: #3841db;
      }
    }
    .el-button {
      width: 150px;
      height: 36px;
    }
    .tip {
      color: $color-gray;
      margin-top: 15px;
      font-size: 12px;
    }
  }
  .upload-wrapper {
    position: relative;
    padding: 10px;
    height: 120px;
    margin-bottom: 20px;
    border: 1px dashed $border-color;
    overflow: hidden;
    .clear-btn {
      top: 0;
      right: 0;
      position: absolute;
      font-size: 12px;
      padding: 2px 5px;
      color: $color-primary;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 0 0 0 4px;
    }
    .wrapper {
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      // text-align: center;
    }
    .img-wrapper {
      display: inline-block;
      position: relative;
      width: 100px;
      height: 100px;

      .el-image {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 1px solid $border-color;
      }
      .name {
        position: absolute;
        width: calc(100% - 2px);
        height: 20px;
        line-height: 20px;
        padding: 0 5px;
        bottom: 1px;
        left: 1px;
        font-size: 12px;
        color: $color-primary;

        text-align: center;
        @include overflow;
        background: #fff;
      }
    }
    .exist,
    .error {
      color: $color-warning;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%);
      margin-top: 15px;
      z-index: 100;
      font-size: 12px;
    }
    .error {
      color: $color-danger;
    }
    .progress + .progress {
      margin-left: 2px;
    }
  }
}
</style>
