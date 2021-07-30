<template>
  <el-button size="mini"
             type="danger"
             :loading="loading"
             @click="cancel"
             v-p="['order:order:cancel']"
  >批量取消</el-button>
</template>

<script>
import { cancell } from "@/api/order/cancell";
export default {
  props: {
    idList: {
      type: Array,
      default: () => []
    },
    sup_this: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  methods: {
    async cancel() {
      let idList = this.idList
      console.log(idList);
      if (idList.length === 0) {
        this.$message.warning('请先选择数据')
        return
      }

      this.$confirm(
        `确定取消该订单吗？已取消的订单，可以在已取消订单中恢复原订单状态。`,
        "确认",
        {
          confirmButtonText: "确认取消",
          cancelButtonText: "放弃",
          dangerouslyUseHTMLString: true,
          callback: async (action) => {
            if (action === "confirm") {
              try {
                await this.cancell({
                  idList
                });
                this.$message.success("取消成功");
              } catch (err) {}
              return;
            }
            this.$message.info("已放弃");
          },
        }
      );
    },
    async cancell(params) {
      this.loading = true;
      try {
        const res = await cancell(params);
        const { detail, code } = res;
        if ($SUC({ code })) {
          this.sup_this && this.sup_this.init();
        }
      } catch (err) {
        console.log(err);
      }
      this.loading = false;
      return true;
    },
  },
};
</script>

<style></style>
