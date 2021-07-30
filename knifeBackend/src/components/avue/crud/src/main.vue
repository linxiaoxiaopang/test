<template>
  <div class="crud-container pull-auto">
    <transition name="slide-fade" :duration="500">
      <div ref="headerSearch" class="crud-header" v-show="showHeaderSearch">
        <slot name="headerBefore"></slot>
        <!--v-show="searchFlag && showSearch"-->
        <el-form
          :model="searchForm"
          ref="searchForm"
          class="el-row formPart"
          :size="option.searchSize || 'mini'"
        >
          <!-- 循环列搜索框 -->
          <el-col
            v-for="(column,index) in searchColumn"
            :key="index"
            :md="column.searchSpan || 6"
            :xs="24"
            :span="24"
            :offset="column.offset || 0"
            :pull="column.pull"
            :style="{ width: column.searchWidth && column.searchWidth + 'px' }"
          >
            <el-form-item :label="column.label + ':'" :prop="column.prop" :label-width="setPx(column.searchLabelWidth,80)">
              <slot v-if="column.searchFormSlot"
                    :name="column.prop + 'SearchForm'"
                    :dic="setDic(column.dicData,DIC[column.dicData])"
                    :form="searchForm"
                    :label="column.label"
                    :prop="column.prop"
                    :props="column.props"
                    :placeholder="column.searchPlaceholder"
              ></slot>
              <component v-else
                         :size="option.searchSize || 'mini'"
                         :is="getSearchType(column.type)"
                         v-model="searchForm[column.prop]"
                         :type="column.type"
                         :valueFormat="column.valueFormat"
                         :label="column.label"
                         :placeholder="column.searchPlaceholder"
                         :props="column.props"
                         :dic="setDic(column.dicData,DIC[column.dicData])"
                         :border="column.border"
                         :minRows="column.minRows"
                         :maxRows="column.maxRows"
                         :controls="column.controls"
                         :controls-position="column.controlsPosition"
                         @search-change="searchChange"
              ></component>
            </el-form-item>
          </el-col>
          <el-col v-if="vaildData(option.btn,true)" :span="1.5" class="text-right nowrap ml10">
            <el-form-item>
              <el-button type="primary" @click="searchChange" icon="el-icon-search" :size="option.searchSize || 'mini'">{{ option.searchText || '' }}</el-button>
              <el-button v-if="option.resetBtn" @click="searchReset" icon="el-icon-refresh" :size="option.searchSize || 'mini'">重置</el-button>
              <slot name="searchMenu"></slot>
            </el-form-item>
          </el-col>
        </el-form>
        <slot name="headerAfter"></slot>
      </div>
    </transition>
    <div class="menu-left clearfix"
         v-if="vaildData(option.addBtn,true) || vaildData(option.columnBtn,true) || searchColumn.length || $slots.menuLeft || $slots.menuRight"
    >
      <div class="fl">
        <el-button
          v-if="vaildData(option.addBtn,false)"
          type="primary"
          size="mini "
          @click="rowAdd"
        >新增</el-button>
        <slot name="menuLeft"></slot>
      </div>
      <div class="fr">
        <el-button icon="el-icon-s-operation" circle @click="columnVisible=true" v-if="vaildData(option.columnBtn,false)"></el-button>
        <el-button icon="el-icon-search" circle @click="handleShowSearch" v-if="vaildData(option.searchColumn,false)"></el-button>
        <el-dialog
          title="列显隐"
          :visible.sync="columnVisible"
          width="50%"
          append-to-body
        >
          <el-checkbox-group v-model="showColumnList">
            <el-checkbox
              v-for="(column,index) in columnList"
              :key="index"
              :label="column.prop"
            >{{ column.label }}</el-checkbox>
          </el-checkbox-group>
        </el-dialog>
        <slot name="menuRight"></slot>
      </div>
    </div>
    <slot name="header"></slot>
    <el-table ref="table"
              :data="data"
              :row-key="option.rowKey"
              :expand-row-keys="expandRowKeys"
              :tree-props="vaildData(option.treeProps, {children: 'children', hasChildren: 'hasChildren'})"
              v-loading="tableLoading"
              :stripe="option.stripe"
              :show-header="option.showHeader"
              :default-sort="option.defaultSort"
              :max-height="option.maxHeight"
              :height="option.height=='auto'?($AVUE.clientHeight - vaildData(option.calcHeight,275)):option.height"
              :width="setPx(option.width,'100%')"
              :border="vaildData(option.border,true)"
              :row-class-name="tableRowClassName"
              :span-method="tableSpanMethod"
              @row-click="rowClick"
              @row-dblclick="rowDblclick"
              @selection-change="selectionChange"
              @sort-change="sortChange"
    >
      <!-- 下拉弹出框  -->
      <template v-if="option.expand">
        <el-table-column type="expand" width="50" fixed="left" align="center">
          <template slot-scope="props">
            <slot :row="props.row" name="expand"></slot>
          </template>
        </el-table-column>
      </template>
      <!-- 选择框 -->
      <template v-if="option.selection">
        <el-table-column type="selection"
                         width="50"
                         fixed="left"
                         align="center"
                         :selectable="option.selectable"
        ></el-table-column>
      </template>
      
      <!-- 序号 -->
      <template v-if="option.index">
        <el-table-column
          :label="vaildData(option.indexLabel,'#')"
          type="index"
          :index="indexMethod"
          width="50"
          fixed="left"
          align="center"
        ></el-table-column>
      </template>
      <!-- 循环列 -->
      <el-table-column
        v-for="(column,index) in tableColumn"
        :key="column.prop"
        :prop="column.prop"
        :show-overflow-tooltip="column.overHidden && overHidden"
        :min-width="column.minWidth"
        :sortable="column.sortable"
        :align="vaildData(column.align,option.align)"
        :header-align="vaildData(column.headerAlign,option.headerAlign)"
        :width="column.width"
        :label="column.label"
        :fixed="column.fixed"
      >
        <template slot="header" slot-scope="scope">
          <slot v-if="column.headerSlot"
                :name="column.prop + 'Header'"
                :dic="setDic(column.dicData,DIC[column.dicData])"
                v-bind="scope"
          ></slot>
          <template v-else>{{ column.label }}</template>
        </template>
        <template slot-scope="scope">
          <slot
            v-bind="scope"
            :dic="setDic(column.dicData,DIC[column.dicData])"
            :name="column.prop"
            v-if="column.slot"
          >
            {{detail(scope.row,column)}}
          </slot>
          <template v-else>
            <span v-if="column.type" v-html="detail(scope.row,column)"></span>
            <span v-else>{{scope.row[column.prop]}}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column v-if="vaildData(option.menu,true)"
                       :fixed="option.menuFixed === 'normal' ? undefined : vaildData(option.menuFixed,'right')"
                       label="操作"
                       :align="option.menuAlign"
                       :header-align="option.menuHeaderAlign"
                       :width="vaildData(option.menuWidth,240)"
      >
        <template slot-scope="scope">
          <slot :row="scope.row" name="menu" :index="scope.$index"></slot>
          <template v-if="vaildData(option.menu,true)">
            <el-button type="text" size="mini" @click.stop.safe="rowEdit(scope.row,scope.$index)" v-if="vaildData(option.editBtn,true)">编辑</el-button>
            <el-divider direction="vertical" v-if="option.editBtn&&option.delBtn"></el-divider>
            <el-button type="text" danger size="mini" @click.stop.safe="rowDel(scope.row,scope.$index)" v-if="vaildData(option.delBtn,true)">删除</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination v-if="vaildData(option.page,true)"
                   class="crud-pagination pull-right"
                   :current-page.sync="page.pageIndex"
                   :background="vaildData(option.pageBackground,true)"
                   :page-sizes="vaildData(option.pageSizes,[5, 10, 15, 20])"
                   :page-size="page.pageSize"
                   :hide-on-single-page="hideOnSinglePage"
                   @size-change="sizeChange"
                   @current-change="currentChange"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="page.total"
    ></el-pagination>
    <!-- 表单 -->
    <el-dialog lock-scroll
               :fullscreen="vaildData(option.formFullscreen,false)"
               :modal-append-to-body="false"
               :append-to-body="true"
               :title="boxType==0?'新增':'编辑'"
               :visible.sync="boxVisible"
               :width="vaildData(option.formWidth,'60%')"
               :before-close="hide"
    >
      <el-form ref="tableForm" class="crud-form" :model="tableForm" :label-width="setPx(option.labelWidth,80)" :rules="tableFormRules">
        <el-row :gutter="20" :span="24">
          <template v-for="(column,index) in dialogFormColumn">
            <el-col :span="column.span || 12">
              <el-form-item :style="{height:setPx(column.formHeight,'auto')}" :label="column.label" :prop="column.prop" :label-width="setPx(column.labelWidth,option.labelWidth || 80)">
                <slot :value="tableForm[column.prop]" :column="column" :dic="setDic(column.dicData,DIC[column.dicData])" :name="column.prop+'Form'" v-if="column.formsolt"></slot>
                <component v-else
                           :is="getComponent(column.type)"
                           v-model="tableForm[column.prop]"
                           :precision="column.precision"
                           :height="setPx(column.formHeight,'auto')"
                           :size="vaildData(column.size, 'mini')"
                           :clearable="column.clearable"
                           :type="column.type"
                           :minRows="column.minRows"
                           :maxRows="column.maxRows"
                           :placeholder="column.label"
                           :dic="setDic(column.dicData,DIC[column.dicData])"
                           :disabled="boxType==0?vaildData(column.addDisabled,false):vaildData(column.editDisabled,false)"
                           :format="column.format"
                           :value-format="column.valueFormat"
                ></component>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="rowUpdate" v-if="boxType==1">修 改</el-button>
        <el-button type="primary" @click="rowSave" v-else>新 增</el-button>
        <el-button @click="hide">取 消</el-button>
      </span>
    </el-dialog>
  
  </div>
</template>
<script>
  import crud from '../../mixins/crud.js'
  import { validatenull } from '../../utils/validate.js'
  import tableTemp from '../../utils/tableTemp.js'
  import moment from 'moment'
  export default {
    name: 'AvueCrud',
    mixins: [crud()],
    components: {},
    data() {
      return {
        hideOnSinglePage: true,
        
        searchForm: {},
        overHidden: true,
        headerSearchHeight: 0,
        
        // 查询表单显隐
        searchStyle: '',
        showSearch: true,
        // 表格列显隐
        columnVisible: false,
        showColumnList: [],
        
        boxVisible: false,
        boxType: 0,
        DIC: {},
        tableForm: {},
        tableFormRules: {},
        tableIndex: -1,
        tableSelect: []
      }
    },
    created() {
      //规则初始化
      this.rulesInit()
      //初始化字典
      this.dicInit()
      //初始化表单
      this.formInit()
    },
    watch: {
      option: {
        handler(n, o) {
          this.hideOnSinglePage = this.vaildData(n.hideOnSinglePage, true)
          this.rulesInit()
        },
        deep: true
      },
      tableForm: {
        handler(n, o) {
          this.formVal()
        },
        deep: true
      },
      columnList: {
        handler() {
          this.columnList.map(column => {
            this.showColumnList.push(column.prop);
          })
        },
        immediate: true
      },
      showHeaderSearch(n) {
        this.headerSearchHeight = Math.max(this.$refs.headerSearch.clientHeight, this.headerSearchHeight);
        this.$refs.headerSearch.style.height = `${this.headerSearchHeight}px`;
        this.$refs.headerSearch.style.overflow = 'hidden';
        setTimeout(() => {
          if (n) this.$refs.headerSearch.style = '';
        }, 500)
      }
    },
    computed: {
      searchColumn() {
        return this.option.column.filter(column => {
          return column.search
        })
      },
      searchFlag: function() {
        return !validatenull(this.searchForm)
      },
      showHeaderSearch() {
        return (this.searchFlag && this.showSearch) || this.$slots.headerBefore || this.$slots.headerAfter
      },
      columnList() {
        return this.option.column.filter(column => {
          return !column.hide
        })
      },
      tableColumn() {
        return this.option.column.filter(column => {
          return !column.hide && this.showColumnList.includes(column.prop)
        })
      },
      dialogFormColumn() {
        return this.option.column.filter(column => {
          return this.boxType==0?this.vaildData(column.addDisplay,true):this.vaildData(column.editDisplay,true)
        })
      }
    },
    mounted() {},
    props: {
      value: {
        type: Object,
        default: () => {
          return {}
        }
      },
      spanMethod: Function,
      rowClassName: Function,
      beforeClose: Function,
      beforeOpen: Function,
      expandRowKeys: {
        type: Array,
      },
      page: {
        type: Object,
        default() {
          return {
            // total: 0, //总页数
            // pageIndex: 0, //当前页数
            // pageSize: 10, //每页显示多少条
            // background: true //背景颜色
          }
        }
      },
      tableLoading: {
        type: Boolean,
        default: false
      },
      data: {
        type: Array,
        required: true,
        default: () => {
          return []
        }
      },
      option: {
        type: Object,
        required: true,
        default: () => {
          return []
        }
      }
    },
    methods: {
      rulesInit() {
        this.tableFormRules = {};
        this.option.dic = [];
        if (validatenull(this.page)) this.option.page = false;
        this.option.column.forEach(ele => {
          this.getDicData(ele);
          this.setCascaderItem('form', ele);
          
          ele.searchSpan = this.vaildData(ele.searchSpan, this.option.searchSpan);
          ele.searchLabelWidth = this.vaildData(ele.searchLabelWidth, this.option.searchLabelWidth);
          
          if (ele.rules) this.tableFormRules[ele.prop] = ele.rules
        })
      },
      dicInit() {
        this.GetDic(this.option.dic).then(data => {
          Object.keys(data).forEach(key => {
            this.$set(this.DIC, key, data[key]);
          });
        })
      },
      formVal() {
        this.$emit('input', this.tableForm)
      },
      formReset() {
        for (let o in this.tableForm) {
          if (this.tableForm[o] instanceof Array) {
            this.tableForm[o] = []
          } else if (typeof this.tableForm[o] === 'number') {
            this.tableForm[o] = 0
          } else {
            this.tableForm[o] = ''
          }
        }
      },
      formInit() {
        const list = this.option.column
        let form = {}
        let searchForm = {}
        list.forEach(ele => {
          if (
            ele.type == 'checkbox' ||
            ele.type == 'radio' ||
            ele.type == 'cascader'
          ) {
            form[ele.prop] = []
            if (ele.search) {
              searchForm[ele.prop] = []
            }
          } else if (ele.type == 'number') {
            form[ele.prop] = 0
            if (ele.search) {
              searchForm[ele.prop] = 0
            }
          } else {
            form[ele.prop] = ''
            if (ele.search) {
              searchForm[ele.prop] = ''
            }
          }
          if (!validatenull(ele.value)) form[ele.prop] = ele.value;
          if (!validatenull(ele.searchValue)) searchForm[ele.prop] = ele.searchValue;
        })
        this.tableForm = Object.assign({}, form)
        this.searchForm = Object.assign({}, searchForm)
      },
      //搜索回调
      searchChange() {
        this.$emit('search-change', this.searchForm)
      },
      //搜索清空
      searchReset() {
        this.$refs['searchForm'].resetFields();
        this.$emit('search-reset', this.searchForm)
      },
      // 页大小回调
      sizeChange(val) {
        this.hideOnSinglePage = false
        this.$emit('size-change', val)
      },
      // 页码回调
      currentChange(val) {
        this.$emit('current-change', val)
      },
      // 选中实例
      toggleSelection(rows, selected) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.table.toggleRowSelection(row, selected)
          })
        } else {
          this.$refs.table.clearSelection()
        }
      },
      //选择回调
      selectionChange(val) {
        this.tableSelect = val
        this.$emit('selection-change', val)
      },
      //排序回调
      sortChange(val) {
        this.$emit('sort-change', val)
      },
      
      //合并行
      tableSpanMethod(param) {
        if (typeof this.spanMethod === "function") return this.spanMethod(param);
      },
      //行添加class
      tableRowClassName(param) {
        if (typeof this.rowClassName === "function") return this.rowClassName(param);
      },
      
      //行双击
      rowDblclick(row, event) {
        this.$emit('row-dblclick', row, event)
      },
      // 搜索表单显隐
      handleShowSearch() {
        this.showSearch = !this.showSearch;
      },
      
      //当某个单元格被点击时会触发该事件
      cellClick(row, column, cell, event) {
        this.$emit("cell-click", row, column, cell, event);
      },
      //行单机
      rowClick(row, event, column) {
        this.$emit('row-click', row, event, column)
      },
      //处理数据
      detail(row, column) {
        let result = '';
        if (column.formatter && typeof column.formatter === 'function') {
          result = column.formatter(row)
        } else {
          result = row[column.prop]
        }
        if (column.type) {
          if (
            (column.type == 'date' ||
              column.type == 'time' ||
              column.type == 'datetime') &&
            column.format
          ) {
            const format = column.format
              .replace('dd', 'DD')
              .replace('yyyy', 'YYYY')
            result = moment(result).format(format)
          }
          result = this.findByvalue(
            typeof column.dicData == 'string'
              ? this.DIC[column.dicData]
              : column.dicData,
            result,
            column.props,
          )
        }
        this.$set(row, `$${column.prop}`, result);
        return result
      },
      // 新增
      rowAdd() {
        this.boxType = 0
        this.show()
      },
      // 编辑
      rowEdit(row, index) {
        this.tableForm = Object.assign({}, row)
        this.tableIndex = index
        this.boxType = 1
        this.show()
      },
      // 删除
      rowDel(row, index) {
        this.$emit('row-del', row, index)
      },
      //保存
      rowSave() {
        this.$refs['tableForm'].validate(valid => {
          if (valid) {
            this.$emit('row-save', Object.assign({}, this.tableForm), this.hide, () => {})
          }
        })
      },
      //更新
      rowUpdate() {
        this.$refs['tableForm'].validate(valid => {
          if (valid) {
            const index = this.tableIndex
            this.$emit(
              'row-update',
              Object.assign({}, this.tableForm),
              index,
              this.hide,
              () => {}
            )
          }
        })
      },
      //显示表单
      show(cancel) {
        const callack = () => {
          if (cancel !== true) {
            this.boxVisible = true
          }
        }
        if (typeof this.beforeOpen === 'function') this.beforeOpen(callack)
        else callack()
      },
      //隐藏表单
      hide(cancel) {
        const callack = () => {
          if (cancel !== false) {
            this.$nextTick(() => {
              this.$refs['tableForm'].resetFields()
              //释放form表单
              this.formReset()
            })
            this.boxVisible = false
          }
        }
        if (typeof this.beforeClose === 'function') this.beforeClose(callack)
        else callack()
      },
      validate(callback) {
        return this.$refs.searchForm.validate(callback)
      },
      indexMethod: function indexMethod(index) {
        return index + 1 + ((this.page.pageIndex || 1) - 1) * (this.page.pageSize || 10);
      },
      rowPrint() {
        console.log('rowPrint');
        // this.overHidden = false;
        // this.$nextTick(function () {
        //   this.$print(this.$refs.table);
        //   this.overHidden = true;
        // })
        
        if (validatenull(this.data)) {
          this.$message.warning("请勾选要打印的数据");
          return;
        }
        /*const getTemplate = () => {
          return tableTemp(
            this.tableColumn,
            this.data,
            this.tableColumn
          );
        };*/
        
        this.$nextTick(() => {
          var newstr = this.getTemplate();
          var tab = window.open("", "打印");
          tab.document.open();
          tab.document.write(newstr);
          tab.window.print();
          tab.close();
        });
      },
      getTemplate() {
        return tableTemp(
          this.tableColumn,
          this.data,
          this.tableColumn
        );
      },
      
      toggleRowExpansion(row, expanded) {
        this.$refs.table.toggleRowExpansion(row, expanded)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .crud-container {
    margin: 0 auto;
    width: 99%;
    overflow: auto;
    
    .menu-left {
      margin: 10px 0 5px 0;
      .fl {
        .el-button {
          margin-right: 8px;
          margin-bottom: 8px;
        }
      }
    }
  }
  .crud-pagination {
    margin-top: 15px;
    padding: 10px 20px;
  }
  .crud-form {
    padding: 0 8px;
  }
  .crud-header {
    & > .el-button {
      padding: 12px 25px;
    }
  }
  .crud--overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }
  
  
  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    -webkit-transition: all .49s linear;
    -moz-transition: all .49s linear;
    -ms-transition: all .49s linear;
    -o-transition: all .49s linear;
    transition: all .49s linear;
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    height: 0!important;
  }
  
  
  .formPart {
    margin: 20px 0;
    background-color: #F7F8FA;
    padding: 20px 20px 5px;
    .el-form-item {
      margin-right: 20px;
    }
  }
</style>
