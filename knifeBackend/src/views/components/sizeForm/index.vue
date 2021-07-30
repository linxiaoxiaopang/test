<template>
  <div class="size-form-component">
    <el-popover
      v-if="option.addSizeBtn"
      ref="sizePopover"
      placement="bottom-start"
      width="500"
      popper-class="size-form-popover"
      trigger="click"
      @after-leave="popoverInput.size = ''"
    >
      <el-form label-width="75px" @submit.native.prevent>
        <el-form-item label="添加尺码:" prop="pass">
          <el-input v-model="popoverInput.size" size="small" placeholder="添加多个尺码，尺码用英文逗号隔开，例如35,36,37"></el-input>
        </el-form-item>
      </el-form>
      <el-button size="small" @click="closePopover('sizePopover')">取消</el-button>
      <el-button size="small" type="primary" @click="handleAdd('size')">添加</el-button>
      <el-button
        slot="reference"
        class="add-button"
        icon="el-icon-plus"
      >添加尺码</el-button>
    </el-popover>
    <el-popover
      v-if="option.addPropBtn"
      ref="propPopover"
      placement="bottom-start"
      width="500"
      class="ml10"
      popper-class="size-form-popover"
      trigger="click"
      @after-leave="popoverInput.prop = ''"
    >
      <el-form label-width="165px" @submit.native.prevent>
        <el-form-item label="添加属性（单位：cm）:" prop="pass">
          <el-input v-model="popoverInput.prop" size="small" placeholder="添加属性名称，例如长度"></el-input>
        </el-form-item>
        <div class="fr">
          <el-button size="small" @click="closePopover('propPopover')">取消</el-button>
          <el-button size="small" type="primary" @click="handleAdd('prop')">添加</el-button>
        </div>
      </el-form>
      <el-button
        slot="reference"
        class="add-button"
        icon="el-icon-plus"
      >添加属性</el-button>
    </el-popover>
    
    <div class="fr">
      <slot name="menuRight"></slot>
    </div>

    <el-form
      ref="packForm"
      :model="packForm"
      :rules="packFormRules"
      :validate-on-rule-change="false"
      label-width="28px"
      class="el-row pack-form"
      @submit.native.prevent
    >
      <el-table
        v-if="tableDataVisible"
        ref="table"
        :data="tableData"
        border
        class="mt20"
      >
        <el-table-column
          v-for="(column, index) in tableColumns"
          :key="index"
          :prop="`${index}`"
          :label="`${index}`"
          align="center"
          :min-width="column.minWidth + 'px'"
          class-name="hover-input"
        >
          <template #header="scoped">
            <template v-if="column.isHeaderEdit && !option.isDetail">
              <el-form-item
                :prop="`header_${column.prop}`"
                label-width="0"
                class="validate-msg-center"
                :rules="headerEditRules"
              >
                <autoWidthInput
                  :value="column.label"
                  @input="handleHeaderEditInput($event, column, packForm, `header_${column.prop}`)"
                  hasEditBtn
                >
                  <template #unit>(cm)</template>
                </autoWidthInput>
                <el-popover
                  :ref="`prop${column.prop}`"
                  placement="top-start"
                  popper-class="el-popover-mini"
                  trigger="click"
                >
                  <div class="mb10">确认删除该列信息？</div>
                  <el-button size="mini" @click="closePopover('prop', column.prop)">取消</el-button>
                  <el-button size="mini" type="primary" @click="handleDelete('prop', column.prop)">确定</el-button>
                  <i slot="reference" class="el-icon-delete text-primary ml10"></i>
                </el-popover>
              </el-form-item>
            </template>
            <template v-else>
              <span
                :class="{'is-custom-required': column.required}"
                v-html="tableHeaderDetail(column)"
              ></span>
            </template>
          </template>
          <template slot-scope="scoped">
            <template v-if="column.isBodyEdit && !option.isDetail">
              <el-form-item
                :prop="`${column.prop}${scoped.$index}`"
                label-width="0"
                class="validate-msg-center"
              >
                <autoWidthInput
                  :disabled="isDisabled(scoped.row)"
                  :hasEditBtn="!isDisabled(scoped.row)"
                  :value="scoped.row[column.prop].value"
                  @input="handleBodyEditInput($event, scoped.row, packForm, column.prop, scoped.$index)"
                ></autoWidthInput>
              </el-form-item>
            </template>
            <template v-else-if="column.type === 'input'">
              <el-form-item
                :prop="`${column.prop}${scoped.$index}`"
                label-width="0"
              >
                <el-input
                  size="small"
                  :disabled="isDisabled(scoped.row)"
                  :value="scoped.row[column.prop]"
                  @input="handleTableInput($event, scoped.row, packForm, column.prop, scoped.$index)"
                />
              </el-form-item>
            </template>
            <template v-else-if="column.inputList">
              <el-form-item
                v-for="item in column.inputList"
                :key="item.prop"
                class="el-col-8"
                :label="item.label"
                :prop="`${item.prop}${scoped.$index}`"
              >
                <el-input
                  size="small"
                  :disabled="isDisabled(scoped.row)"
                  :value="scoped.row[item.prop]"
                  @input="handleTableInput($event, scoped.row, packForm, item.prop, scoped.$index)"
                />
              </el-form-item>
            </template>
            <template v-else>
              {{ tableCellDetail(scoped.row, column.prop) }}
              <span v-if="isDisabled(scoped.row) && column.prop === 'size_name'" class="text-danger">(已上架)</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          v-if="option.menu"
          prop="menu"
          label="操作"
          align="center"
        >
          <template slot-scope="{ row, $index }">
            <el-popover
              v-if="!isDisabled(row)"
              :ref="`size${$index}`"
              placement="top-start"
              class="ml10"
              popper-class="el-popover-mini"
              trigger="click"
            >
              <div class="mb10">确认删除该尺码？</div>
              <el-button size="mini" @click="closePopover('size', $index)">取消</el-button>
              <el-button size="mini" type="primary" @click="handleDelete('size', $index)">确定</el-button>
              <i slot="reference" class="el-icon-delete text-primary mr15"></i>
            </el-popover>
            <svg-icon icon-class="menu" class="text-primary draggable-btn"/>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import autoWidthInput from '@/views/components/autoWidthInput'
import { conversionCMToIN, createRandomNum, isIntAndZero, isInteger, isNegativeAndZero, validateNotNegative } from '@/utils'
import Sortable from 'sortablejs'
import { sortableMethodsMixin } from '@/mixins'
import { deepClone, getDiffData } from '@/components/avue/utils/util'
import { SIZE_DETAIL, CUSTOM, SHELVES } from '@/utils/constant'
import { add, del, edit, sortEdit, addSizePropInfo, editSizePropInfo, getSizePropInfo } from '@/api/product/protoSizeApi'
export default {
  components: {
    autoWidthInput
  },
  mixins: [sortableMethodsMixin],
  props: {
    data: {
      type: Array,
      required: true
    },
    productData: {
      type: Object,
      default: () => ({})
    },
    option: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      popoverInput: {
        size: '',
        prop: ''
      },
      sizePropData: null,
      tableData: [],
      tableDataVisible: true,
      addColumns: [],
      packForm: {},
      packRules: {
        validator: isInteger
      },
      headerEditRules: {
        required: true,
        message: '属性名不能为空'
      }
    }
  },
  computed: {
    packFormRulesProps({ tableColumns }) {
      let packFormRulesProps = []
      tableColumns.forEach(col => {
        if (col.required || col.isBodyEdit) {
          if (col.inputList) {
            col.inputList.forEach(item => {
              packFormRulesProps.push({
                prop: item.prop,
                rules: item.rules
              })
            })
          } else if (col.type || col.isBodyEdit) {
            packFormRulesProps.push({
              prop: col.prop,
              rules: col.rules,
              isHeaderEdit: col.isHeaderEdit
            })
          }
        }
      })
      return packFormRulesProps
    },
    packFormRules({ tableData, packFormRulesProps }) {
      let packFormRules = {}
      let rule =  {
        required: true,
        message: '该项为必填项'
      }
      tableData.forEach((col, index) => {
        packFormRulesProps.forEach(({ prop, rules, isHeaderEdit }) => {
          let formProp = `${prop}${index}`
          if (isHeaderEdit) {
            this.$set(this.packForm, `header_${prop}`, col[prop].label)
            this.$set(this.packForm, formProp, col[prop].value)
          } else {
            this.$set(this.packForm, formProp, col[prop])
          }
          packFormRules[formProp] = [rule, rules]
        })
      })
      // console.log(this.packForm)
      return packFormRules
    },
    
    tableColumns({ option, addColumns, showAddColumn }) {
      // console.log('tableColumns addColumns', addColumns)
      return option.column.concat(showAddColumn ? addColumns : [])
    },
    showAddColumn({ option: { addPropBtn, showAddColumn } }) {
      return addPropBtn || showAddColumn
    },
  
    handleAddColumnsChange({ addColumns, option: { isDetail } }) {
      let tempObj = {}
      addColumns.forEach(addCol => {
        tempObj[addCol.prop] = {
          label: addCol.label,
          value: ''
        }
      })
      // console.log('handleAddColumnsChange', addColumns, tempObj)
      !isDetail && this.$emit('update:addColumns', addColumns)
      return tempObj
    },
    handleTableDataChange({ tableData, addColumns, handleAddColumnsChange }) {
      tableData.forEach(row => {
        addColumns.forEach(addCol => {
          if (row[addCol.prop]) {
            row[addCol.prop].label = handleAddColumnsChange[addCol.prop].label
          } else {
            this.$set(row, addCol.prop, deepClone(handleAddColumnsChange[addCol.prop]))
          }
        })
      })
      // console.log('handleAddColumnsChange', handleAddColumnsChange)
      // console.log('handleTableDataChange', tableData)
    },
    
    validateAddColumn({ addColumns }) {
      let addColumnProps = addColumns.map(addCol => addCol.prop)
      // console.log('validateAddColumn', addColumnProps)
      return (prop) => {
        return addColumnProps.includes(prop)
      }
    },
    tableHeaderDetail({ validateAddColumn, option: { isDetail } }) {
      return (column) => {
        // console.log('tableHeaderDetail', column.label)
        return column.label +
          (
            validateAddColumn(column.prop)
              ? (isDetail ? ' (cm/in)' : ' (cm)')
              : ''
          )
      }
    },
    tableCellDetail({ validateAddColumn }) {
      return (row, prop) => {
        if (validateAddColumn(prop)) {
          let value = row[prop].value
          return value && `${value}/${conversionCMToIN(value)}`
        }
        return row[prop]
      }
    },
  
    oSizes({ productData: { sizes } }) {
      return sizes.filter(({ status }) => status != SHELVES) || []
    },
    canSort({ option: { menu } }) {
      return menu
    }
  },
  watch: {
    data: {
      handler(n) {
        let { option: { isDetail }, packRules } = this
        this.tableData = isDetail ? deepClone(n) : n
        if (n.length && isDetail) {
          let addColumns = []
          n.forEach((row) => {
            for (const key in row) {
              if (validateNotNegative(key)) {
                addColumns[key] = {
                  label: row[key].label,
                  prop: key,
                  rules: packRules,
                  isHeaderEdit: true,
                  isBodyEdit: true
                }
              }
            }
          })
          this.addColumns = []
          setTimeout(() => {
            this.addColumns = addColumns
            // console.log('data this.addColumns', this.addColumns)
          })
          // console.log('data addColumns', addColumns)
        }
        // console.log('data', JSON.stringify(n))
      },
      immediate: true
    },
    option: {
      handler(n) {
        let { addColumns, data } = this
        if (n.addColumn && addColumns.length === 0 && data.length === 0) {
          this.addColumns = deepClone(n.addColumn)
          // console.log('option', n.addColumn, addColumns, JSON.parse(JSON.stringify(data)))
        }
      },
      immediate: true,
      deep: true
    },
    productData: {
      handler(n) {
        this.getSizePropInfo(n.id)
      },
      immediate: true,
      deep: true
    },
    handleTableDataChange: {
      handler(n) {
        // console.log('handleTableDataChange', JSON.stringify(n))
      },
      deep: true
    },
    packForm: {
      handler(n) {
        // console.log('packForm', n)
      },
      deep: true
    }
  },
  updated() {
    console.log('updated')
    // console.log(this.$refs.table.$refs.bodyWrapper.getElementsByTagName('tbody'))
    let { $refs: { table }, tableData, sortable, canSort } = this
    let oSorts = sortable ? sortable.toArray() : []
    // console.log(oSorts, tableData)
    if (canSort && table && tableData.length !== oSorts.length) {
      // console.log(oSorts, tableData)
      let tbody = table.$refs.bodyWrapper.getElementsByTagName('tbody')[0]
      let trs = tbody.getElementsByTagName('tr')
      for (let i = 0, len = trs.length; i < len; i++) {
        trs[i].setAttribute('data-id', i)
      }
      this.sortable = Sortable.create(tbody, {
        handle: '.draggable-btn',
        onEnd: (evt) => {
          // console.log(evt)
          this.setNewSortToList(this.tableData, this.getNewSort(evt))
          tableData.sort((a, b) => a.sort - b.sort)
          this.sortable.sort(tableData.map(({ sort }) => sort))
          // console.log(this.sortable.toArray())
          // console.log(tableData.map(item => item.size_name + item.sort + item.oldSort))
        }
      })
    }
  },
  methods: {
    handleAdd(type) {
      let { popoverInput, addColumns, packRules, tableData } = this
      let value = popoverInput[type]
      if (!value) {
        this.$message.warning('请正确输入数据')
        return
      }
      switch (type) {
        case 'size':
          let sizeNames = value.replace(/[，,]+/g, ',').split(',')
          // console.log(sizeNames, sizeNames.find(size_name => isNegativeAndZero(size_name)))
          if (sizeNames.some(size_name => isNegativeAndZero(size_name))) {
            this.$message.warning('尺码名称为数字时，须为正整数')
            return
          }
      
          setTimeout(() => {
            this.tableDataVisible = true
            this.$nextTick(function () {
              this.$refs.table.$el.scrollIntoView()
            })
          })
          this.tableDataVisible = false
      
          sizeNames.forEach(size_name => {
            if (size_name) {
              tableData.push({
                ...SIZE_DETAIL,
                size_name,
                sort: tableData.length,
                oldSort: tableData.length,
                id: `${CUSTOM}-${createRandomNum()}`
              })
            }
          })
          // tableData.sort((a, b) => a.sort - b.sort)
          // console.log(tableData.map(item => item.size_name + item.sort + item.oldSort))
          break

        case 'prop':
          addColumns.push({
            label: value,
            prop: addColumns.length,
            rules: packRules,
            isHeaderEdit: true,
            isBodyEdit: true
          })
          break
      }
      this.closePopover(`${type}Popover`)
    },
    handleDelete(type, index) {
      let { tableData, addColumns } = this
      // console.log('handleDelete', type, index)
      switch (type) {
        case 'size':
          if (tableData.length <= 1) {
            this.closePopover(`${type}${index}`)
            return this.$message.warning('尺码至少需要存在一个！')
          }
          tableData.splice(index, 1)
          break
      
        case 'prop':
          addColumns.splice(index, 1)
          let addColumnsLen = addColumns.length
          for (let i = Number(index); i < addColumnsLen; i++) {
            addColumns[i].prop = i
  
            tableData.forEach(row => this.$set(row, i, row[i + 1]))
          }
          // console.log('handleDelete tableData', JSON.stringify(tableData))
          tableData.forEach(row => this.$delete(row, addColumnsLen))
          // console.log('handleDelete tableData', addColumnsLen, JSON.stringify(tableData))
          // console.log('handleDelete tableColumns', JSON.stringify(this.tableColumns))
          break
      }
      this.closePopover(`${type}${index}`)
    },
    
    handleTableInput(val, row, form, prop, rowIndex) {
      this.$set(form, `${prop}${rowIndex}`, val)
      this.$set(row, prop, val)
      // console.log(this.tableData, this.packForm)
    },
    handleHeaderEditInput(val, column, form, prop) {
      this.$set(form, prop, val)
      this.$set(column, 'label', val)
      // console.log(this.tableData, this.packForm)
    },
    handleBodyEditInput(val, row, form, prop, rowIndex) {
      this.$set(form, `${prop}${rowIndex}`, val)
      this.$set(row[prop], 'value', val)
      // console.log(this.tableData, this.packForm)
    },
    
    closePopover(type, index = '') {
      let popoverEle = this.$refs[`${type}${index}`]
      if (Array.isArray(popoverEle)) {
        popoverEle.forEach(ele => {
          ele.doClose()
        })
      } else {
        popoverEle.doClose()
      }
    },
  
    existSameSizeName() {
      const sizes = this.data
      const set = [...new Set(sizes.map(({ size_name }) => size_name.toUpperCase()))]
      return set.length < sizes.length
    },
    async validate() {
      if (this.tableData.length === 0) {
        this.$message.warning('尺码至少需要存在一个')
        return false
      }

      if (this.existSameSizeName()) {
        this.$message.warning('存在两个一样的尺码，尺码名称必须唯一')
        return 0
      }
  
      const [, successData] = await awaitWrap(this.$refs.packForm.validate())
      // console.log(successData, this.packForm, this.packFormRules)
      return successData
    },
    async doSubmit() {
      const valid = await this.validate()
      if (valid) {
        await this.doFunc()
      }
    },
    async doFunc() {
      if (this.option.addPropBtn) {
        let { sizePropData, productData } = this
        if (sizePropData) {
          return await this.editSizePropInfo(sizePropData)
        } else {
          return await this.addSizePropInfo(productData.id)
        }
      } else {
        let { productData: { id }, data: allSizes } = this
        allSizes = allSizes.map(size => {
          let item = {}
          for (const key in size) {
            if (!validateNotNegative(key)) {
              item[key] = size[key]
            }
          }
          return item
        })
        this.doSortEdit(allSizes)
        const sizes = allSizes.filter(({ status }) => status != SHELVES)
        const delRes = await Promise.all([...this.doDel(sizes)])
        const delSuccessBool = delRes.every(({ code }) => $SUC({ code }))
        if (!delSuccessBool) {
          return this.$message.error('尺码删除发生错误')
        }
        const res = await Promise.all([...this.doAdd(id, sizes), ...this.doEdit(sizes)])
        const successBool = res.every(({ code }) => $SUC({ code }))
        if (successBool) {
          return true
        }
      }
    },
    doDel(sizes) {
      const delArr = this.oSizes.filter(({ id }) => {
        return sizes.every((item) => item.id !== id)
      })
      return delArr.map(({ id }) => del(id))
    },
    doAdd(id, sizes) {
      const addArr = sizes.filter(({ id }) => {
        if (!id) return true
      
        return id.toString().indexOf(CUSTOM) >= 0
      })
      // let { dragCurrentOrder } = this
      return addArr.map((form) => {
        // form.sort = dragCurrentOrder[form.id]
        return add({
          ...form,
          id: undefined,
          prim_prod: id
        })
      })
    },
    doEdit(sizes) {
      let { oSizes } = this
      const editArr = sizes.filter(({ id }) => {
        return oSizes.some((item) => {
          if (id.toString().indexOf(CUSTOM) >= 0) return false
          return item.id == id
        })
      })
      
      let diffData = []
      editArr.forEach((item) => {
        let oSize = oSizes.find(({ id }) => item.id === id)
        let diffItem = getDiffData(oSize, item)
        delete diffItem.sort
        if (Object.keys(diffItem).length) diffData.push(item)
      })
      if (diffData.length === 0) return []
      
      return diffData.map(({ id, psd_file, ...form }) =>
        edit(id, {
          ...form
        })
      )
    },
    doSortEdit(sizes) {
      let { sizes: oSizes } = this.productData
      let oSorts = {}
      oSizes.forEach(({ id, sort }, index) => {
        oSorts[id] = isIntAndZero(sort) ? sort : index
      })
      const editArr = []
      sizes
        .filter(({ id }) => {
          return oSizes.some((item) => {
            if (id.toString().indexOf(CUSTOM) >= 0) return false
            return item.id == id
          })
        })
        .map(({ id, sort }) => {
          if (sort !== oSorts[id]) {
            editArr.push({
              id,
              sort
            })
          }
        })
      
      if (editArr.length === 0) return
      return sortEdit(editArr)
    },
  
    async addSizePropInfo(prim_prod) {
      // prim_prod为原型id
      let { addColumns } = this
      if (addColumns.length === 0 || !prim_prod) return true
      
      let [, res] = await awaitWrap(addSizePropInfo({
        params: JSON.stringify(this.getSizePropInfoByTableData()),
        prim_prod
      }))
      if ($SUC(res)) {
        return true
      }
    },
    async editSizePropInfo(sizePropData) {
      let info = JSON.stringify(this.getSizePropInfoByTableData())
      if (sizePropData.introduce_detail === info) return true
      
      let [, res] = await awaitWrap(editSizePropInfo({
        info,
        id: sizePropData.id
      }))
      if ($SUC(res)) {
        return true
      }
    },
    async getSizePropInfo(id) {
      let { sizePropData, option: { addPropBtn } } = this
      if (sizePropData || id === undefined || !addPropBtn) return
      let [, res] = await awaitWrap(getSizePropInfo(id))
      if ($SUC(res) && res.detail[0]) {
        let tempArr = JSON.parse(res.detail[0].introduce_detail)
        this.sizePropData = deepClone(res.detail[0])
        let { tableData, packRules } = this
        let addColumns = []
        tempArr.forEach((item, index) => {
          if (tableData[index]) {
            for (const key in item) {
              this.$set(tableData[index], key, item[key])
              if (!addColumns[key]) {
                addColumns[key] = {
                  label: item[key].label,
                  prop: key,
                  rules: packRules,
                  isHeaderEdit: true,
                  isBodyEdit: true
                }
              }
            }
          }
        })
        // console.log(tempArr, addColumns)
        this.addColumns = addColumns
      }
    },
    getSizePropInfoByTableData() {
      return this.tableData.map(row => {
        let item = {}
        for (const key in row) {
          if (validateNotNegative(key)) {
            item[key] = row[key]
          }
        }
        return item
      })
    },
  
    isDisabled(data) {
      return data.status === SHELVES
    }
  }
}
</script>
<style lang="scss">
.size-form-component {
  font-size: 14px;
  .el-table {
    border-top: 1px solid $border-color;
    border-left: 1px solid $border-color;
    th {
      border-right: 1px solid $border-color;
      color: #595961;
      font-weight: normal;
      > .el-input__inner {
        color: #595961;
      }
    }
    .el-icon-delete {
      font-size: 16px;
    }
  }
  .el-table__empty-block {
    display: none;
  }
}
.size-form-popover {
  padding: 15px 40px 20px 30px;

  .el-button {
    font-size: 14px;
  }
}

.pack-form {
  .el-form-item__label {
    padding: 0 3px 0 5px;
  }
  .el-form-item {
    margin: 18px 0;
    &.is-required:not(.is-no-asterisk)>.el-form-item__label::before {
      display: none;
    }
  }
}
</style>
