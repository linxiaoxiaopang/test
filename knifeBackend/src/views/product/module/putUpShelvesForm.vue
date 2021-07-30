<template>
  <BaseDialog height="auto" :dialogVisible.sync="dialog" :title="title">
    <div class="recoveryShelvesFormComponent" v-loading="loading">
      <div class="table-wrapper">
        <CommonTable
          height="auto"
          :selection="false"
          :cols="cols"
          :infoData="data"
        >
          <template #nameSlot="{ scoped, scoped: { index } }">
            <el-checkbox
              v-model="data[index].status"
              @change="proStatusChangeHandler($event, index)"
            >
              {{ scoped[scoped.prop] }}
            </el-checkbox>
            <!-- <el-tag type="danger" size="mini">
              {{ scoped[scoped.prop] }}
            </el-tag> -->
          </template>

          <template #prim_structSlot="{ scoped, scoped: { index } }">
            <template v-for="item in scoped[scoped.prop] || []">
              <el-checkbox
                :key="item.id"
                v-model="item.status"
                @change="structChangeHandler($event, index)"
                >{{ item.structure }}</el-checkbox
              >
            </template>

            <div class="put-on-list" v-if="putOnPrim_structs(index).length">
              <div class="label">已上架原型款式:</div>
              <div class="item-list">
                <template v-for="item in putOnPrim_structs(index)">
                  <el-tag size="mini" type="primary" :key="item.id">{{
                    item.structure
                  }}</el-tag>
                </template>
              </div>
            </div>
          </template>

          <template #sizesSlot="{ scoped, scoped: { index } }">
            <template v-for="item in scoped[scoped.prop] || []">
              <el-checkbox
                :key="item.id"
                v-model="item.status"
                @change="sizeChangeHandler($event, index)"
                >{{ item.size_name }}</el-checkbox
              >
            </template>

            <div class="put-on-list" v-if="putOnSizes(index).length">
              <div class="label">已上架原型尺码:</div>
              <div class="item-list">
                <template v-for="item in putOnSizes(index)">
                  <el-tag size="mini" type="primary" :key="item.id">{{
                    item.size_name
                  }}</el-tag>
                </template>
              </div>
            </div>
          </template>
          <template #messageSlot="{ scoped }">
            <color-text-btn
              :type="scoped[scoped.prop].status ? 'success' : 'danger'"
            >
              <div class="text">
                {{ scoped[scoped.prop].text }}
              </div>
            </color-text-btn>
          </template>
        </CommonTable>
      </div>
    </div>

    <template #footer>
      <LoadingBtn @click="cancel"> 取消 </LoadingBtn>
      <el-button :loading="loading" type="primary" @click="doSubmit" size="small">
        {{ title }}
      </el-button>
    </template>
  </BaseDialog>
</template>
<script>
import { offShelvesDialogCols as cols } from "../cols";
import { commonFromMixin } from "@/mixins";
import { waitToputOn as putOn } from "@/api/product/productApi";

export default {
  mixins: [commonFromMixin],
  props: {
    cData: {
      type: Array,
      required: true,
    },
    putUpData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      cols,
      data: this.cData,
      value: "",
      loading: false,
    };
  },

  computed: {
    putOnSizes() {
      return (index) => {
        try {
          const { sizes = [] } = this.putUpData[index];
          if (Array.isArray(sizes)) {
            return sizes;
          }
          return [];
        } catch (err) {
          return [];
        }
      };
    },

    putOnPrim_structs() {
      return (index) => {
        try {
          const { prim_struct = [] } = this.putUpData[index];
          if (Array.isArray(prim_struct)) {
            return prim_struct;
          }
          return [];
        } catch (err) {
          return [];
        }
      };
    },
  },
  methods: {
    allProChangeHandler(checked) {
      this.data.map((item) => {
        const { prim_struct = [], sizes = [] } = item;
        this.updateDataStatus([[item], prim_struct, sizes], checked);
      });
    },
    proStatusChangeHandler(checked, index) {
      const { prim_struct = [], sizes = [] } = this.data[index];
      this.updateDataStatus([prim_struct, sizes], checked);
    },

    structChangeHandler(checked, index) {
      const { prim_struct = [], sizes = [] } = this.data[index];
      if (
        checked &&
        prim_struct.every(({ status }) => status) &&
        sizes.every(({ status }) => status)
      ) {
        this.updateDataStatus([[this.data[index]]], checked);
      }
      if (!checked) {
        this.updateDataStatus([[this.data[index]]], checked);
      }
      this.validMessage(this.data[index], index);
    },

    sizeChangeHandler(checked, index) {
      const { prim_struct = [], sizes = [] } = this.data[index];
      if (
        checked &&
        sizes.every(({ status }) => status) &&
        prim_struct.every(({ status }) => status)
      ) {
        this.updateDataStatus([[this.data[index]]], checked);
      }
      if (!checked) {
        this.updateDataStatus([[this.data[index]]], checked);
      }
      this.validMessage(this.data[index], index);
    },

    updateDataStatus(datas, checked) {
      datas.map((data) => {
        data.map((item) => {
          this.$set(item, "status", checked);
        });
      });
    },
    existPuOn(index = 0) {
      const data = this.putUpData[index];
      const { prim_struct = [], sizes = [] } = data || {};
      return !!(prim_struct.length || sizes.length);
    },
    validMessage(data, index) {
      const existPuOn = this.existPuOn(index);
      const { prim_struct = [], sizes = [] } = data;
      const sizesSuccess = sizes.some(({ status }) => status);
      const structSuccess = prim_struct.some(({ status }) => status);
      if (existPuOn) {
        return this.$set(data, "message", {
          status: true,
          text: "",
        });
      }

      if (sizesSuccess) {
        if (!structSuccess) {
          return this.$set(data, "message", {
            status: false,
            text: "线上不存在款式，尺码已选择， 款式也必须选择。",
          });
        }
      }

      if (structSuccess) {
        if (!sizesSuccess) {
          return this.$set(data, "message", {
            status: false,
            text: "线上不存在尺码，款式已选择，尺码也必须选择。",
          });
        }
      }

      return this.$set(data, "message", {
        status: true,
        text: "",
      });
    },
    async doSubmit() {
      const success = this.data.every(({ message }) => message.status);
      if (!success) {
        return this.$message.warning("请查看提示，存在不合理操作！");
      }
      const params = this.getParams();
      this.doPutUp(params);
    },
    getParams() {
      const primIds = [];
      let structIds = [];
      let sizesIds = [];
      this.data.map(({ prim_struct, sizes, id, status }) => {
        // if (!this.existPuOn(0)) {
        //   primIds.push(id);
        // }
        primIds.push(id);
        structIds = structIds.concat(
          prim_struct.filter(({ status }) => status).map(({ id }) => id)
        );
        sizesIds = sizesIds.concat(
          sizes.filter(({ status }) => status).map(({ id }) => id)
        );
      });
      return {
        primIds,
        structIds,
        sizesIds,
      };
    },
    async doPutUp(params) {
      this.loading = true;
      try {
        const { code } = await putOn(params);
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
.recoveryShelvesFormComponent {
  display: flex;
  flex-direction: column;
  height: 100%;
  .off-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    align-items: flex-end;
    .el-input {
      width: 250px;
    }
  }
  .table-wrapper {
    flex: 1;
    overflow: auto;
    .put-on-list {
      border: 1px solid $border-color;
      padding: 5px;
      margin-top: 10px;
      overflow: hidden;
      .label {
        float: left;
        margin-right: 5px;
      }
      .el-tag {
        margin-right: 5px;
        margin-bottom: 5px;
      }
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
    .text {
      top: 15px;
      position: absolute;
      width: 80%;
      left: 10%;
      text-align: left;
      font-size: 12px;
      white-space: normal;
    }
  }
}
</style>