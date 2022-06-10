<template>
  <div>
    <Vnodes a="10000" />
  </div>
</template>
<script>
import MsgBox from "./msgBox";
export default {
  extends: MsgBox,
  props: {
    hi: {
      type: String,
      default: "child hello wrold",
    },
  },
  components: {
    Vnodes: {
      functional: true,
      render(h, context) {
        return h("div", context.props.a);
      },
    },
  },
};
</script>
