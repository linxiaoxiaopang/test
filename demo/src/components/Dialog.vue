<template>
  <section>
    <el-dialog
      title="提示"
      :visible.sync="box"
      v-dialogdrag
      :class="{ 'avue-dialog': type == 0 }"
      width="40%"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="box = false">取 消</el-button>
        <el-button type="primary" @click="box = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-button @click="openBox(1)">原生el样式弹窗</el-button>
    <el-button type="primary" @click="openBox(0)">avue样式弹窗</el-button>
    <el-button type="primary" @click="preview">preview</el-button>
    <el-button type="primary" @click="findObject1">findObject</el-button>
  </section>
</template>

<script>
export default {
  data() {
    return {
      type: "",
      box: false,
    };
  },
  methods: {
    openBox(type) {
      this.type = type;
      this.box = true;
    },

    preview() {
      console.log('hello world')
      alert('hello world')
      return 
      let datas = [
        {
          thumbUrl: require("@/assets/logo.png"), //缩略图
          url: require("@/assets/logo.png"), //大图
        },
        {
          thumbUrl: require("@/assets/logo.png"), //缩略图
          url: require("@/assets/logo.png"), //大图
        },
        {
          thumbUrl: require("@/assets/logo.png"), //缩略图
          url: require("@/assets/logo.png"), //大图
        },
      ];
      let index = 0; //默认打开序号
      this.$ImagePreview(datas, index);
    },
    findObject1() {
      var option = { column: [{
          prop: 'hello world',
          haha: 'hahah达'
      }] };
      var prop = this.findObject(option.column, "hello world");
      console.log(prop); //操作对象
    },
  },
};
</script>

<style>
</style>