<script>
export default {
  functional: true,
  render(h, context) {
    const { props } = context;
    console.log("props.vnode", props.vnode);
    const child = h("span", "child");
    props.vnode.children.push(child);
    return  props.vnode
  },
};
</script>