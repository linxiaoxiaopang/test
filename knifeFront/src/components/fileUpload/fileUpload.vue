<template>
  <div class="imgUpLoadComponent">
    <div class="list">
      <div
        v-for="(file, indx) in files || []"
        v-loading="loading"
        :class="['item', file.uploadStatus === 'success' && 'success-item']"
        :style="{
          width: $attrs.size || '148px',
          height: $attrs.size || '148px',
          'line-height': $attrs.size || '148px',
        }"
        :key="indx"
      >
        <div class="card-wrapper">
          <label
            v-if="file.uploadStatus"
            :class="[
              'el-upload-list__item-status-label',
              file.uploadStatus === 'fail' && 'error',
            ]"
          >
            <i
              class="el-icon-upload-success el-icon-check"
              v-if="file.uploadStatus === 'success'"
            ></i>
            <i
              class="el-icon-upload-success el-icon-warning-outline"
              v-else-if="file.uploadStatus === 'fail'"
            >
            </i>
          </label>
          <div class="dialog">
            <i class="el-icon-delete" @click="deleteHandler(file, indx)"></i>
          </div>
          <!-- <el-image fit="scale-down" :src="file | formatRowUrl" /> -->
          <div class="file-wrapper">
            <i class="el-icon-s-order"></i>
            <span>{{ file.name || getFileName(file) }}</span>
          </div>
        </div>
      </div>
      <div
        v-if="showUploadBtn"
        class="upload-item"
        :style="{
          width: $attrs.size || '148px',
          height: $attrs.size || '148px',
          'line-height': $attrs.size || '148px',
        }"
      >
        <el-upload
          :http-request="requestHandler"
          :file-list="files"
          :show-file-list="false"
          :action="$attrs.action || '#'"
          :list-type="$attrs['list-type'] || 'picture-card'"
          style="width: 100%; height: 100%"
          :before-upload="$attrs['before-upload'] || beforeUpload"
          :multiple="$attrs.multiple === undefined ? true : false"
          v-bind="$attrs"
          v-on="$listeners"
        >
          <slot>
            <i slot="default" class="el-icon-plus"></i>
          </slot>
          <template #tip>
            <slot name="tip" />
          </template>
        </el-upload>
      </div>
    </div>
  </div>
</template>
<script>
import commonPrivateMixin from './mixins/commonPrivateMixin'
export default {
  name: 'crudFileUpload',
  mixins: [commonPrivateMixin],
}
</script>
<style lang="scss" scoped>
.imgUpLoadComponent {
  .list {
    display: flex;
    flex-wrap: wrap;
    .item,
    .upload-item {
      margin-right: 10px;
      margin-bottom: 10px;
      border: 1px solid $border-color;
      border-radius: 4px;
      .card-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        .el-upload-list__item-status-label {
          display: block;
          position: absolute;
          right: -17px;
          top: -7px;
          width: 46px;
          height: 26px;
          background: #13ce66;
          text-align: center;
          transform: rotate(45deg);
          box-shadow: 0 1px 1px #ccc;
          line-height: 40px;
          z-index: 10;
          i {
            font-size: 12px;
            margin-top: 12px;
            transform: rotate(-45deg);
            font-weight: 600;
          }
          .el-icon-check,
          .el-icon-warning-outline {
            display: inline-block;
            width: 20px;
            text-align: right;
            color: #fff;
          }
        }
        .error {
          background: $color-danger;
        }
        .dialog {
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.5);
          i {
            font-size: 30px;
            color: #fff;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
      .card-wrapper:hover {
        .dialog {
          display: block;
        }
        .success-dialog {
          display: none;
        }
      }
      ::v-deep {
        .el-loading-spinner {
          line-height: 1;
        }
        .el-upload {
          width: 100%;
          height: 100%;
          line-height: inherit;
          .el-icon-plus {
            line-height: inherit;
          }
        }
      }

      .el-upload.el-upload,
      .el-image,
      .file-wrapper {
        width: 100%;
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
          padding: 0 1rem;
          word-break: break-all;
        }
      }
    }
    .upload-item {
      border: none;
    }
    //上传成功，隐藏上传按钮
    .success-item + .upload-item {
      display: none;
    }
  }
}
</style>
