<template functional>
  <div>
    <el-button v-if="props.valid" icon="el-icon-success" size="mini" round class="auth-button">
      <span class="button-text">{{props.validText}}</span>
    </el-button>
    <template v-else>{{props.invalidText}}</template>
  </div>
</template>
