<template>
  <BatchOperation class="head-container" style="margin-top: 0">
    <AddCate :sup_this="sup_this" />
  </BatchOperation>
</template>

<script>
import AddCate from "./addCate";
import { commonEheaderMixin } from "@/mixins";

export default {
  mixins: [commonEheaderMixin],
  components: { AddCate },
  props: {
    selectedObj: Object,
  },
};
</script>

