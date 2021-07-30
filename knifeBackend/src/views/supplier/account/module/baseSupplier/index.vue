<template>
  <div class="app-container baseUserRoleComponent app-flex-col-container">
    <div class="flex-col-content">
      <div class="title">
        <i class="el-icon-d-arrow-left" @click="back"></i>
        <span>{{ userTitle }}</span>
      </div>
      <BaseForm
        style="width: 50%"
        v-loading="loading"
        size="small"
        ref="form"
        label-width="100PX"
        :cols="formField"
        :form="form"
      >
        <template #nameSlot="{ scoped: { prop, placeholder } }">
          <el-input
            size="small"
            type="text"
            style="width: 250px"
            :placeholder="placeholder"
            v-model="form[prop]"
          />
        </template>

        <template #passwordSlot="{ scoped: { prop, placeholder } }">
          <el-input
            v-model="form[prop]"
            :placeholder="placeholder"
            type="password"
            show-password
            auto-complete="on"
          />
        </template>

        <template #password2Slot="{ scoped: { prop, placeholder } }">
          <el-input
            v-model="form[prop]"
            :placeholder="placeholder"
            show-password
            type="password"
            auto-complete="on"
          />
        </template>

        <template #supplierSlot="{ scoped: { prop, placeholder } }">
          <SupplierSelectList
            style="width: 250px"
            :menus="menus"
            :keyword.sync="form[prop]"
            :placeholder="placeholder"
          />
        </template>

        <template #rolesSlot="{ scoped: { prop, placeholder } }">
          <RoleSelectList
            style="width: 250px"
            multiple
            :menus="roles"
            :keyword.sync="form[prop]"
            :placeholder="placeholder"
          />
        </template>
      </BaseForm>
    </div>
    <div class="btn-wrapper bottom">
      <el-button @click="back"> 取消 </el-button>
      <el-button type="primary" @click="doSubmit" :loading="loading"> 提交 </el-button>
    </div>
  </div>
</template>

<script>
import SupplierSelectList from '../supplierSelectList'
import RoleSelectList from '../roleSelectList'
import { addUserField, editUserField } from './formField'
import { commonFromMixin } from '@/mixins'
import { add, read, edit } from '@/api/user'
import { supplier_list } from '@/api/order/supplier'
import { getSelectedRoles } from '@/api/role'
export default {
  mixins: [commonFromMixin],
  components: {
    SupplierSelectList,
    RoleSelectList
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    sup_this: {
      type: Object,
      default: null
    }
  },
  computed: {
    userTitle() {
      return this.isEdit ? '编辑供应商账号' : '添加供应商账号'
    }
  },
  data() {
    if (!this.isEdit) {
      const confirmPass = (rule, value, callback) => {
        if (this.form.password !== value) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }
      addUserField[4].rule.push({
        validator: confirmPass
      })
    }
    return {
      formField: this.isEdit ? editUserField : addUserField,
      id: this.$route.query.id,
      form: {},
      loading: false,
      menus: [],
      roles: []
    }
  },
  created() {
    this.initEdit()
    this.getSupplier()
    this.getSelectedRoles()
  },
  methods: {
    back() {
      this.$router.replace('/supplier/account')
    },
    async getSupplier() {
      const { detail = [], code } = (await supplier_list()) || {}
      if ($SUC({ code })) {
        this.menus = detail
      }
    },
    async getSelectedRoles() {
      const { detail = [], code } = (await getSelectedRoles()) || {}
      if ($SUC({ code })) {
        this.roles = detail
      }
    },
    async initEdit() {
      if (!this.isEdit) return
      if (!this.id) {
        this.back()
      }
      const { code, detail } = await read(this.id)
      if ($SUC({ code })) {
        const { nick_name, username, email, supplier, roles } = detail || {}
        this.form = {
          username,
          nick_name,
          email,
          supplier: supplier ? supplier.id : '',
          roles
        }
        const { form } = this.$refs
        form && form.resetFields()
      }
    },
    async doSubmit() {
      const valid = await this.validate()
      if (!valid) return
      if (this.isEdit) {
        this.doEdit()
      } else {
        this.doAdd()
      }
    },
    async doAdd() {
      this.loading = true
      try {
        const { code } = await add(this.form)
        if ($SUC({ code })) {
          this.success()
          this.back()
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },

    async doEdit() {
      this.loading = true
      try {
        const { code } = await edit(this.id, this.form)
        if ($SUC({ code })) {
          this.success()
          this.back()
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.baseUserRoleComponent {
  padding: 30px;
  .title {
    padding: 15px;
    background: #fff;
    i {
      margin-right: 10px;
    }
  }
  .btn-wrapper {
    margin-left: 50%;
    transform: translateX(-50%);
    margin-top: 30px;
    overflow: auto;
    text-align: center;
  }
}
</style>
