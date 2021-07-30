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
      </BaseForm>
    </div>
    <div class="btn-wrapper bottom">
      <el-button @click="back"> 取消 </el-button>
      <el-button type="primary" @click="doSubmit" :loading="loading"> 提交 </el-button>
    </div>
  </div>
</template>

<script>
import { addUserField, editUserField } from './formField'
import { commonFromMixin } from '@/mixins'
import { add, edit, read } from '@/api/order/supplier'
import { getSelectedRoles } from '@/api/role'

export default {
  mixins: [commonFromMixin],
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
      return this.isEdit ? '编辑供应商' : '添加供应商'
    }
  },
  data() {
    return {
      formField: this.isEdit ? editUserField : addUserField,
      id: this.$route.query.id,
      form: {},
      loading: false
    }
  },
  created() {
    this.initEdit()
  },
  methods: {
    back() {
      this.$router.replace('/supplier')
    },
    async initEdit() {
      if (!this.isEdit) return
      if (!this.id) {
        this.back()
      }
      const { code, detail } = await read(this.id)
      if ($SUC({ code })) {
        const { name, contacts, phone, email } = detail || {}
        this.form = {
          name,
          contacts,
          phone,
          email
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
