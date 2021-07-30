<template>
  <div class="check-container app-container">
    <!-- tip -->
    <div class="tip">
      <i class="el-icon-delete"></i>
      以参考图为标准，核对刀版图，如有问题请重新上传Psd刀版文件
    </div>
    <div class="main-tools">
      <div class="select-wrapper">
        <el-select v-model="mode" placeholder="请选择" @change="modeChange">
          <el-option label="全局对比" value="0"> </el-option>
          <el-option label="细节对比" value="1"> </el-option>
        </el-select>
      </div>
      <div class="size-wrapper">
        <span
          class="button"
          :class="{ active: selectCheckIndex === index }"
          @click="selectCheck(index)"
          v-for="(item, index) in checkImage"
        >
          {{ item.size_name + (statusData[`${item.size_name}`] == 1 ? '(上架)' : '') }}
        </span>
      </div>
      <el-button type="primary" @click="download">下载</el-button>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="back">返回</el-button>
    </div>
    <div class="reference-container" ref="referenceContainer" v-show="mode === '0'">
      <!-- 参考图 -->
      <div class="reference-wrapper" ref="referenceWrapper">
        <div class="title">校验参考图</div>
        <div class="content">
          <PicZoom :url="mainImage.check_kl_img" ref="mainPicZoom" />
        </div>
      </div>
      <!-- 校验图 -->
      <div class="check-wrapper">
        <div class="tools">
          <div class="left"></div>
          <div class="right" v-if="selectCheckImage && this.statusData[`${selectCheckImage.size_name}`] != 1">
            <el-button class="button" type="primary" @click="verify(1)">
              <i class="el-icon-check" v-show="selectCheckImage.is_right === 1"></i> 通过</el-button
            >
            <el-button class="button" type="danger" @click="verify(0)">
              <i class="el-icon-close" v-show="selectCheckImage.is_right === 0"></i> 不通过</el-button
            >
          </div>
        </div>
        <div class="image-wapper">
          <PicZoom
            :url="item.check_kl_img"
            v-for="(item, index) in checkImage"
            :key="index"
            v-show="selectCheckIndex === index"
            ref="picZoom"
          />
        </div>
      </div>
    </div>
    <div class="detailed-container" v-show="mode === '1'" v-if="mainImage">
      <detail-check :main="mainImage" :index="selectCheckIndex" />
    </div>
  </div>
</template>

<script>
import { getKnifeReference, checkPass } from '@/api/product/checkProdApi'
import PicZoom from '@/views/components/picZoom'
import DetailCheck from './detailCheck'
import { mapState } from 'vuex'
import { createRandomNum } from '@/utils'

export default {
  name: 'checkReference',
  components: {
    PicZoom,
    DetailCheck
  },
  data() {
    return {
      mainImage: '',
      selectCheckIndex: 0,
      isCurrentVerified: false,
      mode: '0',
      isInitMainImgae: false,
      statusData: {}
    }
  },
  computed: {
    ...mapState({
      checkImage: (state) => state.checkProd.checkImage
    }),
    selectCheckImage() {
      console.log('selectCheckImage', this.checkImage[this.selectCheckIndex])
      return this.checkImage[this.selectCheckIndex]
    }
  },
  async created() {
    const { code, detail } = await getKnifeReference({ protoId: this.$route.query.protoId })
    this.statusData = this.$route.query
    if ($SUC({ code })) {
      if (detail.length === 0) return
      const checkImage = detail
        .map((item) => {
          if (item.is_base) {
            this.mainImage = item
            return null
          }
          return item
        })
        .filter((item) => item)
      this.$store.commit('checkProd/SET_CHECK_IMAGE', checkImage)
      if (this.mode === '0') {
        this.initMainImgae()
      }
    }
  },
  methods: {
    selectCheck(index) {
      this.selectCheckIndex = index
      if (this.mode === '0') {
        this.picZoomInit()
      }
    },
    verify(isVerified) {
      const current = this.checkImage[this.selectCheckIndex].groups.map((item) => {
        item.is_right = 1
        return item
      })
      this.$set(this.checkImage[this.selectCheckIndex], 'groups', current)

      this.checkImage[this.selectCheckIndex].is_right = isVerified
    },
    async save() {
      const data = this.checkImage.map((item) => ({
        id: item.id,
        is_right: item.is_right,
        size_name: item.size_name
      }))

      const { code } = await checkPass(data)
      if ($SUC({ code })) {
        this.$message.success('提交成功')
        this.$router.back()
      }
    },
    initMainImgae() {
      if (this.isInitMainImgae) return
      console.log('initMainImgae')
      var img = new Image()
      img.src = this.mainImage.check_kl_img
      img.onload = () => {
        if (img.width > img.height) {
          this.$refs.referenceContainer.style.flexDirection = 'column'
          this.$refs.referenceWrapper.style.marginBottom = '10px'
        }
        this.picZoomInit()
        this.isInitMainImgae = true
      }
    },
    picZoomInit() {
      this.$nextTick(() => {
        this.$refs.mainPicZoom.init()
        this.$refs.picZoom && this.$refs.picZoom.map((item) => {
          if (item.$el.style.display === 'none') return
          item.init()
        })
      })
    },
    modeChange() {
      if (this.mode === '0') {
        this.initMainImgae()
      }
    },
    back() {
      this.$router.back()
    },
    download() {
      // console.log(this.mainImage)
      // console.log(this.checkImage)
      const paths = []
      // 参考图
      paths.push(this.mainImage.check_kl_img)
      // this.mainImage.groups.map((item) => {
      //   paths.push(item.group_img)
      // })
      // // 效果图
      // this.checkImage.map((check) => {
      //   paths.push(check.check_kl_img)
      //   check.groups.map((item) => {
      //     paths.push(item.group_img)
      //   })
      // })
      this.downloadByPath(paths)
    },
    downloadByPath(paths) {
      const tasks = paths.map((url) => {
        return {
          name: '',
          url: `${url}?uid=${createRandomNum()}`
        }
      })
      thunderLink.newTask({
        downloadDir: '', // 指定当前任务的下载目录名称，迅雷会在用户剩余空间最大的磁盘根目录中创建这个目录。【若不填此项，会下载到用户默认下载目录】
        tasks
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.check-container {
  font-size: 16px;
  color: #595961;
  .tip {
    height: 46px;
    background: #fff5ed;
    border: 1px solid #ff9f00;
    border-radius: 2px;
    display: flex;
    align-items: center;
    padding-left: 24px;
    font-size: 16px;
    color: #595961;
    margin-bottom: 16px;
    i {
      color: #ff9f00;
      font-size: 20px;
      margin-right: 10px;
    }
  }
  .main-tools {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .select-wrapper {
      width: 150px;
      margin-right: 20px;
    }
    .size-wrapper {
      display: flex;
      align-items: center;
      margin-right: 20px;
      .button {
        height: 32px;
        cursor: pointer;
        line-height: 32px;
        padding: 0 23px;
        border: 1px solid #dcdee0;
        border-radius: 2px;
        margin-right: 8px;
        &:last-child {
          margin-right: 0;
        }
      }
      .active {
        border: 1px solid #3841db;
      }
    }
  }
  .reference-container {
    display: flex;
    padding-bottom: 400px;
    // height: 700px;
    // overflow: hidden;
  }
  .reference-wrapper {
    flex: 1;
    min-height: 300px;
    border: 1px solid #dcdee0;
    padding: 18px 30px;
    .title {
      // margin-top: -4px;
      height: 44px;
      text-align: center;
      margin-bottom: 14px;
    }
    .content {
      position: relative;
      width: 100%;
      height: 100%;
    }
  }
  .check-wrapper {
    flex: 1;
    border: 1px solid #dcdee0;
    padding: 18px 30px;
    .tools {
      height: 44px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      .left {
      }
      .right {
      }
    }
    .image-wapper {
      width: 100%;
      height: 100%;
      .image {
        width: 100%;
      }
    }
  }
  .buttom {
    padding-top: 30px;
    min-height: 400px;
    text-align: center;
  }
}
</style>
