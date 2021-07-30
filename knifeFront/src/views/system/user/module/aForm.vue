<template>
  <BaseDialog
    :append-to-body="true"
    :dialogVisible.sync="dialog"
    title="分配角色"
    width="450px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="60px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="角色" prop="roles">
            <el-select
              style="width: calc(100% - 80px)"
              multiple
              v-model="form.roles"
              filterable
              placeholder="请选择角色"
            >
              <el-option
                v-for="item in menus"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit"
        >确认</el-button
      >
    </div>
  </BaseDialog>
</template>

<script>
import { matchRoles } from "@/api/role";

export default {
  props: {
    menus: {
      type: Array,
      required: true,
    },
    sup_this: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      dialog: false,
      loading: false,
      form: {
        roles: [],
      },
      rules: {
        roles: [{ required: true, message: "请选择角色" }],
      },
    };
  },
  methods: {
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          this.doAdd();
        } else {
          return false;
        }
      });
    },
    doAdd() {
      const { id, roles } = this.form;
      matchRoles(id, { roles })
        .then((res) => {
          this.resetForm();
          this.$message({
            showClose: true,
            type: "success",
            message: "分配角色成功",
            duration: 5000,
          });
          this.loading = false;
          this.sup_this.init();
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    resetForm() {
      this.dialog = false;
      this.$refs["form"].resetFields();
    },
  },
};
</script>

<style scoped>
</style>
