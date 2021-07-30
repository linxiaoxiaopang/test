<template>
  <div class="referenceCanvas">
    <div class="doc">
      <el-alert title="数字序号为前端显示顺序，拖动可调整顺序！" type="warning" show-icon> </el-alert>
      <draggable class="list" v-model="data" v-bind="dragOption" @change="dragChange($event)">
        <div
          :key="index"
          :class="['item', 'drag-item', isSet({ name, base_group_cover, base_group_mark }) && 'is-set']"
          v-for="({ img_url, show_rotate, name, base_group_cover, base_group_mark, text }, index) in forms"
        >
          <div :class="['index-item', index == curIndex && 'active']">
            <span class="num">
              {{ index + 1 }}
            </span>
          </div>
          <div :class="['img-wrapper', index == curIndex && 'active']">
            <el-image
              @click.stop="groupClick(index)"
              fix="contain"
              :src="img_url"
              :style="{ transform: `rotate(${show_rotate}deg)` }"
            >
            </el-image>
          </div>

          <div class="name-wrapper">
            <span class="name">
              {{ name }}
            </span>
            <div class="icon">
              <i class="el-icon-s-fold"></i>
            </div>
          </div>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },

  props: {
    sup_this: {
      type: Object,
      default: () => null
    },

    forms: {
      type: Array,
      required: true
    },

    //初始索引
    curIndex: {
      type: Number,
      default: 0
    }
  },

  computed: {
    data: {
      get() {
        return this.forms
      },
      set(newVal) {
        this.$emit('update:forms', newVal)
      }
    },

    dragOption() {
      return {
        animation: 200,
        group: 'description',
        ghostClass: 'ghost',
        draggable: '.drag-item'
      }
    },

    isSet() {
      return ({ name, base_group_cover, base_group_mark }) => {
        // console.log(name, base_group_cover)
        try {
          return !!(name && base_group_cover.length && base_group_mark.length)
        } catch (err) {
          return false
        }
      }
    }
  },

  methods: {
    dragChange(e) {
      // console.log('e', e)
      let oldForms = this.forms.reduce((prev, next) => {
        prev[next.oldSort] = next
        return prev
      }, [])
      this.forms.forEach((form, index) => {
        let oldForm = oldForms[index]
        if (!(form.isNameChange || oldForm.isNameChange)) {
          form.name = oldForm.isEdit.oldName
        }
      })
      this.$emit('dragChange', e)
    },

    groupClick(index) {
      this.$emit('update:curIndex', index)
    }
  }
}
</script>

<style lang="scss" scoped>
.referenceCanvas {
  box-shadow: 0 0 10px 1px #999;
  padding: 0 10px;
  padding: 10px;
  background: #fff;
  .doc {
    width: 100%;
    overflow-x: auto;
    position: relative;
    .el-alert {
      border: 1px solid $color-warning;
      ::v-deep {
        span {
          color: #1a1a1a;
        }
      }
    }
  }
  .list {
    margin-top: 10px;
    padding: 10px 20px;
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    border: 1px solid $border-color;
  }

  .item {
    font-size: 14px;
    display: inline-block;
    position: relative;
    cursor: pointer;
    margin-right: 20px;

    .name-wrapper {
      width: 100%;
      margin-top: 10px;
      height: 2rem;

      font-size: 0;
      .name {
        font-size: 16px;
        display: inline-block;
        width: 120px;
        @include overflow;
      }
      .icon {
        display: inline-block;
        width: 80px;
        text-align: right;
        i {
          font-size: 20px;
        }
      }
    }
  }
  .item.is-set {
    .img-wrapper {
      background: #3840df15;
    }
    .img-wrapper::after {
      background: #3840df15;
      content: '已设置';
      position: absolute;
      z-index: 1000;
      right: 10px;
      bottom: 10px;
      color: $color-primary;
      font-size: 12px;
    }
  }

  .index-item {
    font-size: 20px;
    .num {
      display: flex;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
  .index-item.active {
    .num {
      color: $color-primary;
    }
  }
  .img-wrapper {
    position: relative;
    width: 200px;
    height: 200px;
    cursor: pointer;
    border: 1px solid $border-color;
    overflow: hidden;
  }
  .img-wrapper.active {
    border-color: $color-primary;
  }
  .el-image {
    padding: 4px;
    width: 100%;
    height: 100%;
  }
}
</style>
