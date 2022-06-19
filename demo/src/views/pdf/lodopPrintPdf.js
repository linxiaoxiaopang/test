import Vue from 'vue'
import PrintBtn from './printBtn'
import merge from 'element-ui/src/utils/merge'

export default function lodopPrintPdf(option) {
  const ExtendPrintBtn = Vue.extend(PrintBtn)
  const vm = new ExtendPrintBtn()
  //合并option 相当于遍历添加vm的prop
  merge(vm, option)
  //js动态加载完成
  vm.printHandler()
}

Vue.prototype.$lodopPrintPdf = lodopPrintPdf