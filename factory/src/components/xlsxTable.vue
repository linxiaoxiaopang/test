<template>
  <div class="xlsxContainer">
    <div @click="handleUploadBtnClick">
      <slot>
        <el-button type="primary">上传文件</el-button>
      </slot>
    </div>
    <input
      :ref="uploadInputId"
      type="file"
      :accept="accept"
      class="c-hide"
      @change="handkeFileChange"
    />
  </div>
</template>

<script>
import XLSX from "xlsx";
export default {
  name: "vue-xlsx-table",
  data() {
    return {
      rawFile: null,
      workbook: null,
      tableData: {
        header: [],
        body: [],
      },
      uploadInputId: new Date().getUTCMilliseconds(),
    };
  },
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    accept: {
      type: String,
      default: ".xlsx, .xls",
    },
    className: {
      type: String,
      default: "xlsx-button",
    },
  },
  computed: {
    rABS() {
      const DEFAULT_OPTION = {
        rABS: false,
      };
      const xlsxOptions = Object.assign(DEFAULT_OPTION, this.options);
      return xlsxOptions.rABS;
    },
  },
  methods: {
    handkeFileChange(e) {
      if (this.rawFile !== null) {
        return;
      }
      const loading = this.$loading({
        lock: true,
        text: "上传中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      this.rawFile = e.target.files[0];
      this.$emit("getFileName", this.rawFile.name);
      this.fileConvertToWorkbook(this.rawFile)
        .then((workbook) => {
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          this.formatNumToString(sheet);
          let xlsxArr = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]]
          );
          this.workbook = workbook;
          loading.close();
          this.initTable(this.xlsxArrToTableArr(xlsxArr));
        })
        .catch((err) => {
          this.$emit("on-select-file", false);
          loading.close();
          console.error(err);
        });
    },
    // formatNumToString(sheet) {
    //   var column_arr = /([A-Z]+)([0-9]+):([A-Z]+)([0-9]+)/i.exec(sheet["!ref"]);
    //   const cols = [column_arr[1], column_arr[3]];
    //   const rows = [column_arr[2], column_arr[4]];
    //   if (cols.some((col) => col.length >= 2)) return;
    //   const colsCodes = cols.map((col) => col.charCodeAt(col));
    //   let start = Math.max(2, rows[0]);
    //   for (let i = start; i < rows[1]; i++) {
    //     for (let j = colsCodes[0]; j < colsCodes[1]; j++) {
    //       const key = `${String.fromCharCode(j)}${i}`;
    //       if (
    //         !isNaN(Number(sheet[key] && sheet[key].v)) &&
    //         String(sheet[key] && sheet[key].v).length >= 12
    //       ) {
    //         sheet[key].w = sheet[key].v;
    //       }
    //     }
    //   }
    // },
    formatNumToString(sheet) {
      var column_arr = /([A-Z]+)([0-9]+):([A-Z]+)([0-9]+)/i.exec(sheet["!ref"]);
      const rows = [
        Math.max(column_arr[2] - 1, 0),
        Math.max(column_arr[4] - 1, 0),
      ];
      let startCol = 0;
      let endCol = 0;
      while (!sheet[XLSX.utils.encode_cell({ c: startCol, r: rows[0] })]) {
        ++startCol;
      }
      endCol = startCol;
      while (sheet[XLSX.utils.encode_cell({ c: endCol, r: rows[0] })]) {
        ++endCol;
      }
      const range = {
        s: { c: +startCol, r: +rows[0] },
        e: { c: +endCol, r: +rows[1] },
      };
      for (let i = range.s.c; i <= range.e.c; i++) {
        for (let j = range.s.r; j <= range.e.r; j++) {
          let cell = sheet[XLSX.utils.encode_cell({ c: j, r: i })];
          if (
            !isNaN(Number(cell && cell.v)) &&
            String(cell && cell.v).length >= 12
          ) {
            cell.w = cell.v;
          }
        }
      }
    },
    fileConvertToWorkbook(file) {
      let reader = new FileReader();
      return new Promise((resolve, reject) => {
        try {
          reader.onload = (renderEvent) => {
            const data = new Uint8Array(renderEvent.target.result);
            const workbook = XLSX.read(data, {
              type: this.rABS ? "binary" : "array",
            });
            resolve(workbook);
          };
          reader.onerror = (error) => {
            reject(error);
          };
          if (this.rABS) {
            reader.readAsBinaryString(file);
          } else {
            reader.readAsArrayBuffer(file);
          }
        } catch (error) {
          reject(error);
        }
      });
    },
    xlsxArrToTableArr(xlsxArr) {
      let tableArr = [];
      let length = 0;
      let maxLength = 0;
      let maxLengthIndex = 0;
      xlsxArr.forEach((item, index) => {
        length = Object.keys(item).length;
        if (maxLength < length) {
          maxLength = length;
          maxLengthIndex = index;
        }
      });
      let tableHeader = Object.keys(xlsxArr[maxLengthIndex]);
      let rowItem = {};
      xlsxArr.forEach((item) => {
        rowItem = {};
        for (let i = 0; i < maxLength; i++) {
          rowItem[tableHeader[i]] = item[tableHeader[i]] || "";
        }
        tableArr.push(rowItem);
      });
      return {
        header: tableHeader,
        data: tableArr,
      };
    },
    tableArrToXlsxArr({ data, header }) {
      let xlsxArr = [];
      let tempObj = {};
      data = data || []
      data.forEach((rowItem) => {
        tempObj = {};
        rowItem.forEach((item, index) => {
          tempObj[header[index]] = item;
        });
        xlsxArr.push(tempObj);
      });
      return xlsxArr;
    },
    initTable({ data, header }) {
      this.tableData.header = header;
      this.tableData.body = data.filter((item) => {
        const key = header.filter((item) => item.indexOf("EMPTY") === -1)[0];
        return item[key];
      });
      this.$emit("on-select-file", this.tableData);
    },
    handleUploadBtnClick() {
      this.clearAllData();
      this.$refs[this.uploadInputId].click();
    },
    clearAllData() {
      this.$refs[this.uploadInputId].value = null;
      this.tableData = {
        header: [],
        body: [],
      };
      this.rawFile = null;
      this.workbook = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.xlsxContainer {
  .c-hide {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    display: none;
  }
}
</style>