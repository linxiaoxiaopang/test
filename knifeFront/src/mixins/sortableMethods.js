import { isIntAndZero } from '@/utils'

export default {
  methods: {
    getNewSort({ oldIndex, newIndex }) {
      let oIndexes = {}
      if (oldIndex !== newIndex) {
        oIndexes[oldIndex] = newIndex
        if (newIndex > oldIndex) {
          for (let i = oldIndex + 1; i <= newIndex; i++) {
            oIndexes[i] = i - 1
          }
        } else {
          for (let i = newIndex; i < oldIndex; i++) {
            oIndexes[i] = i + 1
          }
        }
      }
      return oIndexes
    },
    setNewSortToList(dragList, newIndexes, newSortProp = 'sort', oldSortProp = 'oldSort') {
      dragList.forEach((item, index) => {
        // 若排序字段不为正数，则设为当前index
        if (!isIntAndZero(item[newSortProp])) this.$set(item, newSortProp, index)
        // 若old排序字段不为正数（未设置值），则设为排序字段值（放在排序字段设置默认值之后）
        if (!isIntAndZero(item[oldSortProp])) item[oldSortProp] = item[newSortProp]
        // 为排序字段设置排序后的值（放在排序字段设置默认值之后）
        if (isIntAndZero(newIndexes[item[newSortProp]])) item[newSortProp] = newIndexes[item[newSortProp]]
      })
      return dragList
    }
  }
}
