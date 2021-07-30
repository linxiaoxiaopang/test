<template>
  <div class="inline-block previewComponent">
    <el-button
      icon="el-icon-view"
      size="small"
      @click="toggleShow(true)"
      :class="{ normal: isNormalFont }"
    >
      预览
    </el-button>
    <transition name="el-fade-in-linear">
      <div class="dailog" v-if="previewShow">
        <i class="del el-icon-close" @click="toggleShow(false)"> </i>
        <Exhibition :data="swiperData || []" />
      </div>
    </transition>
  </div>
</template>

<script>
import Exhibition from '@/views/design/detail/module/exhibition'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components: {
    Exhibition
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    isNormalFont: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['previewShow']),
    swiperData() {
      let tmp = []
      this.data.map((list) => {
        if (!Array.isArray(list)) return []
        return list.map((item) => {
          let obj = {}
          obj.mid = item.base64Pic || item.white_show
          obj.small = obj.mid
          tmp.push(obj)
        })
      })
      return tmp
    }
  },
  methods: {
    ...mapMutations(['UPDATE_PREVIEW_SHOW']),
    toggleShow(bool) {
      this.UPDATE_PREVIEW_SHOW(bool)
    }
  }
}
</script>

<style lang="scss" scoped>
.previewComponent {
  color: #fff;
  font-size: 12px;
  margin-right: 10px;
  cursor: pointer;
  .normal {
    font-size: 14px;
    height: 40px;
    width: 117px;
  }
  i {
    position: relative;
    top: 2px;
    font-size: 18px;
    margin-right: 3px;
  }
  .dailog {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    padding: 40px;
    width: 70vw;
    height: 80vh;
    background: #fff;
    z-index: 10000;
    box-shadow: 0px 3px 10px 0px rgba(47, 72, 124, 0.14);
    border-radius: 8px;
    .del {
      position: absolute;
      top: 10px;
      right: 1rem;
      font-size: 30px;
      z-index: 1;
      color: $color-gray;
    }
  }
}
</style>
