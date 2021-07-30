<template>
  <div class="operationTabComponent">
    <div class="chunk" ref="chunk"></div>
    <ul>
      <li
        :class="[curValue == value && 'active']"
        :key="index"
        v-for="({ value, label }, index) in data"
        @click="toggleTab({ value, label })"
      >
        <span>{{ label }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { fabricInstanceMixin } from '../mixins'
import { createRandomNum } from '@/utils'
import { FONT_INIT_FORM } from '../constant'

const FONT_SETTING_VAL = '4'
const FONT_SETTING_LABEL = '添加文字'

const NAVS = [
  {
    value: '0',
    label: '产品'
  },
  {
    value: '1',
    label: '我的图片'
  },
  {
    value: '2',
    label: '共享图片'
  },
  {
    value: '3',
    label: '背景'
  }
  // {
  //   value: FONT_SETTING_VAL,
  //   label: FONT_SETTING_LABEL,
  // },
]

export default {
  mixins: [fabricInstanceMixin],
  props: {
    value: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      data: NAVS,
      curValue: this.value
    }
  },
  watch: {
    curValue(newVal) {
      this.$emit('update:value', newVal)
    },
    value(newVal) {
      this.curValue = newVal
      this.toggleTab({ value: newVal })
    }
  },
  mounted() {
    this.toggleTab({
      value: this.curValue
    })
  },
  methods: {
    toggleTab({ value, label }) {
      if (label === FONT_SETTING_LABEL) {
        return this.$message.warning('此功能暂未开放')
      }
      // const tmpArr = ["0%", "20%", "40%", "60%", "80%"];
      const tmpArr = ['0%', '25%', '50%', '75%']
      const chunk = this.$refs.chunk
      this.curValue = value
      chunk.style.left = tmpArr[this.curValue]
      chunk.style.transition = 'all .2s linear'
      this.$emit('toggleTab', { value, label })
    },
    //fabirc操作
    createItext() {
      const activeObject = this.instance.getActiveObject()
      if (
        this.curValue != FONT_SETTING_VAL ||
        activeObject ||
        (activeObject && activeObject.type != 'i-text')
      )
        return
      const { text, ...rest } = FONT_INIT_FORM
      this.instance.createItext(text || '', {
        registeObjectEvent: false,
        editable: false,
        left: 100,
        top: 100,
        id: createRandomNum(),
        ...rest
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.operationTabComponent {
  position: relative;

  .chunk {
    position: absolute;
    left: 0;
    top: 0px;
    width: 25%;
    height: 28px;
    background: $color-primary;
    border-radius: 16px;
  }
  ul {
    padding-left: 0;
    background: #f6f7fb;
    display: flex;
    li {
      position: relative;
      flex: 1;
      width: 20%;
      z-index: 1;
      line-height: 28px;
      cursor: pointer;
      font-size: 14px;
      color: #595961;
      font-weight: 600;
      text-align: center;
    }
    li.active {
      color: #fff;
      transition: color 0.2s linear;
    }
  }
}
</style>
