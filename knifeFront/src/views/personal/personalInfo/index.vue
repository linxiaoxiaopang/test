<template>
  <div class="app-container personalInfoPage">
    <div class="title">个人信息</div>
    <div class="content">
      <el-image
        class="avatar"
        :src="avatar || require('@/assets/images/logo.png')"
      ></el-image>
      <div class="info">
        <template v-if="isEdit">
          <BaseForm
            class="info-base-form"
            v-loading="loading"
            size="small"
            ref="form"
            label-width="auto"
            :cols="formField"
            :form="form"
          >
            <template #nameSlot="{ scoped: { prop, placeholder } }">
              <el-input
                size="small"
                type="text"
                style="width: 250px"
                :placeholder="placeholder"
                v-model="form[prop]"
              />
            </template>
          </BaseForm>
          <div class="btn-wrapper">
            <el-button size="mini" @click="cancel"> 取消 </el-button>
            <el-button
              type="primary"
              size="mini"
              :loading="loading"
              @click="doSubmit"
            >
              确定
            </el-button>
          </div>
        </template>

        <div class="detail-wrapper" v-else>
          <color-text-btn
            v-if="!is_super"
            class="edit"
            icon="el-icon-edit-outline"
            type="primary"
            size="mini"
            @click="toEdit"
            v-p="['rbac:common_users:partial_update']"
          >
            编辑
          </color-text-btn>

          <div
            class="row"
            :key="index"
            v-for="({ prop, label }, index) in formField.filter(
              ({ prop }) => prop !== 'tele'
            )"
          >
            <div
              v-if="prop !== 'nick_name'"
              :class="['label']"
              style="color: #636c78"
            >
              {{ label }}：
            </div>
            <div
              :class="['name', prop == 'nick_name' && 'nick-name']"
              style="color: #333333"
            >
              {{ form[prop] }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="password-wrapper" v-if="!isEdit">
      <div class="label">手机号：</div>
      <div class="tele-name">{{ form.tele || '暂无' }}</div>
    </div>
    <div class="password-wrapper">
      <div class="label">密码：</div>
      <div class="name">********</div>
      <UpdatePass
        :data="form"
        :sup_this="sup_this"
        v-p="['rbac:common_users:change_password']"
      />
    </div>
  </div>
</template>

<script>
import UpdatePass from './module/updatePass'
import { mapGetters } from 'vuex'
import formField from './formField'
import { read, update } from '@/api/user'
import { deepClone, getDiffData } from '@/components/avue/utils/util'
import { validatenull } from '@/components/avue/utils/validate'
export default {
  data() {
    return {
      formField,
      sup_this: this,
      form: {},
      oForm: {},
      loading: false,
      isEdit: false
    }
  },
  components: {
    UpdatePass
  },
  computed: {
    ...mapGetters(['id', 'avatar', 'is_super'])
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      if (this.is_super) return
      const id = this.id
      const { code, detail } = await read(id)
      if ($SUC({ code })) {
        this.form = detail
        this.oForm = deepClone(detail)
      }
    },
    async doSubmit() {
      const { id, ...rest } = this.form
      const valid = this.validate()
      if (!valid) return
      this.loading = true
      
      let diffData = getDiffData(rest, this.oForm)
      if (!validatenull(diffData)) {
        const [, res] = await awaitWrap(update(id, diffData))
        if ($SUC(res)) {
          this.init()
          this.$message.success('操作成功')
        }
      }
  
      this.isEdit = false
      this.loading = false
    },
    async toEdit() {
      this.isEdit = true
    },
    async cancel() {
      await this.init()
      this.isEdit = false
    },
    async validate() {
      const { form } = this.$refs
      const forms = Array.isArray(form) ? form : [form]
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
.personalInfoPage {
  height: calc(100vh - 100px);
  .content {
    display: flex;
    justify-content: flex-start;
    padding: 20px 15px;
    width: 50%;
    max-width: 500px;
    background: #f4f5f9;
    border: 1px solid $border-color;
    border-radius: 2px;
    border-radius: 4px;
    .el-image {
      flex: 0 0 55px;
      margin-right: 15px;
      white-space: nowrap;
      width: 55px;
      height: 55px;
      border-radius: 50%;
      background: #bed1e9;
    }
    .info {
      flex: 1;
    }
    .info-base-form {
      width: 100%;
      ::v-deep {
        .el-form {
          padding: 0;
        }
      }
    }
    .label {
      white-space: nowrap;
    }
    .detail-wrapper {
      position: relative;
      font-size: 14px;
      .edit {
        position: absolute;
        right: 0;
      }
      .row {
        display: flex;
        padding: 5px 0;
      }
      .nick-name {
        font-size: 20px;
        font-weight: 400;
      }
    }

    .btn-wrapper {
      margin-left: 50%;
      transform: translateX(-50%);
    }
  }
  .password-wrapper {
    margin-top: 15px;
  }
  .password-wrapper {
    width: 100%;
    display: flex;
    padding: 5px 10px;
    align-items: center;
    .label {
      display: inline-block;
      width: 80px;
      text-align: right;
    }
    .tele-name,
    .name {
      font-size: 12px;
      position: relative;
      top: 4px;
      margin: 0 5px;
      line-height: 1;
      flex: 0 0 60px;
    }
    .tele-name {
      position: static;
    }
  }
}
</style>
