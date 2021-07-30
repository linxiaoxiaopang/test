<template>
  <div class="createTagsComponents">
    <template v-for="(tag, indx) in dynamicTags">
      <el-tag
        closable
        zize="small"
        :disable-transitions="false"
        @close="handleClose(tag, indx)"
        @click="handleClick(tag, indx)"
      >
        <el-input
          ref="input"
          :key="indx"
          v-show="indx === curIndex"
          v-model="dynamicTags[indx]"
          class="input-redit-tag"
          size="small"
          @blur="blurHnadler"
        >
        </el-input>
        <span v-if="indx !== curIndex">{{ tag }}</span>
      </el-tag>
    </template>

    <el-input
      size="mini"
      class="input-new-tag"
      v-if="inputVisible"
      v-model="inputValue"
      ref="saveTagInput"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm"
    >
    </el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput"
      >+ {{ btnText }}</el-button
    >
  </div>
</template>

<script>
import jsCookie from "js-cookie";
export default {
  props: {
    tags: {
      type: Array,
      default: () => [],
    },
    btnText: {
      type: String,
      default: "新增尺码",
    },
  },
  data() {
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      curIndex: -1,
    };
  },
  watch: {
    dynamicTags: {
      handler(newVal) {
        this.$emit("update:tags", newVal);
        this.$emit("tagChangeHandler", newVal);
      },
      deep: true,
    },
    tags: {
      handler(newVal) {
        this.dynamicTags = this.tags;
      },
      deep: true,
    },
  },

  methods: {
    handleClose(tag, index) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      this.$emit("removeTagHandler", {
        value: tag,
        index,
      });
    },
    handleClick(tag, index) {
      this.curIndex = index;
      this.$nextTick(() => {
        this.$refs.input[index].focus();
      });
    },
    blurHnadler() {
      this.curIndex = -1;
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
  },
};
</script>

<style lang="scss"  scoped>
.createTagsComponents {
  display: flex;
  flex-wrap: wrap;
  align-items: flex;
  // padding: 10px 0;
  font-size: 0;
  .el-tag {
    height: 30px;
    line-height: 30px;
    margin-right: 10px;
    margin-bottom: 5px;
  }
  .button-new-tag {
    height: 30px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    margin-left: 0;
    height: 30px;
    vertical-align: bottom;
    position: relative;
    top: -2px;
  }
  .input-redit-tag {
    width: 90px;
    vertical-align: bottom;
    top: -2px;
    ::v-deep {
      .el-input__inner {
        border: none;
        background: transparent;
      }
    }
  }
}
</style>