import Vue from 'vue'
import avue from '@/components/avue/index.js'
import colorTextBtn from '@/components/base/colorTextBtn.vue'
import uploadBtn from '@/components/base/uploadBtn.vue'


Vue.use(avue)
  .component('colorTextBtn', colorTextBtn)
  .component('uploadBtn', uploadBtn)