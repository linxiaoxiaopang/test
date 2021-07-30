<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      custom-class="preview-img-dialog"
      width="1200px"
    >
      <el-button
        type="text"
        icon="el-icon-close"
        class="custom-dialog-close"
        @click="dialogVisible = false"
      ></el-button>
      <el-carousel
        :interval="5000"
        arrow="always"
        indicator-position="none"
        :autoplay="false"
        class="img-bg"
      >
        <el-carousel-item v-for="item in 1" :key="item">
          <el-image :src="data.path" fit="contain" class="h100 bg">
            <div slot="error" class="image-slot">
              <img
                src="@/assets/images/default.png"
                fit="contain"
                alt=""
                class="block"
              />
            </div>
          </el-image>
        </el-carousel-item>
      </el-carousel>
      <div class="more-info">
        <div class="base-info">
          <div class="title">基本信息</div>
          <div class="content">
            <div class="item">
              <span class="label">名称</span>
              <span class="input">{{ data.title }}</span>
            </div>
            <div class="item">
              <span class="label">上传来源</span>
              <span class="input">{{ data.created_user_name }}</span>
            </div>
            <div class="item">
              <span class="label">图片分类</span>
              <span class="input">{{ data.category_name }}</span>
            </div>
            <div class="item">
              <span class="label">上传时间</span>
              <span class="input">{{
                parseCharacterTime(data.create_time)
              }}</span>
            </div>
          </div>
        </div>
        <div class="base-info">
          <div class="title">
            <span>定制过的产品</span>
            <el-button type="text" @click="dialogVisible = false"
              >查看更多</el-button
            >
          </div>
          <el-row :gutter="20" class="content">
            <el-col :span="8" v-for="item in 4" :key="item">
              <div class="img-bg">
                <img :src="data.src" alt="" height="100%" />
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { dialogComponentsMixin } from '@/mixins'
import { parseCharacterTime } from '@/utils'

export default {
  mixins: [dialogComponentsMixin],
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  methods: {
    parseCharacterTime
  }
}
</script>

<style lang="scss">
.bg {
  background: #fff;
}
</style>
