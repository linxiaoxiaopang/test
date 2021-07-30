<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    :title="isAdd ? '新增权限组' : '编辑权限'"
    width="500px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-form-item :label="isAdd ? '别名' : '名字'" prop="name">
        <el-input v-if="isAdd" :placeholder="`请输入${isAdd ? '别名' : '名字'}`" v-model="form.name" style="width: 360px" />
        <el-tag v-else type="primary">
          {{ form.name }}
        </el-tag>
      </el-form-item>
      <el-form-item v-if="!isAdd" label="别名" prop="alias">
        <el-input placeholder="请输入别名" v-model="form.alias" style="width: 360px" />
      </el-form-item>
      <el-form-item label="方法" prop="method" v-if="!isAdd">
        <!-- <el-input v-model="form.method" style="width: 360px" /> -->
        <el-tag type="danger">
          {{ form.method }}
        </el-tag>
      </el-form-item>
      <!-- <el-form-item style="margin-bottom: 0px" label="父级权限">
        <treeselect
          v-model="form.pid"
          :normalizer="normalizer"
          :options="permissions"
          style="width: 360px"
          placeholder="请选择父级权限"
        />
      </el-form-item> -->
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
          v-show="showSubmitBtn"
          slot="reference"
          type="success"
          size="mini"
          >确定</el-button
        >
      </el-popover>
      <el-button
        v-if="!showSubmitBtn"
        @click="showPopover"
        type="success"
        size="mini"
        >确定</el-button
      >
      <GroupPushChildren
        ref="groupPushChildren"
        :sup_this="sup_this"
        :permissions="permissions"
      />
      <!-- <el-button :loading="loading" type="primary" @click="doSubmit"
        >确认</el-button
      > -->
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from "@/api/permission";
import { normalizer } from "@/utils";
import Treeselect from "@riophae/vue-treeselect";
import GroupPushChildren from "./groupPushChildren";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  components: { Treeselect, GroupPushChildren },
  props: {
    permissions: {
      type: Array,
      required: true,
    },
    isAdd: {
      type: Boolean,
      required: true,
    },
    isReditGroup: {
      type: Boolean,
      defualt: false,
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
        alias: [{ required: !this.isAdd, message: "请输入别名", trigger: "blur" }]
      },
    };
  },
  computed: {
    showSubmitBtn () {
      return this.isAdd ? this.form.name : this.form.name&&this.form.alias 
    },
  },
  methods: {
    normalizer(node) {
      return normalizer(node, this.form.name);
    },
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.isAdd) {
            if (this.isReditGroup) {
              this.doEdit();
            } else {
              this.doAdd();
            }
          } else this.doEdit();
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
    doAdd() {
      const params = {
        name: this.form.name,
        alias: this.form.name,
      };
      add(params)
        .then((res) => {
          this.resetForm();
          this.$confirm("添加权限成功, 是否前往填充权限组?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              const { detail = {} } = res;
              this.$refs.groupPushChildren.dialog = true;
              this.$refs.groupPushChildren.form = {
                method: [],
                name: detail.name,
                id: detail.id,
              };
              this.cancel();
            })
            .catch(() => {});

          this.loading = false;
          this.sup_this.init();
          // this.sup_this.getPermissions();
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    doEdit() {
      const params = {
         alias: this.form.name,
        ...this.form,
      };
      edit(this.form.id, params)
        .then((res) => {
          this.resetForm();
          this.$message({
            showClose: true,
            type: "success",
            message: "修改成功!",
            duration: 2500,
          });
          this.loading = false;
          this.sup_this.init();
          // this.sup_this.getPermissions();
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
