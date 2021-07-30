<template>
  <div class="app-container tmp-settings-page">
    <div class="top">
      <div class="title"><p>基础信息</p></div>
      <div class="information-warpper">
        <div class="name-warpper">
          <span>模板名称：</span>
          <span class="name" v-if="edit === false">{{ name }}</span>
          <el-input
            style="width: 100px"
            size="mini"
            v-model="name"
            v-if="edit === true"
            clearable
          ></el-input>
          <i class="el-icon-edit edit" @click="onEdit" v-if="type !== 'watch'"></i>
        </div>
        <div class="way-warpper">
          <span>物流费用计算方式：</span>
          <span>{{ mode }}</span>
          <el-tooltip placement="top" effect="light">
            <div slot="content" v-if="calculateMode !== FRIST_WEIGHT">
              物流费用 = 费用 + 挂号费 + 紧急情形附加费
            </div>
            <div slot="content" v-else>
              运费 = 首重价格 +((计费重量-首重)/续重单位重量) * 续费单位价格 + 挂号费 +
              紧急情形附加费
            </div>
            <i class="el-icon-question margin"></i>
          </el-tooltip>
        </div>
        <div class="way-warpper flex">
          <span>计费重量设置（如勾选计泡，实际费用重量为两者取高）：</span>
          <!-- <el-radio-group v-model="radio" @change="onRadioChange">
            <el-radio :disabled="type === 'watch'" :label="index" v-for="(item, index) in list" :key="index">{{
              item.type
            }}</el-radio>
          </el-radio-group> -->

          <!-- <el-checkbox-group v-model="radio" @change="onRadioChange">
            <el-checkbox v-for="(item, index) in list" :label="item.val" :key="index">{{ item.type }}</el-checkbox>
          </el-checkbox-group> -->
          <el-tooltip
            placement="top"
            effect="light"
            content="计算公式： 材积重量（g） = 长（cm） * 宽(cm) * 高（cm） / 材积除数"
            style="margin-left: -8px"
          >
            <i class="el-icon-question margin" style="margin-top: -3px"></i>
          </el-tooltip>
          <el-checkbox disabled style="margin-left: 10px" :value="true">{{
            list[0].type
          }}</el-checkbox>
          <el-checkbox
            :disabled="type === 'watch'"
            v-model="radio"
            :true-label="1"
            :false-label="0"
            >{{ list[1].type }}</el-checkbox
          >
          <div style="margin: -5px 0 0 15px" v-if="radio === 1">
            <span>材积除数：</span>
            <el-input size="mini" style="width: 94px" v-model="num" :disabled="type == 'watch'"></el-input>
          </div>
        </div>
        <el-button @click="$router.go(-1)">返回</el-button>
        <el-button
          :loading="loading"
          type="primary"
          :disabled="name.trim === ''"
          @click="handleSave"
          v-if="type !== 'watch'"
          >保存</el-button
        >
      </div>
    </div>
    <div style="height: 16px; background: #f0f2f5"></div>
    <div class="title"><p>规则信息</p></div>

    <div class="table-wrapper">
      <div class="table-wrapper-header">
        <div class="l-h">
          <BatchEdit v-if="type !== 'watch'" :sup_this="sup_this" />
          <BulkDelTmp
            v-if="type !== 'watch'"
            :sup_this="sup_this"
            :selectedData="selectedData"
          />
        </div>
        <div class="r-h">
          <!-- <el-button size="small" icon="el-icon-upload2">导入</el-button> -->
          <!-- <XlsxTable @on-select-file="onSelectFile" style="display: inline-block">
            <el-button size="small" icon="el-icon-upload2">导入</el-button>
          </XlsxTable> -->
          <addCountryButton
            :templateId="id"
            :sup_this="sup_this"
            :list="data"
            v-if="type !== 'watch'"
          />
        </div>
      </div>
      <CommonTable
        ref="table"
        height="auto"
        :tableLoading="tableLoading"
        :cols="cols"
        :infoData="data"
        :span-method="spanMethod"
        @selection-change="handleSelectionChange"
        @select="selectHandler"
      >
        <template #createdListSlot="{ scoped: row }"> {{ getList(row) }} </template>
        <template #weightRangeSlot="{ scoped: row }"> {{ weightRange(row) }} </template>
        <template #firstFreightSlot="{ scoped: row }">
          {{ row.firstWeight }} g / ￥{{ row.firstFreight }}
        </template>
        <template #continuedFreightSlot="{ scoped: row }">
          {{ row.continuedWeight }} g / ￥{{ row.continuedFreight }}
        </template>
        <slot>
          <el-table-column
            fixed="right"
            label="操作"
            v-if="type !== 'watch'"
            width="200px"
            align="center"
          >
            <template slot-scope="{ row }">
              <eEdit :sup_this="sup_this" :row="row" />
              <CopyBtn :sup_this="sup_this" :row="row" :templateId="id" :list="data" />
              <DelTmp :sup_this="sup_this" :data="row" />
            </template>
          </el-table-column>
        </slot>
      </CommonTable>
    </div>

    <PaginationBar
      ref="paginationBar"
      @refreshTableEventFun="refreshTableEventFun"
      :total="total"
    />
  </div>
</template>

<script>
import XlsxTable from "@/components/xlsxTable.vue";

import addCountryButton from "../module/addCountryButton.vue";
import BatchEdit from "../module/batchEdit";
import eEdit from "../module/edit";
import CopyBtn from "../module/copyBtn";
import DelTmp from "../module/delTmp";
import BulkDelTmp from "../module/bulkDelTmp";

import {
  updateTemplate,
  deleteCreatedTemplate,
  batchCreateTemplate,
} from "@/api/template";
import { getCounrty } from "@/api/country";
import { delMixin, initDataMixin } from "@/mixins";
import { firstWeightListCols, sameWeightListCols } from "./cols";

import { changeArrKey } from "@/utils";

import { FRIST_WEIGHT, SAME_WEIGHT, FRIST_WEIGHT_ORDER_KEYS } from "@/utils/constant";

let rowId = "";

export default {
  mixins: [initDataMixin, delMixin],
  components: {
    addCountryButton,
    BatchEdit,
    DelTmp,
    CopyBtn,
    BulkDelTmp,
    eEdit,
    XlsxTable,
  },
  data() {
    return {
      sup_this: this,
      FRIST_WEIGHT,
      size: 10000,
      calculateMode: this.$route.query.calculateMode,
      url: "/system/expressFreightTemplateConfig/list",
      method: "post",
      mergeData: {
        isDeleted: 0,
        templateId: 0,
      },
      countryList: [],
      id: 0,
      edit: false,
      name: "",
      type: "",
      mode: "",
      radio: 0,
      num: 0,
      loading: false,
      list: [
        { type: "实际重量", val: 0 },
        { type: "计泡重量", val: 1 },
      ],
    };
  },

  created() {
    this.initData();
    // if (this.type === 'copy') {
    //   this.mergeData.templateId = this.id - 1
    // } else {
    //   this.mergeData.templateId = this.id
    // }
    this.mergeData.templateId = this.id;
    getCounrty({ isDeleted: 0 }).then((res) => {
      this.countryList = res.detail;
    });
    // console.log(JSON.parse(this.$route.query.res))
  },

  computed: {
    //根据首重和一样重量两种不同的模式返回不同的数据
    cols() {
      const tmpObj = {
        [FRIST_WEIGHT]: firstWeightListCols,
        [SAME_WEIGHT]: sameWeightListCols,
      };
      return tmpObj[this.calculateMode];
    },

    weightRange() {
      return (row) => {
        return `${row.startWeight}g ~ ${row.endWeight}g`;
      };
    },
  },

  methods: {
    selectHandler(selection, row) {
      const selected = selection.includes(row);
      if (!selected) {
        const data = this.selectedData.filter(
          ({ countryId }) => countryId != row.countryId
        );
        this.$nextTick(() => {
          this.selectedData = data;
        });
      }
    },

    async onSelectFile(excelData) {
      const loading = this.$loading({
        lock: true,
        text: "上传中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      try {
        const { body = [] } = excelData;
        const data = changeArrKey(body, FRIST_WEIGHT_ORDER_KEYS);
        const countryIdList = this.getCounrtyIdsByCode(data);
        if (!countryIdList) {
          loading.close();
          return;
        }
        const params = {
          templateId: this.mergeData.templateId,
          countryIdList,
          list: data,
        };
        const { code } = await batchCreateTemplate(params);
        if ($SUC({ code })) {
          this.$message.success("创建成功");
          this.init();
        }
      } catch (err) {
        console.log(err);
      }
      loading.close();
    },

    //通过国家二字码获取城市id
    getCounrtyIdsByCode(data) {
      const errArr = [];
      const cIds = [];
      data.map((item) => {
        const fObj = this.countryList.find((cItem) => {
          return cItem.twoCharCode == item.twoCharCode;
        });
        if (!fObj) {
          errArr.push(item.twoCharCode);
        } else {
          cIds.push(fObj.id);
        }
      });
      if (errArr.length) {
        this.$message.error(`${errArr.join("、")}是异常的国家二字码!`);
        return false;
      }
      return cIds;
    },

    onRadioChange(item) {
      this.radio = item;
    },
    getList(data) {
      const list = this.countryList.find((item) => {
        return item.id === data.countryId;
      });
      return list && list.countryCnName;
    },
    handleSave() {
      this.edit = false;
      this.loading = true;
      if (this.name === "") {
        this.$message.error("请输入模板名称");
        this.loading = false;
        return;
      }
      if (this.radio === 1) {
        if (this.num === "") {
          this.$message.error("请输入材积除数");
          this.loading = false;
          return;
        }
        if (!/^([1-9][0-9]*)(\.\d+)?$/.test(this.num)) {
          this.$message.error("请输入一个大于0的材积除数");
          this.loading = false;
          return;
        }
      }
      let data1 = {};
      if (this.radio === 0) {
        data1 = {
          isByActualWeight: 1,
          isByVolumetricWeight: 0,
        };
      } else {
        data1 = {
          isByActualWeight: 1,
          isByVolumetricWeight: 1,
        };
      }
      let data2 = {
        id: this.id,
        templateName: this.name,
        volumeDivisor: Number(this.num),
      };
      let data = Object.assign(data1, data2);
      updateTemplate(data)
        .then(() => {
          this.$message.success("模板更新成功！");
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    onEdit() {
      this.edit = !this.edit;
    },
    onDelete(row) {
      const idList = [row.id];
      deleteCreatedTemplate({ idList }).then(() => {
        this.init();
        this.$message.success("国家删除成功！");
      });
    },

    spanMethod({ row, column, rowIndex, columnIndex }) {
      const id = row.countryId;
      let spanNum = 1;
      if (columnIndex == 0) {
        row.rowNum = rowIndex;
        if (rowIndex == 0) {
          rowId = undefined;
        }
      }
      if (columnIndex > 1 && columnIndex != this.cols.length + 1) return;

      if (rowId == id && row.rowNum == rowIndex) {
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
      rowId = id;
      row.rowNum = rowIndex + 1;
      const data = this.data;
      for (let i = rowIndex + 1; i < data.length; i++) {
        const item = data[i];
        const itemId = item.countryId;
        if (rowId == itemId) {
          spanNum++;
        } else {
          break;
        }
      }
      return {
        rowspan: spanNum,
        colspan: 1,
      };
    },

    initData() {
      this.name = this.$route.query.templateName;
      this.type = this.$route.query.type;
      this.num = this.$route.query.volumeDivisor;
      // if (this.type === "copy") {
      //   this.id = Number(this.$route.query.id) + 1;
      // } else {
      //   this.id = Number(this.$route.query.id);
      // }
      this.id = Number(this.$route.query.id);
      if (this.calculateMode === FRIST_WEIGHT) {
        this.mode = "已选择按首重续重计费";
      } else {
        this.mode = "已选择同重量段费用相同";
      }
      if (this.$route.query.weight == 1) {
        this.radio = 1;
      } else {
        this.radio = 0;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tmp-settings-page {
  .table-wrapper {
    padding: 20px;
    .table-wrapper-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
    }
  }
  .title {
    padding-left: 20px;
    line-height: 44px;
    border-bottom: 1px solid #e7e8f0;
    p {
      padding-top: 2px;
      padding-left: 7px;
      height: 16px;
      line-height: 16px;
      font-size: 16px;
      border-left: 3px solid #3841db;
      color: #595961;
    }
  }
}

.app-container {
  padding: 0;
  .top {
    height: 224px;
  }
  .danger {
    color: #f54a45;
    cursor: pointer;
  }
.el-table td:last-child {
  border-right: 1px solid #EBEEF5;
}
  .information-warpper {
    padding: 20px 0 0 60px;
    font-size: 14px;
    color: #595961;
    .name-warpper {
      display: flex;
      height: 32px;
      align-items: center;
      cursor: pointer;
      color: #595961;
      .edit {
        display: none;
        margin-left: 8px;
        color: #3841db;
      }
    }
    .name-warpper:hover {
      .edit {
        display: block;
      }
    }
    .el-button {
      margin-top: 8px;
      padding: 0;
      width: 60px;
      height: 32px;
    }
    .way-warpper {
      color: #595961;
      margin-top: 12px;
      .margin {
        margin-left: 5px;
      }
      ::v-deep {
        .el-form-item__label {
          font-weight: normal;
        }
        .el-radio__label {
          font-weight: normal;
        }
        .el-radio {
          margin-right: 15px;
        }
      }
    }
    .flex {
      margin-top: 10px;
      display: flex;
      height: 32px;
      align-items: center;
    }
  }
}
</style>
