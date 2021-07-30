<template>
  <BaseDialog maxHeight="50vh" :dialogVisible.sync="dialog" :title="title">
    <div class="updateCateComponent" v-loading="loading">
      <div class="header">
        <el-form
          ref="form"
          style="width: 300px"
          label-position="left"
          label-suffix=":"
          :model="form"
          :rules="rules"
          label-width="auto"
        >
          <el-form-item label="产品分类" prop="category">
            <!-- <ProtoTypeTreeSelect
              :selectedValue.sync="form.category"
              :maxHeight="100"
            /> -->
            <Cascader :selectedValue.sync="form.category" />
          </el-form-item>
        </el-form>
      </div>
      <div class="table-wrapper">
        <div class="label">已勾选的产品：</div>
        <CommonTable
          height="auto"
          :selection="false"
          :cols="cols"
          :infoData="data"
        >
          <template #mergeSlot="{ scoped }">
            <div class="merge-slot-class">
              <el-image
                style="width: 60px; height: 60px"
                :src="figure(scoped)"
                fit="contain"
              ></el-image>
              <div>
                <div>
                  {{ scoped.name || "暂无名字" }}
                </div>
              </div>
            </div>
          </template>
          <slot>
            <el-table-column align="center" label="操作" width="100px">
              <template slot-scope="{ $index }">
                <ColorTextBtn type="primary" @click="moveHanlder($index)">
                  移除
                </ColorTextBtn>
              </template>
            </el-table-column>
          </slot>
        </CommonTable>
      </div>
    </div>

    <template #footer>
      <LoadingBtn @click="cancel"> 取消 </LoadingBtn>
      <el-button @click="doSubmit" type="primary"> 确定 </el-button>
    </template>
  </BaseDialog>
</template>
<script>
import Cascader from "@/components/cascader";

import { proCateCols as cols } from "./cols";
import { commonFromMixin } from "@/mixins";
import { bulkChangeProd } from "@/api/product/productApi";

export default {
  mixins: [commonFromMixin],
  components: {
    Cascader,
  },
  props: {
    name: String,
    isAdd: {
      type: Boolean,
      default: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      cols,
      loading: false,
      form: {
        category: [],
      },
      rules: {
        category: [
          { required: true, message: "产品分类必填", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    figure() {
      return (row) => {
        try {
          const {
            prim_struct: [{ figures = [] }],
          } = row || {};
          if (!figures || !figures.length) {
            return require("@/assets/images/logo.png");
          }
          const cover = figures.filter(({ isCover }) => isCover);
          return (
            (cover[0] && cover[0].path) || require("@/assets/images/logo.png")
          );
        } catch (err) {
          return require("@/assets/images/logo.png");
        }
      };
    },
  },
  methods: {
    moveHanlder(index) {
      this.data.splice(index, 1);
    },
    async doSubmit() {
      const success = await this.validate();
      console.log("success", success);
      if (!success) return;
      this.doChange();
    },
    async doChange() {
      this.loading = true;
      try {
        const { code } = await bulkChangeProd({
          ids: this.data.map(({ id }) => id),
          category: this.form.category.pop(),
        });
        if ($SUC({ code })) {
          this.success();
        }
      } catch (err) {}
      this.loading = false;
    },
    success() {
      this.$message.success("操作成功");
      this.init();
      this.$nextTick(() => {
        this.dialog = false;
      });
    },
    cancel() {
      this.dialog = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.updateCateComponent {
  display: flex;
  flex-direction: column;
  max-height: 50vh;
  .header {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 15px;
    align-items: center;
  }
  .table-wrapper {
    flex: 1;
    overflow: auto;
    .label {
      margin-bottom: 10px;
    }
    .el-table {
      border: 1px solid #ebeef5;
      border-right: none;
      ::v-deep {
        td {
          border-right: none;
        }
      }
    }
    .merge-slot-class {
      display: flex;
      align-items: center;
      .el-image {
        margin-right: 10px;
      }
    }
  }
}
</style>