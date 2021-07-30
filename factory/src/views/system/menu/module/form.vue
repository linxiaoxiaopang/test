<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增菜单' : '编辑菜单'" width="600px">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="是否显示" prop="is_show">
        <el-radio v-model="form.is_show" :label="true">是</el-radio>
        <el-radio v-model="form.is_show" :label="false">否</el-radio>
      </el-form-item>
      <el-form-item v-if="form.is_show" label="菜单图标" prop="icon">
        <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['iconSelect'].reset()">
          <IconSelect ref="iconSelect" @selected="selected" />
          <el-input slot="reference" v-model="form.icon" style="width: 460px" placeholder="点击选择图标" readonly>
            <svg-icon
              v-if="form.icon"
              slot="prefix"
              :icon-class="form.icon"
              class="el-input__icon"
              style="height: 32px; width: 16px"
            />
            <i v-else slot="prefix" class="el-icon-search el-input__icon" />
          </el-input>
        </el-popover>
      </el-form-item>
      <el-form-item label="菜单名称" prop="name">
        <el-input v-model="form.name" placeholder="名称" style="width: 460px" />
        <!-- <el-tag type="danger">
          {{ form.name }}
        </el-tag> -->
      </el-form-item>
      <el-form-item label="菜单排序" prop="sort">
        <el-input v-model.number="form.sort" placeholder="序号越小越靠前" style="width: 460px" />
      </el-form-item>
      <el-form-item label="内部菜单" prop="is_frame">
        <el-radio v-model="form.is_frame" :label="false">是</el-radio>
        <el-radio v-model="form.is_frame" :label="true">否</el-radio>
      </el-form-item>
      <el-form-item label="链接地址">
        <!-- <el-input
          v-model="form.path"
          placeholder="菜单路径"
          style="width: 460px"
        /> -->
        <el-tag type="primary">
          {{ form.path }}
        </el-tag>
      </el-form-item>
      <el-form-item v-if="!form.is_frame" label="组件路径">
        <el-tag type="danger">
          {{ form.component || 'null' }}
        </el-tag>

        <!-- <el-input v-model="form.component" placeholder="组件路径" style="width: 460px;"/> -->
        <!-- <el-select
          class="selectComponentListGroupComponent"
          v-model="form.component"
          filterable
          clearable
          placeholder="请选择组件路径"
          style="width: 460px"
        >
          <el-option-group
            v-for="(group, fIndx) in (sup_this && sup_this.selectComponentList) || []"
            :label="group.label"
            :key="fIndx"
          >
            <el-option
              v-for="(item, indx) in group.options || []"
              :label="item"
              :value="item"
              :key="indx"
            />
          </el-option-group>
        </el-select> -->
      </el-form-item>
      <el-form-item label="父级菜单" v-if="form.pid !== null || isAdd">
        <treeselect
          ref="treeselect"
          v-if="!createChild"
          v-model="form.pid"
          :options="menus"
          :normalizer="normalizer"
          style="width: 460px"
          placeholder="请选择父级菜单"
        >
          <label slot="option-label" slot-scope="{ node }">
            <span style="color: #f56c6c" v-if="delMenus.map(({ id }) => id).includes(node.id)"> {{ node.label }}</span>
            <span v-else> {{ node.label }}</span>
          </label>
        </treeselect>
        <el-tag v-else type="danger"> {{ parentName }} </el-tag>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/menu'
import Treeselect from '@riophae/vue-treeselect'
import IconSelect from '@/components/IconSelect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { shakingChildren } from '@/utils'

import { MENU_TYPE } from '@/utils/constant'

export default {
  components: { Treeselect, IconSelect },
  props: {
    menus: {
      type: Array,
      required: true
    },
    delMenus: {
      type: Array,
      default: () => []
    },
    isAdd: {
      type: Boolean,
      required: true
    },
    sup_this: {
      type: Object,
      default: null
    },
    createChild: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      form: {
        name: '',
        sort: 999,
        path: '',
        component: '',
        is_show: 'true',
        is_frame: 'false',
        pid: null,
        icon: '',
        menu_type: MENU_TYPE
      },
      rules: {
        is_show: [{ required: true, message: '是否在导航栏显示', trigger: 'blur' }],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          {
            validator: this.validatorName,
            trigger: 'change'
          }
        ],
        sort: [
          {
            required: true,
            message: '请输入序号',
            trigger: 'blur',
            type: 'number'
          }
        ],
        is_frame: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }]
      }
    }
  },
  computed: {
    parentName() {
      const idArr = shakingChildren(this.menus, 'id')
      const labelArr = shakingChildren(this.menus, 'label')
      if (this.form.pid === null) return '无'
      const index = idArr.findIndex((id) => this.form.pid === id)
      if (index >= 0) {
        return labelArr[index]
      }

      return '无'
    }
  },
  methods: {
    //校验菜单名称是否已经存在
    validatorName(rule, value, callback) {
      if (!this.isAdd) {
        return callback()
      }
      const names = shakingChildren(this.menus, 'label')
      const existence = names.includes(value)
      if (existence) {
        return callback(new Error('菜单名称已经存在'))
      }
      callback()
    },
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      const bool = this.delMenus.some((item) => {
        return item.id === node.id
      })
      return {
        id: node.id,
        label: bool ? `(待删除)${node.label}` : node.label,
        children: node.children,
        isNew: bool
      }
    },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else this.doEdit()
        } else {
          return false
        }
      })
    },
    doAdd() {
      this.form.menu_type = MENU_TYPE
      add(this.form)
        .then((res) => {
          this.resetForm()
          this.$message({
            showClose: true,
            type: 'success',
            message: '添加成功!',
            duration: 2500
          })
          this.loading = false
          this.sup_this.init()
          this.sup_this.getMenus()
        })
        .catch((err) => {
          this.loading = false
          console.log(err)
        })
    },
    doEdit() {
      const { ...params } = this.form
      params.menu_type = MENU_TYPE
      edit(this.form.id, params)
        .then((res) => {
          this.resetForm()
          this.$message({
            showClose: true,
            type: 'success',
            message: '修改成功!',
            duration: 2500
          })
          this.loading = false
          this.sup_this.init()
          this.sup_this.getMenus()
        })
        .catch((err) => {
          this.loading = false
          console.log(err)
        })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
    },
    selected(name) {
      this.form.icon = name
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-select-group__title::before {
    content: '路径分类：';
  }
}
</style>
