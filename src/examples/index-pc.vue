<template>
  <div class="container">
    <div class="header">
      <div class="logo" @click="clickHandler">LOGO</div>
    </div>
    <div class="content-wrapper">
      <div class="list-wraper">
        <div :key="item.id" v-for="item in list" class="image-wrapper">
          <img :src="item.url" />
          <i
            @click="handleAdd(item.url)"
            class="pt-iconfont icon-plus-circle"
          ></i>
        </div>
      </div>
      <vue-fabric
        ref="canvas"
        id="canvas"
        :width="width"
        :height="height"
        @selection:created="modified"
        @selection:updated="selected"
        @object:modified="modified"
      ></vue-fabric>
      <div class="tool-wrapper">
        <i @click="handleDelete" class="pt-iconfont icon-delete"></i>
        <i @click="rotate" class="pt-iconfont icon-shuaxin"></i>
        <i @click="changeDrawMore" class="pt-iconfont icon-crop"></i>
        <i @click="selected" class="pt-iconfont icon-crop"></i>
      </div>
    </div>
    <vue-image-model
      :close="
        () => {
          imgUrl = '';
        }
      "
      v-show="imgUrl.length > 0"
      :url="imgUrl"
    ></vue-image-model>
  </div>
</template>

<script type='text/ecmascript-6'>
import VueImageModel from "../components/image-model.vue";
// import Worker from "./web.worker.js";

export default {
  components: {
    VueImageModel,
  },
  data() {
    return {
      // http://data618.oss-cn-qingdao.aliyuncs.com/ys/3524/img/b.jpg
      imgUrl: "",
      width: 300,
      height: 500,
      num: 0,
      list: [
        {
          id: 1,
          url: "/static/images/sticker1.png",
        },
        {
          id: 2,
          url: "/static/images/sticker2.png",
        },
        {
          id: 3,
          url: "/static/images/sticker3.png",
        },
        {
          id: 4,
          url: "/static/images/sticker4.png",
        },
        {
          id: 5,
          url: "/static/images/sticker5.png",
        },
      ],
      isDrawingMode: true,
    };
  },
  created() {
    this.width = document.body.offsetWidth - 200;
    this.height = document.body.offsetHeight - 60;
    console.log(document.body.offsetWidth);
  },
  mounted() {
    // this.$refs.canvas.createTriangle({ id: 'Triangle', x: 100, y: 100, x1: 150, y1: 200, x2: 180, y2: 190, fill: 'yellow', left: 80 });
    //     this.$refs.canvas.createImage('/static/images/sticker1.png', { id: 'myImage', width: 100, height: 100, left: 10, top: 10 ,evented:false, selectable: false});
    //     // this.$refs.canvas.createImage('/static/images/sticker2.png');
    //     // this.$refs.canvas.createImage('/static/images/sticker3.png');
    //     let options = {
    //       x: 100, y: 100, x1: 600, y1: 600, color: '#B2B2B2', drawWidth: 2, id: 'Triangle'
    //     };
    //     // this.$refs.canvas.drawDottedline(options);
    //     // this.$refs.canvas.createEllipse({ rx: 200, ry: 400, left: 300 });
    //     this.$refs.canvas.createItext(`斯诺伐克两三斯诺伐克两三斯诺伐克两三斯诺伐
    // 克两三斯诺伐克两三斯诺伐克两三斯诺伐克两三`, { top: 100, left: 300, width: 50 ,editable:false});
    //     this.$refs.canvas.setCornerIcons({ size: 20, tl: '/static/images/cow.png' });
    //     this.$refs.canvas.drawByPath([[50, 50], [120, 120], [80, 160]], {});

    var img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    let that = this;
    img.onload = function () {
      that.$refs.canvas.createImageByImg(img, {
        id: "myImage",
        width: 100,
        height: 100,
        left: 10,
        top: 10,
        evented: true,
        selectable: true,
        crossOrigin: "anonymous",
      });
    };
    img.src = "/static/images/sticker1.png";
    this.$refs.canvas.setSelection(false);
    let options = {
      imgUrl: "https://weiliicimg9.pstatp.com/weili/l/701712572929933335.webp",
      width: this.width,
      height: this.height,
      opacity: 1,
      scaleX: 1.5,
    };
    // this.$refs.canvas.setBackgroundImage(options);
    this.$refs.canvas.setBackgroundColor("#ffffff00");
    // https://s1.tuchong.com/content-image/201907/be4f3b7bc7b57305bf4c4c2d304d5ba8.jpg
    // this.$refs.canvas.createImageByImg('http://cdn2.jianshu.io/assets/web/logo-58fd04f6f0de908401aa561cda6a0688.png', { id: 'myImage', width: 100, height: 100, left: 10, top: 10 ,evented:false, selectable: false, crossOrigin:"anonymous"});
    // this.$refs.canvas.freeDrawConfig({isDrawingMode:this.isDrawingMode});
  },
  methods: {
    modified() {
      console.log(111111)
     const o = this.$refs.canvas.canvas.getActiveObject()
     console.log('w', o.width * o.scaleX)
     console.log('h', o.height * o.scaleY)
     console.log('sx', o.scaleX)
     console.log('sy', o.scaleY)
     console.log(o.getCenterPoint())
     console.log(o.type)
     if(o.type === 'group') {
      const iO = o.item(0).getCenterPoint()
      const rIO = o.item(0).getBoundingRect()
    
    //   //  this.$refs.canvas.canvas.discardActiveGroup()
    // o.clone((cO) => {
    //   // const cs = cO.destroy()
    //   // console.log('cs', cs)
    //   const one = cO.toActiveSelection()
    //   // console.log('cO.item(0)', cO.item(0).getCenterPoint())
    //   console.log('one', one)
    // })
    //  o.toActiveSelection()
    //  this.$refs.canvas.canvas.renderAll()
      console.log('iO', iO)
      console.log('iO', iO)
      console.log('getBoundingRect', rIO)
     setTimeout(() => {
        const os = this.$refs.canvas.getObjects()
      os.map(oa => {
        // console.log('type', o.type)
        // console.log('oP', o.getCenterPoint(true, true))
          console.log('group', oa.group)
          console.log('bool', o.contains(oa))
          if( o.contains(oa)) {
            console.log('oa', oa.group.getCenterPoint())
            console.log('oa', oa.group.left)
            console.log('oa', oa.group.top)
            oa.setOptions({
              left: 20,
              top: 20
            })
            console.log('ao', oa.getCenterPoint())
            console.log(o.getCenterPoint())
          }
      })
     }, 200)
     }
      // console.log(11111);
      // for(let i = 0; i < 10; i++) {
      //     this.$refs.canvas.canvas.clone((c) => {
      //   console.log(c);
      //   c.setZoom(5);
      //   var ctx = c.getContext("2d");
      //   const data = ctx.getImageData(0, 0, c.width, c.height);
      //   console.log('data', data)
      // });
      // }
    
    },
    startWorker() {
      const worker = new Worker();
      worker.postMessage("hello world");
      worker.onmessage = function (evt) {
        console.log(evt.data);
      };
    },
    clickHandler() {
      //  this.startWorker()
    },
    changeDrawMore() {
      this.isDrawingMode = !this.isDrawingMode;
      this.$refs.canvas.freeDrawConfig({ isDrawingMode: this.isDrawingMode });
    },
    setErase() {
      this.$refs.canvas.eraseDrawConfig({ drawWidth: 20 });
    },
    toggleMirror() {
      this.$refs.canvas.toggleMirror({ flip: "Y" });
    },
    discardActive() {
      this.$refs.canvas.discardActive();
    },
    handleAdd(url) {
      const canvas = this.$refs.canvas.canvas
    //   console.log("handleAdd");
      // this.$refs.canvas.createImage(url);
          const os = this.$refs.canvas.getObjects()
     console.log(os[0].type)
     console.log(os[0].getCenterPoint())
     console.log('getLocalPointer', os[0].getBoundingRect())
     var newgroup = new fabric.Group([os[0]])
      this.$refs.canvas.canvas.add(newgroup)
     this.$refs.canvas.canvas.renderAll()
   setTimeout(() => {
      const os = this.$refs.canvas.getObjects()
       console.log(os)
       console.log(os[0].type)
   }, 100)
    //  const gPos = newgroup.getCenterPoint()
    // // //   // newgroup.discardActiveGroup()
    //  const iPos = newgroup.item(0).getCenterPoint()
    //  console.log('gPos', gPos)
    //  console.log('iPos', iPos)
    //  newgroup.toActiveSelection()
    // const end = os[0].getCenterPoint()
  //  os.map(o => {
  //    console.log(o.type)
  //  })

        //  console.log('end', end)

    },
    handleDelete() {
      this.$refs.canvas.removeCurrentObj();
    },
    rotate() {
      this.$refs.canvas.setRotate();
    },
    createImg() {
      let dataUrl = this.$refs.canvas.toDataUrl();
      // console.log(dataUrl);
      this.imgUrl = dataUrl;
    },
    selected(obj, option) {
      this.$refs.canvas.setSelection(true);
      // console.log(obj);
      // console.log(option);
    },
  },
};
</script>

<style lang='scss' scoped>
.container {
  width: 100%;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    height: 60px;

    border-bottom: 1px solid #efefef;
    display: -ms-flexbox;
    display: -moz-box;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;

    box-sizing: border-box;
    width: 100%;

    .logo {
      width: 200px;
      box-sizing: border-box;
      border-right: 1px solid #efefef;
      height: 60px;
      display: -ms-flexbox;
      display: -moz-box;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      box-align: center;
      -moz-box-align: center;
      -webkit-box-align: center;
      -webkit-align-items: center;
      align-items: center;
      box-pack: center;
      -webkit--moz-box-pack: center;
      -moz-box-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
    }
  }

  .content-wrapper {
    position: relative;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: -moz-box;
    display: -webkit-box;
    display: flex;
    -moz-box-flex: 1;
    box-flex: 1;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;

    .tool-wrapper {
      position: absolute;
      top: 0;
      right: 0;
      display: -ms-flexbox;
      display: -moz-box;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;

      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -moz-box-direction: normal;
      -moz-box-orient: vertical;
      -webkit-flex-direction: column;
      flex-direction: column;

      .pt-iconfont {
        padding: 20px 30px;
      }
    }

    .list-wraper {
      width: 200px;

      border-right: 1px solid #efefef;
      overflow-y: auto;
      flex-shrink: 0;
      box-sizing: border-box;

      display: -webkit-flex;
      display: -ms-flexbox;
      display: -moz-box;
      display: -webkit-box;
      display: flex;
      -webkit-box-orient: vertical;
      -moz-box-orient: vertical;
      -webkit-flex-direction: column;
      flex-direction: column;

      .image-wrapper {
        padding: 20px;
        display: -ms-flexbox;
        display: -moz-box;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;

        flex-shrink: 0;
        box-pack: center;
        -webkit--moz-box-pack: center;
        -moz-box-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        box-align: center;
        -moz-box-align: center;
        -webkit-box-align: center;
        -webkit-align-items: center;
        align-items: center;
        border-bottom: 1px solid #efefef;
        position: relative;
        img {
          width: 120px;
        }
        .pt-iconfont {
          position: absolute;
          top: 0px;
          right: 0px;
          font-size: 18px;
          color: #777;
          padding: 10px;
        }
      }
    }
  }
}
</style>
