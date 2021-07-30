/* eslint-disable */
<template>
  <div>
    <canvas :id="id" :width="width" :height="height"></canvas>
  </div>
</template>

<script type="text/ecmascript-6">
import Utils from "./utils";
import {DESIGN_AREA_W, DESIGN_AREA_H} from '@/utils/constant'
const dot = require("@/assets/images/ic_stretch.png");
const rotate = require("@/assets/images/ic_rotate.png");
const shape = require("@/assets/images/ic_shape.png");
const hShape = require("@/assets/images/ic_h_shape.png");


export default {
  name: "VueFabric",
  props: {
    id: {
      type: String,
      required: false,
      default: "fabricCanvas",
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    markerWitdth: {
      type: Number,
      required: true,
    },
    markerHeight: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      canvas: null,
      currentObj: null,
    };
  },
  created() {},
  mounted() {
    this.canvas = new fabric.Canvas(this.id, { preserveObjectStacking: true });
    let canvas = this.canvas;
    // const renderAll = canvas.renderAll;
    // 重写canvas.renderAll 方法，每次调用renderAll方法$emit当前canvas图层信息对象
    let $this = this;
    // canvas.renderAll = function () {
    //   $this.$emit("renderAllHandler", this.getObjects());
    //   renderAll.call(canvas);
    // };

    // const renderTop = canvas.renderTop;
    // canvas.renderTop = function () {
    //   renderTop.call(canvas);
    //   $this.$emit("renderAllHandler", this.getObjects());
    // };
    const degreesToRadians = fabric.util.degreesToRadians;
    //重写_setupCurrentTransform
    fabric.util.object.extend(fabric.Canvas.prototype, {
      _setupCurrentTransform: function (e, target) {
        if (!target) {
          return;
        }

        var pointer = this.getPointer(e),
          corner = target._findTargetCorner(this.getPointer(e, true)),
          action = this._getActionFromCorner(target, corner, e),
          origin = this._getOriginFromCorner(target, corner);

        if (typeof action === "function") {
          const name = action.call(this, e, target);
          // as of fabric 1.7.11 object cache will try to slice the action to check for scale so we need to convert this to a string
          action = name == "rotate" ? name : "void";
        }

        this._currentTransform = {
          target: target,
          action: action,
          corner: corner,
          scaleX: target.scaleX,
          scaleY: target.scaleY,
          skewX: target.skewX,
          skewY: target.skewY,
          offsetX: pointer.x - target.left,
          offsetY: pointer.y - target.top,
          originX: origin.x,
          originY: origin.y,
          ex: pointer.x,
          ey: pointer.y,
          lastX: pointer.x,
          lastY: pointer.y,
          left: target.left,
          top: target.top,
          theta: degreesToRadians(target.angle),
          width: target.width * target.scaleX,
          mouseXSign: 1,
          mouseYSign: 1,
          shiftKey: e.shiftKey,
          altKey: e[this.centeredKey],
        };

        this._currentTransform.original = {
          left: target.left,
          top: target.top,
          scaleX: target.scaleX,
          scaleY: target.scaleY,
          skewX: target.skewX,
          skewY: target.skewY,
          originX: origin.x,
          originY: origin.y,
        };

        if (action === "remove") {
          this._removeAction(e, target);
        }

        if (action === "moveUp") {
          this._moveLayerUpAction(e, target);
        }

        if (action === "moveDown") {
          this._moveLayerDownAction(e, target);
        }

        if (typeof action === "object") {
          if (Object.keys(action)[0] === "rotateByDegrees") {
            this._rotateByDegrees(e, target, action.rotateByDegrees);
          }
        }

        this._resetCurrentTransform();
      },
    });
    canvas.customiseControls({
      tl: {
        cursor: "pointer",
      },
      tr: {
        cursor: "pointer",
      },
      bl: {
        cursor: "pointer",
      },
      br: {
        cursor: "pointer",
      },
      mb: {
        cursor: "pointer",
      },
      ml: {
        cursor: "pointer",
      },
      mr: {
        cursor: "pointer",
      },
      mt: {
        cursor: "pointer",
      },
      // only is hasRotatingPoint is not set to false
      mtr: {
        action: (() => {
          const that = this;
          const canvas = this.canvas;
          return function () {
            const activeObj = canvas.getActiveObject();
            const { width, height, scaleX, scaleY, angle } = activeObj;
            const { x: left, y: top } = activeObj.getCenterPoint();
            that.createCircle({
              top: top,
              left: left,
              color: "#3841DB",
              originX: "center",
              originY: "center",
              radius: Math.max(width * scaleX * 0.5, height * scaleY * 0.5),
            });
            that.createTextbox(angle.toFixed(2) + "°", {
              top: top,
              left: left,
              textBackgroundColor: "#3841DB",
              originX: "center",
              originY: "center",
              fontSize: 20,
              fill: "#fff",
              textAlign: 'center',
              editable: false,
            });
            return "rotate";
          };
        })(),
      },
    });
    this.setCornerIcons({});
    // canvas.add(new fabric.Circle({ radius: 30, fill: '#f55', top: 100, left: 100 }));
    canvas.backgroundColor = "transparent";

    // canvas.renderAll();
    // this.canvas.push(canvas);
    let that = this;
    this.canvas.controlsAboveOverlay = true;
    this.canvas.skipOffscreen = true;
    // this.drawControls();
    this.canvas.on("selection:created", function (options) {
      that.$emit("selection:created", options);
    });
    this.canvas.on("mouse:down", function (options) {
      that.$emit("mouse:down", options);
    });
    this.canvas.on("mouse:up", function (options) {
      that.$emit("mouse:up", options);
    });
    this.canvas.on("mouse:move", function (options) {
      that.$emit("mouse:move", options);
    });
    this.canvas.on("mouse:dblclick", function (options) {
      that.$emit("mouse:dblclick", options);
    });
    this.canvas.on("mouse:over", function (options) {
      that.$emit("mouse:over", options);
    });
    this.canvas.on("mouse:out", function (options) {
      that.$emit("mouse:out", options);
    });
    this.canvas.on("object:added", function (options) {
      that.$emit("object:added", options);
    });
    this.canvas.on("object:removed", function (options) {
      that.$emit("object:removed", options);
    });
    this.canvas.on("object:modified", function (options) {
      that.$emit("object:modified", options);
    });
    this.canvas.on("object:rotating", function (options) {
      that.$emit("object:rotating", options);
    });
    this.canvas.on("object:scaling", function (options) {
      that.$emit("object:scaling", options);
    });
    this.canvas.on("object:moving", function (options) {
      that.$emit("object:moving", options);
    });
    this.canvas.on("selection:updated", function (options) {
      that.$emit("selection:updated", options);
    });
    this.canvas.on("selection:cleared", function (options) {
      that.$emit("selection:cleared", options);
    });
    this.canvas.on("before:selection:cleared", function (options) {
      that.$emit("before:selection:cleared", options);
    });

    this.canvas.on("after:render", function (options) {
      that.$emit("after:render", this.getObjects());
      // that.$emit("renderAllHandler", this.getObjects())
    });
  },
  methods: {
    setHeight(value, options) {
      options = options || {};
      this.canvas.setHeight(value, options);
    },
    setWidth(value, options) {
      options = options || {};
      this.canvas.setWidth(value, options);
    },
    setOverlayImage(url, options) {
      options = options || {};
      this.canvas.setOverlayImage(
        url,
        this.canvas.renderAll.bind(this.canvas),
        options
      );
    },
    clone(obj, cb, option) {
      option = option || {};
      obj.clone(cb, Option);
    },
    add(obj) {
      this.canvas.add(obj);
    },
    createdGroup(groupArr, options) {
      options = options || {};
      var group = new fabric.Group(groupArr);
      group.selectable = false;
      group.setOptions(options);
      this.canvas.add(group);
      return group;
      // this.canvas.renderAll();
    },
    //水平居中
    centerH(obj) {
      obj.centerH();
    },
    //竖直居中
    centerV(obj) {
      obj.centerV();
    },
    flipX(obj) {
      obj.toggle("flipX");
    },
    flipY(obj) {
      obj.toggle("flipY");
    },
    rotate(obj, deg) {
      obj.rotate((obj.angle += deg));
    },
    scaleToWidth(obj, width) {
      obj.scaleToWidth(width);
    },
    scaleToHeight(obj, height) {
      obj.scaleToHeight(height);
    },
    //向上一层
    bringForward(obj) {
      obj.bringForward(true);
    },
    remove(obj) {
      var nextGroup = this.isNextExistGroup(obj);
      if (nextGroup.type === "group") {
        this.canvas.remove(nextGroup);
      }
      this.canvas.remove(obj);
    },
    //判断是否存在group
    isLastExistGroup(cuyLayer) {
      var objects = this.canvas.getObjects();
      var cuyLayerIndex = objects.findIndex(function (item) {
        return item.id === cuyLayer.id;
      });
      return objects[Math.max(-1, ++cuyLayerIndex)] || {};
    },
    isNextExistGroup(cuyLayer) {
      var objects = this.canvas.getObjects();
      var cuyLayerIndex = objects.findIndex(function (item) {
        return item.id === cuyLayer.id;
      });
      return objects[Math.max(-1, --cuyLayerIndex)] || {};
    },

    //创建图层时初始化显示控制器
    renderControls(obj) {
      // obj._renderControls(this.canvas.getContext('2d'))
      this.canvas.setActiveObject(obj);
    },
    discardActive() {
      this.canvas.discardActiveObject();
      // this.canvas.discardActiveGroup();
      this.canvas.renderAll();
    },
    getActiveObject() {
      return this.canvas.getActiveObject();
    },

    setCornerIcons({
      size = 20,
      borderColor = "#ffba00",
      cornerBackgroundColor = "transparent",
      cornerShape = "rect",
      tl = dot,
      tr = dot,
      bl = dot,
      br = dot,
      mt = hShape,
      mb = hShape,
      ml = shape,
      mr = shape,
      mtr = rotate,
    }) {
      // basic settings
      let that = this;
      fabric.Object.prototype.customiseCornerIcons(
        {
          settings: {
            borderColor: borderColor,
            cornerSize: size,
            cornerShape: cornerShape, // 'rect', 'circle'
            cornerBackgroundColor: cornerBackgroundColor,
          },
          tl: {
            icon: tl,
          },
          tr: {
            icon: tr,
          },
          bl: {
            icon: bl,
          },
          br: {
            icon: br,
          },
          mt: {
            icon: mt,
          },
          mb: {
            icon: mb,
          },
          ml: {
            icon: ml,
          },
          mr: {
            icon: mr,
          },
          // only is hasRotatingPoint is not set to false
          mtr: {
            icon: mtr,
          },
        },
        function () {
          that.canvas.renderAll();
        }
      );
    },
    drawDottedline(options) {
      options = Object.assign(
        {
          x: 0,
          y: 0,
          x1: 10,
          y1: 10,
          color: "#B2B2B2",
          drawWidth: 2,
          offset: 6,
          empty: 3,
        },
        options
      );
      let canvasObject = new fabric.Line(
        [options.x, options.y, options.x1, options.y1],
        {
          ...options,
          strokeDashArray: [options.offset, options.empty],
          stroke: options.color,
          strokeWidth: options.drawWidth,
        }
      );
      this.canvas.add(canvasObject);
      this.canvas.renderAll();
    },
    drawArrowLine(options) {
      options = Object.assign(
        {
          x: 0,
          y: 0,
          x1: 0,
          y1: 0,
          color: "#B2B2B2",
          drawWidth: 2,
          fillColor: "rgba(255,255,255,0)",
          theta: 35,
          headlen: 35,
        },
        options
      );
      let canvasObject = new fabric.Path(
        this.drawArrowBase(
          options.x,
          options.y,
          options.x1,
          options.y1,
          options.theta,
          options.headlen
        ),
        {
          ...options,
          stroke: options.color,
          fill: options.fillColor,
          strokeWidth: options.drawWidth,
        }
      );
      this.canvas.add(canvasObject);
      this.canvas.renderAll();
    },
    drawArrowBase(fromX, fromY, toX, toY, theta, headlen) {
      theta = typeof theta !== "undefined" ? theta : 30;
      headlen = typeof theta !== "undefined" ? headlen : 10;
      // 计算各角度和对应的P2,P3坐标
      var angle = (Math.atan2(fromY - toY, fromX - toX) * 180) / Math.PI,
        angle1 = ((angle + theta) * Math.PI) / 180,
        angle2 = ((angle - theta) * Math.PI) / 180,
        topX = headlen * Math.cos(angle1),
        topY = headlen * Math.sin(angle1),
        botX = headlen * Math.cos(angle2),
        botY = headlen * Math.sin(angle2);
      var arrowX = fromX - topX,
        arrowY = fromY - topY;
      var path = " M " + fromX + " " + fromY;
      path += " L " + toX + " " + toY;
      arrowX = toX + topX;
      arrowY = toY + topY;
      path += " M " + arrowX + " " + arrowY;
      path += " L " + toX + " " + toY;
      arrowX = toX + botX;
      arrowY = toY + botY;
      path += " L " + arrowX + " " + arrowY;
      return path;
    },
    freeDrawConfig(options) {
      options = Object.assign({ color: "#b2b2b2", drawWidth: 2 }, options);

      this.canvas.isDrawingMode = options.isDrawingMode;
      this.canvas.freeDrawingBrush.color = options.color; // 设置自由绘颜色
      this.canvas.freeDrawingBrush.width = options.drawWidth;
      this.canvas.renderAll();
    },
    eraseDrawConfig(options) {
      options = Object.assign({ color: "white", drawWidth: 2 }, options);

      this.canvas.freeDrawingBrush.color = options.color; // 设置自由绘颜色
      this.canvas.freeDrawingBrush.width = options.drawWidth;
      this.canvas.renderAll();
    },
    removeCurrentObj() {
      let obj = this.canvas.getActiveObject();
      // console.log(obj);
      this.canvas.remove(obj);
      this.canvas.renderAll();
    },

    getEditObj() {
      let obj = this.canvas.getActiveObject();
      this.removeCurrentObj();
      return obj;
    },
    setEditObj(obj) {
      this.canvas.add(obj);
      this.canvas.renderAll();
    },
    setRotate(deg = 36) {
      let obj = this.canvas.getActiveObject();
      let angle = obj.angle;
      obj.rotate(angle + deg);
      this.canvas.renderAll();
    },

    deactivateAll() {
      // this.canvas.deactivateAll().renderAll();
    },
    deactivateOne(obj) {
      var activeGroup = this.canvas.getActiveGroup();
      activeGroup.removeWithUpdate(obj);
      this.canvas.renderAll();
    },
    setSelection(flag) {
      this.canvas.selection = flag;
      this.canvas.renderAll();
    },
    moveTo() {
      let obj = this.canvas.getActiveObject();
      this.canvas.sendBackwards(obj, true);
      this.canvas.discardActiveObject();
      // this.canvas.discardActiveGroup();
    },
    createRect(options) {
      options = Object.assign(
        {
          width: 0,
          height: 0,
          fillColor: "rgba(255, 255, 255, 0)",
          left: 50,
          top: 50,
        },
        options
      );
      let rect = new fabric.Rect({
        ...options,
        fill: options.fillColor, // 填充的颜色
      });
      this.canvas.add(rect);
      this.canvas.renderAll();
    },
    createCircle(options) {
      options = Object.assign(
        {
          left: 0,
          top: 0,
          radius: 30,
          fillColor: "rgba(255, 255, 255, 0)",
          color: "#B2B2B2",
          drawWidth: 2,
        },
        options
      );
      let defaultOption = {
        ...options,
        fill: options.fillColor,
        strokeWidth: options.drawWidth,
        stroke: options.color,
      };
      let Circle = new fabric.Circle(defaultOption);
      this.canvas.add(Circle);
      this.canvas.renderAll();
    },
    createTriangle(options) {
      options = Object.assign(
        {
          x: 0,
          y: 0,
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 0,
          left: 100,
          top: 100,
          color: "#B2B2B2",
          drawWidth: 2,
          fillColor: "rgba(255, 255, 255, 0)",
          id: "triangle",
        },
        options
      );
      var path =
        "M " +
        options.x +
        " " +
        options.y +
        " L " +
        options.x1 +
        " " +
        options.y1 +
        " L " +
        options.x2 +
        " " +
        options.y2 +
        " z";
      let canvasObject = new fabric.Path(path, {
        ...options,
        stroke: options.color,
        strokeWidth: options.drawWidth,
        fill: options.fillColor,
      });
      this.canvas.add(canvasObject);
      this.canvas.renderAll();
    },
    createEqualTriangle(options) {
      options = Object.assign(
        {
          left: 100,
          top: 100,
          width: 50,
          height: 80,
          fillColor: "rgba(255, 255, 255, 0)",
          color: "#B2B2B2",
          drawWidth: 2,
        },
        options
      );
      // console.log(defaultOption);
      let triangle = new fabric.Triangle({
        ...options,
        fill: options.fillColor,
        strokeWidth: options.drawWidth,
        stroke: options.color,
      });
      this.setContronVisibility(triangle);
      this.canvas.add(triangle);
      this.canvas.renderAll();
    },
    createLine(options) {
      options = Object.assign(
        {
          x: 0,
          y: 0,
          x1: 10,
          y1: 10,
          fillColor: "rgba(255, 255, 255, 0)",
          strokeColor: "#B0B0B0",
        },
        options
      );
      let line = new fabric.Line(
        [options.x, options.y, options.x1, options.y1],
        {
          ...options,
          fill: options.fillColor,
          stroke: options.strokeColor,
        }
      );
      this.canvas.add(line);
      this.canvas.renderAll();
    },
    createEllipse(options) {
      options = Object.assign(
        {
          rx: 100,
          ry: 200,
          fillColor: "rgba(255, 255, 255, 0)",
          angle: 90,
          strokeColor: "#B0B0B0",
          strokeWidth: 3,
          left: 50,
          top: 50,
        },
        options
      );
      var ellipse = new fabric.Ellipse({
        ...options,
        fill: options.fillColor,
        stroke: options.strokeColor,
      });
      this.canvas.add(ellipse);
      this.canvas.renderAll();
    },
    createText(text, options) {
      options = Object.assign({ left: 100, top: 100 }, options);
      var canvasObj = new fabric.Text(text, { ...options });
      this.canvas.add(canvasObj);
      this.canvas.renderAll();
    },
    createItext(text, options) {
      options = Object.assign({ left: 0, top: 0, fill: "#000" }, options, {
        editable: false,
      });
      let IText = new fabric.IText(text, options);
      this.canvas.add(IText);
      this.canvas.setActiveObject(IText);
      this.canvas.renderAll();
    },
    createTextbox(text, options) {
      // _fontSizeMult: 5,
      options.fillColor = options.fillColor ? options.fillColor : options.fill;
      options = Object.assign(
        {
          fontSize: 14,
          fillColor: "#000000",
          registeObjectEvent: false,
          width: 50,
          left: 100,
          top: 100,
        },
        options
      );

      var canvasObj = new fabric.Textbox(text, {
        ...options,
        fill: options.fillColor,
      });
      this.canvas.add(canvasObj);
      if (options.registeObjectEvent) {
        Utils.registeObjectEvent(this, canvasObj);
      }
      this.canvas.renderAll();
    },
    createImageByImg(img, options) {
      options = options || {};
      let canvas = this.canvas;
      let that = this;
      // let maxWidth = that.width;
      let width = 0;
      let height = 0;
      width = img.width;
      height = img.height;
      // if (img.width > img.height) {
      //   if (img.width > maxWidth) {
      //     width = maxWidth;
      //     height = (img.height / img.width) * width;
      //   } else {
      //     width = img.width;
      //     height = img.height;
      //   }
      // } else {
      //   if (img.height > maxWidth) {
      //     height = maxWidth;
      //     width = (img.width / img.height) * height;
      //   } else {
      //     width = img.width;
      //     height = img.height;
      //   }
      // }
      if (options && options.width) {
        width = options.width;
      }
      if (options && options.height) {
        height = options.height;
      }
      let leftP = that.width / 2;
      let topP = that.height / 2;
      if ((options && options.left) || (options && options.left == 0)) {
        leftP = options.left + width / 2;
      }
      if ((options && options.top) || (options && options.top == 0)) {
        topP = options.top + height / 2;
      }
      let imgOptions = Object.assign(options, {
        id: options && options.id ? options.id : "image",
        left: leftP,
        top: topP,
        scaleX: width / img.width,
        scaleY: height / img.height,
        originX: "center",
        originY: "center",
        cornerStrokeColor: "blue",
      });
      delete imgOptions.width;
      delete imgOptions.height;
      var canvasImage = new fabric.Image(img, imgOptions);

      canvasImage.hasControls = true;
      canvasImage.hasBorders = true;

      canvas.add(canvasImage); // 把图片添加到画布上
      if (options && options.registeObjectEvent) {
        Utils.registeObjectEvent(that, canvasImage);
      }
      canvas.renderAll.bind(canvas);
    },
    createImage(url, options) {
      options = options || {};
      //解决跨域问题
      options.crossOrigin = "anonymous";
      let canvas = this.canvas;
      let that = this;
      const [oRand,oWidth, oHeight, oId] = options.id.split('@')

      console.log('原图宽度', oWidth)
      console.log('原图高度', oHeight)

      fabric.Image.fromURL(url, function (img) {
        const { max, min } = Math;
        // const {width: canvasWidth,height: canvasHeight} = canvas;
        const knifeMarkerSize = max(that.markerWitdth, that.markerHeight);

        console.log('膜层宽度', that.markerWitdth)
        console.log('膜层高度', that.markerHeight)

        if(that.markerWitdth >= that.markerHeight) {
          console.log('当前画布宽度',  DESIGN_AREA_W)
          console.log('当前画布高度',  DESIGN_AREA_H *  that.markerHeight / that.markerWitdth)
        } else {
           console.log('当前画布宽度',  DESIGN_AREA_W *  that.markerWitdth / that.markerHeight )
          console.log('当前画布高度',  DESIGN_AREA_H )
        }


        const picWdidth = oWidth * (DESIGN_AREA_W / knifeMarkerSize);
        const picHeight = oHeight * (DESIGN_AREA_H / knifeMarkerSize);
        // const picRatio =
        //   Math.min(picWdidth, picHeight) / Math.max(picWdidth, picHeight);
        // const compareWidth = picWdidth > picHeight;
        // let width = 0;
        // let height = 0;
        // if (compareWidth) {
        //   width = Math.min(canvasWidth, picWdidth);
        //   height = width * picRatio;
        // } else {
        //   height = Math.min(canvasHeight, picHeight);
        //   width = height * picRatio;
        // }
        const width = picWdidth;
        const height = picHeight;

        if (options && options.width) {
          width = options.width;
        }
        if (options && options.height) {
          height = options.height;
        }
        let leftP = that.canvas.getWidth() / 2;
        let topP = that.canvas.getHeight() / 2;
        if ((options && options.left) || (options && options.left == 0)) {
          leftP = options.left + width / 2;
        }
        if ((options && options.top) || (options && options.top == 0)) {
          topP = options.top + height / 2;
        }
        let imgOptions = Object.assign(options, {
          // ...options,
          id: options && options.id ? options.id : "image",
          left: leftP,
          top: topP,
          // width,
          // height,
          scaleX: width / img.width,
          scaleY: height / img.height,
          originX: "center",
          originY: "center",
          cornerStrokeColor: "blue",
        });
        img.set(imgOptions);

        console.log('画布实际图片宽度', oWidth*imgOptions.scaleX)
        console.log('画布实际图片高度', oHeight*imgOptions.scaleY)

        img.hasControls = true;
        img.hasBorders = true;
        canvas.add(img); // 把图片添加到画布上
        if (options && options.registeObjectEvent) {
          Utils.registeObjectEvent(that, img);
        }
        canvas.setActiveObject(img);
        canvas.renderAll.bind(canvas);
      });
    },
    toJSON() {
      let json = this.canvas.toJSON();
      return json;
    },
    toDataUrl() {
      let canvas = this.canvas;
      let dataURL = canvas.toDataURL({
        format: "png",
        quality: 1,
      });
      return dataURL;
    },
    loadFromJSON(json, cb) {
      let canvas = this.canvas;
      canvas.loadFromJSON(
        json,
        canvas.renderAll.bind(canvas),
        function (o, object) {
          // `o` = json object
          // `object` = fabric.Object instance
          // ... do some stuff ...
          cb(o);
          object.setControlsVisibility({
            bl: true,
            br: true,
            mb: false,
            ml: true,
            mr: true,
            mt: false,
            mtr: true,
            tl: true,
            tr: true,
          });
          object.setOptions({
            editable: false,
          });
          canvas.discardActiveObject();
        }
      );
    },
    clear() {
      this.canvas.clear();
    },
    getObjects() {
      return this.canvas.getObjects();
    },
    renderAll() {
      this.canvas.renderAll(this.canvas);
    },
    renderTop() {
      this.canvas.renderTop();
    },
    setBackgroundColor(color) {
      let canvas = this.canvas;
      this.canvas.setBackgroundColor(color, canvas.renderAll.bind(canvas));
    },
    setBackgroundImage(options) {
      let canvas = this.canvas;
      let opt = {
        opacity: 1,
        left: 0,
        top: 0,
        angle: 0,
        crossOrigin: null,
        originX: "left",
        originY: "top",
        scaleX: 1,
        scaleY: 1,
      };
      // console.log(options);
      if (Object.prototype.toString.call(options) == "[object String]") {
        opt.imgUrl = options;
      } else {
        opt = Object.assign(opt, options);
      }

      // canvas.setBackgroundImage(opt.imgUrl, canvas.renderAll.bind(canvas), {
      //   opacity: opt.opacity,
      //   angle: opt.angle,
      //   left: opt.left,
      //   top: opt.top,
      //   originX: 'left',
      //   originY: 'top',
      //   crossOrigin: opt.crossOrigin,
      //   ...opt
      // });

      fabric.Image.fromURL(opt.imgUrl, function (img) {
        img.set({
          width: opt.width ? opt.width : canvas.width,
          height: opt.height ? opt.height : canvas.height,
          originX: "left",
          originY: "top",
          scaleX: opt.scaleX,
          scaleY: opt.scaleY,
        });
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          ...opt,
        });
      });
    },
    toSvg() {
      return this.canvas.toSVG();
    },
    drawControls() {
      let canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d");
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.ellipse(100, 100, 50, 75, (45 * Math.PI) / 180, 0, 2 * Math.PI); // 倾斜45°角
      ctx.stroke();
      ctx.setLineDash([5]);
      ctx.moveTo(0, 200);
      ctx.lineTo(200, 0);
      ctx.stroke();
      this.canvas.drawControls(ctx);
      // this.canvas.controlsAboveOverlay=true;
    },
    setContronVisibility(obj) {
      obj.setControlsVisibility({
        bl: true,
        br: true,
        mb: false,
        ml: true,
        mr: true,
        mt: false,
        mtr: true,
        tl: true,
        tr: true,
      });
    },
    // 设置mirror
    toggleMirror(options) {
      options = options || {};
      options = Object.assign({ flip: "X" }, options);
      let img = this.canvas.getActiveObject();
      // if (img && img.type == 'image') {
      if (options.flip === "X") {
        img.toggle("flipX");
      } else {
        img.toggle("flipY");
      }
      this.renderAll();
      // }
    },
    // // 设置层级
    // toNextLayer(selectedObj) {
    //   let obj = selectedObj || this.canvas.getActiveObject();
    //   var nextGroup = this.isNextExistGroup(selectedObj);
    //   var secondNextGroup = this.isNextExistGroup(nextGroup);
    //   var thirdNextGroup = this.isNextExistGroup(secondNextGroup);
    //   var objects = this.canvas.getObjects();
    //   var selectedObjIndex = objects.findIndex(function (item) {
    //     return item.id === selectedObj.id;
    //   });

    //   if (!obj) {
    //     return;
    //   }
    //   if (nextGroup.type === "group") {
    //     nextGroup.sendBackwards(true);
    //   }
    //   if (secondNextGroup.type === "group") {
    //     obj.sendBackwards(true);
    //   }
    //   if (nextGroup.type === "group" && thirdNextGroup.type === "group") {
    //     nextGroup.sendBackwards(true);
    //     obj.sendBackwards(true);
    //   }
    //   obj.sendBackwards(true);
    //   this.renderTop();
    //   // this.canvas.setActiveObject(obj);
    // },
   getMoveIndexById (id) {
      const objects = this.canvas.getObjects()
      const tmpObj = {}
      objects.map(({type, id, groupType}, index) => {
       if(tmpObj[id]) {
         tmpObj[id] = {
           type,
            id,
            index,
         }
       }

       if(groupType !== undefined) {
         obj.groupType = groupType
       }
       return obj
      })
      if(obj[id].groupType !== undefined) {
        const {index} = obj[id]
        return {
          group: index - 1,
        }
      }
    },

    getNextMoveIndex(id) {
      const objects = this.canvas.getObjects()
      const curIndex = objects.findIndex(o => o.id === id)
      if(curIndex === -1) return ({})
      const curLayer = objects[curIndex]
      if(curIndex === 0) return ({})
      if(curLayer.groupType !== undefined) {
        const firstLayer = objects[curIndex - 2]
        const existGroup = firstLayer.groupType !== undefined
          return {
            groupMoveIndex: existGroup ? curIndex - 3 : curIndex - 2,
            layerMoveIndex: existGroup ? curIndex - 3 : curIndex - 2,
            group: objects[curIndex - 1]
          }
      }
      const firstLayer = objects[curIndex - 1]
       return {
            layerMoveIndex: firstLayer.groupType !== undefined ? curIndex - 2 : curIndex - 1
          }

    },

    getLastMoveIndex(id) {
      const objects = this.canvas.getObjects()
      const curIndex = objects.findIndex(o => o.id === id)
      if(curIndex === -1) return ({})
      const curLayer = objects[curIndex]
      if(curIndex === objects.length -1) return ({})
      if(curLayer.groupType !== undefined) {
        const firstLayer = objects[curIndex + 1]
        const isGroup = firstLayer.type === 'group'
          return {
            groupMoveIndex: isGroup ? curIndex +2  : curIndex +1,
            layerMoveIndex: isGroup ? curIndex + 2 : curIndex + 1,
            group: objects[curIndex - 1]
          }
      }
      const firstLayer = objects[curIndex + 1]
       const isGroup = firstLayer.type === 'group'
       return {
            layerMoveIndex: isGroup  ? curIndex + 2 : curIndex + 1
          }

    },


    // 移动下一层级
    toNextLayer(selectedObj) {
      let obj = selectedObj || this.canvas.getActiveObject();
      const {groupMoveIndex, layerMoveIndex, group} = this.getNextMoveIndex(obj.id)
      if(layerMoveIndex === undefined) return
      this.canvas.moveTo(obj, layerMoveIndex)
        if(groupMoveIndex !== undefined) {
        this.canvas.moveTo(group, groupMoveIndex)
      }
      this.renderAll();
    },

    //移动上一层级
     toLastLayer(selectedObj) {
        let obj = selectedObj || this.canvas.getActiveObject();
      const {groupMoveIndex, layerMoveIndex, group} = this.getLastMoveIndex(obj.id)
      if(layerMoveIndex === undefined) return
       if(groupMoveIndex !== undefined) {
        this.canvas.moveTo(group, groupMoveIndex)
      }
      this.canvas.moveTo(obj, layerMoveIndex)

      this.renderAll();

       return
      // var obj = selectedObj || this.canvas.getActiveObject();
      // var lastGroup = this.isLastExistGroup(selectedObj);
      // var nextGroup = this.isNextExistGroup(selectedObj);
      // var objects = this.canvas.getObjects();
      // var selectedObjIndex = objects.findIndex(function (item) {
      //   return item.id === selectedObj.id;
      // });

      // if (!obj) {
      //   return;
      // }
      // if (lastGroup.type === "group") {
      //   if (nextGroup.type === "group") {
      //     nextGroup.moveTo(selectedObjIndex + 2);
      //   }
      //   selectedObj.moveTo(selectedObjIndex + 2);
      // } else {
      //   if (nextGroup.type === "group") {
      //     nextGroup.moveTo(selectedObjIndex + 1);
      //   }
      //   selectedObj.moveTo(selectedObjIndex + 1);
      // }

      // this.renderTop();
    },

    toBottomLayer() {
      let obj = this.canvas.getActiveObject();
      if (!obj) {
        return;
      }
      obj.sendToBack();
      this.renderTop();
      // this.canvas.setActiveObject(obj);
    },





    toTopLayer() {
      let obj = this.canvas.getActiveObject();
      if (!obj) {
        return;
      }
      obj.bringToFront();
      this.renderTop();
    },
    drawByPath(pathArray, options) {
      options = Object.assign(
        {
          fillColor: "rgba(255, 255, 255, 0)",
          left: 150,
          top: 150,
          strokeColor: "#B0B0B0",
          strokeWidth: 3,
        },
        options
      );
      let pathStr = "M ";
      for (let item of pathArray) {
        pathStr = pathStr + item[0] + " " + item[1] + " ";
      }
      pathStr = pathStr + "z";
      var path = new fabric.Path(pathStr);
      path.set({
        ...options,
        stroke: options.strokeColor,
        fill: options.fillColor,
      });
      this.canvas.add(path);
    },
  },
};
</script>

<style lang="scss" scoped></style>
