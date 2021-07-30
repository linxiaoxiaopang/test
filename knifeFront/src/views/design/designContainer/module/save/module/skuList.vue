<template>
  <div class="skuListComponent">
    <div class="row">
      <div class="content relation-sku">
        <el-alert title="生成自定义 SKU 规则" type="info" show-icon>
          <p class="address">1，输入前缀的情况下格式：前缀款式-尺码</p>
          <p class="address">2，手动输入规则：手动输入项保存输入数据，未输入项自动生成四位随机数款式-尺码</p>
          <p class="address">3，未做任何输入操作：随机数款式-尺码</p>
        </el-alert>
        <div class="row">
          <div class="label">SKU前缀</div>
          <div class="content">
            <el-input
              clearable
              style="width: 400px"
              placeholder="请输入内容"
              v-model.trim="commonPrefix"
              class="create-sku"
              @input="createPrefix"
            >
              <!-- <el-button slot="append" @click="createPrefix">
                <div class="create-btn">生成</div>
              </el-button> -->
            </el-input>
          </div>
        </div>
        <div class="row">
          <div class="label">自定义SKU</div>
          <div class="content">
            <el-row :gutter="15">
              <el-col :xl="8" :span="12" :key="index" v-for="({ size_name, id, abbr }, index) in skuDatas || []">
                <el-form ref="form" :model="externalSkus[index] || {}">
                  <el-form-item
                    :rules="[
                      {
                        validator: validator
                      }
                    ]"
                    label=""
                    prop="externalSku"
                  >
                    <el-input placeholder="请输入SKU" v-model.trim="externalSkus[index].externalSku">
                      <template slot="prepend">{{ abbr }} - {{ size_name }}</template>
                    </el-input>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCheckCustomSkus as list } from '@/api/product/knifeApi'
export default {
  props: {
    skuDatas: {
      type: Array,
      required: true
    },
    externalSkus: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      store: '0',
      commonPrefix: '',
      allUsers: []
    }
  },
  watch: {
    externalSkus: {
      handler() {
        this.validate()
      },
      deep: true
    }
  },
  created() {
    this.list()
  },
  methods: {
    validator(rule, value, callback) {
      if (value == '' || value === undefined || value === null) {
        return callback('自定义sku必填')
      }
      const externalSkus = this.externalSkus
      const existData = externalSkus.filter(({ externalSku }) => {
        return externalSku === value
      })
      const userSkus = this.allUsers.filter((user_sku) => {
        return value === user_sku
      })
      if (existData.length > 1) {
        return callback('自定义sku重复')
      }
      if (userSkus.length) {
        return callback('自定义sku已存在')
      }
      callback()
    },
    createPrefix() {
      const externalSkus = this.externalSkus
      const commonPrefix = this.commonPrefix
      if (!commonPrefix.trim()) {
        externalSkus.map((item, index) => {
          this.$set(item, 'externalSku', ``)
        })
        // return this.$message.warning('前缀不能为空')
        return
      }
      externalSkus.map((item, index) => {
        this.$set(item, 'externalSku', `${commonPrefix}${item.structure}-${item.size_name}`)
      })
    },
    async list() {
      const { code, detail } = await list()
      if ($SUC({ code })) {
        this.allUsers = detail
      }
    },

    async validate() {
      const { form } = this.$refs
      const forms = Array.isArray(form) ? form : [form]
      console.log('forms', forms)
      const successData = await Promise.all(
        forms.map(async (node) => {
          try {
            return await node.validate()
          } catch (err) {
            return false
          }
        })
      )
      return successData.every((bool) => bool)
    }
  }
}
</script>

<style lang="scss" scoped>
.skuListComponent {
  .el-alert {
    padding: 5px 0 5px 5px;
    margin-bottom: 30px;
    .p1 {
      margin-bottom: 5px;
    }
  }
  .row {
    display: flex;
    margin: 5px 0;
    padding: 5px;

    .label {
      flex: 0 0 80px;
      position: relative;
      top: 4px;
      white-space: nowrap;
      font-size: 14px;
    }

    .content {
      flex: 1;
      .create-btn {
        padding: 0 15px;
      }
    }
  }
  .el-row {
    max-height: 50vh;
    overflow-y: auto;
    margin-bottom: 15px;
    .el-col {
      margin-bottom: 20px;
    }
  }
  .relation-sku {
    padding: 15px;
    border: 1px solid $border-color;
    .address {
      line-height: 1.25rem;
    }
  }
  .create-sku {
    ::v-deep {
      .el-input-group__append {
        padding: 0;
        background: $color-primary;
        color: #fff;
        cursor: pointer;
        border-top: 1px solid $color-primary;
        border-bottom: 1px solid $color-primary;
      }
    }
  }
}
</style>
