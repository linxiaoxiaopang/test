<template>
  <div class="line inline-block">
    <color-text-btn
            size="mini"
            type="success"
            :loading="data.printLoading"
            @click="print(data)"
    >
      {{ data.printLoading ? "加载图片" : "打印彩图" }}
    </color-text-btn>

    <EForm
            ref="formTable"
            :id="printId"
            :productData="productData"
            :data="data"
    />
  </div>
</template>

<script>
  import EForm from "./form";
  import printJS from "print-js";
  import { orderItemList as list } from "@/api/order/orderItem";
  export default {
    components: {
      EForm,
    },
    props: {
      data: {
        type: Object,
        required: true,
      },
      printId: {
        type: String,
        default: "tablePrint",
      },
      printData: {
        type: Object,
        default: () => ({
          printable: "tablePrint",
          type: "html",
          scanStyles: false,
          maxWidth: "100%",
          documentTitle: "彩图打印单",
          css: ["/css/print.css"],
        }),
      },
    },
    data() {
      return {
        isPrint: false,
        productData: [],
      };
    },
    methods: {
      async print(row) {
        this.$set(row, "printLoading", true);
        try {
          await this.list();
          this.$nextTick(() => {
            const { formTable } = this.$refs;
            document.body.insertBefore(formTable.$el, this.$root.$el);
          });
        } catch (err) {
          this.$set(row, "printLoading", false);
        }
        const imgData = this.productData.map(({ productCover }) => {
          if (productCover) return productCover;
          return require("@/assets/images/default.png");
        });
        const p = imgData.map((src) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onerror = () => {
              resolve(true);
            };
            img.onload = () => {
              resolve(true);
            };
            img.src = src;
          });
        });
        await Promise.all(p);
        setTimeout(() => {
          this.$set(row, "printLoading", false);
          printJS({
            ...this.printData,
            printable: this.printId,
          });
        }, 200);
      },
      async list() {
        this.loading = true;
        try {
          const { id } = this.data || {};
          const res = await list({ orderId: id });

          const { detail, code } = res;
          if ($SUC({ code })) {
            console.log("detail", detail);
            this.productData = detail || [];
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
