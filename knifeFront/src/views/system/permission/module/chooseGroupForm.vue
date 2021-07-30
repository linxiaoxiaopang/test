<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    title="选择权限组"
    width="500px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item label="名称" prop="name">
        <!-- <el-input v-model="form.name" style="width: 360px" /> -->
        <el-tag type="primary">
          {{ form.name }}
        </el-tag>
      </el-form-item>
      <el-form-item label="方法" prop="method">
        <!-- <el-input v-model="form.method" style="width: 360px" /> -->
        <el-tag type="danger">
          {{ form.method }}
        </el-tag>
      </el-form-item>
      <el-form-item label="权限组" prop="pid">
        <el-select
          v-model="form.pid"
          filterable
          placeholder="请选择"
          style="width: 360px"
        >
          <el-option
            v-for="item in permissions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>

      <el-popover ref="popover" placement="top" width="200">
        <p>
          确定要修改提交权限吗？权限与前端紧密关联，请核实正常后再进行此操作！
        </p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="$refs['popover'].doClose()"
            >取消</el-button
          >
          <el-button
            :loading="loading"
            type="primary"
            size="mini"
            @click="doSubmit"
            >提交</el-button
          >
        </div>
        <el-button
          v-show="form.name"
          slot="reference"
          type="success"
          size="mini"
          >确定</el-button
        >
      </el-popover>
      <el-button
        v-if="!form.name"
        @click="showPopover"
        type="success"
        size="mini"
        >确定</el-button
      >
      <!-- <el-button :loading="loading" type="primary" @click="doSubmit"
        >确认</el-button
      > -->
    </div>
  </el-dialog>
</template>

<script>
import { update as edit } from "@/api/permission";

export default {
  props: {
    isAdd: {
      type: Boolean,
      default: false,
    },
    permissions: {
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
      loading: false,
      dialog: false,
      form: { name: "", method: "", pid: null },
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        method: [{ required: true, message: "请输入方法", trigger: "blur" }],
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
          this.doChooseGroup();
        } else {
          return false;
        }
        this.$refs["popover"].doClose();
      });
    },
    showPopover() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
        } else {
          return false;
        }
      });
    },
    doChooseGroup() {
      edit(this.form.id, {
        pid: this.form.pid,
        name: this.form.name,
      })
        .then((res) => {
          this.resetForm();
          this.$message.success("操作成功");
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
      this.form = { name: "", method: "", pid: null };
    },
  },
};
</script>

<style scoped>
</style>
