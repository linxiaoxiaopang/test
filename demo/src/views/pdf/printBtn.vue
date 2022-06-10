<template>
  <div @click="printHandler" class="inline-block">
    <slot :loading="loading">
      <el-button
        :loading="loading"
        size="small"
        v-bind="$attrs"
        v-on="$listeners"
        type="primary"
      >
        打印
      </el-button>
    </slot>
  </div>
</template>

<script>
import axios from "axios";
import {
  createPrintCallbackParams,
  loadAllImages,
  getPdfUrlByDom,
} from "./utils";
import { isFunction, isElement } from "lodash";
import printJS from "print-js";

export default {
  props: {
    //String | Function | Element
    printable: {
      default: null,
    },

    name: {
      type: String,
      default: "打印文档",
    },

    //html | pdf
    type: {
      type: String,
      default: "pdf",
    },

    //打印的纸张尺寸, 默认a4
    paperSize: {
      type: [String, Array],
      default: "a4",
    },

    isWebPrint: {
      type: Boolean,
      default: true,
    },

    isPreview: Boolean,
  },

  data() {
    return {
      loading: false,
    };
  },



  methods: {
    async printHandler() {
      const { isWebPrint } = this;
      //浏览器打印
      if (isWebPrint) return this.webPrint();
    },

    async webPrint() {
      //获取浏览器打印数据
      try {
        this.loading = true;
        await new Promise((resolve) => {
          //在下一个执行周期调用
          setTimeout(async () => {
            const [err, data] = await this.getWebPrintData();
            if (err) {
              resolve(false);
              return this.$message.error(data);
            }
            //执行打印操作
            printJS(data);
            resolve(true);
          }, 0);
        });
      } finally {
        this.loading = false;
      }
    },

    async getWebPrintData() {
      try {
        const { name, type, paperSize } = this;
        let printable = await this.getPrintable();
        if (type !== "pdf") {
          const el = await this.getHtmlDom();
          const images = el.getElementsByTagName("img");
          await loadAllImages(images);
          if (!el) return [true, "打印dom不存在"];
          printable = await getPdfUrlByDom(el, name, {
            format: paperSize,
          });
        }
        return [
          false,
          createPrintCallbackParams({
            documentTitle: name,
            name,
            printable,
          }),
        ];
      } catch {
        return [true, "打印异常"];
      }
    },

    async getCssToStr() {
      const { css: cssArr } = this;
      if (!cssArr || !cssArr.length) return "";
      const allData = await Promise.all(
        cssArr.map((url) => this.getCssContent(url))
      );
      const allCssStr = allData.join("\n");
      return allCssStr;
    },

    async getHtmlStr() {
      const dom = await this.getHtmlDom();
      return dom.outerHTML;
    },

    async getHtmlDom() {
      let printable = await this.getPrintable();
      if (!printable) return null;
      if (!isElement(printable)) printable = document.getElementById(printable);
      return printable;
    },

    async getCssContent(url) {
      try {
        const res = await axios.get(url, {
          responseType: "text",
        });
        return res.data || "";
      } catch {
        return "";
      }
    },

    async getPrintable() {
      let { printable } = this;
      //当printable是函数时,调用函数获取函数的返回值
      if (isFunction(printable)) {
        return await printable();
      }
      return printable;
    },
  },
};
</script>

<style>
</style>
