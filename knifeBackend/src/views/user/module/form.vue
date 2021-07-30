<template>
  <el-dialog
    :append-to-body="true"
    :visible.sync="dialog"
    :title="isAdd ? '新增用户' : '编辑用户'"
    width="850px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      size="small"
      label-width="80px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="form.username"
              :disabled="isAdd === false"
              style="width: 300px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机" prop="tele">
            <el-input v-model="form.tele" style="width: 300px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="QQ" prop="qq">
            <el-input v-model="form.qq" style="width: 300px" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司" prop="company">
            <el-input v-model="form.company" style="width: 300px" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="后台权限" prop="is_staff">
            <el-radio v-model="form.is_staff" :label="true">是</el-radio>
            <el-radio v-model="form.is_staff" :label="false">否</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否启用" prop="is_active">
            <el-radio v-model="form.is_active" :label="true">是</el-radio>
            <el-radio v-model="form.is_active" :label="false">否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="类型" prop="type">
            <el-radio v-model="form.type" :label="0">管理员</el-radio>
            <el-radio v-model="form.type" :label="1">员工</el-radio>
            <el-radio v-model="form.type" :label="2">分销商</el-radio>
            <el-radio v-model="form.type" :label="3">工厂人员</el-radio>
            <el-radio v-model="form.type" :label="4">设计师</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="所属员工"
            prop="emply_distors"
            v-if="form.type == 2"
          >
            <el-select
              v-model="form['emply_distors']"
              filterable
              placeholder="请选择分销商所属员工"
            >
              <el-option
                v-for="item in menus"
                :key="item.id"
                :label="item.username"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row v-if="isAdd">
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="form.password"
              style="width: 300px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认密码" prop="password2">
            <el-input
              type="password"
              v-model="form.password2"
              style="width: 300px"
            />
          </el-form-item>
        </el-col>
      </el-row> -->
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
import { add, edit } from "@/api/user";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { isvalidPhone } from "@/utils/validate";

var validPhone = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入手机号码"));
  } else if (!isvalidPhone(value)) {
    callback(new Error("请输入正确的11位手机号码"));
  } else {
    callback();
  }
};
var validUserName = (rule, value, callback) => {
  if (/admin/i.test(value)) {
    return callback(new Error("用户名不能包含关键字admin"));
  }
  callback();
};
export default {
  name: "Form",
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true,
    },
    sup_this: {
      type: Object,
      default: null,
    },
    menus: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      loading: false,
      form: {
        username: "",
        tele: "",
        qq: "",
        company: "",
        is_staff: true,
        is_active: true,
        type: 1,
        password: "123456",
        password2: "123456",
      },
      roleIds: [],
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { trigger: "change", validator: validUserName },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        tele: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
          { trigger: "blur", validator: validPhone },
        ],
        qq: [{ required: true, message: "请输入qq", trigger: "blur" }],
        company: [{ required: true, message: "请输入公司", trigger: "blur" }],
        // emply_distors: [
        //   { required: true, message: "请选业务员所属员工", trigger: "blur" },
        // ],
        // password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        // password2: [
        //   { required: true, message: "请输入确认密码", trigger: "blur" },
        // ],
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
          const _this = this;
          if (this.isAdd) {
            this.doAdd();
          } else this.doEdit();
        } else {
          return false;
        }
      });
    },
    doAdd() {
      const { emply_distors, ...form } = this.form || {};
      add({
        ...form,
        emply_distors: form.type == 2 ? emply_distors : undefined,
      })
        .then((res) => {
          this.resetForm();
          this.$message({
            showClose: true,
            type: "success",
            message: "添加成功!用户默认密码是'123456'!",
            duration: 5000,
          });
          this.loading = false;
          this.$parent.$parent.init();
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
    doEdit() {
      const { emply_distors, ...form } = this.form || {};
      edit(this.form.id, {
        ...form,
        type_name: ["管理员", "员工", "分销商", "工厂人员", "设计师"][
          this.form.type
        ],
        emply_distors: form.type == 2 ? emply_distors : undefined,
      })
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
