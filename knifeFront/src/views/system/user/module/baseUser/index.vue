<template>
  <div class="app-container baseUserRoleComponent app-flex-col-container">
    <div class="flex-col-content">
      <div class="title">
        <i class="el-icon-d-arrow-left"></i>
        <span style="font-weight: bold">{{ userTitle }}</span>
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
          <el-input size="small" type="text" style="width: 250px" :placeholder="placeholder" v-model="form[prop]" />
        </template>

        <template #passwordSlot="{ scoped: { prop, placeholder } }">
          <el-input
            v-model="form[prop]"
            :placeholder="placeholder"
            style="width: 296px"
            type="password"
            show-password
            autocomplete="new-password"
          />
        </template>

        <template #password2Slot="{ scoped: { prop, placeholder } }">
          <el-input
            v-model="form[prop]"
            :placeholder="placeholder"
            style="width: 296px"
            show-password
            type="password"
            autocomplete="new-password"
          />
        </template>
        <template #rolesSlot="{ scoped: { prop, placeholder } }">
          <RoleSelectList
            style="width: 156px"
            multiple
            :menus="menus"
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
import RoleSelectList from '../roleSelectList'
import { addUserField, editUserField } from './formField'
import { commonFromMixin } from '@/mixins'
import { add, read, edit } from '@/api/user'
import { getSelectedRoles } from '@/api/role'
import { isRobust } from '@/utils/validate'

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
      return this.isEdit ? '编辑用户' : '添加子账号'
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
      menus: []
    }
  },
  created() {
    this.initEdit()
    this.getSelectedRoles()
  },
  methods: {
    back() {
      this.$router.replace('/personalCenter/permission/user')
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
::v-deep {
  .el-input--suffix .el-input__inner {
    height: 36px;
  }
  .el-form--inline .el-form-item__label {
    font-weight: normal;
    color: #636c78;
    font-size: 14px;
  }
  .el-input--small .el-input__inner {
    width: 296px;
    height: 36px;
    border: 1px solid #dcdee0;
    border-radius: 2px;
  }
}
.baseUserRoleComponent {
  height: 100vh;
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
