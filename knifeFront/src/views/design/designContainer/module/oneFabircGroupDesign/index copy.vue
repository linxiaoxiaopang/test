<template>
  <div class="fabricListComponent">
    <FabricByGroup
      v-if="showFabricByGroup"
      ref="fabricByGroup"
      :groupIndex="0"
      :data="data"
      :id="`canvas${$route.protoId}`"
    />
  </div>
</template>

<script>
import FabricByGroup from './oneFabricByGroup'
import { mapMutations } from 'vuex'
import { MAKER, SECURITY, INIT_GTOUP_INFO_FORM } from '@/utils/constant'
import { fabricInstanceMixin } from '../../mixins'

export default {
  inject: ['canvasModifiedHandler'],
  mixins: [fabricInstanceMixin],
  components: {
    FabricByGroup
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    groupIndex: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      showFabricByGroup: false
    }
  },
  watch: {
    '$route.query.id': {
      async handler() {
        this.$nextTick(() => {
          this.showFabricByGroup = false
          this.$nextTick(() => {
            this.showFabricByGroup = true
            this.$nextTick(() => {
              const tmpArr = []
              const { fabricByGroup } = this.$refs
              if (!fabricByGroup) return
              tmpArr.push(fabricByGroup.canvas)
              this.SET_FABRIC_LIST(tmpArr)
              this.$emit('fabircListUpdate', this.data.length)
              this.SET_CUR_FABRIC_INDEX(0)
            })
          })
        })
      },
      immediate: true
    }
  },
  computed: {
    klMarks() {
      let tmpArr = []
      this.data.map(({ kl_images = [], kl_texts }) => {
        kl_images.map((img) => {
          if (MAKER == img.type) {
            return tmpArr.push(img)
          }
        })
      })
      return tmpArr
    },

    klImages() {
      let tmpArr = []
      this.data.map(({ kl_images = [], kl_texts }) => {
        kl_images.map((img) => {
          if (SECURITY == img.type) {
            return tmpArr.push(
              Object.assign({}, img, {
                text: (kl_texts[0] && kl_texts[0].value) || ''
              })
            )
          }
        })
      })
      return tmpArr
    },
    makerId() {
      return (group) => {
        let id = undefined
        const { kl_images: klImages } = group || {}
        klImages.map(({ id: klId, type }) => {
          if (type === MAKER) {
            id = klId
          }
        })
        return id
      }
    }
  },
  methods: {
    ...mapMutations([
      'SET_CUR_FABRIC_INDEX',
      'SET_FABRIC_LIST',
      'UPDATE_FABRIC_LIST'
    ])
  }
}
</script>

<style lang="scss" scoped>
.fabricListComponent {
  box-shadow: 0px 3px 10px 0px rgba(47, 72, 124, 0.14);
  .el-carousel__item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 700px;
    width: 700px;
  }
  .clone {
    top: 0;
    position: absolute;
    z-index: 100;
  }
}
</style>
<style lang="scss">
.fabric-list-dropdown-menu {
  max-height: 300px;
  overflow: auto;
}
.copy-all {
  width: 100%;
  text-align: center;
}
.fabric-list-wrapper-swipper-img-wrapper.fabric-list-wrapper-swipper-img-wrapper {
  padding: 10px 10px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  .el-image {
    width: 100%;
    height: 46px;
  }
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    line-height: 1.2;
  }
  .name {
    font-size: 12px;
    text-align: center;
    @include overflow;
  }
  .page-num {
    font-size: 12px;
    color: $color-danger;
  }
}
.fabric-list-wrapper-swipper-img-wrapper.disabled {
  opacity: 0.5;
}
</style>
