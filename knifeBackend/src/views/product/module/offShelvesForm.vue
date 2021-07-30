<template>
  <BaseDialog
    :height="showSearch ? '50vh' : 'auto'"
    :dialogVisible.sync="dialog"
    :title="title"
  >
    <div class="offShelvesFormComponent" v-loading="loading">
      <div class="off-header" v-if="showSearch">
        <el-checkbox v-model="checked">全选</el-checkbox>
        <el-input
          placeholder="搜索原型名称"
          suffix-icon="el-icon-search"
          v-model="value"
        >
        </el-input>
      </div>
      <div class="table-wrapper">
        <CommonTable
          height="auto"
          :selection="false"
          :cols="cols"
          :infoData="domData"
        >
          <template #nameSlot="{ scoped, scoped: { index } }">
            <el-checkbox
              v-model="data[index].status"
              @change="proStatusChangeHandler($event, index)"
            >
              {{ scoped[scoped.prop] }}
            </el-checkbox>
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
          </template>
          <template #messageSlot="{ scoped }">
            <color-text-btn
              :type="scoped[scoped.prop].status ? 'success' : 'danger'"
            >
              {{ scoped[scoped.prop].text }}
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
import { bulkOff, putOn } from "@/api/product/productApi";

export default {
  mixins: [commonFromMixin],
  props: {
    showSearch: {
      type: Boolean,
      default: true,
    },
    isOff: {
      type: Boolean,
      required: true,
    },
    cData: {
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
    domData() {
      if (!this.value) {
        return this.data;
      }
      return this.data.filter(({ name }) => this.value.indexOf(name) >= 0);
    },
    checked: {
      get() {
        return this.data.every(({ status }) => {
          return status;
        });
      },
      set(checked) {
        this.allProChangeHandler(checked);
      },
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
      if (checked && prim_struct.every(({ status }) => status)) {
        this.updateDataStatus([sizes, [this.data[index]]], checked);
      }
      if (!checked && prim_struct.some(({ status }) => !status)) {
        this.updateDataStatus([[this.data[index]]], checked);
      }
      if (!checked && prim_struct.every(({ status }) => !status)) {
        this.updateDataStatus([sizes, [this.data[index]]], checked);
      }
      this.validMessage(this.data[index]);
    },

    sizeChangeHandler(checked, index) {
      const { prim_struct = [], sizes = [] } = this.data[index];
      if (checked && sizes.every(({ status }) => status)) {
        this.updateDataStatus([prim_struct, [this.data[index]]], checked);
      }
      if (!checked && sizes.some(({ status }) => !status)) {
        this.updateDataStatus([[this.data[index]]], checked);
      }
      if (!checked && sizes.every(({ status }) => !status)) {
        this.updateDataStatus([prim_struct, [this.data[index]]], checked);
      }
      this.validMessage(this.data[index]);
    },

    updateDataStatus(datas, checked) {
      datas.map((data) => {
        data.map((item) => {
          this.$set(item, "status", checked);
        });
      });
    },
    validMessage(data) {
      const { prim_struct = [], sizes = [] } = data;

      const sizesSuccess = sizes.every(({ status }) => status);
      const structSuccess = prim_struct.every(({ status }) => status);
      if (sizesSuccess) {
        if (!structSuccess) {
          return this.$set(data, "message", {
            status: false,
            text: "尺码已经全部下架， 款式也必须全部下架。",
          });
        }
      }

      if (structSuccess) {
        if (!sizesSuccess) {
          return this.$set(data, "message", {
            status: false,
            text: "款式已经全部下架， 尺码也必须全部下架。",
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
      if (this.isOff) {
        this.doOff(params);
      } else {
        this.doPutUp(params);
      }
    },
    getParams() {
      const primIds = [];
      let structIds = [];
      let sizesIds = [];
      this.data.map(({ prim_struct, sizes, id, status }) => {
        if (status) {
          primIds.push(id);
        }
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
    async doOff(params) {
      this.loading = true;
      try {
        const { code } = await bulkOff(params);
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

.offShelvesFormComponent {
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
    .el-table {
      border: 1px solid #ebeef5;
      border-right: none;
      ::v-deep {
        td {
          border-right: none;
        }
      }
    }
  }
}
</style>