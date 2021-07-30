<template>
  <div class="inline-block">
    <color-text-btn type="primary" @click="to" v-p="['order:orderItem:relevanceUpdate']">
      <el-button size="mini" plain type="primary"> 关联产品 </el-button>
    </color-text-btn>
    <RelationForm
      ref="form"
      v-if="dialogVisible"
      title="关联产品"
      :skuList="skuList"
      :dialogVisible.sync="dialogVisible"
      :sup_this="sup_this"
      :info="data"
      :allData="allData"
      :orderData="orderData"
      v-on="$listeners"
    />
  </div>
</template>
<script>
import RelationForm from "./relationForm";
import { associate } from "@/api/order/waitOrderApi";

export default {
  components: { RelationForm },
  props: {
    sup_this: {
      type: Object,
      required: true,
    },
    allData: {
      type: Array,
      required: true
    },
    data: {
      type: Object,
      required: true,
    },
    orderData: {
      type: Object,
      required: true,
    },
    skuList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      dialogVisible: false,
    };
  },

  methods: {
    async to() {
      this.dialogVisible = true;
      console.log('this.data', this.data)
      return
      try {
        const { code,data } = await associate();
    
        if ($SUC({ code })) {
          // this.$set(row, )
          // this.$message.success("操作成功");
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
