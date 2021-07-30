import Sortable from 'sortablejs'

export default {
  data() {
    return {
      dragCurrentOrder: null,
      dragOrderProps: {
        key: 'id',
        orderKey: 'sort'
      }
    }
  },
  computed: {
    dragInitOrder({ dragList, dragOrderProps, getSortValue }) {
      // console.log(dragList)
      let tempObj = {}
      // 添加排序列表只能用push
      dragList.map(
        (
          {
            [dragOrderProps.key]: key,
            [dragOrderProps.orderKey]: sort
          },
          index
        ) => {
          tempObj[key] = getSortValue(sort, index)
        }
      )
      return tempObj
    }
  },
  watch: {
    dragInitOrder: {
      handler(n) {
        // console.log('dragInitOrder', n)
        // 排序值只在初始时赋值
        if (!this.dragCurrentOrder) this.dragCurrentOrder = this.reorder(n)
        let { dragCurrentOrder } = this
        let initKeys = Object.keys(n)
        let currentKeys = Object.keys(dragCurrentOrder)
        if (initKeys.length !== currentKeys.length) {
          initKeys.map(key => {
            if (!currentKeys.includes(key)) dragCurrentOrder[key] = n[key]
          })
          currentKeys.map(key => {
            if (!initKeys.includes(key)) delete dragCurrentOrder[key]
          })
          this.dragCurrentOrder = this.reorder(dragCurrentOrder)
        }
        // console.log(this.dragCurrentOrder)
      },
      immediate: true
    }
  },
  updated() {
    if (this.$refs.tabs) {
      let {dragOption} = this
      Sortable.create(dragOption.el, {
        ...dragOption,
        onMove: (evt, originalEvent) => {
          let { related: {classList} } = evt
          // console.log(evt, originalEvent)
          if (typeof dragOption.onMove === 'function') dragOption.onMove(evt, originalEvent)

          let filter = dragOption.filter.split('.')
          if (filter.some(item => classList.contains(item))) {
            return false
          }
        },
        onEnd: (evt) => {
          let { oldIndex, newIndex } = evt
          let oIndexes = {}
          // console.log(oldIndex, newIndex)
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
          
          let { dragCurrentOrder } = this
          for (const dragOrderKey in dragCurrentOrder) {
            let oldOrder = dragCurrentOrder[dragOrderKey]
            let newOrder = oIndexes[oldOrder]
            dragCurrentOrder[dragOrderKey] = newOrder || newOrder === 0 ? newOrder : oldOrder
          }
          
          /*console.log(
            oIndexes,
            this.dragList.map(({ size_name }) => size_name),
            this.dragCurrentOrder
          )*/
          if (typeof dragOption.onEnd === 'function') dragOption.onEnd(evt)
        }
      })
    }
  },
  methods: {
    getDiffSortable(list) {
      const { dragCurrentOrder, dragOrderProps } = this
      return list.filter(
        (
          {
            [dragOrderProps.key]: key,
            [dragOrderProps.orderKey]: sort
          }
        ) => {
          return dragCurrentOrder[key] !== sort
        }
      )
    },
    getSortValue(sort, index) {
      return sort || sort === 0 ? parseInt(sort) : index
    },
    reorder(dragCurrentOrder) {
      Object.entries(dragCurrentOrder)
        .reduce((prev, entry) => {
          if (prev[entry[1]] || prev[entry[1]] === 0) {
            prev.splice(entry[1] + 1, 0, entry[0])
          } else {
            prev[entry[1]] = entry[0]
          }
          return prev
        }, [])
        .filter(key => key || key === 0)
        .map((key, index) => dragCurrentOrder[key] = index)
      return dragCurrentOrder
    }
  }
}
