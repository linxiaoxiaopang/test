<template>
  <div
    :style="{ height: disable ? '100%' : null }"
    class="app-container addRoleComponent app-flex-col-container"
  >
    <div class="title">
      <i class="el-icon-d-arrow-left" @click="back"></i>
      <span @click="back">{{ roleTitle }}</span>
    </div>
    <div class="flex-col-content">
      <BaseForm
        v-loading="loading"
        size="small"
        ref="form"
        label-width="100PX"
        :cols="formField"
        :form="form"
      >
        <template #nameSlot="{ scoped: { prop, placeholder, readonly } }">
          <el-input
            size="small"
            type="text"
            style="width: 250px"
            :placeholder="placeholder"
            :readonly="readonly"
            v-model="form[prop]"
          />
        </template>

        <template #descSlot="{ scoped: { prop, placeholder, readonly } }">
          <el-input
            size="small"
            type="textarea"
            style="width: 400px"
            :rows="4"
            :readonly="readonly"
            :placeholder="placeholder"
            v-model="form[prop]"
          />
        </template>

        <template #menusSlot="{ scoped: { prop } }">
          <Distribution
            :resetUrl="menusUrl"
            :form="form"
            :prop="prop"
          />
        </template>

        <template #permissionsSlot="{ scoped: { prop } }">
          <Distribution
            :resetUrl="permissionUrl"
            :form="form"
            :prop="prop"
          />
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
import Distribution from "./distribution";
import cloneDeep from "lodash/cloneDeep";
import formField from "./formField";
import { commonFromMixin } from "@/mixins";
import { add, read, edit } from "@/api/role";

export default {
  mixins: [commonFromMixin],
  components: {
    Distribution,
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
    detailId: {
      type: [Number, String],
    },
  },
  computed: {
    roleTitle() {
      if (this.detailId) {
        return "角色详情";
      }
      return this.isEdit ? "编辑角色" : "添加角色";
    },
    disable() {
      return !!this.detailId;
    },
    formField() {
      const data = this.disable
        ? cloneDeep(formField).map((item) => {
            item.readonly = true;
            return item;
          })
        : formField;
      console.log("data", data);
      return data;
    },
  },
  data() {
    return {
      id: this.detailId || this.$route.query.id,
      form: {
        menus: [],
        permissions: [],
      },
      menusUrl: "/api/rbac/menu/tree/",
      permissionUrl: "/api/rbac/permission/tree/",
      loading: false,
    };
  },

  created() {
    this.initEdit();
  },
  methods: {
    back() {
      this.$router.replace("/system/role");
      this.$emit('back')
    },
    async initEdit() {
      if (!this.isEdit) return;
      if (!this.id) {
        this.back();
      }
      const { code, detail } = await read(this.id);
      if ($SUC({ code })) {
        const { name, desc, menus = [], permissions = [] } = detail || {};
        this.form = {
          name,
          desc,
          menus,
          permissions,
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
.addRoleComponent {
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