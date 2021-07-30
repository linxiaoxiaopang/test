<template functional>
  <div class="list-state-group" :class="data.staticClass">
    <el-radio-group :value="props.value" v-on="listeners">
      <el-radio-button v-for="({ label, value }, index) in props.list" :label="value" :key="index">
        {{ label }}
      </el-radio-button>
    </el-radio-group>
  </div>
</template>
