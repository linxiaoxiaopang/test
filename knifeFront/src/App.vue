<template>
  <div id="app">
    <transition :name="animationName" mode="out-in">
      <router-view />
    </transition>
    <Mission v-if="showMission" />
  </div>
</template>

<script>
import { MENUS_NAME } from '@/utils/constant'
import Mission from '@/components/mission'
import FONT_LIST from '@/utils/fontConfig'
export default {
  name: 'App',
  components: {
    Mission
  },
  created() {
    FONT_LIST.map(({ fontFamily, url }) => {faker
      this.loadFont(fontFamily, url)
    })
  },
  data() {
    return {
      animationName: 'fade-transform'
    }
  },
  computed: {
    key() {
      return this.$route.fullPath
    },
    showMission() {
      const hiddenArr = [MENUS_NAME]
      const { name } = this.$route
      if (!name) return true
      return !hiddenArr.includes(name)
    }
  },
  methods: {
    loadFont(name, url) {
      //name 字体的名称
      //url  字体链接
      let style = document.createElement('style')
      style.type = 'text/css'
      style.innerText =
        '@font-face {font-family:' + name + ';src:url(' + url + ')};font-display: swap'
      document.getElementsByTagName('head')[0].appendChild(style)
    }
  }
}
</script>
