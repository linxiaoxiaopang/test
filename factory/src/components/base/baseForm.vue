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
              type,
              rule,
              colNum,
              slotName,
              hidden,
            },
            indx
          ) in cols"
          :key="indx"
        >
          <el-form-item
            :label="label"
            :prop="prop"
            :rules="rule"
            v-if="isNumber"
          >
            <el-input
              v-model.number="form[prop]"
              :type="type"
              :size="size"
              :readonly="readonly"
              :placeholder="placeholder"
            ></el-input>
          </el-form-item>
          <el-form-item label="" :prop="prop" :rules="rule" v-else-if="hidden">
          </el-form-item>
          <el-form-item
            :label="label"
            :prop="prop"
            :rules="rule"
            v-else-if="slotName"
          >
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
      default: 5
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
  },
  computed: {
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