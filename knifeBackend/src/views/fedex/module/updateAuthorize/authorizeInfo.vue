<template>
  <div class="authorize-info-component">
    <div class="row">
      <div class="r-item" :key="index" v-for="(value, key, index) in info">
        <span class="label">
          {{ key }}:
        </span>
        <span class="name">
          {{ value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { changeObjKey } from '@/utils/common'

const KEYS_CONVERSION = {
  '客戶编码': 'customerCode',
  ApiSecret: 'clientSecret',
  clientId: 'clientId'
}
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  computed: {
    info() {
      // const info = changeObjKey(this.data, KEYS_CONVERSION)
      return changeObjKey(this.data, KEYS_CONVERSION)
    }
  }
}
</script>

<style lang="scss" scoped>
.authorize-info-component {
  .row {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    background: $bg-color;
    padding: 0 10px;
    .r-item {
      padding: 5px 10px;
    }
    .label {
      color: #000;
    }
    .name {
      color: $color-gray;
    }
  }
}
</style>
