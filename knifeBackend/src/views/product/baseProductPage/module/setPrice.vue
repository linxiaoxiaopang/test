<template>
  <div class="setPriceTable">
    <el-table :data="priceData" border class="table-border">
      <template v-for="({ prop, label }, index) in priceColData">
        <el-table-column
          v-if="prop == 'size'"
          :key="index"
          :prop="prop"
          :label="label"
          align="center"
        >
        </el-table-column>
        <el-table-column
          v-else
          :key="index"
          :prop="prop"
          :label="label"
          align="center"
        >
          <template v-slot="{ row }">
            <el-input
              v-model="row[`${prop}`]"
              @blur="takeTableData"
              :disabled="isSet"
            ></el-input>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    priceData: Array,
    priceColData: Array,
    isSet: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    takeTableData() {
      console.log(this.priceData);
    },
  },
};
</script>

<style scoped lang="scss">
.setPriceTable {
  margin-top: 20px;
  .table-border {
    border-top: 1px solid #ebeef5;
    border-left: 1px solid #ebeef5;
  }
}
</style>
