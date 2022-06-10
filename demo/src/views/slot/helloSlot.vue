
<script>
export default {
  props: {
    sliceNum: {
      type: Number,
      default: 3,
    },
  },

  render(createElement) {
    console.log('this.$slots', this.$slots)
    console.log('this.$children', this.$children)
    console.log('this.$scopedSlots', this.$scopedSlots)
    const defaultList = (this.$slots.default || []).filter(({isComment}) => !isComment)
    const slice3 = defaultList.slice(0, this.sliceNum);
    const sliceMax3 = defaultList.slice(this.sliceNum);
    console.log('this.$slots.default', this.$slots.default )
    return createElement(
      "div",
      {
        class: ["flex"],
      },
      [
        slice3,
        createElement("el-dropdown", [
          createElement(
            "el-button",
            {
              props: {
                size: "mini",
              },
            },
            [
              "更多菜单",
              createElement("i", {
                class: ["el-icon-arrow-down", "el-icon--right"],
              }),
            ]
          ),

          createElement(
            "el-dropdown-menu",
            {
              slot: "dropdown",
            },
            sliceMax3.map((node) => {
              return createElement("el-dropdown-item", [node]);
            })
          ),
        ]),
      ]
    );
  },
};
</script>

<style scoped>
/* .flex {
  display: flex;
  justify-content: space-between;
} */
</style>