<template>
  <section class="app-container app-flex-col-container basics-edit">
    <div class="content">
      <avue-form
        ref="topForm"
        v-model="form.topForm"
        :option="formOption"
        class="search-form-part el-form-required-position"
      >
        <template #category="{ prop }">
          <ProtoTypeTreeSelect
              size="mini"
              class="w100"
              style="margin-top: 4px;"
              placeholder="请选择原型分类"
              :selectedValue.sync="form.topForm[prop]"
              :maxHeight="150"
              @change="$refs.topForm.validateField(prop)"
          />
        </template>
      </avue-form>

      <listStateGroup v-model="status" :list="tabs" class="mb20"></listStateGroup>

      <div class="form-wrapper">
        <component
            v-show="status === item.value"
            :ref="item.value"
            v-for="item in tabs"
            :key="item.value"
            :is="item.value"
            v-model="form"
        ></component>
      </div>
    </div>

    <div class="bottom">
      <basicsEditPreview :productData="productData || {}" :data="form"></basicsEditPreview>
      <el-button type="primary" @click="doSubmit" :loading="loading">
        保存
      </el-button>
    </div>
  </section>
</template>

<script>
import {
  formOption,
  tabs
} from './const'
import listStateGroup from '@/views/components/listStateGroup'
import ProtoTypeTreeSelect from '@/components/protoTypeTreeSelect'
import productDetails from './module/productDetails'
import productSPEC from './module/productSPEC'
import packSPEC from './module/packSPEC'
import clearanceOfGoodsInfo from './module/clearanceOfGoodsInfo'
import basicsEditPreview from './module/basicsEditPreview'
import { mapState } from 'vuex'

import { formOption as productDetailsOption } from './module/productDetails/const'
import { deepClone } from '@/components/avue/utils/util'

export default {
  name: 'basicsEdit',
  components: {
    listStateGroup,
    ProtoTypeTreeSelect,
    productDetails,
    productSPEC,
    packSPEC,
    clearanceOfGoodsInfo,
    basicsEditPreview
  },
  data() {
    this.$store.dispatch('HandleOption', formOption)
    return {
      formOption,
      tabs,
      form: {
        topForm: {}
      },
      errInfo: {
        prim_id: null,
        errFunc: []
      },
      status: 'productDetails',
      loading: false
    }
  },
  computed: {
    ...mapState({
      productData(state) {
        let productData = state.bus.basicsEdit
        productData?.sizes.forEach((size, index) => size.sort = index)
        return productData
      }
    }),
    formProps({ getPropOfOption }) {
      return {
        topForm: getPropOfOption(formOption),
        productDetails: getPropOfOption(productDetailsOption),
        sizeForms: ['size_name', 'weight', 'length', 'width', 'height']
      }
    },
    handleData({ formProps }) {
      let formNames = ['topForm', 'productDetails']
      return (data) => {
        formNames.forEach(name => {
          this.$set(this.form, name, formProps[name].reduce((prev, next) => {
            prev[next] = data[next]
            return prev
          }, {}))
        })
      }
    }
  },
  watch: {
    productData: {
      handler(n) {
        if (n) {
          let newData = deepClone(n)
          console.log('productData', newData)
          this.form.productData = n
          this.handleData(newData)
  
          this.$set(this.form, 'sizeForms', newData.sizes)
          this.$set(this.form, 'structForms', newData.prim_struct)
        } else if (this.$route.query.type === 'edit') {
          this.$router.back()
        }
      },
      immediate: true
    }
  },
  destroyed() {
    this.$store.commit('SET_BUS', {
      basicsEdit: undefined
    })
  },
  methods: {
    async doSubmit() {
      // console.log(this.form)
      let valid = await this.validate()
      // console.log(this.$refs.formTab)
      console.log('doSubmit this.form', this.form)
      if (valid) await this.doFunc()
    },
    async doFunc() {
      this.loading = true
      let valid
      if (this.$route.query.type === 'add') {
        valid = await this.doAdd()
      } else {
        valid = await this.doEdit()
      }
      if (valid) {
        this.success()
      }
      this.loading = false
      return valid
    },
    async doAdd() {
      let { $refs, errInfo: { prim_id, errFunc } } = this
      if (!prim_id) {
        let productData = await $refs.productDetails[0].doAdd()
        if (productData) {
          prim_id = productData.prim_id
          this.errInfo.prim_id = prim_id
  
          errFunc.push(() => $refs.packSPEC[0].doAdd(prim_id))
          errFunc.push(() => $refs.clearanceOfGoodsInfo[0].doAdd(prim_id))
        } else {
          this.status = 'productDetails'
          this.$message.error('原型创建失败,请修改正确后保存')
        }
      }
      if (prim_id) {
        let newErrFunc = await this.handleAddRequest(errFunc)
        this.errInfo.errFunc = newErrFunc
        return newErrFunc.length === 0
      }
    },
    async doEdit() {
      let { $refs } = this
      let valids = await Promise.all(
        this.tabs.map(tab => {
          return $refs[tab.value][0].doFunc()
        })
      )
      if (valids.every(valid => valid)) {
        this.success()
      }
    },
    async validate() {
      let { $refs, tabs } = this
      let [, valid] = await awaitWrap($refs.topForm.validate())
      if (!valid) {
        this.$message.warning('请先填写所有必填信息')
      }

      let p = tabs.map(({ value }) => $refs[value][0].validate())
      let valids = await Promise.all(p)
      let errIndex = valids.findIndex(valid => !valid)
      console.log(valids)
      if (errIndex > -1) {
        this.status = tabs[errIndex].value
        valids[errIndex] !== 0 && this.$message.warning('请完善' + tabs[errIndex].label)
      }
      return valid && errIndex < 0
    },
    success() {
      this.$message.success('操作成功')
      setTimeout(() => this.$router.back(), 500)
    },
    async handleAddRequest(arr) {
      let errFunc = []
      let valids = await Promise.all(
        arr.map(fn => fn())
      )
      valids.forEach((valid, index) => {
        if (!valid) {
          errFunc.push(arr[index])
          if (index === 0) {
            this.status = 'packSPEC'
            this.$message.error('原型尺码表创建失败,请修改正确后保存')
          } else if (index === 1) {
            this.status = 'clearanceOfGoodsInfo'
            this.$message.error('报关信息创建失败,请修改正确后保存')
          }
        }
      })
      return errFunc
    },
    
    getPropOfOption(option) {
      return option.column.reduce((prev, { prop, minProp, maxProp }) => {
        prev.push(prop)
        if (minProp || maxProp) {
          prev.push(minProp)
          prev.push(maxProp)
        }
        return prev
      }, [])
    }
  }
}
</script>

<style lang="scss">
.basics-edit {
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 0 20px;
    overflow: auto;
  }
  .form-wrapper {
    flex: 1;
    margin-top: 30px;
    overflow: hidden auto;
  }
  .bottom {
    flex: 0 0 60px;
  }
  .el-radio-button__inner {
    color: #1a1a1a;
  }
}

.basics-edit-component {
  padding: 0 50px;
  .form-item {
    & + .form-item {
      margin-top: 50px;
    }
  }
  .form-label {
    margin: 0 0 20px 10px;
    color: #595961;
  }
}
.is-custom-required {
  position: relative;
  &::before {
    content: '*';
    position: absolute;
    left: -10px;
    color: #F5222D;
  }
}

.add-button.el-button {
  height: 30px;
  line-height: 30px;
  padding: 0 15px;
  background: #F7F8FA;
  border: 1px solid #DCDEE0;
  border-radius: 2px;
  font-size: 14px;
  color: $color-primary;
  &:hover {
    background: transparent;
    border-color: $color-primary;
  }
  [class^=el-icon-] {
    font-size: 10px;
    transform: scale(.8);
  }
}
</style>
