<template>
  <div
    :style="{ height: disable ? '100%' : null }"
    class="app-container addRoleComponent app-flex-col-container"
  >
    <div class="flex-col-content">
      <div class="title">
        <i class="el-icon-d-arrow-left"></i>
        <span>{{ roleTitle }}</span>
      </div>
      <BaseForm
        v-loading="loading"
        size="small"
        ref="form"
        label-width="100PX"
        :disabled="disable"
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

        <template #descSlot="{ scoped: { prop, placeholder } }">
          <el-input
            size="small"
            type="textarea"
            style="width: 400px"
            :rows="4"
            :placeholder="placeholder"
            v-model="form[prop]"
          />
        </template>

        <template #menusSlot="{ scoped: { prop } }">
          <Distribution :resetUrl="menusUrl" :form="form" :prop="prop" />
        </template>

        <template #permissionsSlot="{ scoped: { prop } }">
          <Distribution :resetUrl="permissionUrl" :form="form" :prop="prop" />
        </template>
      </BaseForm>
    </div>
    <div class="btn-wrapper bottom">
      <el-button @click="back"> 取消 </el-button>
      <el-button
        v-if="!disable"
        type="primary"
        @click="doSubmit"
        :loading="loading"
      >
        提交
      </el-button>
    </div>
  </div>
</template>

<script>
import Distribution from './distribution'
import formField from './formField'
import { commonFromMixin } from '@/mixins'
import { add, read, edit } from '@/api/role'

export default {
  mixins: [commonFromMixin],
  components: {
    Distribution
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    sup_this: {
      type: Object,
      default: null
    },
    detailId: {
      type: [Number, String]
    }
  },
  computed: {
    roleTitle() {
      if (this.detailId) {
        return '角色详情'
      }
      return this.isEdit ? '编辑角色' : '添加角色'
    },
    disable() {
      return !!this.detailId
    }
  },
  data() {
    return {
      formField,
      id: this.detailId || this.$route.query.id,
      form: {
        menus: [],
        permissions: []
      },
      menusUrl: '/api/rbac/menu/tree/',
      permissionUrl: '/api/rbac/permission/tree/',
      loading: false
    }
  },
  created() {
    this.initEdit()
  },
  methods: {
    back() {
      this.$router.replace('/redirect/personalCenter/permission/system/role')
    },
    async initEdit() {
      if (!this.isEdit) return
      if (!this.id) {
        this.back()
      }
      const { code, detail } = await read(this.id)
      if ($SUC({ code })) {
        const { name, desc, menus = [], permissions = [] } = detail || {}
        this.form = {
          name,
          desc,
          menus,
          permissions
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
  .el-form--inline .el-form-item__label {
    font-weight: normal;
    color: #636c78;
  }
  .distributionComponent .el-checkbox[data-v-f04bfd08] .el-checkbox__label {
    font-weight: 400;
    color: #495060;
  }
}
.addRoleComponent {
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
