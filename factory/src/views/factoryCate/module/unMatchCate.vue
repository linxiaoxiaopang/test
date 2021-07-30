<template>
  <div class="unMatchCateComponent" v-if="data.length">
    <div class="un-match-title">未匹配分类</div>
    <div class="wrapper">
      <el-tag
        type="warning"
        :key="id"
        size="small"
        v-for="{ id, structure } in firstData"
      >
        {{ structure }}
      </el-tag>
    </div>
    <el-collapse-transition>
      <div v-if="show" class="wrapper">
        <el-tag
          type="warning"
          :key="id"
          size="small"
          v-for="{ id, structure } in othersData"
        >
          {{ structure }}
        </el-tag>
      </div>
    </el-collapse-transition>
    <div class="btn-wrapper" v-if="othersData.length">
      <div class="btn-text" v-show="!show" @click="show = true">
        显示全部
        <i class="fa fa-angle-double-down"></i>
      </div>
      <div class="btn-text" v-show="show" @click="show = false">
        收起
        <i class="fa fa-angle-double-up"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { noCateList as list } from "@/api/product/factoryCateApi";
export default {
  data() {
    return {
      data: [],
      show: false,
    };
  },
  created() {
    this.list();
  },
  computed: {
    firstData() {
      return this.data.slice(0, 5);
    },
    othersData() {
      return this.data.slice(5);
    },
  },
  methods: {
    async list() {
      const {
        code,
        detail: { results = [] },
      } = await list();
      if ($SUC({code})) {
        this.data = results;
      }
    },
  },
};
</script>

<style lang="scss" cooped>
.unMatchCateComponent {
  border: 1px solid $border-color;
  padding: 8px;
  padding-bottom: 0;
  border-radius: 8px;
  margin-top: 15px;
  margin-bottom: 15px;
  .un-match-title {
    margin-bottom: 10px;
    color: $color-warning;
  }
  .wrapper {
    .el-tag {
      margin: 5px;
      cursor: pointer;
    }
  }
  .btn-wrapper {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: $color-primary;
    padding-bottom: 15px;
    .btn-text {
      cursor: pointer;
    }
  }
}
</style>