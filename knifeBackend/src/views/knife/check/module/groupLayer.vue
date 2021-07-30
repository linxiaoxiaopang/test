<template>
  <div class="groupLayerComponent">
    <div class="layer" :key="index" v-for="(node, index) in data">
      <el-image fit="contain" :src="forms[index].imgUrl || ''"></el-image>
      <div class="input-items">
        <span class="name">{{ node.name }}</span>
        <el-form
          :disabled="disabled"
          :model="forms[index]"
          v-if="forms.length"
          label-position="left"
          label-suffix=":"
          size="mini"
          inline
        >
          <el-form-item label="图层类型">
            <el-select
              size="mini"
              v-model="forms[index].type"
              placeholder="图层类型"
            >
              <el-option
                v-for="item in layerTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="name">
            <el-tag type="primary" size="mini">
              {{ forms[index].name }}
            </el-tag>
          </el-form-item>
          <el-form-item label="top">
            <el-tag type="primary" size="mini">
              {{ concatPX(forms[index].top) }}
            </el-tag>
          </el-form-item>
          <el-form-item label="left">
            <el-tag type="primary" size="mini">
              {{ concatPX(forms[index].left) }}
            </el-tag>
          </el-form-item>
          <el-form-item label="width">
            <el-tag type="primary" size="mini">
              {{ concatPX(forms[index].width) }}
            </el-tag>
          </el-form-item>
          <el-form-item label="heihgt">
            <el-tag type="primary" size="mini">
              {{ concatPX(forms[index].height) }}
            </el-tag>
          </el-form-item>
          <el-form-item class="flex-item" label="文字" v-if="forms[index].text">
            <div class="s-item">
              <span>value：</span
              ><el-tag type="primary" size="mini">
                {{ forms[index].text.value }}
              </el-tag>
            </div>
            <div class="s-item">
              <span>size：</span
              ><el-tag type="primary" size="mini">
                {{ forms[index].text.size }}
              </el-tag>
            </div>
            <div class="s-item">
              <span>transform：</span>
              <el-tag
                type="primary"
                size="mini"
                :key="index"
                v-for="(val, key, index) in forms[index].text.transform"
              >
                {{ key }}：{{ val }}
              </el-tag>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      required: true,
    },
    disabled: Boolean,
    sup_this: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      layerTypes: [
        {
          value: "0",
          label: "文字层",
        },
        {
          value: "1",
          label: "膜层",
        },
        {
          value: "2",
          label: "安全线",
        },
        {
          value: "3",
          label: "分界线",
        },
        {
          value: "4",
          label: "其他",
        },
      ],
    };
  },
  computed: {
    forms() {
      return this.info.forms || [];
    },
    data() {
      const children = this.info._children || [];
      return children;
    },
    concatPX(val) {
      return (val) => {
        return val + "px";
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.groupLayerComponent {
  padding: 0 10px;
  .layer {
    display: flex;
    margin-bottom: 10px;
    .el-image {
      flex: 0 0 150px;
      height: 100px;
      border: 1px solid $border-color;
      padding: 8px;

      border-radius: 8px;
      background: #eeee;
    }
    .input-items {
      padding: 15px;
      position: relative;
      flex: 1;
      margin-left: 15px;
      border: 1px solid $border-color;
      .el-form-item {
        margin-bottom: 0;
        .s-item {
          // margin-left: 20px;
          .el-tag {
            margin-right: 15px;
          }
        }
      }
      .flex-item {
        display: flex;
        ::v-deep {
          .el-form-item__label {
            white-space: nowrap;
          }
        }
      }
      .name {
        position: absolute;
        top: 0;
        right: 0;
        padding: 2px 8px;
        background-color: $color-gray;
        color: #fff;
        border-radius: 8px 0 8px 0px;
        font-size: 12px;
        z-index: 10;
        opacity: 0.5;
      }
    }
  }
}
</style>