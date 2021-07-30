<template>
  <BaseDialog
    class="picUploadTableDialogComponent"
    :width="$attrs.width || '80%'"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template>
      <CommonTable
        ref="table"
        height="auto"
        :infoData="data"
        :cols="cols"
        :tableLoading="tableLoading"
        @selection-change="handleSelectionChange"
      >
        <template #empty>
          <el-button
            @click="uploadMorePic"
            class="empty-btn"
            type="text"
            icon="el-icon-plus"
            >添加图片</el-button
          >
        </template>
        <template #pathSlot="{ scoped: row, prop }">
          <CacheImg
            ref="img"
            style="width: 80px; height: 80px"
            :raw="row.raw"
            fit="contain"
          />
        </template>
        <template #titleHeaderSlot>
          <div class="title">名称</div>
        </template>
        <template #existSlot="{ scoped }">
          <el-tag type="warning" v-if="scoped[scoped.prop]">
            已存在，无需重复上传。
          </el-tag>
          <el-tag type="primary" v-else> 可上传 </el-tag>
        </template>

        <template #category_nameHeaderSlot>
          <div class="title">图片分类</div>
          <div class="sub-title">
            <CateHead
              :sup_this="cur_this"
              @updateSelectedData="updateSelectedData"
            />
          </div>
        </template>
        <template #category_nameSlot="{ scoped }">
          <div class="selected-type">
            {{ scoped[scoped.prop] }}
          </div>
          <div class="sub-title">
            <Cate
              :data="scoped"
              :sup_this="cur_this"
              @updateSelectedData="
                updateSelectedData($event, data[scoped.index] || {})
              "
            />
          </div>
        </template>
        <slot>
          <el-table-column label="操作" align="center" width="80px">
            <template slot-scope="scoped">
              <LoadingBtn type="text" @click="del(scoped.$index)" size="mini"
                >删除</LoadingBtn
              >
            </template>
          </el-table-column>
        </slot>
      </CommonTable>
    </template>
    <template #footer>
      <el-button :disabled="tableLoading" type="primary" @click="uploadHandler">
        上传
      </el-button>
      <LoadingBtn @click="cancel"> 取消 </LoadingBtn>
    </template>
  </BaseDialog>
</template>

<script>
import BulkShareHead from "./module/bulkShareHead";
import CateHead from "./module/cateHead";
import Cate from "./module/cate";
import CacheImg from "@/components/cacheImg";

import { publicCheck as check } from "@/api/imageApi";
import { compressFile } from "@/utils";
import { mapActions } from "vuex";
import cloneDeep from "lodash/cloneDeep";

export default {
  components: {
    BulkShareHead,
    CateHead,
    Cate,
    CacheImg,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    cols: {
      type: Array,
      default: () => [],
    },
    uploadFunc: {
      type: Function,
    },
    sup_this: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      cur_this: this,
      selectedData: [],
      tableLoading: false,

      loading: false,
      uploadStatus: undefined,
      batchForm: {},
      batchType: 0,
    };
  },
  computed: {
    formatRowUrl() {
      const tmpRaws = [];
      return ({ raw }, $el) => {
        console.log(URL);
        console.log("$el", $el);
        if (tmpRaws.includes(raw)) {
          if ($el && $el.src) {
            console.log($el.src);
            return $el.src;
          }
        }
        tmpRaws.push(raw);
        return URL.createObjectURL(raw);
      };
    },
  },
  methods: {
    ...mapActions(["ProAdd"]),
    async check() {
      this.tableLoading = true;
      const titles = this.data.map(({ title }) => title);
      try {
        const { code, detail } = (await check({ titles })) || {};
        if ($SUC({ code })) {
          const thumP = [];
          titles.map((title, index) => {
            thumP.push(compressFile(this.data[index].raw));
            if (detail.includes(title)) {
              this.$set(this.data[index], "exist", true);
            }
          });
          const thumData = await Promise.all(thumP);
          thumData.map((item, index) => {
            const { file, naturalWidth, naturalHeight } = item || {};
            if (!item) return;
            this.$set(this.data[index], "thumbnail_path", file);
            this.$set(this.data[index], "width", naturalWidth);
            this.$set(this.data[index], "height", naturalHeight);
          });
        }
      } catch (err) {
        console.log(err);
      }
      this.tableLoading = false;
    },
    updateSelectedData({ key, val }, data) {
      const selectedData = data ? [data] : this.selectedData;
      selectedData.map((item) => {
        this.$set(item, key, val);
      });
    },

    handleSelectionChange(selection) {
      this.selectedData = selection;
    },

    cancel() {
      this.$emit("update:dialogVisible", false);
    },

    //删除操作
    del(index) {
      this.data.splice(index, 1);
    },

    //上传
    async uploadHandler() {
      let {data} = this
      const uploadData = data.filter(({ exist }) => !exist)
      if (data.length === 0) {
        this.$message.warning('请先上传图片')
        return
      }
      if (uploadData.length !== data.length) {
        this.$message.warning('存在重复上传图片')
        return
      }
      await Promise.all(uploadData.map((form) => this.doAdd(form)))
      this.hideenTable()
      this.$nextTick(() => {
        this.cancel()
        this.sup_this && this.sup_this.init()
      })
    },
    hideenTable() {
      const ele = this.$refs.table.table.$el;
      ele.style.transition = `all .5s linear`;
      ele.style.webkitTransition = `all .5s linear`;
      ele.style.transform = `translate(calc(25vw + 400px), calc(20vh + 200px)) scale(0.05) rotate(360deg)`;
      ele.style.webkitTransform = `translate(calc(25vw + 400px), calc(20vh + 200px)) scale(0.05) rotate(360deg)`;
      ele.style.opacity = 0;
    },
    async doAdd(form) {
      await this.ProAdd(cloneDeep(form));
    },

    //上传其他图片
    uploadMorePic() {
      this.$emit("uploadMorePic");
    },
    inputHandler(val, { index, prop }) {
      this.$set(this.data[index], prop, val);
    },
    checkTag(tags) {
      let errorStr = [];
      tags.map((tag, indx) => {
        if (!isReasonableText(tag)) {
          errorStr.push(`"${tag}"`);
        }
      });
      if (errorStr.length > 0) {
        this.$message(
          `标签只能是包含大小写字母，中文，_的非空字符串, ${errorStr.join(
            "，"
          )}标签存在非法字符！！`
        );
        return false;
      }
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.picUploadTableDialogComponent {
  .exist {
    color: $color-warning;
  }
  ::v-deep {
    .el-table th.is-leaf {
      border: none;
      border-bottom: 1px solid #ebeeeff5;
      padding: 5px 0;
    }
    .el-table td {
      padding: 0;
    }
  }
  .createTags-wrapper {
    padding-top: 5px;
    height: 80px;
  }
  .title {
    font-size: 14px;
  }
  .sub-title {
    font-size: 12px;
    color: $color-primary;
    cursor: pointer;
  }
  .upload-success,
  .upload-error {
    font-size: 12px;
  }
  .upload-success {
    color: $color-success;
  }
  .upload-error {
    color: $color-danger;
  }
  .empty-btn {
    font-size: 20px;
    font-weight: 600;
  }
}
</style>