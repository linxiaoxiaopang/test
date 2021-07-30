<template>
  <SelectList :menus="menus" v-bind="$attrs" v-on="$listeners" />
</template>

<script>
export default {
  props: {
    menus: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style>
</style>