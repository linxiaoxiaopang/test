<template>
  <div class="lang-item">
    <div v-for="item in data">
      <div v-if="isArray(item)">
        <langItem :data="item"></langItem>
      </div>
      <div :id="item.id" v-else-if="isPlainObject(item)" >
       <div :is="tagName(item.level)"> {{item.name}}</div>
      </div>
      <div v-else>
        {{ item }}
        <el-button type="text" v-copy="`${item}`" size="mini" v-copy:callback="handleCopied">
          复制
        </el-button>
        <el-button type="text" v-copy="`{{${item}}}`" size="mini" v-copy:callback="handleCopied">
          复制{{}}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {isArray, isPlainObject} from "lodash";
import {copy} from 'v-copy'

export default {
  name: 'langItem',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isArray,
      isPlainObject
    }
  },
  directives: {
    copy
  },
  computed: {
    tagName() {
      return (level) => {
        return `h${level}`
      }
    }
  },
  methods: {
    handleCopied() {
      this.$message.success('复制成功')
    }
  }
};
</script>

<style>
.lang-item {
  padding-left: 20px;
  font-size: 18px;
}
</style>