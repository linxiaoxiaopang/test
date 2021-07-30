<template>
  <div class="consigneeComponent" v-if="Object.keys(info).length">
    <div class="c-row">
      <span class="label"> 收货人： </span>
      <span class="text">
        {{ info.consigneeName }}
      </span>
      <span class="label"> 收货人电话： </span>
      <span class="text">
        {{ info.consigneeContactPhone }}
      </span>
      <span class="label"> 收货人手机号码： </span>
      <span class="text">
        {{ info.consigneeContactMobilePhone }}
      </span>

      <span class="label"> 邮编： </span>
      <span class="text">
        {{ info.consigneePostcode }}
      </span>

      <span class="label"> 国家： </span>
      <span class="text">
        {{ info.consigneeCountryCode }}
      </span>
      <span class="label"> 省份： </span>
      <span class="text">
        {{ info.consigneeProvince }}
      </span>
      <span class="label"> 城市： </span>
      <span class="text">
        {{ info.consigneeCity }}
      </span>
      <span class="label"> 地址： </span>
      <span class="text">
        {{ info.consigneeDetailAddress }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.consigneeComponent {
  margin-bottom: 10px;
  font-size: 1.25rem;
  .c-row {
    line-height: 1.5;
    margin-bottom: 5px;
    .label:not(:first-child) {
      margin-left: 15px;
    }
    .text {
      font-size: 1rem;
      color: $color-primary;
    }
  }
}
</style>