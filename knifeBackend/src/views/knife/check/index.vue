<template>
  <section
    class="app-container checkKenifePage app-flex-col-container"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div class="flex-col-content row">
      <div class="l-col">
        <KenifeFiles
          ref="kenifeFiles"
          :thumbnails="thumbnails"
          :data="psdListData"
          @loadend="loadend"
          @toggleCurPsd="toggleCurPsd"
        />
      </div>
      <div class="m-col">
        <GroupLayer
          v-loading="curPsd.loading"
          element-loading-text="拼命处理中"
          element-loading-spinner="el-icon-loading"
          ref="groupLayer"
          :sup_this="this"
          :info="curGroupLayer"
          :disabled="doneSuccess"
        />
      </div>
      <div class="r-col">
        <kenifeLayer
          v-if="curPsd.nodes"
          ref="kenifeLayer"
          :sup_this="this"
          :info="curPsd"
          @toggleCurGroupLayer="toggleCurGroupLayer"
        />
      </div>
    </div>
    <div class="bottom">
      <BottomBtn
        :loading="loading"
        :key="index"
        :data="item"
        :index="index"
        :psdListData="psdListData"
        :back="true"
        v-if="curPsd == item"
        v-for="(item, index) in psdListData"
        @doSubmit="doSubmit"
      />
    </div>
  </section>
</template>

<script>
import KenifeFiles from './module/kenifeFiles'
import kenifeLayer from './module/kenifeLayer'
import GroupLayer from './module/groupLayer'
import BottomBtn from './module/bottomBtn'

import cloneDeep from 'lodash/cloneDeep'
import { mapGetters } from 'vuex'
import { add, createStardandSize, stardandAdd } from '@/api/product/productApi'
import { createRandomNum } from '@/utils'
import { MAKER, SECURITY, BOUNDARY, FONT_LAYER, OTHER_LAYER, KL_IMAGE_TYPES } from '@/utils/constant'

const MAX_NUM = 4
export default {
  components: {
    KenifeFiles,
    kenifeLayer,
    GroupLayer,
    BottomBtn
  },
  data() {
    return {
      sup_this: this,
      psdListData: [],
      curPsd: {},
      curGroupLayer: {},
      thumbnails: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters(['knifePsds', 'knifeStandardStatus']),
    doneSuccess() {
      return this.curPsd.success
    }
  },
  created() {
    this.createPsdListData()
    if (window.history && window.history.pushState) {
      history.pushState(null, null, document.URL)
      window.addEventListener('popstate', this.goBack, false)
    }
  },
  // 2：需要在退出页面的时候销毁这个监听事件
  destroyed() {
    window.removeEventListener('popstate', this.goBack, false)
  },
  methods: {
    goBack() {
      const existUndoTask = this.existUndoTask()
      if (!existUndoTask) return
      this.$confirm(
        `检测到尺码文件
        <span style="color: #ff4949;">${existUndoTask.join('、')}</span> 未上传，是否仍然要离开当前页面？`,
        '确认信息',
        {
          distinguishCancelAndClose: true,
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      )
        .then(() => {
          this.$router.back()
        })
        .catch((action) => {
          history.pushState(null, null, document.URL)
          if (action === 'cancel') {
            this.$message({
              type: 'info',
              message: '停留在当前页面，继续上传操作'
            })
          }
        })
    },
    back() {
      this.$router.replace('/knife')
    },

    toggleCurGroupLayer(groupLayer) {
      this.curGroupLayer = groupLayer
    },

    getImageType(layerName) {
      try {
        layerName = layerName.trim() || ''

        for (let key in KL_IMAGE_TYPES) {
          if (layerName.charAt() == '分') {
            return BOUNDARY
          }
          if (layerName.charAt() === KL_IMAGE_TYPES[key].charAt()) {
            return key
          }
        }
      } catch (err) {
        console.log(err)
      }
      return OTHER_LAYER
    },
    createPsdListData() {
      if (!this.knifePsds.length) {
        return this.$router.replace('/product/maintain/knifeMange')
      }
      const psdListData = cloneDeep(this.knifePsds)
      try {
        this.loading = true
        psdListData.map((knifeItem) => {
          const { files } = knifeItem
          const p = []
          files.map((file) => {
            const url = URL.createObjectURL(file)
            p.push(
              new Promise((resolve) => {
                this.PSD.fromURL(url)
                  .then((psd) => {
                    const png = psd.image.toPng()
                    const psdInfo = psd.tree().export()
                    psdInfo.thumbnail = png.src
                    this.$nextTick(() => {
                      this.thumbnails.push(png.src)
                    })
                    psdInfo.file = file

                    psdInfo.nodes = psd.tree().descendants()
                    const nodes = psdInfo.nodes
                    nodes.map((node) => {
                      if (node.type !== 'group' || node.depth() !== 1) return
                      const children = node._children || []
                      const forms = []
                      children.map((item, index) => {
                        const { name, top, left, width, height, text } = item.export() || {}
                        const type = this.getImageType(name)
                        const obj = {
                          name,
                          top,
                          left,
                          width,
                          height,
                          type: type + ''
                        }
                        if (text) {
                          const { value, transform, font } = text
                          let size = 16
                          try {
                            size = font.sizes[0]
                          } catch (err) {}

                          obj.text = {
                            value,
                            transform,
                            size
                          }
                          obj.type = FONT_LAYER + ''
                        }
                        if (item.type !== 'group') {
                          obj.imgUrl = item.layer.image.toBase64()
                        }
                        forms.push(obj)
                      })
                      node.forms = forms
                    })
                    //在knifePsds添加额外psd信息

                    Object.assign(knifeItem, psdInfo)
                    resolve(true)
                  })
                  .catch((err) => {
                    resolve(true)
                  })
              })
            )
          })
          Promise.all(p).then(() => {
            this.psdListData = psdListData
            this.curPsd = this.psdListData[0]
          })
        })
      } catch (err) {
        this.loading = false
      }
    },
    toggleCurPsd(index) {
      this.curPsd = this.psdListData[index]
    },
    finish() {
      return this.psdListData.every(({ success }) => success)
    },
    existUndoTask() {
      const doingArrr = this.psdListData
        .filter(({ success }) => {
          return !success
        })
        .map(({ size_name }) => size_name)
      if (!doingArrr.length) return null
      return doingArrr
    },
    //图片加载完成后，隐藏loading
    loadend() {
      this.loading = false
    },
    async createStandard(data, curPsdData) {
      const primId = this.$route.query.primId
      const { code, detail } = await createStardandSize({
        prim_prod: primId,
        size_name: curPsdData.size_name
      })

      if ($SUC({ code })) {
        const { id } = detail
        const formData = new FormData()
        for (let [key, val] of data.entries()) {
          if (key !== 'id') {
            if (key === 'params') {
              formData.append(key, val)
              // console.log('JSON.stringify(val)', JSON.stringify(val))
            } else {
              formData.append(key, val)
            }
          }
        }
        formData.append('id', id)
        const { code } = await stardandAdd(formData)
        if ($SUC({ code })) {
          this.$message.success('创建标准尺码成功')
        }
      }
      // const { code, msg } = await add(data);
    },
    async doSubmit({ data: curPsdData, index: curIndex }) {
      const {
        id,
        file,
        children = [],
        nodes = [],
        document: {
          width: kl_image_width,
          height: kl_image_height,
          resources: { resolutionInfo: { h_res, v_res } = {} } = {}
        } = {}
      } = curPsdData || {}
      this.$set(curPsdData, 'loading', true)
      const params = {
        kldoc: {},
        klgroup: []
      }

      params.kldoc = {
        kl_image_width,
        kl_image_height,
        kl_h_dpi: h_res,
        kl_v_dpi: v_res
        // kl_psd_path: null,
        // kl_psd_path: file,
      }
      const groupNodes = nodes.filter((item) => item.type === 'group' && item.depth() == 1)
      const formsList = groupNodes.map(({ forms }) => forms)
      const childrenOfChildren = children.filter((item) => item.type === 'group')
      childrenOfChildren.map((item, index) => {
        const forms = formsList[index]
        let klimage = []
        let kltext = []
        let obj = {
          name: item.name,
          order: index
        }
        forms.map((form, index) => {
          if (form.text) {
            const {
              type,
              imgUrl,
              text: { value, transform = {}, size },
              ...rest
            } = form
            kltext.push(Object.assign({}, rest, transform, { value, size }))
          } else {
            // klimage.push(Object.assign({}, form, {imgUrl: ''}));
            klimage.push(
              Object.assign({}, form, {
                name: createRandomNum() + form.name
              })
            )
          }
        })
        obj.klimage = klimage
        obj.kltext = kltext
        params.klgroup.push(obj)
      })

      const errTypeArr = []
      params.klgroup.map(({ klimage }, index) => {
        if (!Array.isArray(klimage) && !klimage.length) {
          return errTypeArr.push(index + 1)
        }
        const haveMaker = klimage.find((item) => item.type == MAKER)
        if (!haveMaker) {
          errTypeArr.push(index + 1)
        }
      })

      if (errTypeArr.length) {
        const { kenifeLayer } = this.$refs
        this.$message.error(`psd中第${errTypeArr.join('、')}组块中未查找到膜层`)
        kenifeLayer.groupClick(errTypeArr[0] - 1)
        this.$set(curPsdData, 'loading', false)
        return
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('id', id)
      formData.append('params', JSON.stringify(params))
      try {
        // if (curIndex == 0 && !this.knifeStandardStatus) {
        //   this.createStandard(formData, curPsdData);
        // }
        const { code, msg } = await add(formData)
        //当为第一个尺码的时候，判断是否需要生成标准码！

        if ($SUC({ code })) {
          this.$set(curPsdData, 'success', true)
          if (!this.existUndoTask()) {
            this.$message.success('添加刀版图成功')
            setTimeout(() => {
              this.$router.replace('/product/maintain/knifeMange')
            }, 200)
          } else {
            const successMsg = `当前尺码处理完成，尺码："${this.existUndoTask().join('、')}"还未处理, 请前往处理！`

            this.$message.success(successMsg)
          }
        }
        if (msg) {
          this.$message({
            showClose: true,
            type: 'error',
            message: msg,
            duration: 2500
          })
        }
      } catch (err) {
        console.log(err)
      }
      this.$set(curPsdData, 'loading', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.checkKenifePage {
  .row {
    display: flex;
    .l-col {
      flex: 0 0 250px;
    }
    .m-col {
      margin: 0 10px;
      flex: 1;
      overflow: auto;
    }
    .r-col {
      flex: 0 0 350px;
    }
  }
}
</style>
