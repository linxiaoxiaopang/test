<template>
  <div class="fileItemComonent">
    <div class="file-item">
      <template v-for="(file, index) in data">
        <div
          :key="index"
          class="file-wrapper"
          v-if="getFileSuffix(file) === 'json'"
        >
          <i class="el-icon-s-order"></i>
          <span>{{ file.name || getFileName(file) }}</span>
        </div>
        <div :key="index" class="card-wrapper" v-else>
          <div class="pic-name">
            {{ file.name || getFileName(file) }}
          </div>
          <el-image fit="contain" :src="file | formatRowUrl" />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { getPicName, getFileSuffix } from "@/utils";
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  filters: {
    //格式化图片地址
    formatRowUrl(file) {
      let url = file.url || file.path;
      if (url) {
        if (!/^http/.test(url)) {
          return `${serverRootPath}${url}`;
        }
        return url;
      }
      return URL.createObjectURL(file);
    },
  },
  computed: {
    getFileName() {
      return (file) => {
        return getPicName(decodeURIComponent(file.url || file.path || ""));
      };
    },
    getFileSuffix() {
      return (file) => {
        const suffix = getFileSuffix(file.name || file.url || file.path || "");
        return suffix;
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.fileItemComonent {
  .file-item {
    width: 100%;
    display: flex;
    height: 100px;
  }
  .card-wrapper {
    width: 50%;
    height: 100%;
    position: relative;
    overflow: hidden;
    .pic-name {
      position: absolute;
      height: 1rem;
      width: 100%;
      line-height: 1rem;
      z-index: 100;
      left: 0;
      bottom: 0;
      font-size: 12px;
      background: $color-primary;
      color: #fff;
      text-align: center;
      @include overflow;
      border-radius: 4px 4px 0 0;
    }
    .el-image {
      width: 100%;
      height: 100%;
      background: #eee;
    }
  }
  .file-wrapper {
    width: 50%;
    height: 100%;
  }
  .file-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    i {
      margin-bottom: 20px;
      line-height: 1;
      font-size: 60px;
    }
    span {
      line-height: 1;
      padding: 0 0.25rem;
      display: inline-block;
      width: 100%;
      padding-bottom: 8px;
      @include overflow;
    }
  }
}
</style>