<template>
  <div class="createProtoHeader" >
    <ul class="list">
      <li
       :key="domId"
       class="item"
       v-for="{ label, domId } in summary"
       @click="moveToDomById(domId)"
      >
        {{ label }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      summary: [
        {
          label: "基础信息",
          domId: "basis",
        },
        {
          label: "规格信息",
          domId: "specifications",
        },
        {
          label: "同步设置",
          domId: "async",
        },
      ],
    };
  },
  methods: {
    moveToDomById (domId) {
      this.$emit('moveToDomById', domId)
    }
  }
};
</script>

<style lang="scss" scoped>
.createProtoHeader {
  .list {
    display: flex;
    height: 48PX;
    line-height: 48PX;
    list-style-type: none;
    background: #fff;
    border-radius: 4px 4px 0 0;
    .item {
      border-radius: 4px;
      flex: 1;
      text-align: center;
      cursor: pointer;
    }
  }
}
</style>