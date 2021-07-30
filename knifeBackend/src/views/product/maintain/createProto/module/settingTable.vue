<template>
  <div class="settingTableComponent">
    <el-button type="primary" size="mini" @click="addNewSize">
      添加尺码
    </el-button>
    <CommonTable
      height="auto"
      :infoData="domData"
      :cols="cols"
      :selection="false"
      :header-cell-style="{
        background: '#f7f7f7',
        padding: 0,
        color: '#000',
      }"
    >
      <template #empty>
        <el-button type="primary" size="mini" @click="addNewSize">
          添加尺码
        </el-button>
      </template>
      <template #sizeSlot="{ scoped: { index } }">
        <!-- <el-tag  size="mini" type="primary">
          {{ scoped[scoped.prop] || '暂无' }}
        </el-tag> -->

        <CheckInput
          type="text"
          size="mini"
          label="尺码"
          :value.sync="domData[index].size"
          :validFunc="validFunc"
        />
      </template>

      <template #weightSlot="{ scoped: row, scoped: { prop, index } }">
        <CheckInput
          type="text"
          size="mini"
          label="重量"
          :value.sync="domData[index][prop]"
        />
      </template>
      <template #volumeSlot="{ scoped: row, scoped: { prop, index } }">
        <CheckInput
          type="text"
          size="mini"
          label="体积"
          :value.sync="domData[index][prop]"
        />
      </template>

      <template #lengthSlot="{ scoped: row, scoped: { prop, index } }">
        <CheckInput
          type="text"
          size="mini"
          label="长度"
          :value.sync="domData[index][prop]"
        />
      </template>

      <template #widthSlot="{ scoped: row, scoped: { prop, index } }">
        <CheckInput
          type="text"
          size="mini"
          label="宽度"
          :value.sync="domData[index][prop]"
        />
      </template>

      <template #heightSlot="{ scoped: row, scoped: { prop, index } }">
        <CheckInput
          type="text"
          size="mini"
          label="高度"
          :value.sync="domData[index][prop]"
        />
      </template>
      <template #priceSlot="{ scoped: row, scoped: { prop, index } }">
        <CheckInput
          type="text"
          size="mini"
          label="价格"
          :value.sync="domData[index][prop]"
        />
      </template>
      <template #standardSlot="{ scoped: row, scoped: { prop, index } }">
        <el-radio-group
          v-model="domData[index][prop]"
        >
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </template>

      <slot>
        <el-table-column label="操作" width="100px" align="center">
          <template slot-scope="scoped">
            <el-button type="text" @click="del(scoped.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </slot>
    </CommonTable>
  </div>
</template>

<script>

import CheckInput from "./checkInput";

import { protoSettingCols as cols } from "../../../cols";
import { SIZES_ITEM } from "@/utils/constant";

export default {
  components: {
    CheckInput,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      cols,
     
    };
  },
  filters: {
    formatUrl(file) {
      return URL.createObjectURL(file);
    },
  },
  computed: {
    domData() {
      const { sizes = [] } = this.data;
      return sizes;
    },
  },
  methods: {
    validFunc(value) {
      if (value === undefined || value === "") {
        return {
          success: false,
          errMsg: "尺码必填",
        };
      }
      const re = /^[\w-.]+$/;
      const rsCheck = re.test(value);
      if (!rsCheck) {
        return {
          success: false,
          errMsg: "只能输入数字,点,字母,下划线",
        };
      } else {
        return {
          success: true,
          errMsg: "",
        };
      }
    },
    addNewSize() {
      this.data.sizes.push({
        ...SIZES_ITEM,
      });
    },
    del(index) {
      this.data.sizes.splice(index, 1);
    },
    async validate() {
      if (!this.domData.length) {
        this.$message.error("尺码不能为空");
        return false;
      }
      const success = !document.querySelectorAll(".el-form-item__error").length;
      if(!success) {
        this.$message.warning("存在必填项未填写，请检查页面报红位置！");
      }
      return success
    },
  },
};
</script>

<style>
</style>