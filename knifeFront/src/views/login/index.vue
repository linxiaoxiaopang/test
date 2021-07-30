<template>
  <div class="loginPageBox">
    <div class="loginImgBox">
      <div class="mask">
        <h6>正丁定制</h6>
      </div>
    </div>
    <div class="loginBox">
      <header>
        <p class="fontOne">登录</p>
        <p class="fontTwo">欢迎回来</p>
      </header>
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginForm"
        @keyup.enter.native="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入登录账号/邮箱"
            type="text"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" class="passwordItem">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            :type="passwordType"
          ></el-input>
          <i class="passwordIcon" @click="changeIcon">
            <img src="./ic_preview_close.svg" v-if="passwordType == 'password'">
            <img src="./ic_preview.svg" v-else>
          </i>
        </el-form-item>
        <el-form-item>
          <p class="register">
            <el-checkbox
              v-model="loginForm.rememberMe"
              style="margin-right: 30px"
              >记住账号</el-checkbox
            >
            强烈建议使用
            <b>谷歌浏览器</b>
            <!-- <b>360浏览器</b>（极速模式） -->
          </p>
        </el-form-item>
        <el-form-item prop="passwordLogin">
          <el-button
            type="primary"
            style="width: 100%"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
// import { SYSTEM_NAME, COMPANY_NAME } from "@/utils/constant";

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: '',
        rememberMe: ''
      },
      loginFormRules: {
        username: [
          { required: true, message: '当前登录账号为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '当前密码为空', trigger: 'blur' },
          {
            min: 8,
            max: 16,
            message: '长度在 8 到 16 个字符',
            trigger: 'blur'
          }
        ]
      },
      passwordType: 'password',
      loading: false,
      redirect: undefined,
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getCookie()
  },
  methods: {
    getCookie() {
      const username = Cookies.get('username')
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? '' : username,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        const user = {
          username: this.loginForm.username,
          password: this.loginForm.password,
          // password: this.loginForm.password,
          rememberMe: this.loginForm.rememberMe
        }
        if (valid) {
          this.loading = true
          if (user.rememberMe) {
            Cookies.set('username', user.username, { expires: 1 })
            Cookies.set('rememberMe', user.rememberMe, { expires: 1 })
          } else {
            Cookies.remove('username')
            Cookies.remove('rememberMe')
          }
          this.$store
            .dispatch('Login', user)
            .then((res) => {
              this.$router.push({ path: '/' })
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          console.log('提交错误!')
          return false
        }
      })
    },
    changeIcon() {
      if(this.passwordType == 'password') {
        this.passwordType = 'text'
      } else {
        this.passwordType = 'password'
      }
    }
  }
}
</script>

<style scoped lang="scss">
.loginPageBox {
  display: flex;
  width: 800px;
  height: 440px;
  box-shadow: 0px 0px 8px 1px rgba($color: #000000, $alpha: 0.2);
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  .loginImgBox {
    flex: 440;
    height: 100%;
    position: relative;
    background: url('~@/assets/images/loginImg.png') center center no-repeat;
    .mask {
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: rgba($color: #000000, $alpha: 0.2);
      h6 {
        width: 300px;
        text-align: center;
        font-weight: 400;
        font-size: 24px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
      }
    }
  }
  .loginBox {
    flex: 360;
    height: 100%;
    background-color: #fff;
    padding: 0 40px;
    box-sizing: border-box;
    header {
      .fontOne {
        font-size: 24px;
        font-weight: 500;
        width: 100%;
        text-align: center;
        margin-top: 50px;
      }
      .fontTwo {
        font-size: 12px;
        font-weight: 400;
        width: 100%;
        text-align: center;
        color: #666;
        margin-top: 10px;
      }
    }
    .el-form {
      margin-top: 45px;
      .el-form-item {
        margin-bottom: 20px;
        ::v-deep {
          .el-form-item__error {
            top: -50%;
          }
        }

        .register {
          text-align: center;
        }
        .passwordIcon {
          display: inline-block;
          position: absolute;
          width: 20px;
          height: 20px;
          // border: 1px solid black;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          img {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      }
      .passwordItem {
        margin-top: 28px;
      }
    }
  }
}
</style>
