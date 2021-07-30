<template>
  <div class="saleDateTimeComponent">
    <el-radio-group v-model="label" size="mini">
      <el-radio label="1" border>今日</el-radio>
      <el-radio label="2" border>昨日</el-radio>
    </el-radio-group>
    <el-date-picker
      v-model="value"
      type="daterange"
      size="mini"
      range-separator="/"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="yyyy-MM-dd"
    >
    </el-date-picker>
  </div>
</template>

<script>
import { debounce, parseCharacterTime } from '@/utils'
import cloneDeep from 'lodash/cloneDeep'
export default {
  props: {
    time: {
      required: true
    }
  },
  data() {
    return {
      value: this.time,
      label: null
    }
  },
  watch: {
    value(newVal) {
      newVal = newVal || []
      let time = []
      const today = parseCharacterTime(new Date()) || []
      time[0] = today.split(' ')[0]
      time[1] = today.split(' ')[0]
      if (newVal[0] === time[0] && newVal[1] === time[1]) {
        this.label = '1'
        this.updateValue(newVal)
        return
      }

      let yTime = []

      let dateTime = new Date()
      dateTime = dateTime.setDate(dateTime.getDate() - 1)
      dateTime = new Date(dateTime)
      const yesDay = parseCharacterTime(dateTime)
      yTime[0] = yesDay.split(' ')[0]
      yTime[1] = yesDay.split(' ')[0]

      if (newVal[0] === yTime[0] && newVal[1] === yTime[1]) {
        this.label = '2'
        this.updateValue(newVal)
        return
      }
      this.updateValue(newVal)
      this.label = null
    },
    label(newVal) {
      let val = cloneDeep(newVal)
      if (val == 1) {
        val = []
        const time = parseCharacterTime(new Date())
        console.log('time', time)
        val[0] = time.split(' ')[0]
        val[1] = time.split(' ')[0]
        this.value = val
      }
      if (val == 2) {
        val = []
        let dateTime = new Date()
        dateTime = dateTime.setDate(dateTime.getDate() - 1)
        dateTime = new Date(dateTime)
        const time = parseCharacterTime(dateTime)
        val[0] = time.split(' ')[0]
        val[1] = time.split(' ')[0]
        this.value = val
      }
      this.updateValue(val)
    }
  },
  methods: {
    updateValue: debounce(function (val) {
      this.$emit('update:time', val)
      this.$emit('change', val)
    })
  }
}
</script>

<style lang="scss" scoped>
.saleDateTimeComponent {
  position: relative;

  display: flex;
  justify-content: flex-start;
  .el-radio-group {
    flex: 0 0 105px;
  }
  .el-date-editor {
    flex: 1;
  }
  ::v-deep {
    .el-radio__input {
      display: none;
    }
    .el-radio--mini.is-bordered {
      padding-left: 0;
      padding-right: 5px;
      height: 31px;
      margin: 0;
      line-height: 17px;
      margin-right: 5px;
    }
    .el-radio__label {
      padding-left: 5px;
    }
    .el-date-editor--daterange.el-input__inner {
      width: auto;
    }
  }
}
</style>
