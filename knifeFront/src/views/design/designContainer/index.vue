<template>
  <section class="designContainerPage">
    <EHeader
      :sup_this="sup_this"
      :data="knifeData"
      :sizeIds="sizeIds"
      :protoObj="protoObj"
      :previewData="previewData"
      :quickDesignData="quickDesignData"
    />
    <div class="design-content" v-loading="loading">
      <div class="left-col">
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
          <el-carousel-item v-for="({ name, info, id }, index) in names" :key="index">
            <div class="r-content-wrapper">
              <component :is="name" v-bind="info" v-if="id != TAB_FONT_ADD_ID" />

              <component :is="name" v-bind="info" v-else-if="id == TAB_FONT_ADD_ID && tabActiveIndex == 4" />
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="main">
        <LineOperators />
        <div class="special-effects">
          <SpecialEffects />
        </div>
        <div class="fabric-list">
          <template v-if="isOneGroupDesign">
            <div class="module-thumb">
              <div class="swiper">
                <!-- 模块列表 -->
                <ModuleSwiper :data="quickDesignData" :moduleActiveIndex.sync="knifeActiveIndex" />
              </div>
            </div>
            <OneFabircGroupDesign
              v-if="quickDesignData.length"
              :data="quickDesignData || []"
              :groupIndex="knifeActiveIndex"
              @fabircListUpdate="fabircListUpdate"
            />
          </template>
          <template v-if="!isOneGroupDesign">
            <FabricList
              v-if="knifeData.length"
              :data="knifeData || []"
              :groupIndex="knifeActiveIndex"
              @fabircListUpdate="fabircListUpdate"
            />

            <div class="knife-thumb">
              <div class="swiper">
                <ProtoSwiper :data="knifeData" :activeIndex.sync="knifeActiveIndex" />
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="right-col">
        <ProdShowSwiper
          ref="prodShowSwiper"
          :quickDesignData="quickDesignData"
          :knifeData="knifeData"
          :protoObj="protoObj"
          :proShowData="proShowData"
          @updatePreviewData="updatePreviewData"
        />
        <div class="b-wrapper">
          <div class="layerController-wrapper">
            <LayerController :tabActiveIndex.sync="tabActiveIndex" />
          </div>
          <div class="done-btn-wrapper">
            <DoneBtnWrapper
              :quickDesignData="quickDesignData"
              :sup_this="sup_this"
              :data="knifeData"
              :sizeIds="sizeIds"
              :protoObj="protoObj"
              :previewData="previewData"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import SwiperWrapper from '@/components/swiperWrapper'

import EHeader from './module/header'
import ProdShowSwiper from './module/prodShowSwiper'
import LayerController from './module/layerController'
import OneFabircGroupDesign from './module/oneFabircGroupDesign'
import FabricList from './module/fabricList'
import LineOperators from './module/lineOperators'
import ProtoSwiper from './module/protoSwiper'
//模块列表
import ModuleSwiper from './module/moduleSwiper'
import OperationTab from './module/operationTab'
import SpecialEffects from './module/specialEffects'
import DoneBtnWrapper from './module/doneBtnWrapper'

import Collection from './module/componentAboutTab/collection'
import UploadDesignPic from './module/componentAboutTab/uploadDesignPic'
import SharedPicLibrary from './module/componentAboutTab/sharedPicLibrary'
import DesignBgColor from './module/componentAboutTab/designBgColor'
import FontSetting from './module/componentAboutTab/fontSetting'

import {
  baseDetail,
  showDesignInfo,
  documentDetail,
  quickDesign //一键定制信息
} from '@/api/product/knifeApi'
import { list } from '@/api/product/protoApi'

import { TAB_COMPONENT_NAMES, TAB_FONT_ADD_ID } from './constant'

import {
  GROUP_LIST_DESIGN, //分块定制
  ONG_GROUP_DESIGN //一键定制
} from '@/utils/constant'

import { fabricInstanceMixin, tileMixin } from './mixins'

import { mapMutations } from 'vuex'

export default {
  provide() {
    return {
      canvasModifiedHandler: this.canvasModifiedHandler,
      putProShows: this.putProShows,
      resetData: this.resetData,
      prodShowSwiperRunCalc: this.prodShowSwiperRunCalc
    }
  },
  mixins: [fabricInstanceMixin, tileMixin],
  components: {
    SwiperWrapper,

    EHeader,
    ProdShowSwiper,
    LayerController,
    FabricList,
    OneFabircGroupDesign,
    LineOperators,
    OperationTab,
    SpecialEffects,
    DoneBtnWrapper,

    Collection,
    UploadDesignPic,
    SharedPicLibrary,
    DesignBgColor,
    ModuleSwiper,
    ProtoSwiper,
    FontSetting
  },
  data() {
    return {
      sup_this: this,
      TAB_FONT_ADD_ID,
      protoObj: {},
      quickDesignData: [], //一键定制信息
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
    },

    //监听更换设计模式
    isOneGroupDesign(newVal) {
      this.knifeActiveIndex = '0'
      if (newVal) {
        //重置一键定制转换未分块定制数据
        this.UPDATE_ONE_GROUP_TRANSFORM_LIST_DATA([])
      }
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
    ...mapMutations(['UPDATE_DOCUMENT_PSD_INFO']),
    fabircListUpdate(num) {
      const { prodShowSwiper } = this.$refs
      if (prodShowSwiper) {
        prodShowSwiper.initCloneCanvas(num)
      }
    },
    //切换产品重置数据
    resetData() {
      this.knifeData = []
      this.quickDesignData = []
      const { prodShowSwiper } = this.$refs
      this.tabActiveIndex = '0'
      this.knifeActiveIndex = '0'
      if (prodShowSwiper) {
        prodShowSwiper.resetSwiper()
      }
      //重置一键定制转换未分块定制数据
      this.UPDATE_ONE_GROUP_TRANSFORM_LIST_DATA([])
      this.initData()
    },
    updatePreviewData(data) {
      this.previewData = data
    },

    canvasModifiedHandler(noRenderGroup = false) {
      const { prodShowSwiper } = this.$refs
      if (!prodShowSwiper) return
      if (this.instance && !noRenderGroup) {
        const curLayer = this.getActiveObject()
        if (curLayer && curLayer.groupType !== undefined) {
          this.baseTile(curLayer.groupType)
        }
      }
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
        await this.list()
        await Promise.all([
          //初始化psd全局信息
          this.initpsdDocumentInfo(),
          this.showDesignInfo(),
          this.baseDetail()
        ])
        //一键定制信息
        await this.quickDesign()

        //加在效果图需要的数据
        this.initPrimShowImgs()
      } catch (err) {}
      this.loading = false
    },

    //加在效果图需要的数据
    initPrimShowImgs() {
      const { prodShowSwiper } = this.$refs
      this.$nextTick(() => {
        prodShowSwiper.initPrimShowImgs()
      })
    },

    async showDesignInfo() {
      this.proShowData = []
      const { detail = [], code } = (await showDesignInfo({ id: this.$route.query.protoId })) || {}
      if ($SUC({ code })) {
        //筛选掉未上架的款式
        this.proShowData = detail.filter(({ id }) => {
          const { prim_struct } = this.protoObj
          try {
            return prim_struct.some((item) => id == item.id)
          } catch (err) {
            return false
          }
        })
      }
    },

    //一键定制信息
    async quickDesign() {
      this.quickDesignData = []
      const { detail = [], code } = (await quickDesign(this.$route.query.id)) || {}
      if ($SUC({ code })) {
        //一键定制信息
        this.quickDesignData = detail
        //一键定制数据为空，切换为默认定制
        if (!this.quickDesignData.length) {
          this.UPDATE_DESIGN_TYPE(GROUP_LIST_DESIGN)
        } else {
          this.UPDATE_DESIGN_TYPE(ONG_GROUP_DESIGN)
        }
      }
    },

    prodShowSwiperRunCalc() {
      console.log('join')
      const { prodShowSwiper } = this.$refs
      prodShowSwiper.runCalc()
    },

    //初始化Vuex中全局psd的信息
    async initpsdDocumentInfo() {
      const { detail, code } = await documentDetail(this.$route.query.id)
      if ($SUC({ code })) {
        //更新Vuex中全局psd的信息
        this.UPDATE_DOCUMENT_PSD_INFO(detail)
      }
    },

    async baseDetail() {
      this.knifeData = []
      const { detail = [], code } = (await baseDetail(this.$route.query.id)) || {}
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

    .right-col,
    .left-col {
      display: flex;
      flex-direction: column;
      width: 350px;
      padding: 20px;
      box-sizing: border-box;
      background: #fff;
      height: 100%;
    }
    .right-col {
      width: 290px;
      padding-bottom: 0px;
      justify-content: space-between;
      .b-wrapper {
        flex: 1;
        margin-top: 100px;
      }
      .layerController-wrapper {
        flex: 0 0 300px;
      }
      .done-btn-wrapper {
        position: relative;
      }
    }
    .left-col {
      width: 380px;

      .el-carousel {
        flex: 1;
        .r-content-wrapper {
          height: 100%;
        }
      }
      ::v-deep {
        .rightl-color-picker {
          width: 100%;
          // .rightl-color-predefine {
          //   width: 100%;
          // }
        }
      }
    }
    .main {
      position: relative;
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
        .knife-thumb,
        .module-thumb {
          display: flex;
          justify-content: flex-end;
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
        .module-thumb {
          justify-content: flex-start;

          bottom: auto;
          top: -10px;
        }
      }
      .special-effects {
        position: absolute;
        right: 10px;
      }
    }
  }
}
</style>
