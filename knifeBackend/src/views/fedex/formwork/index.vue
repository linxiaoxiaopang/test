<template>
  <div class="app-container">
    <addDialog
      :type.sync="type"
      :form="form"
      :radio.sync="radio"
      @refresh="refresh"
      @resetFields="resetFields"
      ref="dialog"
      @handleCopied="handleCopied"
    />
    <div class="continent-warpper">
      <span>运费模板状态：</span>
      <span
        :class="[{ active: selectedIndex === -1 }, 'whole-warpper']"
        @click="handleSelectedAll"
        >全部</span
      >
      <ul
        v-for="(item, index) in list"
        :key="index"
        class="whole-warpper"
        :class="[{ active: selectedIndex === index }]"
        @click="handleSelected(index)"
      >
        <li>{{ item.type }}</li>
      </ul>
      <span style="margin-left: 8px">模板名称：</span>
      <el-input
        v-model="search"
        style="width: 180px"
        placeholder="输入模板名称"
        size="mini"
        clearable
        @clear="searchModel"
        @change="searchModel"
      ></el-input>
      <el-button type="primary" icon="el-icon-search"></el-button>
    </div>
    <CommonTable
      class="operation"
      :selection="false"
      :tableLoading="tableLoading"
      :cols="cols"
      :infoData="data"
      style="margin-top: 40px"
    >
      <template #stateSlot="{ scoped: row }"> {{ getState(row) }} </template>
      <template #updateTimeSlot="{ scoped: row }">
        {{ parseTime(row[row.prop]) }}
      </template>
      <slot>
        <el-table-column fixed="right" label="操作" width="200px" align="center">
          <template slot-scope="{ row }">
            <div v-if="row.isEnabled === 0">
              <span class="primary" @click="onEdit(row)">编辑</span>
              <span class="line"></span>
              <span class="primary" @click="onOpen(row)">启用</span>
              <span class="line"></span>
              <span class="primary" @click="onCopy(row)">复制</span>
              <span class="line"></span>
              <Popover @sureHandler="onDelete(row.id)">
                <template #tip>
                  <p>您确定要删除模板么?</p>
                </template>
                <template #reference="{ scope: loading }">
                  <color-text-btn
                    class="update-btn"
                    :loading="loading"
                    size="mini"
                    type="danger"
                    >删除</color-text-btn
                  >
                </template>
              </Popover>
            </div>
            <div v-if="row.isEnabled === 1">
              <span class="primary" @click="onWatch(row)">查看</span>
              <span class="line"></span>
              <span class="primary" @click="onCopy(row)">复制</span>
              <span class="line"></span>
              <span class="danger" @click="onForbidden(row)">禁用</span>
            </div>
            <div v-if="row.isEnabled === 2">
              <span class="primary" @click="onWatch(row)">查看</span>
              <span class="line"></span>
              <span @click="onCopy(row)" class="primary">复制</span>
              <span class="line"></span>
              <span class="primary" @click="onOpen(row)">启用</span>
            </div>
          </template>
        </el-table-column>
      </slot>
    </CommonTable>
    <templateDialog
      :show.sync="show"
      :templateData="templateData"
      @handleForbidden="handleForbidden"
    />
    <PaginationBar
      ref="paginationBar"
      @refreshTableEventFun="refreshTableEventFun"
      :total="total"
    />
  </div>
</template>

<script>
import templateDialog from "./module/templateDialog.vue";
import {
  deleteTemplate,
  createTemplate,
  updateTemplate,
  getRelatedMailList,
  copy,
} from "@/api/template";
import { delMixin } from "@/mixins";
import addDialog from "./module/addDialog.vue";
import { formworkListCols as cols } from "@/views/fedex/cols";
import { parseTime } from "@/utils";
import { mapGetters } from "vuex";
import initDataMixin from "@/mixins/initData";
import { debounce } from "@/utils";
export default {
  name: "formwork",
  mixins: [initDataMixin, delMixin],
  components: {
    addDialog,
    templateDialog,
  },
  data() {
    return {
      cols,
      url: "/system/expressFreightTemplate/list",
      method: "post",
      mergeData: {
        isDeleted: 0,
      },
      radio: 1,
      type: "add",
      currentData: {},
      form: {
        name: "",
        way: 1,
      },
      templateData: {},
      show: false,
      search: "",
      tm: "",
      selectedIndex: -1,
      query: {},
      list: [
        { type: "未启用", index: 0 },
        { type: "已启用", index: 1 },
        { type: "已停用", index: 2 },
      ],
      copy: {},
    };
  },
  computed: {
    ...mapGetters(["continentDictCode"]),
  },
  methods: {
    parseTime,
    resetFields() {
      this.form = {
        name: "",
        way: 1,
      };
    },
    redirect(row) {
      this.$router.push({
        path: "/fedex/formwork/settings",
        query: {
          id: row.id,
          templateName: row.templateName,
          calculateMode: row.calculateMode,
          volumeDivisor: row.volumeDivisor,
          weight: row.isByVolumetricWeight,
          type: this.type,
        },
        // query: { res: JSON.stringify(this.copy), type: this.type }
      });
    },
    onEdit(row) {
      this.type = "edit";
      this.redirect(row);
      console.log(this.page);
    },
    onOpen(row) {
      this.copy = row;
      this.copy.isEnabled = 1;
      updateTemplate(this.copy).then(() => {
        this.init();
        this.$message.success("模板启用成功");
      });
    },
    onCopy(row) {
      this.type = "copy";
      this.form.name = row.templateName + "副本";
      this.copy = row;
      this.$refs.dialog.visible = true;
    },
    onDelete(id) {
      const index = [id];
      deleteTemplate({ idList: index }).then(() => {
        this.query = {};
        this.refreshPage();
        this.$message.success("模板删除成功");
      });
    },
    onWatch(row) {
      this.type = "watch";
      this.redirect(row);
    },
    handleForbidden() {
      this.copy = this.currentData;
      this.copy.isEnabled = 2;
      updateTemplate(this.copy).then(() => {
        this.init();
        this.show = false;
        this.$message.success("模板禁用成功");
      });
    },
    onForbidden(row) {
      this.currentData = row;
      this.show = true;
      getRelatedMailList({ id: row.id }).then((res) => {
        this.templateData = res.detail;
      });
    },
    handleSelected(index) {
      this.selectedIndex = index;
      this.query.isEnabled = index;
      this.query.templateName = this.tm;
      this.searchChange();
    },
    handleSelectedAll() {
      this.selectedIndex = -1;
      this.query.templateName = this.tm;
      this.query.isEnabled = undefined;
      this.searchChange();
    },
    async handleCopied() {
      this.copy.templateName = this.form.name;
      delete this.copy.updateTime;
      delete this.copy.isEnabled;
      // await createTemplate(this.copy)
      //   .then(() => {
      //     this.init();
      //     this.$refs.dialog.visible = false;
      //     this.$message.success("模板复制成功");
      //   })
      //   //解决模板名称重复导致的列表坍塌
      //   .catch(this.init());
      let currentId = 0;
      const templateName = this.copy.templateName;
      await copy({ id: this.copy.id, templateName })
        .then((res) => {
          currentId = res.detail;
          this.init();
          this.$refs.dialog.visible = false;
          this.$message.success("模板复制成功");
        })
        .catch(this.init());
      this.$router.push({
        path: "/fedex/formwork/settings",
        query: {
          id: currentId,
          templateName: this.copy.templateName,
          calculateMode: this.copy.calculateMode,
          volumeDivisor: this.copy.volumeDivisor,
          weight: this.copy.isByActualWeight,
          type: this.type,
        },
        // query: { res: JSON.stringify(this.copy), type: this.type }
      });
    },
    searchModel() {
      this.query.templateName = this.search;
      this.tm = this.search;
      this.searchChange();
    },
    refresh() {
      this.init();
    },
    getState(data) {
      switch (data.isEnabled) {
        case 0:
          return "未启用";
          break;
        case 1:
          return "已启用";
          break;
        case 2:
          return "已停用";
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  display: flex;
  flex-direction: column;
  .operation {
    .line {
      display: inline-block;
      margin-right: 8px;
      width: 1px;
      height: 12px;
      background: #dcdee0;
    }
    .primary {
      color: #3841db !important;
      margin-right: 8px;
      cursor: pointer;
    }
    .danger {
      color: #f54a45;
      cursor: pointer;
    }
  }
  .continent-warpper {
    min-width: 1200px;
    font-size: 14px;
    display: flex;
    align-items: center;
    margin-top: 20px;
    background-color: #f0f2f5;
    padding: 20px;
    .el-button {
      margin-left: 8px;
      width: 48px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }
    .active {
      color: #3841db;
      border: 1px solid #3841db !important;
    }
    .whole-warpper {
      padding: 10px;
      border: 1px solid #dcdee0;
      border-radius: 2px;
      margin-right: 12px;
      cursor: pointer;
      li {
        list-style: none;
      }
    }
  }
  .addButton {
    ::v-deep {
      width: 90px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .continent-warpper {
    display: flex;
  }
}
</style>
