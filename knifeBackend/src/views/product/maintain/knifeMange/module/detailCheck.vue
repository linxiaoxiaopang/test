<template>
  <div class="detail-check">
    <!-- tools -->
    <div class="check-wrapper" v-for="(item, index) in check_group">
      <div class="image-wrapper">
        <div class="title">参考图</div>
        <div class="image">
          <img :src="main_group[index].group_img" alt="" />
        </div>
      </div>
      <div class="image-wrapper check">
        <div class="title">
          <span>校验图</span>
          <div class="right">
            <el-button class="button" type="primary" @click="verify({ item, index, is_right: 1 })">
              <i class="el-icon-check" v-show="item.is_right && item.is_right === 1"></i>
              通过</el-button
            >
            <el-button class="button" type="danger" @click="verify({ item, index, is_right: 0 })">
              <i class="el-icon-close" v-show="!item.is_right || item.is_right !== 1"></i>
              不通过</el-button
            >
          </div>
        </div>
        <div class="image">
          <img :src="item.group_img" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { deepClone } from '@/components/avue/utils/util'
import { mapState } from 'vuex'
export default {
  props: {
    main: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  computed: {
    ...mapState({
      checkImage: (state) => state.checkProd.checkImage
    }),
    main_group() {
      return this.main ? this.main.groups : []
    },
    check() {
      return this.checkImage[this.index]
    },
    check_group() {
      return this.check ? this.check.groups : []
    }
  },
  methods: {
    verify({ item, index, is_right }) {
      this.$store.commit('checkProd/SET_CHECK_IMAGE_GROUP', { id: this.check.id, index, is_right })
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-check {
  width: 100%;
  .check-wrapper {
    width: 100%;
    display: flex;
    border: 1px solid #dcdee0;
    margin-bottom: 20px;
    .image-wrapper {
      flex: 1;
      .title {
        height: 44px;
        display: flex;
        align-items: center;
      }
      .image {
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .check {
      margin-left: 20px;
      .title {
        justify-content: space-between;
      }
    }
  }
}
</style>
