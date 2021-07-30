<template>
  <div class="magnifier">
    <div
      class="midBox"
      ref="oMidBox"
      @mouseleave="mouseleaveHandler"
      @mouseenter="mouseenterHandler"
      @mousemove="mousemoveHandler"
    >
      <img :src="picUrl" ref="oMidBoxImg" class="midBoxImg" alt />
      <div class="shadowBox" ref="shadowBox" v-if="show" @mouseleave.stop @mouseenter.stop></div>
      <i class="el-icon-search icon"></i>
    </div>
    <div class="largeBox" ref="largeBox" v-show="show">
      <img :src="picUrl" ref="oLargeBoxImg" class="largeBoxImg" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    picUrl: {
      type: String,
      default: require('@/images/default.png')
    }
  },
  data() {
    return {
      show: true
    }
  },
  mounted() {
   this.$nextTick(() => {
      this.initSize()
   })
  },
  methods: {
    initSize() {
      let oMidBox = this.$refs.oMidBox
      let shadowBox = this.$refs.shadowBox
      if (!oMidBox || !shadowBox) return
      const shadowBoxWidth = shadowBox.offsetWidth
      const shadowBoxHeight = shadowBox.offsetHeight
      const midBoxPicWidth = oMidBox.offsetWidth
      const midBoxPicHight = oMidBox.offsetHeight
      if (!this.$refs.largeBox) return
      const bigBoxWidth = this.$refs.largeBox.offsetWidth
      const bigBoxHeight = this.$refs.largeBox.offsetHeight
      if(!this.$refs.oLargeBoxImg) return
      this.$refs.oLargeBoxImg.style.width =
        bigBoxHeight * (midBoxPicWidth / shadowBoxWidth) + 'px'
      this.$refs.oLargeBoxImg.style.height =
        bigBoxHeight * (midBoxPicHight / shadowBoxHeight) + 'px'
      this.show = false
    },
    mouseenterHandler() {
      this.show = true
    },
    mouseleaveHandler() {
      this.show = false
    },
    mousemoveHandler(ev) {
      this.$nextTick(() => {
        let shadowBox = this.$refs.shadowBox
        let oMidBox = this.$refs.oMidBox
        let oMidBoxImg = this.$refs.oMidBoxImg
        let oLargeBoxImg = this.$refs.oLargeBoxImg
        if (!shadowBox || !oMidBox || !oMidBoxImg || !oLargeBoxImg) return
        let widnowDirTop = oMidBox&&oMidBox.getBoundingClientRect().top
        let widnowDirLeft = oMidBox&&oMidBox.getBoundingClientRect().left
        let oMaxMidLeft = oMidBox.offsetWidth - shadowBox.offsetWidth
        let oMidLeft = ev.pageX - shadowBox.offsetWidth / 2
        let oMidTop = ev.pageY - shadowBox.offsetHeight / 2
        shadowBox.style.left = oMidLeft - widnowDirLeft + 'px'
        shadowBox.style.top = oMidTop - widnowDirTop + 'px'
        if (shadowBox.style.left < '0px') {
          shadowBox.style.left = '0px'
        }
        if (parseInt(shadowBox.style.left) > oMaxMidLeft) {
          shadowBox.style.left = oMaxMidLeft + 'px'
        }
        if (shadowBox.style.top < '0px') {
          shadowBox.style.top = '0px'
        }
        if (
          parseInt(shadowBox.style.top) >
          oMidBoxImg.offsetHeight - shadowBox.offsetHeight
        ) {
          shadowBox.style.top =
            oMidBoxImg.offsetHeight - shadowBox.offsetHeight + 'px'
        }
        oLargeBoxImg.style.left =
          -oLargeBoxImg.offsetWidth *
            (parseInt(shadowBox.style.left) / oMidBox.offsetWidth) +
          'px'
        oLargeBoxImg.style.top =
          -oLargeBoxImg.offsetHeight *
            (parseInt(shadowBox.style.top) / oMidBox.offsetHeight) +
          'px'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.magnifier {
  position: relative;
  z-index: 10;
  .midBox {
    width: 396px;
    height: 396px;
    font-size: 0;
    cursor: pointer;
    .midBoxImg {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .shadowBox {
      height: 150px;
      width: 150px;
      background: rgba(0, 0, 0, 0.3);
      position: absolute;
      left: 0;
      top: 0;
    }
    .icon {
      position: absolute;
      bottom: 10px;
      right: 10px;
      font-size: 20px;
      color: $color-gray;
      z-index: 100;
    }
  }
  .largeBox {
    position: absolute;
    left: 410px;
    top: -6px;
    width: 410px;
    height: 410px;
    box-shadow: 0 0 3px 1px #999;
    overflow: hidden;
    .largeBoxImg {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 100000;
      object-fit: cover;
    }
  }
}
</style>