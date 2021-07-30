<template>
  <section class="app-container knifePage app-flex-col-container">
    <div class="title">
      上传位置psd文件
      <el-button type="primary" size="mini" @click="toggleModule">新增模块</el-button>
    </div>
    <div class="flex-col-content">
      <el-row :gutter="15">
        <el-col :span="8" :key="index" v-for="(form, index) in data">
          <BaseForm
            customClass="customClass"
            ref="form"
            label-width="88px"
            :cols="getFormField(index)"
            :form="form"
          >
            <template #filesSlot="{ scoped: { prop } }">
              <FileUpload :files.sync="form[prop]" :limit="1" accept=".psd"/>
            </template>
          </BaseForm>
          <i class="el-icon-close" @click="toggleModule(index)"></i>
        </el-col>
      </el-row>
    </div>

    <div class="bottom">
      <el-button type="default" @click="$router.back()">
        返回
      </el-button>
      <el-button type="primary" @click="doSubmit"> 保存并进行下一步 </el-button>
    </div>
  </section>
</template>

<script>
import FileUpload from '@/components/fileUpload/fileUpload'
import { mapGetters, mapMutations } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
import { convertCurrency } from '@/utils'

import { getKlProdSite as list } from '@/api/product/protoSizeApi'

export default {
  name: 'knifeSize',
  components: {
    FileUpload
  },
  data() {
    return {
      formField: [],
      data: [],
      isStandard: true
    }
  },
  computed: {
    ...mapGetters(['isGoBack', 'knifePsds'])
  },
  created() {
    if (this.isGoBack) {
      this.data = this.knifePsds
    } else {
      this.list()
    }
  },
  destroyed() {
    this.SET_IS_GO_BACK(false)
  },
  
  methods: {
    ...mapMutations(['SET_KNIFE_PSDS', 'SET_KNIFE_STANDARD_STATUS', 'SET_IS_GO_BACK']),
    async doSubmit() {
      console.log(this.data)
      const success = await this.validForms()
      if (!success) return
      this.SET_KNIFE_STANDARD_STATUS(this.isStandard)
      this.SET_KNIFE_PSDS(this.data)
      let url = `/knife/size/check?primId=${this.$route.query.id}`
      if (!this.isStandard) {
        url = `/knife/check?primId=${this.$route.query.id}`
      }
      this.$router.push(url)
    },
    async validForms() {
      const { form } = this.$refs
      const forms = Array.isArray(form) ? form : [form]
      const valids = await Promise.all(
        forms.map(async (node) => {
          try {
            return await node.validate()
          } catch (err) {
            return false
          }
        })
      )
      return valids.some((bool) => bool)
    },
    async list() {
      const [err, res] = await awaitWrap(list(this.$route.query.base_size_id))
      if ($SUC(res)) {
        let { detail, code } = res
        this.data = detail.map(({ display_img, position_psd }) => {
          return {
            files: [
              {
                url: display_img,
                position_psd
              }
            ]
          }
        })
      }
      if (this.data.length === 0) {
        this.data = [
          {
            files: []
          }
        ]
      }
    },
    getFormField(index) {
      return [
        {
          label: '模块' + convertCurrency(index + 1),
          prop: 'files',
          name: 'files',
          colNum: 24,
          placeholder: '请上传模块',
          slotName: 'filesSlot'
        }
      ]
    },
    toggleModule(index) {
      if (index > -1) {
        if (this.data.length === 1) {
          this.$message.warning('至少上传一个模块')
          return
        }
        this.data.splice(index, 1)
      }
      if (typeof index === 'object') this.data.push({files: []})
    }
  }
}
</script>

<style lang="scss" scoped>
.knifePage {
  .title {
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
  }
  .customClass {
    margin-bottom: 15px;
    border: 1px solid $border-color;
    border-radius: 4px;
  }
  .flex-col-content {
    .el-col {
      position: relative;
      .el-icon-close {
        position: absolute;
        top: 10px;
        right: 20px;
        cursor: pointer;
      }
    }
  }
}
</style>
