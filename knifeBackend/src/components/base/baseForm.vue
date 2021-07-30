<template>
  <div :class="['tableForm', topPosition && 'topPosition', customClass]">
    <el-form
      :inline="true"
      ref="form"
      :model="form"
      :label-position="$attrs['label-position'] || 'right'"
      :label-width="$attrs['label-width'] || '80px'"
      :label-suffix="$attrs['label-suffix'] || ':'"
      :class="[customFormClass]"
      v-bind="$attrs"
      @submit.native.prevent
      :disabled="isDisable"
      size="small"
    >
      <el-button
        :loading="loading"
        class="form-del-btn"
        v-if="showDelBtn"
        @click="delFormHandler"
      >
        删除
      </el-button>
      <el-row :gutter="gutter">
        <el-col
          :span="colNum"
          v-for="(
            {
              label,
              prop,
              name,
              readonly,
              placeholder,
              isNumber,
              isRange,
              type,
              rule,
              colNum,
              slotName,
              hidden,
            },
            indx
          ) in formColumn"
          :key="indx"
        >
          <el-form-item :label="label" :prop="prop" :rules="rule" v-if="isNumber">
            <el-input
              v-model.number="form[prop]"
              :type="type"
              :size="size"
              :readonly="readonly"
              :placeholder="placeholder"
              autoComplete="new-password"
              @keyup.enter.native="onchange"
            ></el-input>
          </el-form-item>
          <div class="flex-middle" v-else-if="isRange">
            <label
              :for="'min_' + prop"
              class="el-form-item__label"
              :style="{ width: $attrs['label-width'] || '80px' }"
              >{{ label }}:</label
            >
            <div class="flex-middle flex-one">
              <el-form-item :prop="'min_' + prop" :rules="rule.min">
                <el-input
                  v-model="form['min_' + prop]"
                  :placeholder="'请输入最小' + label"
                  @keyup.enter.native="onchange"
                />
              </el-form-item>
              <slot><span style="margin-right: 9px">~</span></slot>
              <el-form-item :prop="'max_' + prop" :rules="rule.max">
                <el-input
                  v-model="form['max_' + prop]"
                  :placeholder="'请输入最大' + label"
                  @keyup.enter.native="onchange"
                />
              </el-form-item>
            </div>
          </div>
          <el-form-item label="" :prop="prop" :rules="rule" v-else-if="hidden">
          </el-form-item>
          <el-form-item :label="label" :prop="prop" :rules="rule" v-else-if="slotName">
            <slot :name="slotName" :scoped="{ prop, placeholder }"></slot>
          </el-form-item>
          <el-form-item v-else :label="label" :prop="prop" :rules="rule">
            <el-input
              :name="name"
              v-model.trim="form[prop]"
              :type="type"
              :size="size"
              :readonly="readonly"
              :placeholder="placeholder"
              autoComplete="new-password"
              @keyup.enter.native="onchange"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 操作按钮 -->
      <slot name="operationBtns"></slot>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    gutter: {
      type: Number,
      default: 5,
    },
    customClass: String,
    customFormClass: String,
    operationClass: String,
    showDelBtn: Boolean,
    formVisible: {
      type: Boolean,
      default: false,
    },
    topPosition: {
      type: Boolean,
      default: false,
    },
    form: {
      type: Object,
      default: () => ({}),
    },
    size: String,
    cols: Array,
    isDisable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
    };
  },
  watch: {
    formVisible(newVal) {
      if (!newVal) {
        this.resetFields();
      }
    },
    cols: {
      handler(n) {
        n.forEach((col) => {
          let { rule = [], prop, isRange } = col;
          if (isRange) {
            rule = Array.isArray(rule) ? [...rule] : [rule];
            col.rule = {
              min: rule.concat({
                validator: (rule, value, callback) => {
                  const one = Number(value);
                  const max = Number(this.form["max_" + prop]);
                  if (!one || !max || one < max) {
                    return callback();
                  }
                  return callback(new Error("输入值不得大于最大阈值"));
                },
              }),
              max: rule.concat({
                validator: (rule, value, callback) => {
                  const one = Number(value);
                  const min = Number(this.form["min_" + prop]);
                  if (!one || !min || one > min) {
                    return callback();
                  }
                  return callback(new Error("输入值不得小于最小阈值"));
                },
              }),
            };
          }
        });
      },
      immediate: true,
      deep: true,
    },
  },
  computed: {
    formColumn({ cols }) {
      return cols.filter((col) => !col.hidden);
    },
    baseForm() {
      return this.$refs.form && this.$refs.form;
    },
  },
  methods: {
    async delFormHandler() {
      this.loading = true;
      try {
        await this.$confirm("此操作将永久删除该信息, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        this.$emit("delFormHandler", this.form);
      } catch (err) {
        if (err === "cancel") {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        }
        this.loading = false;
        console.log(err);
      }
    },
    // 重置表单
    resetFields() {
      this.$refs.form.resetFields();
    },
    async validate() {
      return await this.$refs.form.validate();
    },
    async validateField(type) {
      return await this.$refs.form.validateField(type);
    },
    async clearValidate(type) {
      return await this.$refs.form.clearValidate(type);
    },
    onchange() {
      this.$emit("change", this.form);
    },
  },
};
</script>

<style lang="scss" scoped>
.tableForm {
  position: relative;
  width: 100%;
  // display: flex;
  // justify-content: center;
  align-items: center;
  .form-del-btn {
    position: absolute;
    right: 0;
    top: 0;
    background: $color-danger;
    color: #fff;
    padding: 5px 15px;
    cursor: pointer;
    border-radius: 4px 0 0 4px;
    font-size: 12px;
  }
  .el-form {
    width: 100%;
    padding: 1rem;
    padding-bottom: 0;
  }
  .el-form-item {
    display: flex;
    width: 100%;
    ::v-deep {
      .el-form-item__content {
        width: 100%;
        flex: 1;
      }
    }
  }
}
.topPosition.topPosition {
  .el-form-item {
    display: block;
  }
}
</style>
