<template>
  <div class="layerIntro">
    <div v-for="(val, key) in data" :class="['item', !isObj(val) && 'strItem']">
      <span class="key">{{ key }}：</span>
      <el-tag size="mini" type="primary" v-if="!isObj(val)">
        {{ val }}
      </el-tag>
      <layer-intro style="margin-left: 15px" v-else :data="val" />
    </div>
  </div>
</template>

<script>
export default {
  name: "layerIntro",
  props: {
    data: {
      default: () => ({}),
    },
  },
  computed: {
    isObj(val) {
      return (val) => {
        return typeof val === "object";
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.layerIntro {
  .key {
    color: $color-gray;
    font-size: 12px;
  }
  .item {
    cursor: pointer;
    display: inline-block;
    padding: 5px 8px;
  }
  .strItem:hover {
    background: $color-primary;
        border-radius: 4px;;
    .key {
      color: #fff;
    }
  }
}
</style>