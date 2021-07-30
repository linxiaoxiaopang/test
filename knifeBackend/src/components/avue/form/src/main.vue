<template>
  <div class="from-container pull-auto">
    <el-form ref="form" :model="form" :label-width="setPx(option.labelWidth,80)" :rules="formRules" @submit.stop="">
      <el-row :span="24">
        <el-col v-for="(item,index) in columnOption"
                :key="index"
                :span="vaildData(option.columnSpan, 24)"
                class="avue-group"
        >
          <el-row :span="24" class="avue-group__item">
            <div class="avue-group__header" v-if="item.label">
              <h1 class="avue-group__title">{{item.label}}</h1>
            </div>
            <div class="avue-group__header" v-else-if="$slots.header">
              <slot name="header"></slot>
            </div>
            <div class="avue-form__group">
              <template v-for="(column,index) in item.column">
                <el-col :span="column.span||option.span||12" :offset="column.offset" :pull="column.pull">
                  <el-form-item :label="`${column.label?column.label+':':''}`"
                                :prop="column.prop"
                                :label-width="setPx(column.labelWidth,item.labelWidth || option.labelWidth || 80)"
                                :show-message="!(column.disabled||column.readonly)"
                  >
                    <slot v-if="column.formslot"
                          :name="column.prop"
                          :prop="column.prop"
                          :label="column.label"
                          :value="form[column.prop]"
                          :column="column"
                          :dic="setDic(column.dicData,DIC[column.dicData])"
                          :size="item.size || 'small'"
                          :placeholder="column.placeholder"
                    ></slot>
                    <div v-else-if="column.type === 'text'" class="text-cut">{{ form[column.prop] }}</div>
                    <component v-else
                               :is="getComponent(column.type)"
                               v-model="form[column.prop]"
                               :precision="column.precision"
                               :label="column.label"
                               :props="column.props"
                               :placeholder="column.placeholder"
                               :clearable="column.clearable"
                               :type="column.type"
                               :size="item.size || 'small'"
                               :prefix-icon="column.prefixIcon"
                               :minRows="column.minRows"
                               :maxRows="column.maxRows"
                               :dic="setDic(column.dicData,DIC[column.dicData])"
                               :disabled="vaildData(column.disabled, vaildData(item.disabled, option.disabled))"
                               :readonly="vaildData(column.readonly, vaildData(item.readonly, option.readonly))"
                               :format="column.format"
                               :value-format="column.valueFormat"
                               :emitPath="column.emitPath"
                               :checkStrictly="column.checkStrictly"
                               :show-all-levels="column.showAllLevels"
                               :expandTrigger="column.expandTrigger"
                               :controls="column.controls"
                               :controls-position="column.controlsPosition"
                               @search-change="searchChange"
                    ></component>
                  </el-form-item>
                </el-col>
              </template>
            </div>
          </el-row>
        </el-col>
        
        <el-col :span="vaildData(option.menuSpan, 24)" v-if="menuBtn">
          <el-form-item label-width="0">
            <div class="form-menu" :class="menuPostion">
              <el-button type="primary" size="small" @click="submit" v-if="vaildData(option.submitBtn,true)">{{option.submitText?option.submitText:'确定'}}</el-button>
              <el-button plain size="small" @click="resetForm" v-if="vaildData(option.emptyBtn,true)">{{option.emptyText?option.emptyText:'取消'}}</el-button>
              <slot name="menuForm"></slot>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import crud from '../../mixins/crud'
  import { validatenull } from '../../utils/validate.js'
  export default {
    name: 'AvueForm',
    mixins: [crud()],
    components: {},
    data() {
      return {
        formCreate: false,
        form: {},
        formRules: {},
        DIC: {}
      }
    },
    created() {
      this.$nextTick(function () {
        //规则初始化
        // this.rulesInit()
        //初始化dic字典
        // this.dicInit()
        //初始化form表单
        // this.formInit()
        //初始化值
        this.formVal()
      })
    },
    watch: {
      option: {
        handler(n, o) {
          this.formCreate = false;
          this.$nextTick(function () {
            this.formVal();
          })
          // this.rulesInit()
        },
        deep: true
      },
      formRules: {
        handler () {
          this.$nextTick(function () {
            this.clearValidate();
          })
        },
        deep: true
      },
      value: {
        handler(n, o) {
          // console.log(this.option.column[0].prop, JSON.parse(JSON.stringify(this.value)));
          if (this.formCreate) this.formVal()
        },
        deep: true
      },
    },
    mounted() {},
    computed: {
      parentOption() {
        let option = this.deepClone(this.option);
        let group = option.group;
        if (!group) {
          option = Object.assign(option, {
            group: [this.deepClone(option)]
          });
        }
        delete option.column;
        return option;
      },
      columnOption() {
        let list = [...this.parentOption.group] || [];
        list.forEach((ele, index) => {
          ele.column = ele.column || [];
          // 循环列的全部属性
          if (!validatenull(ele.column)) {
            //规则初始化
            this.rulesInit(ele.column);
            //初始化form表单
            this.formInit(ele.column);
          }
        });
        //初始化dic字典
        this.dicInit();
        //初始化值
        // this.formVal();
        
        return list;
      },
      menuBtn() {
        return this.vaildData(this.option.menuBtn,true) && (this.vaildData(this.option.submitBtn,true) || this.vaildData(this.option.emptyBtn,true) || this.$slots.menuForm)
      },
      menuPostion: function() {
        if (this.option.submitPostion) {
          return 'is-' + this.option.submitPostion
        } else {
          return 'is-center'
        }
      },
    },
    props: {
      value: {
        type: Object,
        required: true,
        default: () => {
          return {}
        }
      }
    },
    methods: {
      rulesInit(column) {
        this.formRules = {};
        column.forEach(ele => {
          this.getDicData(ele);
          this.setCascaderItem('form', ele);
          
          if (ele.rules) this.formRules[ele.prop] = ele.rules
        })
      },
      dicInit() {
        this.GetDic(this.option.dic).then(data => {
          Object.keys(data).forEach(key => {
            this.$set(this.DIC, key, data[key]);
          });
        })
      },
      formInit(column) {
        const list = column
        let form = {}
        list.forEach(ele => {
          if (
            ele.type == 'checkbox' ||
            ele.type == 'cascader' ||
            ele.type == 'daterange'
          ) {
            form[ele.prop] = []
          } else {
            form[ele.prop] = ''
          }
          if (!validatenull(ele.value) || Array.isArray(ele.value)) form[ele.prop] = ele.value
        })
        this.form = Object.assign({}, form);
      },
      formVal() {
        if (this.formCreate) {
          this.form = this.value;
          this.$emit('input', this.form)
        } else {
          this.formCreate = true;
          Object.keys(this.form).forEach(ele => {
            this.value[ele]===undefined && this.$set(this.value, ele, this.form[ele]);
          });
          this.form = this.value;
          // Object.assign(this.form, this.value);
          this.$emit("input", this.form);
        }
        // console.log(this.option.column[0].prop, JSON.parse(JSON.stringify(this.form)), JSON.parse(JSON.stringify(this.value)));
      },
      searchChange() {
        if (this.option.isSearch) {
          this.submit()
        }
      },
      submit() {
        this.$refs['form'].validate((valid, errObj) => {
          if (valid) {
            this.$emit('submit', this.form, () => {})
          } else {
            this.$emit('err', errObj)
          }
        })
      },
      resetForm() {
        this.clearValidate();
        this.$refs['form'].resetFields();
        this.$emit("input", this.form);
        this.$emit('reset-change', this.form, () => {})
      },
      validate(callback) {
        return this.$refs.form.validate(callback)
      },
      validateField(field) {
        return this.$refs.form.validateField(field)
      },
      clearValidate (list) {
        this.$nextTick(() => {
          this.$refs.form.clearValidate(list);
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .from-container {
    padding-right: 5%;
    text-align: left;
  }
  .avue-group__item {
    margin-bottom: 10px;
  }
  .form-menu {
    width: 100%;
    &.is-center {
      text-align: center;
    }
    &.is-left {
      text-align: left;
    }
    &.is-right {
      text-align: right;
    }
  }
</style>
