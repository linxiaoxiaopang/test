<template>
  <div class="whole-warpper">
    <el-button
      type="primary"
      @click="handleAdded"
      style="width: 90px; height: 32px; display: flex; align-items: center; justify-content: center; padding: 0"
      >+ 添加模板</el-button
    >
    <el-dialog
      :title="type === 'add' ? '添加运费模板' : '复制运费模板'"
      :visible.sync="visible"
      width="612px"
      :before-close="handleClose"
      class="dialog-warpper"
    >
      <el-form ref="form" :model="form" label-width="120px" :rules="rules" :validate-on-rule-change="false">
        <el-form-item label="模板名称：" prop="name">
          <el-input
            size="mini"
            style="width: 240px"
            v-model="form.name"
            placeholder="输入运费模板名称"
            clearable
          ></el-input>
        </el-form-item>
        <el-radio-group v-if="type === 'add'" v-model="radio1" @change="onRadioChange">
          <el-form-item label="设置计算方式：" prop="way">
            <el-radio :label="item.id" v-for="(item, index) in list" :key="index">{{ item.type }}</el-radio>
          </el-form-item>
        </el-radio-group>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCanceled">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="handleConfirmed">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { createTemplate, getTemplate } from '@/api/template'

export default {
  props: {
    type: {
      type: String,
      default: 'add'
    },
    form: {
      type: Object
    },
    radio: {
      type: Number,
      default: 1
    }
  },
  watch: {
    radio: {
      handler(val) {
        this.radio1 = val
      },
      immediate: true
    },
    radio1(val) {
      this.$emit('update:radio', val)
    }
  },
  data() {
    return {
      radio1: this.radio,
      visible: false,
      loading: false,
      list: [
        { type: '按首重续重计费', id: 1 },
        { type: '同重量段费用相同', id: 2 }
      ],
      query: {},
      rules: {
        name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        way: [{ required: true, message: '请设置计算方式', trigger: 'blur' }]
      }
    }
  },
  methods: {
    reset() {
      this.$emit('resetFields')
      // this.$refs.form.resetFields()
    },
    handleAdded() {
      this.visible = true
      this.$emit('update:type', 'add')
      this.$emit('update:radio', 1)
    },
    handleClose() {
      this.reset()
      this.$nextTick(() => {
        this.visible = false
      })
    },
    onRadioChange(item) {
      this.form.way = item
    },
    handleCanceled() {
      this.handleClose()
      this.$refs.form.clearValidate()
      this.$message.warning('您取消了操作！')
    },
    handleConfirmed() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        this.loading = true
        if (this.type === 'add') {
          const data = {
            calculateMode: this.form.way,
            templateName: this.form.name
          }
          createTemplate(data)
            .then((res) => {
              this.$emit('refresh')
              this.handleClose()
              this.$message.success('模板添加成功！')
              getTemplate({ id: res.detail }).then(({ detail }) => {
                this.loading = false
                this.$router.push({
                  path: '/fedex/formwork/settings',
                  query: {
                    id: detail.id,
                    templateName: detail.templateName,
                    calculateMode: detail.calculateMode,
                    weight: detail.isByVolumetricWeight,
                    type: this.type
                  }
                  // query: { res: JSON.stringify(this.copy), type: this.type }
                })
              })
            })
            .catch(() => {
              this.loading = false
            })
        }
        if (this.type === 'copy') {
          this.loading = false
          this.$emit('handleCopied')
          this.reset()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.whole-warpper {
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
}
</style>
