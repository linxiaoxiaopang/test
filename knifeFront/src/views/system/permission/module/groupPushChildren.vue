<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    title="新增权限"
    width="75%"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item label="组名称" prop="name">
        <el-tag type="danger">
          {{ form.name }}
        </el-tag>
      </el-form-item>
      <el-form-item label="方法" prop="method">
        <el-checkbox-group v-model="form.method">
          <el-checkbox
            :label="item.id"
            :key="index"
            v-for="(item, index) in permissions"
            >{{ item.name }}</el-checkbox
          >
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>

      <el-button :loading="loading" type="primary" @click="doSubmit"
        >确认</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { addChilds } from "@/api/permission";

export default {
  props: {
    sup_this: {
      type: Object,
      default: null,
    },
    permissions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      dialog: false,
      checkList: [],
      form: { method: [], pid: null },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        method: [{ required: true, message: "请选择方法", trigger: "blur" }],
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
          this.doAddChilds();
        } else {
          return false;
        }
      });
    },
    doAddChilds() {
      addChilds(this.form.id, this.form.method)
        .then((res) => {
          this.resetForm();
         this.$message.success('操作成功')
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
      this.form = { name: "", method: [], pid: null };
    },
  },
};
</script>

<style scoped>
</style>
