<template>
  <div class="product-calculator-form">
    <el-form ref="form" :model="form" :rules="formRules" size="small" label-width="108px">
      <el-card>
        <el-row slot="header" class="form-list">
          <el-col :span="8" class="form-item">
            <div class="flex-middle">
              <div class="icon-sort">1</div>
              <span class="text-title ml10">选择产品/填写价格重量</span>
            </div>
            <i class="el-icon-d-arrow-right"></i>
          </el-col>
          <el-col :span="8" class="form-item">
            <div class="flex-middle">
              <div class="icon-sort">2</div>
              <span class="text-title ml10">设置物流参数</span>
            </div>
            <i class="el-icon-d-arrow-right"></i>
          </el-col>
          <el-col :span="8" class="form-item">
            <div class="flex-middle">
              <div class="icon-sort">3</div>
              <span class="text-title ml10">设置购买数量</span>
            </div>
          </el-col>
        </el-row>
        <el-row class="form-list">
          <el-col :span="8" class="form-item">
            <div class="flex-middle">
              <el-image
                  :src="getShowImg(curProduct)"
                  class="select-border"
                  :class="{
                    'is-warning': curProduct === false,
                    'border-dashed': !curProduct,
                    border: curProduct
                  }"
                  @click.native="dialog.selectProduct = true"
              >
                <div slot="error" class="content">
                  <i class="el-icon-plus"></i>
                  <div>选择产品</div>
                </div>
              </el-image>
              <div v-if="curProduct" class="ml20">
                <div class="flex-between mb20">
                  <span>{{ curProductInfo.name }} ({{ curProductInfo.$sex }})</span>
                  <span class="primary-btn" @click="handleSelectProductRemove">移除</span>
                </div>
                <el-form-item label="颜色:" prop="color" label-width="52px">
                  <el-select v-model="form.color" placeholder="请选择寄达国家">
                    <el-option
                        v-for="(item, index) in curProductInfo.structs"
                        :key="item.id"
                        :label="item.color_name"
                        :value="index">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="尺码:" prop="size" label-width="52px">
                  <el-select v-model="form.size" placeholder="请选择寄达国家">
                    <el-option
                        v-for="(item, index) in curProductInfo.sizes"
                        :key="item.id"
                        :label="item.size_name"
                        :value="index">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
            <el-form-item label="价格(￥):" prop="price">
              <avue-crud-input v-model="form.price" placeholder="选择产品自动赋值或自定义" :disabled="!!curProduct"></avue-crud-input>
            </el-form-item>
            <el-form-item label="重量(g):" prop="weight">
              <avue-crud-input v-model="form.weight" placeholder="选择产品自动赋值或自定义" :disabled="!!curProduct"></avue-crud-input>
            </el-form-item>
            <el-form-item label="长宽高(cm³):" prop="volume">
              <div class="flex-middle">
                <avue-crud-input
                  v-model="form.length"
                  placeholder="选择产品自动赋值或自定义"
                  :disabled="!!curProduct"
                  @blur="setMinValue('length')"
                ></avue-crud-input>
                <avue-crud-input
                  v-model="form.width"
                  placeholder="选择产品自动赋值或自定义"
                  :disabled="!!curProduct"
                  @blur="setMinValue('width')"
                ></avue-crud-input>
                <avue-crud-input
                  v-model="form.height"
                  placeholder="选择产品自动赋值或自定义"
                  :disabled="!!curProduct"
                  @blur="setMinValue('height')"
                ></avue-crud-input>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="form-item">
            <el-form-item label="寄达国家:" prop="country" label-width="90px">
              <el-select v-model="form.country" clearable placeholder="请选择寄达国家">
                <el-option
                    v-for="(item, index) in countryList"
                    :key="item.value"
                    :label="item.label"
                    :value="index">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物流:" prop="expressChannel" label-width="90px">
              <div class="flex-middle lh-normal">
                <avue-crud-input placeholder="选择物流" readonly class="express-input" @click.native="expressChannelClick">
                  <span slot="suffix" class="el-input__icon">
                    <svg-icon icon-class="logistics"></svg-icon>
                  </span>
                </avue-crud-input>
                <span class="nowrap ml20">
                  已选
                  <span class="text-striking">{{ form.expressChannel.length }}</span>
                  个物流
                </span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8" class="form-item">
            <el-form-item label="购买数量:" prop="count" label-width="90px" class="is-multiple">
              <el-col :span="8">
                <avue-crud-input v-model="form.count[0]"></avue-crud-input>
              </el-col>
              <el-col :span="8">
                <avue-crud-input v-model="form.count[1]"></avue-crud-input>
              </el-col>
              <el-col :span="8">
                <avue-crud-input v-model="form.count[2]"></avue-crud-input>
              </el-col>
              <el-col :span="8">
                <avue-crud-input v-model="form.count[3]"></avue-crud-input>
              </el-col>
              <el-col :span="8">
                <avue-crud-input v-model="form.count[4]"></avue-crud-input>
              </el-col>
              <el-col :span="8">
                <avue-crud-input v-model="form.count[5]"></avue-crud-input>
              </el-col>
            </el-form-item>
            <el-form-item label="售价 (￥):" prop="sellingPrice" label-width="90px">
                <el-col :span="8" class="pr15">
                  <avue-crud-input v-model="form.sellingPrice"></avue-crud-input>
                </el-col>
              </el-form-item>
          </el-col>
        </el-row>
        <div class="footer">
          <el-button size="small" type="primary" @click="onsubmit">开始计算成本</el-button>
          <el-button size="small" @click="onreset">重置</el-button>
        </div>
      </el-card>
    </el-form>

    <selectProduct :visible.sync="dialog.selectProduct" @submit="handleSelectProduct"></selectProduct>
    <selectExpress
      :visible.sync="dialog.selectExpress"
      :data="form"
      :countryId="countryList[form.country] && countryList[form.country].value"
      @submit="handleSelectExpress"
    ></selectExpress>
  </div>
</template>

<script>
import { notNegative, validateNotNegative, isInt, isMoney, getExpressCost } from '@/utils'
import getPrivateRowValue from '@/views/product/calculator/module/selectProduct/getPrivateRowValue'
import selectProduct from '@/views/product/calculator/module/selectProduct'
import selectExpress from '@/views/product/calculator/module/selectExpress'
import { deepClone, getLabel } from '@/components/avue/utils/util'

import {complexOpenList} from '@/api/order/calculator'
import { validatenull } from '@/components/avue/utils/validate'

export default {
  mixins: [getPrivateRowValue],
  components: {
    selectProduct,
    selectExpress
  },
  data() {
    let validateVolume = (rule, value, callback) => {
      let { length, width, height } = this.form
      if (!length || !width || !height) {
        return callback('请输入长宽高')
      }
      if (!validateNotNegative(length) || !validateNotNegative(width) || !validateNotNegative(height)) {
        return callback('请输入非负数')
      }
      callback()
    }
    let validateCount = (rule, value, callback) => {
      if (this.noValidateCount) return callback()
      let { count } = this.form
      // console.log(count)
      if (count.some(item => item && !isInt(item))) {
        return callback('请输入正整数')
      }
      if (!count.some(item => item)) {
        return callback('请至少输入一个购买数量')
      }
      callback()
    }
    let validateExpressChannel = (rule, value, callback) => {
      let { price, length, width, height, expressChannel } = this.form
      // console.log(count)
      if (!price || !length || !width || !height) {
        if (!this.curProduct) this.curProduct = false
        return callback('请先选择产品/填写价格重量')
      }
      if (!this.curProduct) this.curProduct = null
      if (this.isSubmitValidate && !expressChannel.length) {
        return callback('请选择物流')
      }
      callback()
    }
    return {
      form: {
        expressChannel: [],
        count: ['1', '5', '10']
      },
      formRules: {
        price: [
          {
            required: true,
            message: '请输入价格'
          },
          {
            validator: isMoney
          }
        ],
        weight: [
          {
            required: true,
            message: '请输入重量'
          },
          {
            validator: notNegative
          }
        ],
        volume: [
          {
            required: true,
            validator: validateVolume
          }
        ],
        country: [
          {
            required: true,
            message: '请选择寄达国家'
          }
        ],
        expressChannel: [
          {
            required: true,
            validator: validateExpressChannel
          }
        ],
        count: [
          {
            required: true,
            validator: validateCount
          }
        ],
        sellingPrice: [
          {
            validator: isMoney
          }
        ]
      },
      noValidateCount: false,
      isSubmitValidate: false,
      dialog: {
        selectProduct: false,
        selectExpress: false
      },
      curProduct: null,

      countryList: []
    }
  },
  computed: {
    curProductInfo({ curProduct }) {
      curProduct = curProduct || {$isCustom: true}
      return {
        ...curProduct,
        $sex: getLabel('sex', curProduct.sex),
        sizes: this.getSizes(curProduct) || [],
        structs: this.getStructs(curProduct) || []
      }
    },
    postData() {
      return deepClone({
        product: this.curProductInfo,
        form: this.form
      })
    }
  },
  watch: {
    curProductInfo(n) {
      let { form } = this
      this.$set(form, 'size', 0)
      this.$set(form, 'color', 0)
      this.getSizeInfoFromCurProduct()
    },
    'form.size'() {
      this.getSizeInfoFromCurProduct()
    },
    'form.country'(n) {
      let curCountry = this.countryList[n]
      this.form.$country = curCountry ? curCountry.countryCnName : ''
      this.form.expressChannel = []
    }
  },
  created() {
    complexOpenList().then(res => {
      if ($SUC(res)) {
        this.countryList = res.detail.map(({countryCnName, twoCharCode, id}) => ({
          label: `${countryCnName} (${twoCharCode})`,
          value: id,
          countryCnName
        }))
      }
    })
  },
  methods: {
    async onsubmit() {
      if (await this.validate()) {
        this.$emit('submit', this.postData)
      }
    },
    onreset() {
      this.curProduct = null
      this.form = {
        expressChannel: [],
        count: ['1', '5', '10']
      }
      this.$nextTick(function () {
        this.$refs.form.clearValidate()
      })
      this.$emit('reset', this.postData)
    },
    async validate() {
      this.isSubmitValidate = true
      let [, valid] = await awaitWrap(this.$refs.form.validate())
      this.isSubmitValidate = false
      
      if (valid && this.form.expressChannel.length) {
        return valid
      }
    },
    
    handleSelectProduct(row, column, cell, event) {
      this.curProduct = row
      this.$nextTick(function () {
        this.$refs.form.clearValidate(['price', 'weight', 'volume', 'expressChannel'])
      })
      // console.log('handleCellClick', this.curProduct)
    },
    handleSelectProductRemove() {
      this.curProduct = null
      this.form = {
        ...this.form,
        price: '',
        weight: '',
        length: '',
        width: '',
        height: ''
      }
  
      this.$nextTick(function () {
        this.$refs.form.clearValidate()
      })
    },
    
    async expressChannelClick() {
      // console.log('expressChannelClick this.form', this.form)
      this.noValidateCount = true
      let [, valid] = await awaitWrap(this.$refs.form.validate())
      this.noValidateCount = false
      if (!valid) return
      this.dialog.selectExpress = true
    },
    handleSelectExpress(val) {
      this.$set(this.form, 'expressChannel', val)
    },
    
    getSizeInfoFromCurProduct() {
      let { form, curProductInfo } = this
      let size = curProductInfo.sizes[form.size]
      if (size) {
        this.$set(this.form, 'price', this.getSizePrice(size) || '0')
        this.$set(this.form, 'weight', size.weight || '0')
        this.$set(this.form, 'length', size.length || '0.01')
        this.$set(this.form, 'width', size.width || '0.01')
        this.$set(this.form, 'height', size.height || '0.01')
        console.log(form, size)
      }
    },
    
    setMinValue(prop) {
      if (Number(this.form[prop]) === 0) this.form[prop] = '0.01'
    }
  }
}
</script>

<style lang="scss">
.product-calculator-form {
  color: #636c78;
  .el-card__header {
    padding: 0;
    .text-title {
      font-size: 16px;
    }
    .form-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 45px;
    }
    [class^=el-icon-] {
      font-size: 20px;
      font-weight: 700;
      color: $color-primary;
    }
  }
  .el-card__body {
    padding: 0;
    .form-list {
      border-bottom: 1px solid #E8E8E8;
    }
    .form-item {
      min-height: 338px;
      padding: 20px 3% 12px 30px;
    }
  }
  .el-form-item__label {
    text-align: left;
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 65px;
    padding-right: 20px;
  }
  .form-item {
    padding: 0 20px;
    border-right: 1px solid #E8E8E8;
    &:last-child {
      border: none;
    }
  }
}
.express-input {
  .el-input__suffix {
    right: 10px;
    font-size: 20px;
  }
}
</style>
