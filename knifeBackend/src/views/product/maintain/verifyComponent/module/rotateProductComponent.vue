<template>
  <el-card shadow="never" :class="['product-component', option.wrapperClass]">
    <template #header>
      <div v-if="option.composeImage" class="compose-image" :style="psdInfo">
        <el-image :src="psdInfo.src" :style="psdInfo">
          <img
            slot="error"
            src="@/assets/images/default.png"
            width="123"
            height="56"
            alt
            class="block"
          />
        </el-image>
        <div
          v-for="(style, key) in coods"
          :key="key"
          :style="style"
          class="image-desc"
        >{{ style.order + 1 }}</div>
      </div>
      <div class>
        <div>{{ data.size_name }}</div>
        <div v-if="option.remark" class="remark">参考尺码</div>
      </div>
    </template>
    <draggable
      v-model="list"
      v-bind="dragOptions"
      class="product-component-list"
      @change="onChange"
    >
      <div
        v-for="(item, index) in list"
        :key="item.id"
        class="product-component-item rotate-product-component-item"
      >
        <div class="item-content-wrapper">
          <div class="card-wrapper">
            <svg-icon v-if="option.more" icon-class="menu" />
            <el-card shadow="never">
              <span class="text-red ml10">{{ index + 1 }}</span>
              <el-image
                :src="option.getItemImg(item).img_url"
                :preview-src-list="[option.getItemImg(item).img_url]"
                fit="contain"
                :style="`transform: rotate(${-item.rotate}deg)`"
              >
                <img
                  slot="error"
                  src="@/assets/images/default.png"
                  width="40"
                  height="40"
                  alt
                  class="block"
                />
              </el-image>
              <span class="text-cut" :title="item.name">{{ item.name }}</span>
            </el-card>
          </div>

          <div class="done-list" v-if="!option.remark">
            <el-slider
              ref="slider"
              size="mini"
              :step="0.01"
              :rotate="rotate(item)"
              v-model="item.rotate"
              :min="0"
              :max="360"
              :marks="marks"
              :show-input-controls="false"
              :format-tooltip="formatTooltip"
            ></el-slider>
            <el-input-number
              size="mini"
              v-model="item.rotate"
              :controls="false"
              :min="0"
              :max="360"
              label="请输入角度"
            ></el-input-number>
          </div>
        </div>
        <!-- <el-button v-if="option.rotate" type="text" @click.stop.prevent="onRotate(item.id)">旋转</el-button> -->
      </div>
    </draggable>
  </el-card>
</template>

<script>
// draggable 配置：https://segmentfault.com/a/1190000021376720
import draggable from 'vuedraggable'
import { deepClone } from '@/components/avue/utils/util'

export default {
  components: {
    draggable
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    type: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      list: [],
      psdInfo: {
        src: '',
        scale: '',
        width: '',
        height: ''
      },
      coods: {},

      oData: [],

      marks: {
        90: '90°',
        180: '180°',
        270: '270°'
      }
    }
  },
  computed: {
    option({ type }) {
      let option = {}
      switch (type) {
        case '1':
          option = {
            wrapperClass: 'actual-product',
            more: true,
            rotate: true,
            draggable: true,
            props: {
              docs: 'kl_docs',
              list: 'kl_groups',
              psdPath: 'kl_psd_path'
            },
            getItemImg(item) {
              // console.log('item', item)
              if (item && item.kl_images && item.kl_images[0]) return item.kl_images[0]
              return {
                img_url: ''
              }
            }
          }
          break

        default:
          option = {
            remark: true,
            props: {
              docs: 'base_kl_docs',
              list: 'base_kl_groups',
              psdPath: 'base_psd_path'
            },
            getItemImg(item) {
              if (item && item.base_kl_images && item.base_kl_images[0]) return item.base_kl_images[0]
              return {
                img_url: ''
              }
            }
          }
      }
      return {
        composeImage: true,
        ...option,
        ...this.$attrs
      }
    },
    dragOptions({ option }) {
      return {
        animation: 200,
        group: 'description',
        disabled: !option.draggable,
        ghostClass: 'ghost'
      }
    },
    rotate() {
      return (item) => {
        let item1 = this.coods[item.id]
        this.$set(item1, 'rotate', item.rotate)
        return 0
      }
    }
  },
  watch: {
    data: {
      handler() {
        let list = this.data[this.option.props.list]
        if (list) {
          this.list = deepClone(list)
          this.getPsdInfo()
          this.getCoodDom(this.list)
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    formatTooltip(val) {
      return val + '°'
    },

    onChange() {
      let { coods, list, oData } = this
      list.map(({ id }, index) => {
        coods[id].order = index
        // Object.assign(coods[id], oData[index])
      })
      this.$emit('change', coods)
    },

    onRotate(id) {
      let item = this.coods[id]
      this.$set(item, 'rotate', !item.rotate)
    },

    getChangeData() {
      let { coods } = this
      let tempArr = []
      for (const coodsKey in coods) {
        let { id, order, oldOrder, rotate, oldRotate } = coods[coodsKey]
        if (order !== oldOrder || rotate !== oldRotate) {
          tempArr.push({
            id,
            order,
            rotate
          })
        }
      }
      return tempArr
    },

    getCoodDom(list) {
      let {
        psdInfo: { scale }
      } = this
      this.oData = []
      list.map((item, index) => {
        let { width, height, left, top } = this.option.getItemImg(item)
        let siteInfo = {
          width: width * scale + 'px',
          height: height * scale + 'px',
          left: left * scale + 'px',
          top: top * scale + 'px',
          order: item.order
        }
        this.oData.push(siteInfo)
        this.$set(this.coods, item.id, {
          ...siteInfo,
          id: item.id,
          order: item.order,
          oldOrder: item.order,
          rotate: item.rotate,
          oldRotate: item.rotate
        })
      })
    },
    getPsdInfo() {
      let {
        props: { docs, psdPath }
      } = this.option
      let { kl_image_width, kl_image_height, [psdPath]: oPsdPath } = this.data[docs]?.[0] || {}
      this.getPsdPath(oPsdPath)

      let { psdInfo } = this
      psdInfo.scale = Math.min(250 / kl_image_width, 188 / kl_image_height)
      psdInfo.width = kl_image_width * psdInfo.scale + 'px'
      psdInfo.height = kl_image_height * psdInfo.scale + 'px'
    },
    getPsdPath(url = '') {
      this.PSD.fromURL(url).then((psd) => {
        this.psdInfo.src = psd.image.toPng().src
        this.$nextTick(function () {
          console.log('psdCreated')
          this.$emit('psdCreated', psd)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.rotate-product-component-item.rotate-product-component-item {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  height: auto;

  .item-content-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;
    .card-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .done-list {
      margin-top: 10px;
      display: flex;
      align-items: center;
      .el-slider {
        flex: 1;
      }
      .el-input-number {
        flex: 0 0 80px;
        margin-left: 10px;
      }
    }
  }
  .item-content-wrapper::after {
    content: '';
    position: absolute;
    height: 1px;
    left: -25px;
    right: -25px;
    bottom: 0;
    background: $border-color;
  }
}
</style>
