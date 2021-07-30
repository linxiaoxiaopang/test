<template>
  <a class="thunder-link" :href="href" @click="downloadByPath(paths)">
    <slot>下载</slot>
  </a>
</template>

<script>
export default {
  props: {
    href: {
      type: String,
      default: 'javascript:;'
    },
    paths: {
      type: Array,
      default() {
        return []
      }
    }
  },
  watch: {
    href() {
      this.initCallBack();
    },
  },
  methods: {
    initCallBack() {
      this.$on('hook:updated', this.$nextTick(() => {
        thunderLink();
      }))
    },
    downloadByPath(paths) {
      const alinks = [];
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const aLink = document.createElement("a");
        aLink.className = "thunder-link";
        aLink.setAttribute("href", path);
        document.body.append(aLink);
        alinks.push(aLink);
        setTimeout(() => {
          aLink.click();
        }, 50 * i + 1);
      }

      this.$nextTick(() => {
        thunderLink();

        this.$nextTick(() => {
          alinks.map((aLink, i) => {
            setTimeout(() => {
              document.body.removeChild(aLink);
            }, 50 * i + 1);
          });
        });
      });
    },
  }
};
</script>

<style lang="scss" scoped></style>