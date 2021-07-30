<template>
  <div class="line inline-block">
    <ColorTextBtn size="mini" class="button" type="primary" @click="dialog = true">修改</ColorTextBtn>
    <BaseDialog :dialogVisible.sync="dialog" :title="title" width="500px" @close="cancel">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="88px">
        <el-form-item label="旧密码" prop="old_password">
          <el-input
            v-model="form.old_password"
            placeholder="请输入旧密码"
            type="password"
            autocomplete="off"
            style="width: 370px"
            show-password
          />
        </el-form-item>

        <el-form-item label="新密码" prop="new_password1">
          <el-input
            v-model="form.new_password1"
            placeholder="请输入新密码"
            type="password"
            autocomplete="off"
            style="width: 370px"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="new_password2">
          <el-input
            v-model="form.new_password2"
            type="password"
            placeholder="请输入确认密码"
            autocomplete="off"
            show-password
            style="width: 370px"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="default" @click="cancel">取消</el-button>
        <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import { isRobust } from '@/utils/validate'
import { changePassword } from '@/api/user'
import { mapActions } from 'vuex'

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    // index.vue 的this 可用于刷新数据
    sup_this: {
      type: Object,
      required: true
    }
  },
  data() {
    const confirmPass = (rule, value, callback) => {
      if (this.form.new_password1 !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      dialog: false,
      title: '修改密码',
      form: { old_password: '', new_password1: '', new_password2: '' },
      rules: {
        new_password1: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
            validator: isRobust
          }
        ],
        new_password2: [{ required: true, validator: confirmPass, trigger: 'blur' }]
      }
    }
  },
  methods: {
    ...mapActions(['LogOut']),
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const { old_password, new_password1, new_password2 } = this.form || {}

          this.loading = true
          const form = {
            old_password,
            new_password1,
            new_password2
          }
          changePassword(form)
            .then((res) => {
              this.resetForm()
              this.$message({
                showClose: true,
                type: 'success',
                message: '密码修改成功!',
                duration: 2500
              })
              this.sup_this.init()
              this.LogOut()
            })
            .catch((err) => {
              this.loading = false
              console.log(err)
            })
        } else {
          return false
        }
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { new_password1: '', new_password2: '' }
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: center;
}
</style>
