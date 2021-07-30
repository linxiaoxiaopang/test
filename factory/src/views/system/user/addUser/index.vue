<template>
  <div class="system-add-page">
    <div class="app-container system-add-title">
      添加管理员
    </div>

    <div class="app-container system-add-form">
      <avue-form v-model="form"
                 :option="formOption"
                 @submit="onsubmit"
                 @reset="onreset"
      ></avue-form>
    </div>
  </div>
</template>

<script>
  import { formOption } from "./constData";
  export default {
    data() {
      formOption.column[3].rules.validator = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {
        formOption,
        form: {},
      }
    },
    methods: {
      addUser(){
        this.$router.push({
          path: '/system/user/addUser'
        })
      },
      onsubmit() {

      },
      onreset() {

      },
    }
  };
</script>

<style lang="scss"></style>
