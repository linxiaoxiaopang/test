
<script>
import VnodeSlot from "./vnodeSlot.vue";
import VnodeSlot1 from "./vnodeSlot1.vue";

export default {
  components: {
    VnodeSlot,
    VnodeSlot1,
  },

  render(h) {
    return h("div", [
      h(
        "VnodeSlot",
        {
          scopedSlots: {
            default(props) {
              console.log("props", props);
              return h("span", props.a);
            },
            haha(props) {
              console.log("props", props);
              return h("span", props.haha);
            },
          },
        },
        [
          h(
            "div",
            {
              slot: "haha",
            },
            ["aaaa"]
          ),
        ]
      ),
    ]);
  },
};
</script>

<style>
</style>