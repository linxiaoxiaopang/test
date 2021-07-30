<template>
  <el-dialog
    :title="type === 'add' ? '添加国家 / 地区' : '编辑国家 / 地区'"
    :visible.sync="addDialog"
    width="612px"
    class="dialog-warpper"
    :before-close="handleClose"
  >
    <el-form
      ref="form"
      :model="form"
      label-width="160px"
      :rules="rules"
      :validate-on-rule-change="false"
    >
      <el-radio-group v-model="radio1" @change="onRadioChange">
        <el-form-item label="选择所属洲：" prop="continent">
          <el-radio
            :label="item.id"
            v-for="(item, index) in continentDictCode"
            :key="index"
            >{{ item.itemName }}</el-radio
          >
        </el-form-item>
      </el-radio-group>
      <el-form-item label="国家/地区中文名称：" prop="countrycn">
        <el-input v-model="form.countrycn" placeholder="输入国家/地区中文名称"></el-input>
      </el-form-item>
      <el-form-item label="国家/地区英文名称：" prop="countryen">
        <el-input v-model="form.countryen" placeholder="输入国家/地区英文名称"></el-input>
      </el-form-item>
      <el-form-item label="国家/地区两位代码：" prop="code">
        <el-input v-model="form.code" placeholder="输入国家/地区两位代码"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCanceled">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="handleConfirmed(type)"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { addCounrty, updateCounrty } from "@/api/country";
import { mapGetters } from "vuex";
export default {
  data() {
    var verifyCn = (rule, value, callback) => {
      if (/^[\u4e00-\u9fa5]{0,}$/.test(value) == false) {
        callback(new Error("请输入中文"));
      } else {
        callback();
      }
      callback();
    };
    var verifyEn = (rule, value, callback) => {
      if (/^[A-Za-z ]+$/.test(value) == false) {
        callback(new Error("请输入英文"));
      } else {
        callback();
      }
      callback();
    };
    var verifyCode = (rule, value, callback) => {
      if (/^[A-Za-z]{2}$/.test(value) == false) {
        callback(new Error("请输入两位英文"));
      } else {
        callback();
      }
      callback();
    };
    return {
      query: {},
      radio1: this.radio,
      loading: false,
      rules: {
        continent: [{ required: true, message: "请选择所属洲", trigger: "blur" }],
        countrycn: [
          { required: true, message: "国家/地区中文名称不能为空", trigger: "blur" },
          { validator: verifyCn, trigger: "blur" },
        ],
        countryen: [
          { required: true, message: "国家/地区英文名称不能为空", trigger: "blur" },
          { validator: verifyEn, trigger: "blur" },
        ],
        code: [
          { required: true, message: "国家/地区两位代码不能为空", trigger: "blur" },
          { validator: verifyCode, trigger: "blur" },
        ],
      },
    };
  },
  props: {
    form: {
      type: Object,
    },
    id: {
      type: Number,
    },
    addDialog: {
      type: Boolean,
      deafult: false,
    },
    type: {
      type: String,
      default: "add",
    },
    radio: {
      type: Number,
    },
    sup_this: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters(["continentDictCode"]),
  },
  watch: {
    radio: {
      handler(val) {
        this.radio1 = val;
      },
      immediate: true,
    },
    radio1(val) {
      this.$emit("update:radio", val);
    },
  },
  methods: {
    handleClose() {
      this.$refs.form.resetFields();
      this.$emit("update:addDialog", false);
    },
    onRadioChange(item) {
      this.form.continent = item;
    },
    handleCanceled() {
      this.$emit("update:addDialog", false);
      this.$message.warning("您取消了操作！");
      this.$refs.form.clearValidate();
    },
    handleConfirmed() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.loading = true;
        this.form.code = this.form.code.toUpperCase();
        if (this.type === "add") {
          const data = {
            continentDictCode: this.form.continent,
            countryCnName: this.form.countrycn,
            countryEnName: this.form.countryen,
            twoCharCode: this.form.code,
          };
          addCounrty(data)
            .then(() => {
              this.loading = false;
              this.$emit("update:addDialog", false);
              this.query = {};
              this.sup_this.refreshPage();
              this.$message.success("国家添加成功！");
              this.$refs.form.resetFields();
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          if (
            this.continent === this.form.continent &&
            this.countryen === this.form.countryen &&
            this.countrycn === this.form.countrycn &&
            this.code === this.form.code
          ) {
            this.$emit("update:addDialog", false);
            return;
          }
          const list = {
            id: this.id,
            continentDictCode: this.form.continent,
            countryCnName: this.form.countrycn,
            countryEnName: this.form.countryen,
            twoCharCode: this.form.code,
          };
          updateCounrty(list)
            .then(() => {
              this.loading = false;
              this.$emit("update:addDialog", false);
              this.query = {};
              this.sup_this.refreshPage();
              this.$message.success("更新国家信息成功！");
              this.$refs.form.resetFields();
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dialog-warpper {
  ::v-deep {
    .el-form-item__label {
      color: #595961;
      font-weight: normal;
    }
    .el-radio__label {
      font-weight: normal;
    }
    .el-radio {
      margin-right: 15px;
    }
    .el-dialog__title {
      font-size: 14px;
      color: #1a1a1a;
    }
    .el-dialog__header {
      height: 52px;
      line-height: 52px;
      padding: 0 0 0 24px;
      border: 1px solid #dcdee0;
    }
    .el-input__inner {
      width: 246px;
      height: 36px;
    }
  }
}
</style>
