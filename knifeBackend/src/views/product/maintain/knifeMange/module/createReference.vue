<template>
  <section class="app-container app-flex-col-container createCoordPicPage" v-loading="loading" id="knifeProCode">
    <div class="content-wrapper">
      <div class="title">{{ isLack ? '创建' : '更新' }}参考图</div>
      <div class="header">
        <div class="slider-wrapper">
          <el-slider v-model="gridSizeOfCm" :min="2" :step="1" :max="30"></el-slider>
          <div class="label">{{ gridSizeOfCm }}cm/格</div>
        </div>
        <div class="info">
          <span class="label">宽：</span>
          <span class="value">{{ this.width }}px</span>
          <span class="label">高：</span>
          <span class="value">{{ this.height }}px</span>
        </div>

        <!-- <el-button size="mini" type="primary" :loading="loading" class="label" @click="clipCoordPic"
          >生成参考图</el-button
        >-->

        <Popover @sureHandler="clipCoordPic($event)">
          <template #tip>
            <p>参考图已经存在，确定要更新吗？此操作不能撤销！</p>
          </template>
          <template #reference="{ scope: loading }">
            <el-button
              class="update-btn"
              :loading="loading"
              size="mini"
              type="danger"
              v-show="isLack === false || isFresh === true"
              >更新参考图</el-button
            >
          </template>
        </Popover>
        <el-button
          size="mini"
          type="primary"
          v-if="isLack === true && isFresh === false"
          :loading="loading"
          class="label"
          @click="clipCoordPic"
          >生成参考图</el-button
        >

        <el-button size="mini" :loading="loading" class="label" @click="$router.go(-1)">返回</el-button>
      </div>
    </div>
    <div class="canvas-wrapper flex-col-content">
      <div class="wrapper">
        <canvas class="canvas" id="canvas" ref="canvas" :width="width" :height="height"></canvas>
      </div>
    </div>
  </section>
</template>

<script>
import { getBasePsdByProtoId } from '@/api/product/protoSizeApi'
import { createKnifeReference, baseDetail } from '@/api/product/checkProdApi'
import { getListByProtoId as list } from '@/api/product/protoStructApi'

import { getURLBlod, getPicName } from '@/utils'
import { DPI_CM_FROM_IN, MAKER } from '@/utils/constant'

const COLOR = '#000'
const BACKGROUND_COLOR = '#eee'
const THUMB_SIZE = 150

export default {
  data() {
    return {
      THUMB_SIZE,
      width: 0,
      height: 0,
      loading: false,
      gridSizeOfCm: 2,
      canvas: null,
      psdData: {},
      psdInstance: null,
      data: {},
      cloneCanvas: null,
      structs: [],
      //参考尺码
      referenceId: this.$route.query.referenceId,
      referGroupData: [],
      isFresh: undefined
    }
  },

  created() {
    //获取参考尺码数据
    this.baseDetail()
    this.list().then(() => {
      this.watchGridSizeOfCm()
      this.init()
    })
  },

  computed: {
    isLack() {
      return !+this.$route.query.isUpdate
    }
  },

  methods: {
    watchGridSizeOfCm() {
      this.$watch('gridSizeOfCm', () => {
        this.queryTimer && clearTimeout(this.queryTimer)
        this.queryTimer = setTimeout(() => {
          this.updateGripCanvas()
        }, 300)
      })
    },
    async initPsd() {
      this.loading = true
      try {
        const { canvas: c } = this.$refs
        this.canvas = c
        const url = URL.createObjectURL(this.data)
        const psd = await this.PSD.fromURL(url)
        this.psdInstance = psd
        this.psdData = psd.tree().export()
        const { document: { width, height } = {} } = this.psdData
        this.width = width
        this.height = height
        c.width = width
        c.height = height

        const cloneCanvas = document.createElement('canvas')
        cloneCanvas.setAttribute('id', 'cloneCanvas')
        cloneCanvas.width = width
        cloneCanvas.height = height
        this.cloneCanvas = cloneCanvas
      } catch (err) {
        this.$message.error('psd文件解析失败')
        this.loading = false
        return false
      }
      this.loading = false
      return true
    },
    updateGripCanvas() {
      const { document: { resources: { resolutionInfo: { h_res } = {} } = {} } = {} } = this.psdData
      const dipOfCm = DPI_CM_FROM_IN * this.gridSizeOfCm
      const psd = this.psdInstance
      const c = this.canvas
      const ctx = c.getContext('2d')
      ctx.clearRect(0, 0, c.width, c.height)
      ctx.fillStyle = BACKGROUND_COLOR
      ctx.fillRect(0, 0, c.width, c.height)

      this.drawGrid(dipOfCm, ctx)
      const cloneCtx = this.cloneCanvas.getContext('2d')
      cloneCtx.drawImage(this.canvas, 0, 0)
      ctx.clearRect(0, 0, c.width, c.height)

      ctx.fillStyle = BACKGROUND_COLOR
      ctx.fillRect(0, 0, c.width, c.height)

      const png = psd.image.toPng()
      png.setAttribute('crossOrigin', 'Anonymous')
      this.$nextTick(() => {
        setTimeout(() => {
          ctx.drawImage(png, 0, 0)
          this.drawGrid(dipOfCm, ctx)
          this.loading = false
        }, 50)
      })
    },
    getFontSize(num, gridSize, ctx) {
      let fontSize = 20
      num = parseInt(num)

      const numLeng = num.toString().length

      const size = Math.min(this.getDecimalFontSize(numLeng, fontSize, gridSize, ctx), 70)
      return size
    },
    getDecimalFontSize(numLeng, fontSize, gridSize, ctx) {
      ctx.font = `${fontSize * this.gridSizeOfCm}px serif`
      let txt = '8'.repeat(numLeng)

      const tW = ctx.measureText(txt).width

      let size = fontSize

      if (tW >= gridSize * 0.95) {
        return size
      } else {
        size = this.getDecimalFontSize(numLeng, ++fontSize, gridSize, ctx)
      }
      return size
    },
    drawGrid(gridSize, ctx) {
      let canvasWidth = ctx.canvas.width
      let canvasHeight = ctx.canvas.height

      let xLineTotal = Math.ceil(canvasHeight / gridSize)
      let yLineTotal = Math.ceil(canvasWidth / gridSize)
      const FONT_SIZE = this.getFontSize(xLineTotal * yLineTotal, gridSize, ctx)
      ctx.fillStyle = COLOR
      for (let i = 0; i <= xLineTotal; i++) {
        const drawSize = Math.min(canvasHeight, Math.max(0, i * gridSize - 0.5))
        ctx.beginPath()
        ctx.moveTo(0, drawSize)
        ctx.lineTo(canvasWidth, drawSize)
        ctx.strokeStyle = COLOR
        ctx.stroke()
      }

      for (let i = 0; i <= yLineTotal; i++) {
        const drawSize = Math.min(canvasWidth, Math.max(0, i * gridSize - 0.5))
        ctx.beginPath()
        ctx.moveTo(drawSize, 0)
        ctx.lineTo(drawSize, canvasHeight)
        ctx.strokeStyle = COLOR
        ctx.stroke()
      }

      ctx.font = `${FONT_SIZE * this.gridSizeOfCm}px serif`
      for (let i = 0; i <= xLineTotal; i++) {
        for (let j = 0; j < yLineTotal; j++) {
          const txt = i * yLineTotal + j + 1 + ''
          ctx.fillText(
            txt,
            j * gridSize - 0.5 + gridSize / 2 - ctx.measureText(txt).width / 2,
            i * gridSize - 0.5 + gridSize / 2 + (FONT_SIZE * this.gridSizeOfCm) / 3
          )
        }
      }
    },

    getResetGridSize(coordKl) {
      const picName = getPicName(coordKl || '')
      const tmpArr = picName.split('_')
      return parseInt(tmpArr[tmpArr.length - 1])
    },
    async clipCoordPic($el) {
      $el.$refs && $el.$refs.popover.doClose()
      this.loading = true
      try {
        // const { children = [] } = this.psdData || {}
        const ctx = this.cloneCanvas.getContext('2d')
        // const groups = children.filter(({ type }) => type == 'group')
        const groups = this.referGroupData.map(({ kl_images }) => {
          return kl_images.find((item) => item.type == MAKER)
        })
        console.log('groups', groups)
        const gridsClipPics = groups.map(({ left: x, top: y, width, height }) => {
          const gridData = ctx.getImageData(x, y, width, height)
          const mC = document.createElement('canvas')
          mC.width = width
          mC.height = height
          const mCtx = mC.getContext('2d')
          mCtx.putImageData(gridData, 0, 0)
          const base64Png = mC.toDataURL()
          return base64Png
        })
        if (gridsClipPics.length !== this.referGroupData.length) {
          return this.$message.error('參考尺码组与psd的组数量不一致！')
        }

        const { protoId } = this.$route.query
        let api = createKnifeReference
        const params = {
          // documentPic: this.cloneCanvas.toDataURL(),
          gridsClipPics,
          protoId,
          gridSize: this.gridSizeOfCm
        }
        console.log('params', params)
        if (this.isLack === false) {
          params.prim_groups = this.structs.map(({ prim_show_groups = [] }) => {
            return prim_show_groups[0] && prim_show_groups[0].id
          })
          delete params.structIds
          api = createKnifeReference
        }
        const { code } = await api(params)
        if ($SUC({ code })) {
          if (this.isLack) {
            this.isFresh = true
          }
          this.$message.success('提交成功')
          this.$emit('createCoordPicSuccess')
          this.$router.back()
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },

    async baseDetail() {
      const { detail = [], code } = (await baseDetail(this.referenceId)) || {}
      if ($SUC({ code })) {
        this.referGroupData = detail
        console.log('detaildetaildetail', detail)
      }
    },

    async init() {
      this.loading = true
      const id = this.$route.query.protoId
      if (!id) {
        return this.$router.back()
      }
      try {
        const {
          code,
          detail: { base_psd_path }
        } = await getBasePsdByProtoId({
          id
        })
        if ($SUC({ code })) {
          const blob = await getURLBlod(base_psd_path)
          this.data = blob
          const initStaus = await this.initPsd()
          if (initStaus) {
            this.updateGripCanvas()
          }
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    async list() {
      this.loading = true
      try {
        const { protoId } = this.$route.query || {}
        const { code, detail = [] } = (await list(protoId)) || {}
        if ($SUC({ code })) {
          this.structs = detail
          console.log('detail11', detail)
          const [{ prim_show_groups = [] }] = detail || [{}]
          console.log('prim_show_groups', prim_show_groups)
          this.isFresh = false
          // if (prim_show_groups.length) {
          //   this.gridSizeOfCm = this.getResetGridSize(prim_show_groups[0].coord_kl || '') || 2
          // }
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
      return true
    }
  }
}
</script>

<style lang="scss" scoped>
.createCoordPicPage.createCoordPicPage {
  width: 100%;
  padding-right: 40px;
  .content-wrapper {
    padding: 15px;
    background: #fff;
  }
  .title {
    line-height: 40px;
    height: 40px;
    border-bottom: 1px solid $border-color;
  }
  .header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin: 20px 0;
  }
  .update-btn.update-btn.update-btn,
  .el-button {
    height: 38px;
    line-height: 38px !important;
    height: 38px !important;
    padding-top: 0;
    padding-bottom: 0;
    margin-left: 20px;
  }
  .slider-wrapper {
    display: flex;
    width: 300px;
    align-items: center;
    margin-right: 20px;
    padding: 0 20px;
    border-radius: 2px;
    background: #eee;
    .el-slider {
      flex: 1;
    }
    .label {
      margin-left: 10px;
      font-size: 16px;
      white-space: nowrap;
      color: $color-primary;
    }
  }
  .info {
    display: inline-block;
    padding: 10px 20px;
    background: #eee;

    .value {
      margin-right: 20px;
    }
  }
  .canvas-wrapper {
    overflow: hidden;
    padding: 10px;
    .wrapper {
      width: 100%;

      height: 100%;
      overflow: auto;
      border: 1px solid $color-primary;
      .canvas {
        box-shadow: 0 0 5px 1px #666;
        cursor: pointer;
        width: 100%;
      }
    }
  }
}
</style>
