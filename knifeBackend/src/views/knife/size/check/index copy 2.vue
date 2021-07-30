<template>
  <section
    class="app-container app-flex-col-container verify-component knife-size-check"
    v-loading="loading.createPsd"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div class="content">
      <div class="product-component-wrapper">
        <KenifeFiles
          ref="kenifeFiles"
          :thumbnails="thumbnails"
          :data="psdListData"
          @loadend="loadend"
          @toggleCurPsd="toggleCurPsd"
        >
          <template #name="{ index }"> 模块{{ convertCurrency(index + 1) }} </template>
        </KenifeFiles>

        <product-component :data="baseSize" :composeImage="false" class="base-size-component ml20"></product-component>

        <product-component
          :data="sitePsd"
          type="1"
          :rotate="false"
          :composeImage="false"
          class="site-component ml10"
          @change="draggableChange"
        ></product-component>

        <div ref="listWrapper" class="canvas-wrapper ml10">
          <el-image
            :src="curPsd.thumbnail || ''"
            :style="{
              width: coverLayer.imgWidth * coverLayer.imgScale + 'px',
              height: coverLayer.imgHeight * coverLayer.imgScale + 'px'
            }"
          />
          <canvas ref="canvas" class="canvas"></canvas>
        </div>
      </div>
    </div>

    <div class="bottom">
      <el-button @click="$router.back()"> 上一步 </el-button>
      <el-button v-if="canSave" type="primary" @click="doSubmit" :loading="loading.submit"> 保存 </el-button>
      <el-button v-else type="danger"> 所有模块的组块总数与参考尺码的组块数量不相等 </el-button>
    </div>
  </section>
</template>

<script>
import productComponent from '@/views/product/maintain/verifyComponent/module/productComponent'
import KenifeFiles from '@/views/knife/check/module/kenifeFiles'
import kenifeLayer from '@/views/knife/check/module/kenifeLayer'
import { getReferenceSize, changeGroup } from '@/api/product/productApi'
import { setKlProdSite as add } from '@/api/product/protoSizeApi'
import cloneDeep from 'lodash/cloneDeep'
import { mapGetters } from 'vuex'
import { BOUNDARY, FONT_LAYER, KL_IMAGE_TYPES, OTHER_LAYER } from '@/utils/constant'
import { createRandomNum, convertCurrency, uniqueArray, debounce, getPicName } from '@/utils'

export default {
  name: 'verifyComponent',
  components: {
    KenifeFiles,
    productComponent,
    kenifeLayer
  },
  data() {
    return {
      loading: {
        submit: false,
        createPsd: false
      },
      baseSize: {},
      size: {},

      psdListData: [],
      curPsd: {},
      thumbnails: [],
      coverLayer: {
        width: 350,
        height: 0,
        imgWidth: 350,
        imgHeight: 0,
        imgScale: 1,
        canvasWidth: 350,
        canvasHeight: 0,
        canvasScale: 1
      },

      canSave: true
    }
  },
  computed: {
    ...mapGetters(['knifePsds']),
    sitePsd({ curPsd: { groups = [] }, baseSize: { base_kl_groups = [] } }) {
      let kl_groups = []
      groups.forEach((group) => {
        // 使用group.order而不是groupsOrder是为了防止每次移动后都会更新sitePsd
        kl_groups[group.order] = group
      })
      base_kl_groups.forEach((item, order) => {
        if (!kl_groups[order])
          kl_groups[order] = {
            id: 'placeholder' + order,
            order
          }
      })
      // console.log('sitePsd.kl_groups', kl_groups)
      return {
        size_name: '一键位置psd',
        kl_groups
      }
    },
    canvasInfo({ baseSize, curPsd: { groups = [], groupsOrder }, coverLayer: { canvasScale } }) {
      let siteGroups = []
      for (const index in groupsOrder) {
        siteGroups[groupsOrder[index]] = groups[index]
      }
      return {
        siteGroups,
        baseSize,
        canvasScale
      }
    }
  },
  watch: {
    canvasInfo: {
      handler(n) {
        if (n.baseSize.base_kl_groups && n.siteGroups.length >= this.curPsd.groupsLen && this.coverLayer.height) {
          this.initCanvas()
        }
      },
      deep: true
    }
  },
  created() {
    this.createPsdListData()
    getReferenceSize(this.$route.query.primId).then(
      ({
        detail: {
          base_size: [base_size],
          size
        }
      }) => {
        this.baseSize = base_size
        this.size = size
        let { coverLayer } = this
        coverLayer.canvasWidth = base_size.base_kl_docs[0].kl_image_width
        coverLayer.canvasHeight = base_size.base_kl_docs[0].kl_image_height
        this.resize()
        // console.log(base_size, size);
        this.validPsdGroupsLen()
      }
    )
  },
  methods: {
    async doSubmit() {
      this.loading.submit = true
      let {
        psdListData,
        baseSize: { id, base_kl_groups }
      } = this
      const formData = new FormData()
      let groupIds = []
      let params = {
        size_base_id: id,
        combination: psdListData.map(({ width, height, groups, groupsOrder, file, thumbnail }, sort) => {
          formData.append('psd', file)
          const name = file instanceof File ? file.name.replace('.psd', '') : getPicName(file.url)
          return {
            name,
            // name: file.name.replace('.psd', ''),
            display_img: thumbnail,
            sort,
            width,
            height,
            group: groups.map(({ id, top, left }) => {
              let group_id = base_kl_groups[groupsOrder[id]]?.id
              groupIds.push(group_id)
              return {
                // groupsOrder是最新排序
                // group.order只有切换psd文件时才会更新
                group_id,
                quick_design_top: top,
                quick_design_left: left
              }
            })
          }
        })
      }
      groupIds = uniqueArray(groupIds)
      if (groupIds.length !== base_kl_groups.length) {
        this.$message.warning('参考尺码的位置未全部对应完毕')
        this.loading.submit = false
        return
      }
      formData.append('params', JSON.stringify(params))
      let [err, res] = await awaitWrap(add(formData))
      if (res && $SUC(res)) {
        this.$message.success('操作成功')
        this.$router.push('/product/maintain/sizeMange')
      }
      this.loading.submit = false
      // console.log(psdListData, params)
    },
    draggableChange(val) {
      let { curPsd } = this
      for (const index in curPsd.groupsOrder) {
        curPsd.groupsOrder[index] = val[index].order
      }
      // console.log(val, curPsd.groupsOrder)
      // console.log('sitePsd.kl_groups', this.sitePsd.kl_groups)
    },
    toggleCurGroupLayer(groupLayer) {
      this.curGroupLayer = groupLayer
    },
    createPsdListData() {
      if (!this.knifePsds.length) {
        return this.$router.replace('/product/maintain/sizeMange')
      }
      const psdListData = cloneDeep(this.knifePsds)
      // console.log('psdListData', psdListData)
      try {
        this.loading.createPsd = true
        const p = []
        psdListData.forEach((knifeItem, knifeIndex) => {
          const { files } = knifeItem
          files.map((file) => {
            const url = file.position_psd ? file.position_psd : URL.createObjectURL(file)
            p.push(
              new Promise((resolve) => {
                this.PSD.fromURL(url)
                  .then((psd) => {
                    // console.log('psd', psd)
                    const png = psd.image.toPng()
                    const psdInfo = psd.tree().export()
                    psdInfo.thumbnail = png.src
                    this.$nextTick(() => {
                      this.$set(this.thumbnails, knifeIndex, png.src)
                    })
                    psdInfo.file = file

                    // 组块数组
                    psdInfo.groups = []
                    psdInfo.nodes = psd.tree().descendants()
                    // 组块长度
                    psdInfo.groupsLen = 0
                    // 组块排序值: { [id]: order }
                    // id设置为group的index
                    psdInfo.groupsOrder = {}
                    psdInfo.nodes.map((node) => {
                      // console.log(node.root().width, node.root().height)
                      if (node.type !== 'group' || node.depth() !== 1) return
                      let groupIndex = psdInfo.groupsLen
                      psdInfo.width = node.parent.width
                      psdInfo.height = node.parent.height
                      psdInfo.groupsOrder[psdInfo.groupsLen] = psdInfo.groupsLen
                      psdInfo.groupsLen++
                      // console.log(node)
                      const children = node._children || []
                      const forms = []
                      children.map((item, index) => {
                        const { name, top, left, width, height, text } = item.export() || {}
                        const obj = {
                          name,
                          top,
                          left,
                          width,
                          height
                        }
                        if (item.type !== 'group') {
                          obj.imgUrl = item.layer.image.toBase64()
                        }
                        forms.push(obj)
                      })
                      node.forms = forms
                      this.getGroupImgInfo(forms, node).then((img) => {
                        // console.log(img, this.$refs.canvas)
                        this.$set(psdInfo.groups, groupIndex, {
                          id: psdInfo.groups.length,
                          order: psdInfo.groups.length,
                          name: node.name,
                          ...img,
                          kl_images: [
                            {
                              ...img,
                              img_url: img.src
                            }
                          ]
                        })
                        if (psdInfo.groups.length === psdInfo.groupsLen) {
                          resolve(psd)
                        }
                      })
                    })

                    //在knifePsds添加额外psd信息
                    Object.assign(knifeItem, psdInfo)
                  })
                  .catch((err) => {
                    resolve(true)
                  })
              })
            )
          })
        })
        Promise.all(p).then((res) => {
          // console.log(res)
          this.psdListData = psdListData
          this.toggleCurPsd(0)
          this.validPsdGroupsLen()
        })
      } catch (err) {
        this.loading.createPsd = false
      }
    },
    toggleCurPsd(index) {
      let { psdListData, coverLayer, curPsd } = this
      for (const index in curPsd.groupsOrder) {
        curPsd.groups[index].order = curPsd.groupsOrder[index]
      }
      this.curPsd = curPsd = psdListData[index]

      this.$set(this.curPsd, 'groups', curPsd.groups)
      this.$set(this.curPsd, 'groupsOrder', curPsd.groupsOrder)
      coverLayer.imgWidth = curPsd.width
      coverLayer.imgHeight = curPsd.height
      this.$nextTick(function () {
        coverLayer.imgScale = Math.min(coverLayer.width / coverLayer.imgWidth, coverLayer.height / coverLayer.imgHeight)
        // console.log(this.curPsd)
      })
    },
    loadend() {
      this.loading.createPsd = false
    },
    validPsdGroupsLen() {
      let {
        baseSize: { base_kl_groups },
        psdListData
      } = this
      if (
        base_kl_groups &&
        psdListData.length &&
        base_kl_groups.length !==
          psdListData.reduce((total, item) => {
            return total + (item.groups?.length ?? 0)
          }, 0)
      ) {
        this.$message.warning('所有模块的组块总数与参考尺码的组块数量不相等')
        this.canSave = false
      }
    },
    initCanvas() {
      let {
        coverLayer,
        canvasInfo: { baseSize, siteGroups, canvasScale }
      } = this
      // console.log(JSON.parse(JSON.stringify(baseSize)), JSON.parse(JSON.stringify(siteGroups)), canvasScale)
      // console.log('siteGroups', JSON.parse(JSON.stringify(siteGroups)))
      const c = this.$refs.canvas
      const ctx = c.getContext('2d')
      c.width = coverLayer.canvasWidth * coverLayer.canvasScale
      c.height = coverLayer.canvasHeight * coverLayer.canvasScale
      ctx.clearRect(0, 0, c.width, c.height)
      baseSize.base_kl_groups.forEach((baseGroup, index) => {
        let siteGroup = siteGroups[index]
        if (!siteGroup || !siteGroup.src) return
        const showRotate = baseGroup.show_rotate || 0
        let { img_url, width, height } = baseGroup.base_kl_images[0]
        this.canvasDrawImg(ctx, {
          src: img_url,
          width: width * canvasScale,
          height: height * canvasScale,
          top: siteGroup.top * canvasScale,
          left: siteGroup.left * canvasScale,
          isCache: true,
          rotate: showRotate
        })
      })
    },
    async getGroupImgInfo(children, { width = 0, height = 0, top, left }) {
      // console.log(children)
      const c = document.createElement('canvas')
      const ctx = c.getContext('2d')
      let nodeInfo = {
        width,
        height,
        top,
        left
      }
      children.forEach((child) => {
        if (nodeInfo.width < child.width) nodeInfo.width = child.width
        if (nodeInfo.height < child.height) nodeInfo.height = child.height
        if (nodeInfo.top === undefined)
          Object.assign(nodeInfo, {
            top: child.top,
            left: child.left
          })
        if (nodeInfo.top > child.top) nodeInfo.top = child.top
        if (nodeInfo.left > child.left) nodeInfo.left = child.left
      })
      c.width = nodeInfo.width
      c.height = nodeInfo.height
      await Promise.all(
        children.map((child, index) =>
          this.canvasDrawImg(ctx, {
            src: child.imgUrl,
            left: children[index].left - nodeInfo.left,
            top: children[index].top - nodeInfo.top
          })
        )
      )
      return {
        src: c.toDataURL('image/png'),
        ...nodeInfo
      }
    },
    async canvasDrawImg(ctx, { src, width, height, top, left, isCache, rotate = 0 }) {
      console.log('width, height', width, height)
      let imgEle = null
      if (rotate) {
        let [err, roatateDom] = await awaitWrap(
          this.getCreatedImg(src, isCache, {
            rotate
          })
        )
        const { scaleY, scaleX, dom, iW, iH, cW, cH } = roatateDom
        imgEle = dom
        left = left - (width * scaleX - width) / 2 + (cW - iW) / 2 / (cW / width)
        top = top - (height * scaleY - height) / 2 + (cH - iH) / 2 / (cH / height)
        // left = left -  (cW - iW) / 2 / (cW / width)
        //  top = top -  (cH - iH) / 2 / (cH / height)
        width = scaleX * width
        height = scaleY * height
      } else {
        let [err, dom] = await awaitWrap(
          this.getCreatedImg(src, isCache, {
            rotate
          })
        )
        imgEle = dom
      }

      if (imgEle) {
        let tempArr = [left, top, width, height].filter((item) => item || item === 0)
        ctx.drawImage(imgEle, ...tempArr)
        return true
      }
    },
    getCreatedImg(src, isCache, { rotate = 0 }) {
      let { createdImgCache = {} } = this
      return new Promise((resolve) => {
        let img = createdImgCache[src]
        // if (img) return resolve(img)
        img = new Image()
        img.onload = () => {
          if (isCache) {
            createdImgCache[src] = img
            this.createdImgCache = createdImgCache
          }
          if (rotate) {
            let c = document.createElement('canvas')
            const ctx = c.getContext('2d')
            const { width, height } = img
            let cW = width
            let cH = height
            if (rotate % 180 === 45 || rotate % 180 === 135) {
              cW = Math.sqrt(width * width + height * height)
              cH = Math.sqrt(width * width + height * height)
            } else if (rotate % 180 === 90) {
              cW = height
              cH = width
            }

            c.width = cW
            c.height = cH
            ctx.translate(cW / 2, cH / 2)
            ctx.rotate((rotate * Math.PI) / 180)
            ctx.drawImage(img, -width / 2, -height / 2)

            // ctx.rotate((-rotate * Math.PI) / 180)
            // ctx.translate(-cW / 2, -cH / 2)
            // ctx.rect(0, 0, cW, cH)
            // ctx.fill()
            // let c1 = document.createElement('canvas')
            // const ctx1 = c1.getContext('2d')
            // c1.width = width
            // c1.height = height
            // ctx1.drawImage(c, 0, 0, width, height)
            resolve({
              dom: c,
              scaleX: cW / width,
              scaleY: cH / height,
              iW: width,
              iH: height,
              cW,
              cH
            })
          }
          resolve(img)
        }
        img.src = src
      })
    },
    resize() {
      let {
        coverLayer,
        $refs: { listWrapper }
      } = this
      if (coverLayer.isResize) return
      coverLayer.isResize = true
      let resize = debounce(() => {
        coverLayer.height = listWrapper.clientHeight
        coverLayer.canvasScale = Math.min(
          coverLayer.width / coverLayer.canvasWidth,
          coverLayer.height / coverLayer.canvasHeight
        )
        coverLayer.imgScale = Math.min(coverLayer.width / coverLayer.imgWidth, coverLayer.height / coverLayer.imgHeight)
      }, 500)
      this.$nextTick(function () {
        resize()
        window.addEventListener('resize', resize)
        this.$once('hook:destroyed', () => {
          window.removeEventListener('resize', resize)
        })
      })
    },
    convertCurrency
  }
}
</script>

<style lang="scss" scoped>
.knife-size-check {
  .content {
    overflow: auto;
  }
  .product-component-wrapper {
    height: calc(100% - 20px);
  }
  .base-size-component {
    min-width: 200px;
  }
  .site-component {
    min-width: 250px;
  }
  .canvas-wrapper {
    white-space: nowrap;
    overflow-y: hidden;
    overflow-x: auto;
  }
}
</style>
