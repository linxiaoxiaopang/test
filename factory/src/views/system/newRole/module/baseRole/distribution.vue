<template>
  <div class="distributionComponent">
    <el-checkbox class="all-selected" v-model="checked"> 全选 </el-checkbox>
    <el-table
      class="mine-table"
      :data="data"
      ref="table"
      style="width: 100%"
      row-key="id"
      border
      :key="key"
      default-expand-all
      :height="height"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="alias" label="菜单权限" width="200">
        <template slot-scope="{ row }">
          <el-checkbox
            @change="parentChange(row, $event)"
            :label="row.id"
            v-model="form[prop]"
            >{{ row.alias || row.label }}</el-checkbox
          >
        </template>
      </el-table-column>
      <el-table-column prop="alias" label="次级菜单权限">
        <template slot-scope="{ row }">
          <el-checkbox
            v-for="(sonType, indx) in row.sonTypeArr || []"
            :key="indx"
            :label="sonType.id"
            v-model="form[prop]"
            @change="change(sonType, row.sonTypeArr, $event)"
          >
            {{ sonType.alias || sonType.label }}
          </el-checkbox>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import formField from "./formField";
import { initDataMixin } from "@/mixins";
import { shakeChilrenBeRow, shakingChildren } from "@/utils";
import cloneDeep from "lodash/cloneDeep";

let key = 1;
export default {
  mixins: [initDataMixin],
  props: {
    resetUrl: {
      type: String,
      required: true,
    },
    form: {
      type: Object,
      required: true,
    },
    prop: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      formField,
      url: this.resetUrl,
      sup_this: this,
      height: "50vh",
      oData: [],
    };
  },
  computed: {
    key() {
      return this.height + ++key + "";
    },
    checked: {
      get() {
        const menus = this.form[this.prop];
        if (!this.oData.length) return false;
        return shakingChildren(this.oData).length === menus.length;
      },
      set(checked) {
        if (!checked) {
          this.form[this.prop] = [];
          return;
        }
        this.form[this.prop] = shakingChildren(this.oData).map(({ id }) => id);
      },
    },
  },
  methods: {
    change(son, allSon, bool) {
      const { pid } = son;
      const menus = this.form[this.prop];
      const fIndex = menus.findIndex((mId) => pid == mId);
      if (!bool) {
        if (fIndex == -1) return;
        menus.splice(fIndex, 1);
      }
      if (bool) {
        if (fIndex >= 0) return;
        const allSelected = allSon.every(({ id }) => menus.includes(id));
        if (allSelected) {
          menus.push(pid);
        }
      }
    },
    parentChange(row, bool) {
      const { sonTypeArr, children } = row;
      this.pushData(sonTypeArr, bool);
      this.pushData(children, bool);
    },
    pushData(data, bool) {
      const menus = this.form[this.prop];
      data = Array.isArray(data) ? data : [];
      data.map(({ id }) => {
        const fIndex = menus.findIndex((mId) => id == mId);
        const exist = fIndex > -1;
        if (bool) {
          if (exist) return;
          return menus.push(id);
        }
        if (!bool) {
          if (!exist) return;
          return menus.splice(fIndex, 1);
        }
      });
    },
    initCallBack(res) {
      const { detail } = res || {};
      this.oData = cloneDeep(detail);
      this.data = shakeChilrenBeRow(detail);
      this.$nextTick(() => {
        const { table } = this.$refs;
        if (table && !this.lock) {
          this.lock = true;
          if (this.lock) {
            const dom = table.$el;
            const hs = dom.getElementsByClassName("el-table__header-wrapper");
            const bs = dom.getElementsByClassName("el-table__body");
            if (hs.length && bs.length) {
              this.height =
                hs[0].offsetHeight + bs[0].offsetHeight >=
                document.body.offsetHeight * 0.5
                  ? "50vh"
                  : "auto";
            }
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.distributionComponent {
  .all-selected {
    position: relative;
    left: -5px;
  }
  .el-checkbox {
    white-space: normal;
    margin-left: 10px;
    ::v-deep {
      .el-checkbox__label {
        display: inline;
      }
    }
  }
  .el-table {
    border-left: 1px solid $border-color;
  }
}
</style>