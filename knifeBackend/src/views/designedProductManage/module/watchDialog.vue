<template>
  <div class="dialog-warpper">
    <el-dialog
      title="查看详情"
      :visible.sync="visible"
      width="50%"
      :before-close="handleClose"
      top="10vh"
    >
      <div class="content-warpper">
        <div class="basic-information-warpper">基础信息</div>
        <div class="flex">
          <span class="count">定制产品名称：{{ handleCnName(product) }}</span>
          <span class="count">定制产品英文名称：{{ handleEnName(product) }}</span>
        </div>
        <div class="flex">
          <span class="count">款式：{{ handleStyle(product) }}</span>
          <span class="count">尺码：{{ handleSize(product) }}</span>
        </div>
        <div class="flex">
          <span class="count">账号：{{ product.create_by_account }}</span>
          <span class="count">分销商：{{ product.create_by_name }} </span>
        </div>
        <div class="flex">
          <span>定制时间：{{ product.create_time | formatTime }}</span>
        </div>
        <div class="information-warpper">原型信息</div>
        <div class="flex-warpper">
          <div class="left">
            <div class="model">原型：{{ product.name }}</div>
            <el-popover placement="right" trigger="hover" :visible-arrow="false">
              <div slot="reference">
                <el-image
                  fit="contain"
                  style="width: 100px; height: 100px; border: 1px solid #eeeeee"
                  :src="picture"
                ></el-image>
              </div>
              <div style="height: 40px; line-height: 32px; background: #fff">
                {{ product.chinese_name }}
              </div>
              <el-image
                fit="contain"
                :src="picture"
                style="width: 450px; height: 450px"
                :z-index="9999"
              >
              </el-image>
            </el-popover>
          </div>
          <div class="right">
            <div class="model">原图：</div>
            <el-popover placement="right" trigger="hover" :visible-arrow="false">
              <div slot="reference">
                <el-image
                  fit="contain"
                  style="width: 100px; height: 100px; border: 1px solid #eeeeee"
                  :src="originalPicture"
                ></el-image>
              </div>
              <div style="height: 40px; line-height: 32px; background: #fff">
                {{ product.chinese_name }}
              </div>
              <el-image
                fit="contain"
                :src="originalPicture"
                style="width: 450px; height: 450px"
                :z-index="9999"
              >
              </el-image>
            </el-popover>
          </div>
        </div>
        <div class="picture-warpper">
          <div>效果图:</div>
          <el-button
            type="primary"
            style="padding: 0; height: 30px; width: 100px"
            icon="el-icon-download"
            @click="downloadDesignedPicture"
            >批量下载</el-button
          >
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane
            v-for="(item, index) in handleTab"
            :key="index"
            :label="item"
            :name="index.toString()"
          >
          </el-tab-pane>
          <span v-for="item in currentTab" :key="item">
            <el-popover placement="right" trigger="hover" :visible-arrow="false">
              <span slot="reference">
                <el-image
                  fit="contain"
                  style="
                    border: 1px solid #eeeeee;
                    width: 100px;
                    height: 100px;
                    margin-right: 20px;
                  "
                  :src="item"
                ></el-image>
              </span>
              <div style="height: 40px; line-height: 32px; background: #fff">
                {{ product.chinese_name }}
              </div>
              <el-image
                fit="contain"
                :src="item"
                style="width: 450px; height: 450px"
                :z-index="9999"
              >
              </el-image>
            </el-popover>
          </span>
        </el-tabs>
        <div class="basic-picture-warpper">
          <div>刀版图:</div>
          <el-button
            type="primary"
            style="padding: 0; height: 30px; width: 100px"
            icon="el-icon-download"
            @click="downloadBasicPicture"
            >批量下载</el-button
          >
        </div>
        <div class="table-warpper">
          <el-table :data="specProds" border ref="watchTableRef">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="自定义sku">
              <template slot-scope="{ row }">
                {{ row.custom_sku || "暂无" }}
              </template>
            </el-table-column>
            <el-table-column label="外部sku">
              <template slot-scope="{ row }">
                <el-popover
                  v-if="handleSku(row).length"
                  placement="top"
                  trigger="hover"
                  :visible-arrow="false"
                >
                  <div slot="reference">
                    <span style="color: #3841db; cursor: pointer">查看外部sku</span>
                  </div>
                  <div style="height: 100px; overflow: auto">
                    <div v-for="(item, index) in handleSku(row)" :key="index">
                      {{ item }}
                    </div>
                  </div>
                </el-popover>
                <div v-else>暂无</div>
              </template>
            </el-table-column>
            <el-table-column prop="basicPicture" label="刀版图">
              <template slot-scope="{ row }">
                <el-popover placement="top" trigger="hover" :visible-arrow="false">
                  <div slot="reference">
                    <el-image
                      v-if="row.path"
                      fit="contain"
                      :src="row.path"
                      style="width: 50px; height: 50px"
                    ></el-image>
                  </div>
                  <el-image
                    v-if="row.path"
                    fit="contain"
                    :src="row.path"
                    style="width: 450px; height: 450px"
                  ></el-image>
                </el-popover>

                <span v-if="!row.path">暂无</span>
              </template>
            </el-table-column>
            <el-table-column prop="isBasicGenerate" label="刀版图是否生成">
              <template slot-scope="{ row }">
                <span v-if="row.path">已生成</span>
                <span v-else>未生成</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="{ row }">
                <span
                  v-if="row.path"
                  style="color: #3841db; cursor: pointer"
                  @click="download(row)"
                  >下载</span
                >
                <span v-else>暂无</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { basicListCols as cols } from "../../picture/basePicListPage/module/designedDialog/cols";
// import { downloadByZip } from '../download'
import { createRandomNum } from "@/utils";
export default {
  props: {
    visible: {
      type: Boolean,
    },
    product: {
      type: Object,
    },
  },
  data() {
    return {
      cols,
      activeName: "0",
      tableData: [
        {
          orderNumber: "",
          way: "",
          expressNumber: "",
          expressTime: "",
          basicState: "",
          importTime: "",
          state: "",
        },
      ],
    };
  },
  computed: {
    specProds() {
      try {
        const { spec_prods } = this.product.products[this.activeName];
        if (!Array.isArray(spec_prods)) {
          return [];
        }
        return spec_prods;
      } catch (err) {
        return [];
      }
    },
    currentTab() {
      try {
        if (!this.product) return;
        return (
          this.product &&
          this.product.products[this.activeName].prod_show_images.map((item) => {
            return item.path;
          })
        );
      } catch (error) {}
    },
    picture() {
      try {
        if (!this.product) return;
        return this.product && this.product.products[0].prim_struct.figures[0].path;
      } catch (error) {}
    },
    originalPicture() {
      try {
        if (!this.product) return;
        return this.product && this.product.images[0].thumbnail_path;
      } catch (error) {}
    },
    handleTab() {
      const data = this.product;
      return (
        data.products &&
        data.products.map((item) => {
          return item.prim_struct.structure;
        })
      );
    },
  },
  methods: {
    //使用迅雷下载
    downloadByPath(paths) {
      const tasks = paths.map((url) => {
        return {
          name: "",
          url: `${url}?uid=${createRandomNum()}`,
        };
      });
      thunderLink.newTask({
        downloadDir: "", // 指定当前任务的下载目录名称，迅雷会在用户剩余空间最大的磁盘根目录中创建这个目录。【若不填此项，会下载到用户默认下载目录】
        tasks,
      });
    },
    handleSize(data) {
      const size =
        data.products &&
        data.products[0].spec_prods.map((item) => {
          return item.size_name;
        });
      return size && size.join(" ");
    },
    handleCnName(data) {
      return data.chinese_name ? data.chinese_name : "暂无";
    },
    handleEnName(data) {
      return data.english_name ? data.english_name : "暂无";
    },
    handleClose() {
      this.$emit("update:visible", false);
    },
    handleCustomSku(data) {
      const res = data.spec_prods.map((item) => {
        return item.custom_sku || "暂无";
      });
      return res.join("");
    },
    handleSku(data) {
      const res = data.sku_maps.map((item) => {
        return item.user_sku;
      });
      return res;
    },
    handleStyle(data) {
      const style =
        data.products &&
        data.products.map((item) => {
          return item.prim_struct.structure;
        });
      return style && style.join(" ");
    },
    handleClick(tab) {},
    download(data) {
      let paths = [];
      const url = data.path;
      if (url) {
        paths.push(url);
      }
      this.downloadByPath(paths); // 修改文件夹名字，填在空字符串内
      return;
    },
    downloadDesignedPicture() {
      let paths = [];
      this.product.products.map((product) => {
        product.prod_show_images.map((figure) => {
          if (figure.path) {
            paths.push(figure.path);
          }
        });
      });
      this.downloadByPath(paths);
      return;
    },
    downloadBasicPicture() {
      let selections = this.$refs.watchTableRef.selection;
      if (!selections.length) {
        this.$message.warning("请先选择刀版图后再进行批量下载操作");
        return;
      }
      let paths = [];
      selections.map((selection) => {
        const url = selection.path;
        if (url) {
          paths.push(url);
        }
      });
      this.downloadByPath(paths);
      return;
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-warpper {
  ::v-deep {
    .el-dialog {
      border-radius: 4px;
      overflow: hidden;
    }
  }
  .table-warpper {
    padding: 0px 24px 10px 0;
  }
  .content-warpper {
    height: 700px;
    overflow: auto;
    padding: 22px 0 18px 24px;
    .basic-picture-warpper {
      margin: 40px 24px 20px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    ::v-deep {
      .el-tabs__nav-wrap {
        margin-right: 24px !important;
      }
    }
    .information-warpper {
      padding-top: 24px;
    }
    .picture-warpper {
      margin: 34px 24px 0 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .flex-warpper {
      display: flex;
      ::v-deep {
        .el-popover__reference-wrapper {
          display: inline-block;
          width: 100px;
        }
      }
      .left,
      .right {
        flex: 1;
        .model {
          margin: 18px 0 20px 0;
        }
      }
    }
    .basic-information-warpper {
      margin-bottom: 23px;
    }
    .flex {
      display: flex;
      margin-bottom: 14px;
      .count {
        flex: 1;
      }
    }
  }
  ::v-deep {
    .el-dialog__title {
      font-size: 14px;
      color: #1a1a1a;
    }
    .el-dialog__header {
      height: 56px;
      line-height: 56px;
      padding: 0 0 0 22px;
      border: 1px solid #dcdee0;
    }
    .el-dialog__body {
      padding: 0 !important;
      color: #595961;
    }
  }
}
</style>
