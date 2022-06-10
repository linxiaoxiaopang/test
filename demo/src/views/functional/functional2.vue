<script>
export default {
  functional: true,
  render(h, context) {
    console.log('context.children', context.children)
    console.log('context.children', context.slots())
    return h("button", context.data, context.children);
  },
};
</script>