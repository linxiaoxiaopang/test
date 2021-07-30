<template>
  <section class="loginPage">
    <div class="loginForm">
      <div class="top">
        <span class="title">
          <span class="big">欢迎登录，</span>
          正丁云商刀版图管理系统
        </span>
      </div>

      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        label-position="left"
        label-width="0px"
        class="login-form"
        @keyup.enter.native="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model.trim="loginForm.username"
            type="text"
            clearable
            auto-complete="off"
            placeholder="账号"
          >
            <!-- <svg-icon
              slot="prefix"
              icon-class="user"
              class="el-input__icon"
              style="height: 39px; width: 13px; margin-left: 2px"
            /> -->
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            clearable
            show-password
            type="password"
            auto-complete="off"
            placeholder="密码"
          >
            <!-- <svg-icon
              slot="prefix"
              icon-class="password"
              class="el-input__icon"
              style="height: 39px; width: 13px; margin-left: 2px"
            /> -->
          </el-input>
        </el-form-item>
        <div class="formItem">
          <el-button
            :loading="loading"
            size="medium"
            type="primary"
            style="width: 100%"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </div>
        <p class="register">
          <el-checkbox
            v-model="loginForm.rememberMe"
            style="margin: 0px 0px 25px 0px; margin-right: 20px"
            >记住账号</el-checkbox
          >
          强烈建议使用
          <b>谷歌浏览器</b>
          <!-- <b>360浏览器</b>（极速模式） -->
        </p>

        <!-- <el-form-item style="width: 100%">
          <el-button
            :loading="loading"
            size="medium"
            type="primary"
            style="width: 100%"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
        </el-form-item> -->
      </el-form>
      <div class="info-wrapper">
        <el-image :src="require('@/assets/images/logo.png')" />
        <div class="school-name">泉州正丁云商企业管理有限公司</div>
        <div class="sub-name">正丁云商刀版图管理系统</div>
      </div>
    </div>
  </section>
</template>

<script>
import { buildMenus } from "@/api/login";
import superRouter from "@/router/superRouter";
import Cookies from "js-cookie";
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" },
        ],
        password: [
          { required: true, trigger: "blur", message: "密码不能为空" },
        ],
      },
      loading: false,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    this.getCookie();
  },
  methods: {
    getCookie() {
      const username = Cookies.get("username");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? "" : username,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        const user = {
          username: this.loginForm.username,
          password: this.loginForm.password,
          // password: this.loginForm.password,
          rememberMe: this.loginForm.rememberMe,
        };
        if (valid) {
          this.loading = true;
          if (user.rememberMe) {
            Cookies.set("username", user.username, { expires: 1 });
            Cookies.set("rememberMe", user.rememberMe, { expires: 1 });
          } else {
            Cookies.remove("username");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", user)
            .then((res) => {
              this.$router.push({ path: "/" });
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          console.log("提交错误!");
          return false;
        }
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.loginPage {
  // background-image: url("~@/assets/images/loginBg.png");
  background-color: #64c2a7;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: fixed;
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  min-width: 768px;
  overflow: auto;
  .loginForm {
    padding: 2rem;
    padding-bottom: 3rem;
    position: absolute;
    z-index: 3;
    top: 50%;
    left: 50%;
    transform: translate(0, -50%);
    background: white;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    .info-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: absolute;
      width: 100%;
      height: 100%;
      right: 100%;
      top: 0;
      margin-right: -1px;
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      background: white;
      .el-image {
        margin-bottom: 20px;
        width: 120px;
        // height: 120px;
      }
      .school-name {
        font-size: 1.25rem;
        font-weight: 600;
        color: #000;
        margin-bottom: 10px;
      }
    }
    // width: 400px;
  }

  .top {
    display: flex;
    flex-flow: column wrap;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    .title {
      color: #000;
      font-size: 1rem;
      .big {
        font-size: 1.75rem;
        font-weight: 600;
      }
    }
  }
  .forget {
    display: block;
    color: $color-primary;
    text-align: right;
    position: relative;
    top: -0.5rem;
  }
  .register {
    margin-top: 1rem;
    font-size: 0.75rem;
    text-align: center;
    b {
      color: $color-primary;
      font-size: 1rem;
    }
  }
  .formBox {
    // padding: 0 $space-width * 1.5;
  }

  .el-form-item {
    background-color: #eff6fe;
    margin-bottom: 2rem;

    .el-input {
      input {
        border: 0;
        box-shadow: none;
        background-color: transparent;
        outline: none;
        padding-left: 1rem;
        padding-right: 1rem;
        height: 2rem;
        line-height: 2rem;
      }
    }

    .el-input-group__prepend {
      background-color: transparent;
      color: $color-primary;
      border-color: transparent;
      font-size: 1.25rem;
    }

    .el-form-item__error {
      padding-top: 0.75rem;
      left: 20px;
    }
  }

  .submitBtn {
    margin-top: 1rem;
    padding: 0;
    display: block;
    width: 100%;
    height: 2.75rem;
    line-height: 2.75rem;
    color: white;
    /*box-shadow: 1px 1px 5px 0 #6FB2FF;*/
    border: none;
    outline: none;
  }

  .desc {
    font-size: 80%;
    color: $color-gray;
    text-align: center;
    margin: 16px 0;
  }
}
</style>
