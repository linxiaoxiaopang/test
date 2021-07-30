<template>
  <section class="designContainerPage">
    <EHeader
      :data="knifeData"
      :sizeIds="sizeIds"
      :protoObj="protoObj"
      :previewData="previewData"
    />
    <div class="design-content" v-loading="loading">
      <div class="l-col">
        <ProdShowSwiper
          ref="prodShowSwiper"
          :knifeData="knifeData"
          :protoObj="protoObj"
          :proShowData="proShowData"
          @updatePreviewData="updatePreviewData"
        />
        <div class="layerController-wrapper">
          <LayerController :tabActiveIndex.sync="tabActiveIndex" />
        </div>
      </div>
      <div class="main">
        <LineOperators />
        <div class="fabric-list">
          <FabricList
            v-if="knifeData.length"
            :data="knifeData || []"
            :groupIndex="knifeActiveIndex"
            @fabircListUpdate="fabircListUpdate"
          />
          <div class="knife-thumb">
            <div class="swiper">
              <ProtoSwiper
                :data="knifeData"
                :activeIndex.sync="knifeActiveIndex"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="r-col">
        <OperationTab :value.sync="tabActiveIndex" />
        <el-carousel
          arrow="never"
          :initial-index="1"
          :autoplay="false"
          :loop="false"
          height="100%"
          indicator-position="none"
          ref="carousel"
        >
          <el-carousel-item
            v-for="({ name, info, id }, index) in names"
            :key="index"
          >
            <div class="r-content-wrapper">
              <component
                :is="name"
                v-bind="info"
                v-if="id != TAB_FONT_ADD_ID"
              />

              <component
                :is="name"
                v-bind="info"
                v-else-if="id == TAB_FONT_ADD_ID && tabActiveIndex == 4"
              />
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </section>
</template>

<script>
import SwiperWrapper from '@/components/swiperWrapper'

import EHeader from './module/header'
import ProdShowSwiper from './module/prodShowSwiper'
import LayerController from './module/layerController'
import FabricList from './module/fabricList'
import LineOperators from './module/lineOperators'
import ProtoSwiper from './module/protoSwiper'
import OperationTab from './module/operationTab'

import Collection from './module/componentAboutTab/collection'
import UploadDesignPic from './module/componentAboutTab/uploadDesignPic'
import SharedPicLibrary from './module/componentAboutTab/sharedPicLibrary'
import DesignBgColor from './module/componentAboutTab/designBgColor'
import FontSetting from './module/componentAboutTab/fontSetting'

import { baseDetail, showDesignInfo } from '@/api/product/knifeApi'
import { list } from '@/api/product/protoApi'

import { TAB_COMPONENT_NAMES, TAB_FONT_ADD_ID } from './constant'

export default {
  provide() {
    return {
      canvasModifiedHandler: this.canvasModifiedHandler,
      putProShows: this.putProShows,
      resetData: this.resetData
    }
  },
  components: {
    SwiperWrapper,

    EHeader,
    ProdShowSwiper,
    LayerController,
    FabricList,
    LineOperators,
    OperationTab,

    Collection,
    UploadDesignPic,
    SharedPicLibrary,
    DesignBgColor,
    ProtoSwiper,
    FontSetting
  },
  data() {
    return {
      TAB_FONT_ADD_ID,
      protoObj: {},
      knifeData: [],
      tabActiveIndex: '1',
      knifeActiveIndex: '0',
      names: TAB_COMPONENT_NAMES,
      proShowData: [],
      previewData: [],
      loading: false
    }
  },

  watch: {
    tabActiveIndex(newVal) {
      this.$refs.carousel && this.$refs.carousel.setActiveItem(newVal)
    }
  },
  computed: {
    sizeIds() {
      const { sizes = [] } = this.protoObj || {}
      return sizes.map(({ id }) => id)
    }
  },
  created() {
    this.initData()
  },
  destroyed() {
    this.loading = false
  },
  methods: {
    fabircListUpdate(num) {
      const { prodShowSwiper } = this.$refs
      if (prodShowSwiper) {
        prodShowSwiper.initCloneCanvas(num)
      }
    },
    resetData() {
      this.knifeData = []
      const { prodShowSwiper } = this.$refs
      this.tabActiveIndex = '1'
      this.knifeActiveIndex = '0'
      if (prodShowSwiper) {
        prodShowSwiper.resetSwiper()
      }
      this.initData()
    },
    updatePreviewData(data) {
      this.previewData = data
    },
    canvasModifiedHandler() {
      const { prodShowSwiper } = this.$refs
      if (!prodShowSwiper) return
      prodShowSwiper.createImgByJson()
    },
    putProShows() {
      const { prodShowSwiper } = this.$refs
      if (!prodShowSwiper) return
      const primShowImgs = prodShowSwiper.primShowImgs
    },
    async initData() {
      this.loading = true
      try {
        await Promise.all([
          this.baseDetail(),
          this.showDesignInfo(),
          this.list().then(() => {
            this.getAllKnifeData()
          })
        ])
      } catch (err) {}
      this.loading = false
    },

    async showDesignInfo() {
      this.proShowData = []
      const { detail = [], code } =
        (await showDesignInfo({ id: this.$route.query.protoId })) || {}
      if ($SUC({ code })) {
        this.proShowData = detail
        const { prodShowSwiper } = this.$refs
        this.$nextTick(() => {
          prodShowSwiper.initPrimShowImgs(detail)
        })
      }
    },
    async baseDetail() {
      this.knifeData = []
      const { detail = [], code } =
        (await baseDetail(this.$route.query.id)) || {}
      if ($SUC({ code })) {
        this.knifeData = detail
      }
    },

    async list() {
      const id = this.$route.query.protoId
      if (!id) return this.$router.back()
      try {
        const { code, detail } = await list(id)
        if ($SUC({ code })) {
          this.protoObj = detail
          return true
        }
        return false
      } catch (err) {
        console.log(err)
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.designContainerPage {
  height: 100%;
  display: flex;
  padding: 0;
  flex-direction: column;
  .design-content {
    flex: 1;
    display: flex;
    min-width: 1600px;
    width: 100%;
    margin: 0 auto;

    .l-col,
    .r-col {
      display: flex;
      flex-direction: column;
      width: 350px;
      padding: 20px;
      box-sizing: border-box;
      background: #fff;
      height: 100%;
    }
    .l-col {
      justify-content: space-between;
      .layerController-wrapper {
        flex: 0 0 210px;
      }
    }
    .r-col {
      width: 380px;

      .el-carousel {
        flex: 1;
        .r-content-wrapper {
          height: 100%;
        }
      }
      ::v-deep {
        .el-color-picker {
          width: 100%;
          // .el-color-predefine {
          //   width: 100%;
          // }
        }
      }
    }
    .main {
      flex: 1;
      display: flex;
      padding-top: 20px;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      .fabric-list {
        height: 700px;
        width: 700px;
        position: relative;
        .knife-thumb {
          display: flex;
          justify-content: space-between;
          flex-direction: column;
          align-items: center;
          position: absolute;
          left: 100%;
          bottom: 0;
          margin: 0 10px;
          height: 100%;
          width: 64px;
          padding-top: 10px;
          // overflow: hidden;
          .swiper {
            height: 400px;
            .swiper-container {
              overflow: auto;
            }
          }
        }
      }
    }
  }
}
</style>
