<template>
  <div class="app-container baseUserRoleComponent app-flex-col-container">
    <div class="title">
      <i class="el-icon-d-arrow-left" @click="back"></i>
      <span @click="back">{{ userTitle }}</span>
    </div>
    <div class="flex-col-content">
      <BaseForm
        style="width: 50%;max-width: 500px;"
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
            size="small"
            :placeholder="placeholder"
            type="password"
            show-password
            autocomplete="new-password"
          />
        </template>

        <template #password2Slot="{ scoped: { prop, placeholder } }">
          <el-input
            v-model="form[prop]"
            size="small"
            :placeholder="placeholder"
            show-password
            type="password"
            autocomplete="on"
          />
        </template>
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
    </div>
    <div class="btn-wrapper bottom">
      <el-button @click="back"> 取消 </el-button>
      <el-button type="primary" @click="doSubmit" :loading="loading" >
        提交
      </el-button>
    </div>
  </div>
</template>

<script>
import RoleSelectList from "../roleSelectList";
import { addUserField, editUserField } from "./formField";
import { commonFromMixin } from "@/mixins";
import { add, read, edit } from "@/api/user";
import { getSelectedRoles } from "@/api/role";

export default {
  mixins: [commonFromMixin],
  components: {
    RoleSelectList
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
    sup_this: {
      type: Object,
      default: null,
    },
  },
  computed: {
    userTitle() {
      return this.isEdit ? "编辑管理员" : "添加管理员";
    },
  },
  data() {
    return {
      formField: this.isEdit ? editUserField : addUserField,
      id: this.$route.query.id,
      form: {},
      loading: false,
      menus: [],
    };
  },
  created() {
    this.initEdit();
    this.getSelectedRoles();
  },
  methods: {
    back() {
      this.$router.replace("/system/user");
    },
    async getSelectedRoles() {
      const { detail = [], code } = (await getSelectedRoles()) || {};
      if ($SUC({ code })) {
        this.menus = detail;
        console.log('this.menus', this.menus)
      }
    },
    async initEdit() {
      if (!this.isEdit) return;
      if (!this.id) {
        this.back();
      }
      const { code, detail } = await read(this.id);
      if ($SUC({ code })) {
        const { username, roles, nick_name, email, password, password2 } =
          detail || {};
        this.form = {
          username,
          roles: roles.map(({id}) => id),
          nick_name,
          email,
          password,
          password2,
        };
        const { form } = this.$refs;
        form && form.resetFields();
      }
    },
    async doSubmit() {
      const valid = await this.validate();
      if (!valid) return;
      if (this.isEdit) {
        this.doEdit();
      } else {
        this.doAdd();
      }
    },
    async doAdd() {
      this.loading = true;
      try {
        const { code } = await add(this.form);
        if ($SUC({ code })) {
          this.success();
          this.back();
        }
      } catch (err) {
        console.log(err);
      }
      this.loading = false;
    },

    async doEdit() {
      this.loading = true;
      try {
        const { code } = await edit(this.id, this.form);
        if ($SUC({ code })) {
          this.success();
          this.back();
        }
      } catch (err) {
        console.log(err);
      }
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.baseUserRoleComponent {
  padding: 30px;
  background: $bg-color;
  .title {
    padding: 15px;
    background: #fff;
    i {
      cursor: pointer;
      margin-right: 10px;
    }
    span {
      cursor: pointer;
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