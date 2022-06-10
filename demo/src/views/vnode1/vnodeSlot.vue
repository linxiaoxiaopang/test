<template>
  <div>
    <template v-for="(vnode, index) in vnodes">
      <Vnode v-bind="$attrs" :vnode="vnode" :key="index"></Vnode>
    </template>
  </div>
</template>

<script>
export default {
  components: {
    Vnode: {
      functional: true,
      render: function (createElement, context) {
        return createElement("div", context.props.vnode);
      },
    },
  },

  mounted() {
    this.bindParentUpdated();
  },

  computed: {
    vnodes({ $scopedSlots }) {
      const slotKeys = Object.keys($scopedSlots);
      return slotKeys.map((key) => $scopedSlots[key]());
    },
  },

  methods: {
    bindParentUpdated() {
      const updatedList = this.$parent.$options.updated;
      const func = () => {
        this._computedWatchers.vnodes.dirty = true;
        this.$forceUpdate();
      };
      if (updatedList) {
        updatedList.push(func);
      } else {
        this.$parent.$options.updated = [func];
      }
    },
  },
};
</script>

<style>
</style>