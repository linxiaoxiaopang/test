//平铺操作
export default {
  methods: {
    //删除之前的组图层
    delLastGroupLayer(curLayer, instance) {
      const c = (instance.canvas ||instance )
      if (!curLayer) return
      const objects = c.getObjects()
      const curLayerIndex = objects.findIndex(({ id }) => curLayer.id === id)
      const groupObj = objects[curLayerIndex - 1] || {}
      if (groupObj.type === 'group') {
        c.remove(groupObj)
        c.renderAll()
      }
    },

    //创建或编辑的组图层
    baseTile(tileType, curLayer, instance) {
      if (!curLayer) return
      const {
        type,
        groupHorizontal: horizontal = 0,
        groupVertical: vertical = 0
      } = curLayer
      const c = instance.canvas　|| instance

      if (tileType === undefined) {
        this.delLastGroupLayer(curLayer, instance)
        instance.renderAll()
        this.canvasModifiedHandler(true)
        return
      }

      let pArr = []
      //curLayer为空时，返回
      if (!curLayer) return
      const { width = 0, height = 0, scaleX = 1, scaleY = 1 } = curLayer
      const { x: curLayerX, y: curLayerY } = curLayer.getCenterPoint()
      const { ceil, floor } = Math
      const canvasWidth = c.width
      const canvasHeight = c.height
      const dirWidth = width * scaleX + horizontal
      const dirHeight = height * scaleY + vertical
      const hTotalNum = ceil(canvasWidth / dirWidth) + 1
      const vTotalNum = ceil(canvasHeight / dirHeight) + 1
      const totalNum = ceil(hTotalNum * vTotalNum)
      const temArr = new Array(totalNum).fill({})
      temArr.map((item, indx) => {
        const hIndx = indx % hTotalNum
        const vIndx = floor((indx / hTotalNum) % vTotalNum)
        const colonObj = this.clone(curLayer, {}, (o) => {
          o.angle = 0
          o.scaleX = scaleX
          o.scaleY = scaleY
          if (tileType === 2 && floor(indx / hTotalNum) % 2) {
            o.left = o.left + hIndx * dirWidth + horizontal
          } else {
            o.left = o.left + hIndx * dirWidth
          }

          if (
            tileType === 3 &&
            (indx - hTotalNum * floor(indx / hTotalNum)) % 2
          ) {
            o.top = o.top + vIndx * dirHeight + vertical
          } else {
            o.top = o.top + vIndx * dirHeight
          }
          if (tileType === 1) {
            if ((indx - hTotalNum * floor(indx / hTotalNum)) % 2) {
              o.flipX = true
            }

            if (floor(indx / hTotalNum) % 2) {
              o.flipY = true
            }
          }
        }, instance)
        pArr.push(colonObj)
      })
      console.log(2)
      temArr.map((item, indx) => {
        if (indx === 0) return
        const hIndx = indx % hTotalNum
        const vIndx = floor((indx / hTotalNum) % vTotalNum)
        pArr.push(
          this.clone(curLayer, {}, (o) => {
            o.angle = 0
            o.scaleX = scaleX
            o.scaleY = scaleY
            // o.left = o.left + -hIndx * dirWidth;
            if (tileType === 2 && floor(indx / hTotalNum) % 2) {
              o.left = o.left + -hIndx * dirWidth + horizontal
            } else {
              o.left = o.left + -hIndx * dirWidth
            }
            if (
              tileType === 3 &&
              (indx - hTotalNum * floor(indx / hTotalNum)) % 2
            ) {
              o.top = o.top + vIndx * dirHeight - vertical
            } else {
              o.top = o.top + vIndx * dirHeight
            }
            // o.top = o.top + vIndx * dirHeight;
            if (tileType === 1) {
              if ((indx - hTotalNum * floor(indx / hTotalNum)) % 2) {
                o.flipX = true
              }

              if (floor(indx / hTotalNum) % 2) {
                o.flipY = true
              }
            }
          }, instance)
        )
      })

      temArr.map((item, indx) => {
        if (indx === 0) return
        const hIndx = indx % hTotalNum
        const vIndx = floor((indx / hTotalNum) % vTotalNum)
        pArr.push(
          this.clone(curLayer, {}, (o) => {
            o.angle = 0
            o.scaleX = scaleX
            o.scaleY = scaleY
            // o.left = o.left + hIndx * dirWidth;
            if (tileType === 2 && floor(indx / hTotalNum) % 2) {
              o.left = o.left + hIndx * dirWidth - horizontal
            } else {
              o.left = o.left + hIndx * dirWidth
            }
            if (
              tileType === 3 &&
              (indx - hTotalNum * floor(indx / hTotalNum)) % 2
            ) {
              o.top = o.top + -vIndx * dirHeight + vertical
            } else {
              o.top = o.top + -vIndx * dirHeight
            }
            // o.top = o.top + -vIndx * dirHeight;
            if (tileType === 1) {
              if ((indx - hTotalNum * floor(indx / hTotalNum)) % 2) {
                o.flipX = true
              }

              if (floor(indx / hTotalNum) % 2) {
                o.flipY = true
              }
            }
          }, instance)
        )
      })

      temArr.map((item, indx) => {
        if (indx === 0) return
        const hIndx = indx % hTotalNum
        const vIndx = floor((indx / hTotalNum) % vTotalNum)
        pArr.push(
          this.clone(curLayer, {}, (o) => {
            o.angle = 0
            o.scaleX = scaleX
            o.scaleY = scaleY
            // o.left = o.left + -hIndx * dirWidth;
            if (tileType === 2 && floor(indx / hTotalNum) % 2) {
              o.left = o.left + -hIndx * dirWidth - horizontal
            } else {
              o.left = o.left + -hIndx * dirWidth
            }

            if (
              tileType === 3 &&
              (indx - hTotalNum * floor(indx / hTotalNum)) % 2
            ) {
              o.top = o.top + -vIndx * dirHeight - vertical
            } else {
              o.top = o.top + -vIndx * dirHeight
            }
            // o.top = o.top + -vIndx * dirHeight;
            if (tileType === 1) {
              if ((indx - hTotalNum * floor(indx / hTotalNum)) % 2) {
                o.flipX = true
              }

              if (floor(indx / hTotalNum) % 2) {
                o.flipY = true
              }
            }
          }, instance)
        )
      })
      Promise.all(pArr).then((res) => {
        const existGroup = this.existGroupById(`${curLayer.id}Group`, instance)
        if (existGroup) {
          this.delLastGroupLayer(curLayer, instance)
        }

        const group = new fabric.Group(res, {
          id: `${curLayer.id}Group`,
          angle: curLayer.angle,
          originX: 'center',
          originY: 'center'
        })

        const gPos = group.getCenterPoint()
        const cPos = group.item(0).getCenterPoint()
        console.log('group',group)
        console.log('gPos',gPos)

        group.setOptions({
          left: parseInt(group.left + (curLayerX - (cPos.x + gPos.x))),
          top: parseInt(group.top + (curLayerY - (cPos.y + gPos.y))),
          selectable: false
        })


        (instance.canvas || instance).add(group)
        instance.renderAll()

     
      })
    },

    existGroupById(id, instance) {
      const objects = (instance.canvas || instance).getObjects()
      const fIndex = objects.findIndex((obj) => obj.id == id)
      if (fIndex >= 0) {
        return objects[fIndex]
      }
      return false
    },

    clone(curLayer, option, cb, instance) {
      const c = (instance.canvas ||instance )
      return new Promise((reslove, reject) => {
        curLayer.clone((o) => {
          cb && cb(o)
          reslove(o)
        })
        // c.clone(
        //   curLayer,
        //   (o) => {
        //     console.log('cb', cb)
        //     cb && cb(o)
        //     reslove(o)
        //   },
        //   {}
        // )
      })
    },

    layerIsIntersection(oLayer, { scaleX, scaleY }, mGroup) {
      let { left: l2, top: t2, width: w2, height: h2 } = oLayer

      if (oLayer.group) {
        // let { x: gX, y: gY } = oLayer.group.getCenterPoint()
        // console.log('x + gX', x + gX)
        // console.log('y + gY', y + gY)

        // l2 = x + gX - hypotenuse / 2
        // t2 = y + gY - hypotenuse / 2
        // console.log('l2', l2)
        // console.log('t2', t2)

        const p = this.fastCalcRealPosByGgroupObj(oLayer.group, oLayer, mGroup)
        l2 = p.x - (w2 * scaleX) / 2
        t2 = p.y - (h2 * scaleY) / 2
      }

      // console.log('hypotenuse', hypotenuse)
      // console.log(' w2 * scaleX ', w2 * scaleX)
      // console.log('h2 * scaleY', h2 * scaleY)
      // console.log('l2', l2)
      // console.log('t2', t2)

      const isIntersection = this.isIntersection({
        l: 0,
        t: 0,
        w: 700,
        h: 700,
        l2,
        t2,
        w2,
        h2
      })
      return isIntersection
    },

    //计算组中的对象相对于画布的坐标
    fastCalcRealPosByGgroupObj(mGroup, gLayer) {
      const mObject = gLayer.calcTransformMatrix(true)
      fabric.util.qrDecompose(mObject)
      const mTotal = fabric.util.multiplyTransformMatrices(mGroup, mObject)
      const ce = new fabric.Point(0, 0)
      const p = fabric.util.transformPoint(ce, mTotal)
      return p
    },

    delInvalid(group, { scaleX, scaleY }) {
      const delTmp = []
      // const mGroup = group.calcTransformMatrix(true)
      // fabric.util.qrDecompose(mGroup)
      for (let i = 0; i < group.size(); i++) {
        const layer = group.item(i)
        const bool = !layer.isOnScreen()
        console.log('bool', bool)
        // const isDel = !this.layerIsIntersection(
        //   layer,
        //   { scaleX, scaleY },
        //   mGroup
        // )
        if (bool) {
          delTmp.push(layer)
        }
      }
      console.log('delTmp', delTmp)
      delTmp.map((o) => {
        group.remove(o)
      })
    },
    //判断图片和marker是否相交
    isIntersection({ l, l2, t, t2, w, w2, h, h2 }) {
      console.log(`l, l2, t, t2, w, w2, h, h2`, l, l2, t, t2, w, w2, h, h2)
      if (
        Math.abs(l2 + w2 - (w + l)) + Math.abs(l2 - l) < w + w2 &&
        Math.abs(t2 + h2 - (h + t)) + Math.abs(t2 - t) < h + h2
      ) {
        return true
      } else {
      }
      return false
    }
  }
}
