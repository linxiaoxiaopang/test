<template>
  <div class="fontSettingComponent">
    <el-input
      v-model="query.text"
      placeholder="输入你要添加的文字"
      type="textarea"
      :rows="5"
    ></el-input>
    <el-select
      size="mini"
      style="margin-top: 15px; width: 45%"
      v-model="query.fontSize"
      placeholder="请选择字体大小"
    >
      <el-option
        v-for="item in FONST_SIZE_LIST"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>

    <el-select
      size="mini"
      style="margin-top: 15px; margin-left: 10%; width: 45%"
      :style="{ fontFamily: query.fontFamily }"
      v-model="query.fontFamily"
      placeholder="请选择字体"
    >
      <el-option
        v-for="item in FONST_FAMILY_LIST"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :style="{ fontFamily: item.label }"
      ></el-option>
    </el-select>
    <Color ref="color" class="color-wrapper" :colors.sync="query.fill" />
    <el-button v-if="isShow" size="small" type="primary" @click="createItext">
      添加
    </el-button>
  </div>
</template>

<script>
import Color from "@/components/color";
import { fabricInstanceMixin } from "../../mixins";
import { createRandomNum, colorStr2Obj } from "@/utils";
import {
  FONT_INIT_FORM,
  FONST_SIZE_LIST,
  FONST_FAMILY_LIST,
} from "../../constant";
import { mapGetters } from "vuex";

export default {
  mixins: [fabricInstanceMixin],
  components: {
    Color,
  },
  data() {
    return {
      FONST_SIZE_LIST,
      FONST_FAMILY_LIST,
      query: {
        text: "",
        fill: "rgb(0, 0, 0)",
        fontSize: FONST_SIZE_LIST[0].value,
        fontFamily: "",
      },
      isShow: true,
    };
  },
  watch: {
    query: {
      handler() {
        this.timer && clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.editItext();
        }, 100);
      },
      deep: true,
    },
    fabricActiveObjectIds: {
      handler() {
        this.initQuery();
        this.isShow = this.showAddBtn();
        if (this.$refs.color) {
          this.$refs.color.value = colorStr2Obj(this.query.fill);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    ...mapGetters(["fabricActiveObjectIds", "curFabricIndex"]),
  },
  methods: {
    initQuery() {
      if (this.getActiveObjectType() == "i-text") {
        const { fill, fontSize, text } = this.getActiveObject();
        this.query = {
          text,
          fill,
          fontSize,
        };
      } else {
        this.query = Object.assign({}, FONT_INIT_FORM, { text: "" });
      }
    },
    //fabirc操作
    showAddBtn() {
      const activeObject = this.getActiveObject();
      if (!activeObject || (activeObject && activeObject.type != "i-text")) {
        return true;
      }
      return false;
    },
    createItext() {
      const { text, ...rest } = this.query;
      this.instance.createItext(text || "", {
        registeObjectEvent: false,
        editable: false,
        left: 100,
        top: 100,
        id: createRandomNum(),
        ...rest,
      });
      this.isShow = this.showAddBtn();
    },
    editItext() {
      const activeObject = this.getActiveObject();
      if (!activeObject || (activeObject && activeObject.type != "i-text"))
        return;
      const rgb = this.query.fill || { r: 255, g: 255, b: 255 };
      activeObject.setOptions(
        Object.assign({}, this.query, {
          fill: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        })
      );
      this.instance.renderAll();
    },
  },
};
</script>

<style lang="scss" scoped>
.fontSettingComponent {
  margin-top: 30px;
  padding: 0 10px;
  .color-wrapper {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  .el-button {
    margin-left: 50%;
    width: 150px;
    transform: translateX(-50%);
  }
}
</style>