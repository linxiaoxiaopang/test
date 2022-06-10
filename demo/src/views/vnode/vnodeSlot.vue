<script>
export default {
  render(h) {
    const { default: default1, haha } = this.$scopedSlots;
    return h("div", [...default1({a: 100}), ...haha({haha: 'hahah'})]);
  },
};
</script>

<style>
</style>