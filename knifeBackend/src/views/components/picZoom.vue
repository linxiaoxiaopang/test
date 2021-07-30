<template>
  <div
    class="pic-zoom-container oMidBox"
    ref="oMidBox"
    @mousemove="mousemoveHandler"
    @mouseleave="mouseleaveHandler"
    @mouseenter="mouseenterHandler"
  >
    <img class="image oMidBoxImg" :src="url" alt="" ref="oMidBoxImg" />
    <!-- 阴影盒子 -->
    <div class="shade" ref="shadowBox" v-show="show"></div>
    <div class="largeBox" ref="largeBox" v-show="show">
      <img :src="url" ref="oLargeBoxImg" class="largeBoxImg" />
    </div>
  </div>
</template>

<script>
import { debounce } from '@/utils'

export default {
  props: {
    url: {
      type: String
    },
    shadowBoxWidth: {
      type: Number,
      default: 200
    },
    largeBoxWidth: {
      type: Number,
      default: 400
    }
  },
  data() {
    return {
      show: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      window.removeEventListener('resize', this.resize)
      this.$nextTick(function () {
        this.resize = debounce(() => {
          console.log('resize')
          this.$nextTick(function () {
            this.show = true
            let oLargeBoxImg = this.$refs.oLargeBoxImg
            let oMidBox = this.$refs.oMidBox
            let largeBox = this.$refs.largeBox
            let shadowBox = this.$refs.shadowBox
            if (!oLargeBoxImg || !oMidBox || !largeBox || !shadowBox) {
              console.log(oLargeBoxImg, oMidBox, largeBox, shadowBox)
              return this.resize()
            }
            largeBox.style.width = this.largeBoxWidth
            largeBox.style.height = this.largeBoxWidth
            shadowBox.style.width = this.shadowBoxWidth
            shadowBox.style.height = this.shadowBoxWidth
            oLargeBoxImg.style.width = oMidBox.offsetWidth * (this.largeBoxWidth / this.shadowBoxWidth) + 'px'
            this.show = false
          })
        }, 500)
        this.resize()
        window.addEventListener('resize', this.resize)
        this.$once('hook:destroyed', () => {
          window.removeEventListener('resize', this.resize)
        })
      })
    },
    mouseenterHandler() {
      this.show = true
    },
    mouseleaveHandler() {
      this.show = false
    },
    mousemoveHandler(e) {
      this.show = true
      this.$nextTick(() => {
        let shadowBox = this.$refs.shadowBox
        let oMidBox = this.$refs.oMidBox
        let oMidBoxImg = this.$refs.oMidBoxImg
        let largeBox = this.$refs.largeBox
        let oLargeBoxImg = this.$refs.oLargeBoxImg

        if (!shadowBox || !oMidBox || !oMidBoxImg || !oLargeBoxImg) return
        let widnowDirTop = oMidBox && oMidBox.getBoundingClientRect().top
        let widnowDirLeft = oMidBox && oMidBox.getBoundingClientRect().left
        let oMaxMidLeft = oMidBox.offsetWidth - shadowBox.offsetWidth
        let oMidLeft = e.pageX - shadowBox.offsetWidth / 2
        let oMidTop = e.pageY - shadowBox.offsetHeight / 2
        shadowBox.style.left = oMidLeft - widnowDirLeft + 'px'
        shadowBox.style.top = oMidTop - widnowDirTop + 'px'
        //  大图容器跟随鼠标
        largeBox.style.left = e.pageX + shadowBox.offsetWidth / 2 - widnowDirLeft + 'px'
        largeBox.style.top = e.pageY + shadowBox.offsetHeight / 2 - widnowDirTop + 'px'

        // 边界处理
        if (shadowBox.style.left < '0px') {
          //  阴影盒子
          shadowBox.style.left = '0px'
          //  大图盒子
          largeBox.style.left = shadowBox.offsetWidth + 'px'
        }
        if (parseInt(shadowBox.style.left) > oMaxMidLeft) {
          //   阴影盒子
          shadowBox.style.left = oMaxMidLeft + 'px'
        }
        if (shadowBox.style.top < '0px') {
          //  阴影盒子
          shadowBox.style.top = '0px'
          //   大图盒子
          largeBox.style.top = shadowBox.offsetHeight + 'px'
        }
        if (parseInt(shadowBox.style.top) > oMidBoxImg.offsetHeight - shadowBox.offsetHeight) {
          // 阴影盒子
          shadowBox.style.top = oMidBoxImg.offsetHeight - shadowBox.offsetHeight + 'px'
          //   大图盒子
          largeBox.style.top = oMidBoxImg.offsetHeight + 'px'
        }
        if (parseInt(largeBox.style.left) > oMidBox.offsetWidth - largeBox.offsetWidth) {
          // 大图盒子
          largeBox.style.left = e.pageX - shadowBox.offsetWidth / 2 - widnowDirLeft - largeBox.offsetWidth + 'px'
          if (parseInt(shadowBox.style.left) === oMaxMidLeft) {
            //   大图盒子
            largeBox.style.left = oMidBox.offsetWidth - largeBox.offsetWidth - shadowBox.offsetWidth + 'px'
          }
        }
        if (parseInt(largeBox.style.left) < 0) {
          largeBox.style.left = '0px'
        }

        // 大图显示部分
        oLargeBoxImg.style.left =
          -oLargeBoxImg.offsetWidth * (parseInt(shadowBox.style.left) / oMidBox.offsetWidth) + 'px'
        oLargeBoxImg.style.top =
          -oLargeBoxImg.offsetHeight * (parseInt(shadowBox.style.top) / oMidBox.offsetHeight) + 'px'


        this.$emit('picMouseMove', {
          left: parseInt(shadowBox.style.left),
          top: parseInt(shadowBox.style.top)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pic-zoom-container {
  position: relative;
  // width: 100%;
  // height: 100%;
  .oMidBoxImg {
    width: 100%;
    height: 100%;
    // object-fit: contain;
  }
  .shade {
    background-color: rgba(135, 206, 235, 0.5);
    position: absolute;
    top: 100px;
    left: 100px;
    cursor: move;
    width: 200px;
    height: 200px;
  }
  .largeBox {
    width: 400px;
    height: 400px;
    border: 1px solid red;
    position: absolute;
    top: 100%;
    left: 0;
    background: cornsilk;
    overflow: hidden;
    z-index: 10000;
    .largeBoxImg {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1000;
      object-fit: cover;
    }
  }
}
</style>
