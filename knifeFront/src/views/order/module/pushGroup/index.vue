<template>
  <div style="margin: 15px 0; margin-top: 5px">
    <el-button size="mini" type="primary" @click="handleClick" :loading="loading">
      发送排单
    </el-button>
  </div>
</template>

<script>
import { syncToSupplier, orderList } from "@/api/order";
import { WAIT_DISPATCH } from "@/utils/constant";
import {numberAdd, parsePrice} from "@/utils";
export default {
  props: {
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
  components: {},
  methods: {
    async list(ids) {
      const pArr = ids.map((id) => {
        return orderList({
          orderStatus: WAIT_DISPATCH,
          orderGroupId: id,
        });
      });
      const data = await Promise.all(pArr);
      console.log("data", data);
      const orderIds = [];
      data.map(({ detail }) => {
        detail = Array.isArray(detail) ? detail : [];
        detail.map(({ id }) => {
          orderIds.push(id);
        });
      });
      const successBool = data.map(({ code }) => $SUC({ code }));
      return {
        successBool,
        orderIds,
      };
    },
    async handleClick() {
      const data = this.sup_this.selectedData;

      if (!data.length) {
        return this.$message.warning("请选择数据再进行此操作！");
      }

      let internalTotalPrice = parsePrice(numberAdd(data.map(({internalTotalPrice}) => internalTotalPrice)))

      this.$confirm(
        `<div>当前同步的订单货款总额为：<span style="color:#FF6F30;">${internalTotalPrice}</span></div>
        <div>当前仅统计订单货款总额,运费相关请线下核算。确认是否同步订单到后台?</div>
        <div style="height: 50px;"></div>`,
        '同步确认',
        {
          confirmButtonText: `同步（货款总额${internalTotalPrice}）`,
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          customClass: 'w560'
        }
      ).then(() => {
        this.pushGroup(data)
      }).catch(() => {
        this.$message.info('已取消')
      })
    },
    async pushGroup(data) {
      this.loading = true;
      const { successBool, orderIds } = await this.list(
              data.map(({ id }) => id)
      );
      if (!successBool) {
        return;
      }
      try {
        const { code } = await syncToSupplier({
          idList: orderIds,
        });
        if ($SUC({ code })) {
          this.sup_this && this.sup_this.init();
          this.$message.success("操作成功");
        }
      } catch (err) {}
      this.loading = false;
    }
  },
};
</script>

<style scoped lang="scss">
.gotoDetailBtn {
  display: inline-block;
}
</style>
