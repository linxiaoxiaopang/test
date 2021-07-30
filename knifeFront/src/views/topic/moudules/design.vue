<template>
  <div class="design-warpper" @mousedown.prevent>
    <div class="warpper">
      <div class="topic-title">打造简单、适合操作的设计定制器</div>
      <div class="topic-description">一键加图，同步预览，批量定制产品；海量专业设计图库，设计即创意</div>
      <div class="image-warpper">
        <div class="preview-image">
          <el-image
            :src="require('../images/left-arrow.svg')"
            @click="handleSelected((type = 'left'))"
            class="left-icon"
            style="position: absolute; width: 46px; top: 251px; left: 120px; border-radius: 50%"
          ></el-image>
          <el-image
            :src="require('../images/right-arrow.svg')"
            class="right-icon"
            @click="handleSelected((type = 'right'))"
            style="position: absolute; width: 46px; top: 251px; right: 119px; border-radius: 50%"
          ></el-image>
          <div class="big-image">
            <div class="basicBox">
              <el-image class="basic" :src="require('../images/basic.jpg')"></el-image>
            </div>
            <div class="designedBox" ref="designedBoxRef">
              <el-image class="designed" :src="src"></el-image>
            </div>
            <div class="slideBox" ref="slideBoxRef" @mousedown="mousedownSlide($event)">
              <el-image class="slide" :src="require('../images/slide.png')"></el-image>
            </div>
          </div>
        </div>
      </div>
      <div class="designedList">
        <ul v-for="(item, index) in imagesList" :key="index">
          <li
            class="designedImage"
            :class="{
              active: selectedIndex === index
            }"
          >
            <el-image :src="require('../images/' + item.image)" @click="changeDesigned(item.clothes, index)"></el-image>
          </li>
        </ul>
        <el-button
          type="primary"
          class="designedImage"
          @click="$router.push('/design/index')"
          style="width: 83px; height: 83px; font-size: 18px"
          >立即定制</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    window.addEventListener('scroll', this.onScroll, true)
  },
  data() {
    return {
      imagesList: [
        { image: '1.png', clothes: '1-1.png' },
        { image: '2.png', clothes: '1-2.png' },
        { image: '3.png', clothes: '1-3.png' },
        { image: '4.png', clothes: '1-4.png' },
        { image: '5.png', clothes: '1-5.png' },
        { image: '6.png', clothes: '1-6.png' },
        { image: '7.png', clothes: '1-7.png' },
        { image: '8.png', clothes: '1-8.png' },
        { image: '9.png', clothes: '1-9.png' }
      ],
      selectedIndex: 0,
      src: require('../images/1-1.png'),
      isrunnning: true
    }
  },
  methods: {
    onScroll() {
      let scrollTop = document.documentElement.scrollTop
      if (scrollTop >= 2850) {
        if (!this.isrunnning) return
        this.isrunnning = !this.isrunnning
        this.$refs['designedBoxRef'].style.width = '520px'
        this.$refs['slideBoxRef'].style.left = '504px'
      }
    },
    mousedownSlide() {
      let barX
      let designedLeft
      let designedWidth
      const designedBox = this.$refs['designedBoxRef']
      const slideBox = this.$refs['slideBoxRef']
      document.onmousemove = function (e) {
        designedBox.style.transition = 'none'
        slideBox.style.transition = 'none'
        e.preventDefault()
        barX = e.x
        designedLeft = designedBox.getBoundingClientRect().left
        designedWidth = barX - designedLeft
        designedBox.style.width = designedWidth + 'px'
        slideBox.style.left = designedWidth + 'px'
        if (designedWidth < 16 || designedWidth > 504) {
          if (designedWidth < 16) {
            slideBox.style.left = '16px'
          } else if (designedWidth > 504) {
            slideBox.style.left = '504px'
          }
        }
        document.onmouseup = function () {
          document.onmousemove = null
        }
      }
    },
    changeDesigned(path, index) {
      this.selectedIndex = index
      this.$refs['designedBoxRef'].style.transition = 'none'
      this.$refs['slideBoxRef'].style.transition = 'none'
      this.src = require('../images/' + path)
      this.$refs['designedBoxRef'].style.width = 0 + 'px'
      this.$refs['slideBoxRef'].style.left = 16 + 'px'
      setTimeout(() => {
        this.$refs['designedBoxRef'].style.transition = 'width 2s'
        this.$refs['slideBoxRef'].style.transition = 'left 2s'
        this.$refs['designedBoxRef'].style.width = '520px'
        this.$refs['slideBoxRef'].style.left = '504px'
      }, 500)
    },
    handleSelected(type) {
      if (type === 'left') {
        if (this.selectedIndex === 0) {
          this.selectedIndex = 8
        } else {
          this.selectedIndex -= 1
        }
      } else {
        if (this.selectedIndex === 8) {
          this.selectedIndex = 0
        } else {
          this.selectedIndex += 1
        }
      }
      const currentImage = this.imagesList[this.selectedIndex].clothes
      this.changeDesigned(currentImage, this.selectedIndex)
    }
  }
}
</script>

<style lang="scss" scoped>
.design-warpper {
  height: 1000px;
  width: 100%;
  text-align: center;
  background: #f5f9fe;
  .warpper {
    width: 1200px;
    margin: 0 auto;
    .topic-description {
      margin-bottom: 69px;
    }
    .designedList {
      display: flex;
      justify-content: center;
      align-items: center;
      .designedImage {
        width: 95px;
        height: 95px;
        padding: 6px;
        margin-right: 7px;
        &:hover {
          box-shadow: 0px 5px 16px 0px rgba(134, 149, 224, 0.4);
        }
      }
      .active {
        border: 2px solid #3e47de;
      }
    }
    .image-warpper {
      width: 100%;
      margin-bottom: 46px;
      .preview-image {
        position: relative;
        width: 998px;
        height: 548px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        .left-icon,
        .right-icon {
          &:hover {
            box-shadow: 0px 5px 16px 0px rgba(134, 149, 224, 0.4);
          }
        }
        .big-image {
          width: 520px;
          height: 520px;
          position: relative;
          .basicBox,
          .designedBox {
            width: 520px;
            max-width: 520px;
            transition: width 2s;
            height: 520px;
            position: absolute;
            left: 0;
            top: 0;
            .el-image {
              width: 520px;
              height: 520px;
            }
          }
          .slideBox {
            position: absolute;
            overflow: hidden;
            height: 520px;
            top: 0;
            left: 16px;
            transition: left 2s;
            transform: translateX(-50%);
            cursor: pointer;
            .el-image {
              height: 520px;
              width: 32px;
            }
          }

          .designedBox {
            width: 0;
            overflow: hidden;
          }
        }
      }
    }
  }
}
</style>
