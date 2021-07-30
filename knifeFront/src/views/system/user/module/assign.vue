<template>
  <div class="line inline-block">
    <ColorTextBtn size="mini"  @click="to">分配角色</ColorTextBtn>
    <aForm ref="form" v-bind="$attrs" :sup_this="sup_this" :is-add="false" />
  </div>
</template>
<script>
import aForm from "./aForm";
export default {
  components: { aForm },
  props: {
    data: {
      type: Object,
      required: true,
    },
    // index.vue 的this 可用于刷新数据
    sup_this: {
      type: Object,
      required: true,
    },
  },
  methods: {
    async to() {
      const _this = this.$refs.form;
      _this.form = {
        id: this.data.id,
        roles: this.data.roles.map(({ id }) => id),
      };
      this.$nextTick(() => {
        _this.dialog = true;
      });
    },
  },
};
</script>

<style scoped>
div {
  display: inline-block;
  margin-right: 3px;
}
</style>
