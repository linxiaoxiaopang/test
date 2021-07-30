<template>
  <el-select
          v-model="text"
          filterable
          remote
          :size="size"
          :placeholder="placeholder"
          style="width: 100%;"
          :remote-method="remoteMethod"
          :loading="loading"
          @change="handleChange"
  >
    <el-option
            v-for="item in remoteOptions"
            :key="item[dictValue]"
            :label="item[dictLabel]"
            :value="item[dictValue]">
      <span>{{ item[dictLabel] }}</span>
      <!--<span style="margin-left: 20px;">{{ getSkuDetailStr(item) }}</span>-->
    </el-option>
  </el-select>
</template>

<script>
import propsMixin from "@/components/avue/mixins/propsMixin";
import {debounce} from "@/utils";

export default {
  name: "UserSkuSelect",
  mixins: [propsMixin],
  data() {
    return {
      loading: false,
      remoteOptions: [],
    };
  },
  computed: {
    dictLabel() {
      return this.props.label || 'user_sku'
    },
    dictValue() {
      return this.props.value || 'user_sku'
    },
  },
  destroyed() {
    this.$store.commit('SET_DIC_DATA', { prop: 'userSku' })
  },
  methods: {
    remoteMethod: debounce(
            async function(query) {
              if (query !== '') {
                this.loading = true;

                let skuList = await this.$store.dispatch('GetDic', 'userSku');
                this.remoteOptions = skuList.filter(sku => sku[this.dictLabel].includes(query));

                // this.remoteOptions = (await getSkuList({sku: query})).detail;
                this.loading = false;

              } else {
                this.remoteOptions = [];
              }
            },
            200
    ),
    getSkuDetailStr(sku) {
      return `产品名称:${sku.chinese_name} 款式:${sku.abbr}`
    },
  }
};
</script>

<style>
  .is-readonly .el-input.is-disabled .el-input__inner{
    color: #606266;
    background-color: #fff;
    cursor: pointer;
  }
  .is-readonly .el-input.is-disabled .el-input__icon{
    cursor: pointer;
  }
</style>
