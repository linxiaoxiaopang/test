//平铺操作
export default {
  methods: {
    //删除之前的组图层
    delLastGroupLayer() {
      const c = this.instance.canvas
      const curLayer = this.getActiveObject()
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
    baseTile(tileType) {
      const curLayer = this.getActiveObject()
      if (!curLayer) return
      const {
        type,
        groupHorizontal: horizontal = 0,
        groupVertical: vertical = 0
      } = curLayer
      const c = this.instance.canvas

      if (tileType === undefined) {
        this.delLastGroupLayer()
        this.instance.renderAll()
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
            o.left = o.left + hIndx * dirWidth - horizontal
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
        })
        pArr.push(colonObj)
      })

      temArr.map((item, indx) => {
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
              o.top = o.top + vIndx * dirHeight + vertical
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
          })
        )
      })

      temArr.map((item, indx) => {
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
          })
        )
      })

      temArr.map((item, indx) => {
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
          })
        )
      })
      Promise.all(pArr).then((res) => {
        const existGroup = this.existGroupById(`${curLayer.id}Group`)
        if (existGroup) {
          this.delLastGroupLayer()
        }
        const group = this.instance.createdGroup(res, {
          id: `${curLayer.id}Group`,
          angle: curLayer.angle,
          originX: 'center',
          originY: 'center'
        })
        const gPos = group.getCenterPoint()
        const cPos = group.item(0).getCenterPoint()
        console.log('cPos', cPos)
        console.log('curLayerX', curLayerX)
        console.log('curLayerY', curLayerY)
        console.log('(cPos.x + gPos.x)', cPos.x + gPos.x)
        console.log('(cPos.y + gPos.y)', cPos.y + gPos.y)
        group.setOptions({
          left: group.left + (curLayerX - (cPos.x + gPos.x)),
          top: group.top + (curLayerY - (cPos.y + gPos.y))
        })
        console.log('group', group)
        console.log('scaleX', group.scaleX)
        console.log('scaleY', group.scaleY)
        console.log('group.getCenterPoint()', group.getCenterPoint())
        // this.delInvalid(group, { scaleX, scaleY })

        const objects = c.getObjects()
        let curLayerIndx = objects.findIndex(({ id }) => id === curLayer.id)
        group.moveTo(curLayerIndx)
        // Object.assign(group, this.form)
        c.setActiveObject(curLayer)
        this.instance.renderAll()
        this.canvasModifiedHandler(true)
      })
    },

    existGroupById(id) {
      const objects = this.instance.canvas.getObjects()
      const fIndex = objects.findIndex((obj) => obj.id == id)
      if (fIndex >= 0) {
        return objects[fIndex]
      }
      return false
    },

    clone(curLayer, option, cb) {
      const c = this.instance.canvas
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

    layerIsIntersection(oLayer, { scaleX, scaleY }) {
      let { left: l2, top: t2, width: w2, height: h2 } = oLayer
      const { x, y } = oLayer.getCenterPoint()
      const hypotenuse = Math.sqrt(
        w2 * scaleX * w2 * scaleX + h2 * scaleY * h2 * scaleY
      )
      if (oLayer.group) {
        let { x: gX, y: gY } = oLayer.group.getCenterPoint()
        l2 = x + gX - hypotenuse / 2
        t2 = y + gY - hypotenuse / 2
      }

      console.log('hypotenuse', hypotenuse)
      console.log(' w2 * scaleX ', w2 * scaleX)
      console.log('h2 * scaleY', h2 * scaleY)
      console.log('l2', l2)
      console.log('t2', t2)

      const isIntersection = this.isIntersection({
        l: 0,
        t: 0,
        w: 700,
        h: 700,
        l2,
        t2,
        w2: hypotenuse,
        h2: hypotenuse
      })
      return isIntersection
    },
    delInvalid(group, { scaleX, scaleY }) {
      const delTmp = []
      for (let i = 0; i < group.size(); i++) {
        const layer = group.item(i)
        const isDel = !this.layerIsIntersection(layer, { scaleX, scaleY })
        if (isDel) {
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
      if (
        Math.abs(l2 + w2 - (w + l)) + Math.abs(l2 - l) < w + w2 &&
        Math.abs(t2 + h2 - (h + t)) + Math.abs(t2 - t) < h + h2
      ) {
        return true
      }
      return false
    }
  }
}
