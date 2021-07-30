import store from '@/store'
import { getThumbnail, HasPermission } from '@/utils'
export default {
  install: (Vue) => {
    Vue.directive('el-drag-dialog', {
      bind(el, binding, vnode) {
        if (binding.value === false) return
        const dialogHeaderEl = el.querySelector('.el-dialog__header')
        const dragDom = el.querySelector('.el-dialog')
        dialogHeaderEl.style.cssText += ';cursor:move;'
        dragDom.style.cssText += ';top:0px;'

        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const getStyle = (function () {
          if (window.document.currentStyle) {
            return (dom, attr) => dom.currentStyle[attr]
          } else {
            return (dom, attr) => getComputedStyle(dom, false)[attr]
          }
        })()

        dialogHeaderEl.onmousedown = (e) => {
          // 鼠标按下，计算当前元素距离可视区的距离
          const disX = e.clientX - dialogHeaderEl.offsetLeft
          const disY = e.clientY - dialogHeaderEl.offsetTop

          const dragDomWidth = dragDom.offsetWidth
          const dragDomHeight = dragDom.offsetHeight

          const screenWidth = document.body.clientWidth
          const screenHeight = document.body.clientHeight

          const minDragDomLeft = dragDom.offsetLeft
          const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

          const minDragDomTop = dragDom.offsetTop
          const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomHeight

          // 获取到的值带px 正则匹配替换
          let styL = getStyle(dragDom, 'left')
          let styT = getStyle(dragDom, 'top')

          if (styL.includes('%')) {
            // eslint-disable-next-line
            styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100)

            // eslint-disable-next-line
            styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100)
          } else {
            styL = +styL.replace(/\px/g, '')
            styT = +styT.replace(/\px/g, '')
          }

          document.onmousemove = function (e) {
            // 通过事件委托，计算移动的距离
            let left = e.clientX - disX
            let top = e.clientY - disY

            // 边界处理
            if (-left > minDragDomLeft) {
              left = -minDragDomLeft
            } else if (left > maxDragDomLeft) {
              left = maxDragDomLeft
            }

            if (-top > minDragDomTop) {
              top = -minDragDomTop
            } else if (top > maxDragDomTop) {
              top = maxDragDomTop
            }

            // 移动当前元素
            dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`

            // emit onDrag event
            vnode.child.$emit('dragDialog')
          }

          document.onmouseup = function (e) {
            document.onmousemove = null
            document.onmouseup = null
          }
        }
      }
    })
    Vue.directive('p', {
      inserted(el, binding) {
        const { value = [] } = binding
        const isSuper = store.getters.is_super
        if (isSuper) {
          return isSuper
        }
        if (value && value instanceof Array) {
          const hasPermission = HasPermission(value)

          if (!hasPermission) {
            return el.parentNode.removeChild(el)
          }
          return true
        } else {
          console.error('need roles! Like v-permission="[\'admin\',\'editor\']"')
          return el.parentNode.removeChild(el)
        }
      }
    })

    Vue.directive('formatUrl', {
      inserted(el, binding) {
        const { file } = binding.value
        let url = file.url || file.path
        if (url) {
          if (!/^http/.test(url)) {
            // eslint-disable-next-line
            return (el.src = `${serverRootPath}${url}`)
          }
          return (el.src = url)
        }
        getThumbnail(file).then((res) => {
          const { url } = res
          el.src = url
        })
      }
    })
  }
}
