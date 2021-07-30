<template>
  <BaseDialog :dialogVisible.sync="dialog" width="800px" title="选择款式">
    <template>
      <SearchHeader :query="query" :sup_this="sup_this" />
      <div class="filed-tag-wrapper">
        <div class="label">款式：</div>
        <div class="tag-list">
          <el-tag
            size="small"
            closable
            type="primary"
            :key="item"
            @close="codes.splice(index, 1)"
            v-for="(item, index) in codes"
          >
            {{ codeName(item) }}
          </el-tag>
        </div>
      </div>
      <div class="dialog-form-codes-wrapper">
        <el-checkbox-group v-model="codes">
          <el-checkbox
            :class="[factory_category_id && factory_category_id != category && 'color-danger']"
            style="margin-bottom: 10px"
            :key="id"
            :label="id"
            v-for="{ factory_category_id, id, structure } in data"
            >{{ structure }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </template>
    <template #footer>
      <LoadingBtn type="primary" @click="bulkChoose"> 提交选中数据 </LoadingBtn>
      <LoadingBtn @click="bulkChoose"> 取消 </LoadingBtn>
    </template>
  </BaseDialog>
</template>
<script>
import { allStruct as list } from "@/api/product/productCateApi";
import SearchHeader from "./searchHeader";
export default {
  components: {
    SearchHeader,
  },
  props: {
    menus: {
      type: Array,
      default: () => [],
    },
    category: {
      type: [String, Number],
      reuqired: true,
    },
  },
  data() {
    return {
      data: [],
      sup_this: this,
      firstFresh: true,
      codes: this.menus.map(({ id }) => id),
      query: {},
      size: 10000,
      dialog: this.dialogVisible,
    };
  },
  watch: {
    // dialog(newVal) {
    //   this.$emit("update:dialogVisible", newVal);
    // },
    dialogVisible(newVal) {
      this.dialog = newVal;
    },
    menus() {
      this.codes = this.menus.map(({ id }) => id);
    },
  },
  created() {
    this.init();
  },
  computed: {
    codeName() {
      return (id) => {
        return (
          this.originData &&
          this.originData.filter(({ id: itemId }) => id === itemId)[0].structure
        );
      };
    },
  },
  methods: {
    bulkChoose() {
      this.dialog = false;
      this.$emit(
        "bulkChoose",
        this.originData
          .filter(({ id }) => this.codes.includes(id))
          .map(({ id, structure }) => ({
            id,
            structure,
          }))
      );
    },
    async init() {
      const params = {
        ...this.query,
      };
      const { detail: { results = [] } = {} } = await list(params);
      this.data = results;
      if (this.firstFresh) {
        this.originData = results;
        this.firstFresh = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog-form-codes-wrapper {
  padding: 20px;
  border: 1px solid $border-color;
  border-radius: 8px;
  .el-checkbox-group {
    position: relative;
  }
  .el-checkbox-group:empty {
    min-height: 100px;
  }
  .el-checkbox-group:empty::before {
    content: "暂无内容";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
  }
}
.filed-tag-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 10px;
  .label {
    flex: 0 0 50px;
    padding: 10px 0;
  }
  .tag-list {
    flex: 1;
  }
  .el-tag {
    margin-right: 5px;
    margin-bottom: 5px;
  }
}
</style>