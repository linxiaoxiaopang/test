<template>
  <div class="createProtoHeader">
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
      ],
    };
  },
  methods: {
    moveToDomById(domId) {
      this.$emit("moveToDomById", domId);
    },
  },
};
</script>

<style lang="scss" scoped>
.createProtoHeader {
  background: #fff;
  margin-bottom: 15px;
  height: 48px;
  line-height: 48px;
  .list {
    padding: 0;
    margin-top: 0;
    display: flex;

    list-style-type: none;
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