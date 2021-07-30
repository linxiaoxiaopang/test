<template>
  <div class="anchor-point-tabs">
    <el-tabs v-model="activeName" @tab-click="handleTabClick">
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.prop"
        :name="tab.prop"
        :label="tab.label"
      ></el-tab-pane>
    </el-tabs>
    <div
      v-for="tab in tabs"
      :key="tab.prop"
      :ref="tab.prop"
      class="anchor-point-tab"
    >
      <div class="label">{{ tab.label }}</div>
      <div class="content">
        <slot :name="tab.prop"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabs: Array
  },
  data() {
    return {
      activeName: ''
    }
  },
  watch: {
    tabs: {
      handler(n) {
        if (Array.isArray(n) && n.length) this.activeName = n[0].prop
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    handleTabClick() {
      let { activeName, $refs } = this
      let { [activeName]: currentTab } = $refs
      currentTab = Array.isArray(currentTab) ? currentTab : [currentTab]
      currentTab[0].scrollIntoView()
    }
  }
}
</script>

<style lang="scss">
.anchor-point-tabs {
  width: 100%;
  a {
    display: block;
  }
  .anchor-point-tab {
    .label {
      padding: 15px 0;
      border-bottom: 1px dashed #DCDEE0;
    }
    .content {
      padding: 20px 0 40px;
    }
  }
}
</style>