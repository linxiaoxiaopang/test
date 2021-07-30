<template>
  <div class="proDetail">
    <ColorTextBtn @click="showDialog">查看详情</ColorTextBtn>
    <el-dialog title="查看详情" :visible.sync="dialogVisible" width="50%" top="10vh">
      <div class="container">
        <div class="baseInfoBox">
          <p class="titleFont">基础信息</p>
          <div class="baseInfo">
            <span class="baseInfoItem">定制产品名称 : {{ data.chinese_name }}</span>
            <span class="baseInfoItem">定制产品英文名称 : {{ data.english_name }}</span>
            <span class="baseInfoItem"
              >款式 :
              <span v-for="(item, index) in handleStyle(data)" :key="index">
                {{ item }}
              </span>
            </span>
            <span class="baseInfoItem"
              >尺码 :
              <span v-for="({ size_name }, index) in handleSize(data)" :key="index">
                {{ size_name }}
              </span>
            </span>
            <span class="baseInfoItem">分销商 : {{ data.create_by_name }}</span>
            <span class="baseInfoItem">定制时间 : {{ data.create_time | formatTime }}</span>
          </div>
        </div>
        <div class="prototypeBox">
          <p class="titleFont">原型信息</p>
          <div class="protoContent">
            <div class="protoContentItem">
              <p class="titleFont">原型 : {{ data.chinese_name }}</p>
              <el-popover placement="right" trigger="hover" :visible-arrow="false">
                <div slot="reference">
                  <el-image
                    style="width: 100px; height: 100px"
                    :src="data.products && data.products[0].spec_prods[0].path"
                    fit="contain"
                  ></el-image>
                </div>
                <el-image
                  fit="contain"
                  :src="data.products && data.products[0].spec_prods[0].path"
                  style="width: 450px; height: 450px"
                  :z-index="9999"
                >
                </el-image>
              </el-popover>
            </div>
            <div class="protoContentItem">
              <p class="titleFont">原图 :</p>
              <el-popover placement="right" trigger="hover" :visible-arrow="false">
                <div slot="reference">
                  <el-image
                    fit="contain"
                    style="width: 100px; height: 100px"
                    :src="data.images && data.images[0].path"
                  ></el-image>
                </div>
                <el-image
                  fit="contain"
                  :src="data.images && data.images[0].path"
                  style="width: 450px; height: 450px"
                  :z-index="9999"
                >
                </el-image>
              </el-popover>
            </div>
          </div>
        </div>
        <div class="effectPhotoBox">
          <div class="downBtnBox">
            <p class="titleFont">效果图</p>
            <el-button type="primary" size="mini" class="el-icon-download">批量下载</el-button>
          </div>
          <div>
            <el-tabs v-model="activeName">
              <el-tab-pane
                v-for="(item, index) in handleStyle(data)"
                :key="index"
                :name="index.toString()"
                :label="item"
              >
              </el-tab-pane>
              <span v-for="item in currentTab" :key="item">
                <el-popover placement="right" trigger="hover" :visible-arrow="false">
                  <span slot="reference">
                    <el-image
                      style="border: 1px solid #eeeeee; width: 100px; height: 100px; margin-right: 20px"
                      :src="item"
                      fit="contain"
                    ></el-image>
                  </span>
                  <el-image fit="contain" :src="item" style="width: 450px; height: 450px" :z-index="9999"> </el-image>
                </el-popover>
              </span>
            </el-tabs>
          </div>
        </div>
        <div class="knifeTable">
          <el-table :data="detail.spec_prods">
            <el-table-column label="自定义SKU"></el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="comfirmDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDetail } from '../resellerAPI'
export default {
  props: {
    detailData: {
      type: Object
    }
  },

  data() {
    return {
      dialogVisible: false,
      data: this.detailData,
      activeName: '0',
      detail: {}
    }
  },

  async mounted() {
    try {
      const id = this.data.id
      const { detail } = await getDetail(id)
      this.detail = detail
      console.log('detail', this.detail)
    } catch (err) {
      console.log(err)
    }
  },

  computed: {
    currentTab() {
      try {
        if (!this.detail) return
        return (
          this.detail &&
          this.detail.products[this.activeName].prod_show_images.map((item) => {
            return item.path
          })
        )
      } catch (error) {}
    }
  },
  components: {},
  methods: {
    showDialog() {
      console.log('this.data', this.data)
      this.dialogVisible = true
    },
    comfirmDialog() {
      this.dialogVisible = false
    },
    closeDialog() {
      this.dialogVisible = false
    },
    handleStyle(data) {
      if (Array.isArray(data.products)) {
        return data.products.map((item) => {
          return item.struct_name
        })
      }
      return []
    },
    handleSize(data) {
      if (Array.isArray(data.products)) {
        return data.products[0].spec_prods.map((item) => {
          return item
        })
      }
      return []
    },
    handleStyle(data) {
      if (Array.isArray(data.products)) {
        return data.products.map((item) => {
          return item.struct_name
        })
      }
      return []
    }
  }
}
</script>

<style scoped lang="scss">
.proDetail {
  text-align: left;
  ::v-deep {
    .el-dialog__header {
      border-bottom: 1px solid #ccc;
    }
    .el-dialog__title {
      font-size: 14px;
      color: #595961;
    }
  }
  .container {
    overflow: auto;
    width: 100%;
    height: 600px;
    .titleFont {
      margin-top: 0;
    }
    .baseInfoBox {
      margin-bottom: 30px;
      width: 100%;
      .baseInfo {
        display: flex;
        flex-wrap: wrap;
        .baseInfoItem {
          width: 50%;
        }
      }
    }
    .prototypeBox {
      width: 100%;
      margin-bottom: 30px;
      .protoContent {
        display: flex;
        flex-wrap: wrap;
        .protoContentItem {
          width: 50%;
        }
      }
    }
    .effectPhotoBox {
      .downBtnBox {
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>
