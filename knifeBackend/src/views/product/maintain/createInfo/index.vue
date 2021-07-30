<template>
  <section class="app-container createProtoPage">
    <EHeader @moveToDomById="moveToDomById" />
    <div class="content">
      <Basis ref="basis" v-loading="loading" />
      <Specifications ref="specifications" v-loading="loading" />
    </div>

    <div class="bottom">
      <el-button type="primary" @click="save" :loading="loading"> 保存 </el-button>
    </div>
  </section>
</template>

<script>
import EHeader from './module/header'
import Basis from '../../module/basis'
import Specifications from './module/specifications'
import { createProto as add } from '@/api/product/protoApi'
import cloneDeep from 'lodash/cloneDeep'
import { file2Base64 } from '@/utils'

export default {
  name: 'createInfo',
  components: {
    EHeader,
    Basis,
    Specifications
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    moveToDomById(id) {
      if (!document.getElementById(id)) return
      let top = document.getElementById(id).getBoundingClientRect().top
      let cTop = document.querySelector('.createProtoPage .content').getBoundingClientRect().top
      const scrollTop = document.querySelector('.createProtoPage .content').scrollTop

      document.querySelector('.createProtoPage .content').scrollTo({ top: top + scrollTop - cTop, behavior: 'smooth' })
    },
    async save() {
      this.loading = true
      try {
        const { specifications, basis } = this.$refs
        const basisFrom = await basis.save()

        const specificationsForm = await specifications.save()
        if (!basisFrom || !specificationsForm) {
          this.loading = false
          return
        }
        const sFrom = cloneDeep(specificationsForm)
        for (let i = 0; i < sFrom.structs.length; i++) {
          const item = sFrom.structs[i]
          const pArr = item.figures.map(async (figure) => await file2Base64(figure))
          const res = await Promise.all(pArr)
          item.figures = res.map((base64, index) => {
            return {
              isCover: index == 0,
              path: base64
            }
          })
        }

        const jsonStr = JSON.stringify(Object.assign({}, { basis: basisFrom }, sFrom))
        const formData = new FormData()
        formData.append('jsonStr', jsonStr)

        const { code } = await add(formData)
        if ($SUC({ code })) {
          this.$message.success('原型创建成功')
          setTimeout(() => {
            this.$router.replace('/product/maintain/basicsMange')
          }, 100)
        }
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.createProtoPage {
  display: flex;
  flex-direction: column;
  padding: 0;
  background: #ebebed;
  .content {
    flex: 1;
    overflow: auto;
  }
  .bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 15px;
    background: #fff;
    padding: 10px 0;
    border-radius: 0 0 4px 4px;
    .el-button {
      width: 150px;
    }
  }
}
</style>
