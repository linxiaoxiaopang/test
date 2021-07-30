<template>
  <section
    class="app-container app-flex-col-container verify-component"
    v-loading="sizeNum > createdPsdNum"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div class="content">
      <el-button type="warning" plain icon="el-icon-warning" class="w100">
        以参考尺码的组件为标准，其他尺码拖动可调整组件顺序，也可旋转角度以对应,请按标准校验组件！
      </el-button>

      <div class="product-component-wrapper">
        <product-component :data="baseSize" @psdCreated="createdPsdNum++"></product-component>
        <div class="actual-product-list">
          <div v-for="item in size" :key="item.id" class="actual-product-item">
            <product-component ref="product" type="1" :data="item" @psdCreated="createdPsdNum++"></product-component>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom">
      <el-button @click="$router.back()"> 取消 </el-button>
      <el-button type="primary" @click="doSubmit" :loading="loading.submit"> 保存 </el-button>
    </div>
  </section>
</template>

<script>
import productComponent from './module/rotateProductComponent'
import { getReferenceSize, changeGroup } from '@/api/product/productApi'

export default {
  name: 'verifyComponent',
  components: {
    productComponent
  },
  data() {
    return {
      loading: {
        page: false,
        submit: false
      },
      baseSize: {},
      size: {},
      sizeNum: 1,
      createdPsdNum: 0
    }
  },
  created() {
    getReferenceSize(this.$route.query.id).then(
      ({
        detail: {
          base_size: [base_size],
          size
        }
      }) => {
        this.baseSize = base_size
        size = size.filter(({ kl_docs: [{ kl_psd_path } = {}] = [] }) => kl_psd_path)
        this.size = size
        this.sizeNum = size.length + (base_size ? 1 : 0)
        // console.log(base_size, size);
      }
    )
  },
  methods: {
    doSubmit() {
      this.loading.submit = true
      let tempArr = []
      this.$refs.product.forEach((product) => {
        tempArr = tempArr.concat(product.getChangeData())
      })
      if (tempArr.length) {
        changeGroup(tempArr)
          .then((res) => {
            if ($SUC(res)) {
              this.$message.success('校验成功')
              this.$router.back()
            }
          })
          .finally(() => {
            this.loading.submit = false
          })
      } else {
        this.$confirm('无修改内容, 是否返回?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$router.back()
          })
          .finally(() => {
            this.loading.submit = false
          })
      }
    }
  }
}
</script>

<style lang="scss"></style>
