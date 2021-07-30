<template>
  <div class="app-container baseUserRoleComponent app-flex-col-container">
    <div class="flex-col-content">
      <div class="title">
        <i class="el-icon-d-arrow-left"></i>
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
        <template #rolesSlot="{ scoped: { prop, placeholder } }">
          <RoleSelectList
            style="width: 250px"
            multiple
            :menus="menus"
            :keyword.sync="form[prop]"
            :placeholder="placeholder"
          />
        </template>
      </BaseForm>
      <div class="btn-wrapper">
      <el-button @click="back" size="small"> 取消 </el-button>
      <el-button type="primary" size="small" @click="doSubmit" :loading="loading"> 提交 </el-button>
    </div>
    </div>
   
  </div>
</template>

<script>
import RoleSelectList from '../roleSelectList'
import { addUserField, editUserField } from './formField'
import { commonFromMixin } from '@/mixins'
import { add, read, edit } from '@/api/user'
import { getSelectedRoles } from '@/api/role'

export default {
  mixins: [commonFromMixin],
  components: {
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
      return this.isEdit ? '编辑分销商' : '添加分销商'
    }
  },
  data() {
    return {
      formField: this.isEdit ? editUserField : addUserField,
      id: this.$route.query.id,
      form: {},
      loading: false,
      menus: []
    }
  },
  created() {
    this.initEdit()
    this.getSelectedRoles()
  },
  methods: {
    back() {
      this.$router.back()
    },
    async getSelectedRoles() {
      const { detail = [], code } = (await getSelectedRoles()) || {}
      if ($SUC({ code })) {
        this.menus = detail
      }
    },
    async initEdit() {
      if (!this.isEdit) return
      if (!this.id) {
        this.back()
      }
      const { code, detail } = await read(this.id)
      if ($SUC({ code })) {
        const { username, roles, nick_name, email, password, password2 } = detail || {}
        this.form = {
          username,
          roles,
          nick_name,
          email,
          password,
          password2
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
    margin-top: 30px;
    margin-left: 100px;
    padding-left: 15px;
    text-align: left;
  }
}
</style>
