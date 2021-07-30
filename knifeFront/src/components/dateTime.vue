<template>
  <div class="dateTimeComponent">
    <div class="dateTimeComponent-wrapper" v-clickoutside="outSizeHandler">
      <el-input
        ref="input"
        v-model="value"
        clearable
        suffix-icon="el-icon-date"
        @focus="focusHandlder"
        @input="inputHandler"
        v-bind="$attrs"
        v-on="$listeners"
      />
      <transition name="el-fade-in-linear">
        <div v-show="show" class="quick-date">
          <el-radio-group
            @change="changeHandler"
            v-model="quickValue"
            size="mini"
          >
            <el-radio-button
              :key="index"
              v-for="({ label, txt }, index) in data"
              :label="label"
              >{{ txt }}</el-radio-button
            >
          </el-radio-group>
          <el-date-picker
            popper-class="dateTimeComponent-popper-class"
            ref="picker"
            v-if="pickerShow"
            v-model="time"
            type="daterange"
            range-separator="/"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
          <div class="custom" @click="showPicker" v-else>自定义</div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { conversionTimeFmt, getWeek, getMonth } from "@/utils";
import Clickoutside from "element-ui/src/utils/clickoutside";

const TODAY = "1";
const YESTERDAY = "2";
const WEEK = "3";
const LAST_WEEK = "4";
const MONTH = "5";
const LAST_MONTH = "6";
const SPLIT_CHART = " 至 ";
export default {
  props: {
    filterTime: {
      required: true,
    },
  },
  data() {
    return {
      data: [
        {
          label: TODAY,
          txt: "今日",
        },
        {
          label: YESTERDAY,
          txt: "昨日",
        },
        {
          label: WEEK,
          txt: "本周",
        },
        {
          label: LAST_WEEK,
          txt: "上周",
        },
        {
          label: MONTH,
          txt: "本月",
        },
        {
          label: LAST_MONTH,
          txt: "上月",
        },
      ],
      value: this.filterTime,
      show: false,
      pickerShow: false,
      time: [],
      quickValue: "",
      pickerOptions: {
        onPick: this.onPick,
      },
    };
  },
  directives: { Clickoutside },
  watch: {
    value(newVal) {
      if (newVal === "") {
        this.time = [];
        this.quickValue = "";
      }
      this.$emit("update:filterTime", this.value);
    },
  },
  methods: {
    outSizeHandler() {
      if (this.show && !this.pickerShow) {
        this.show = false;
      }
    },
    reset() {
      this.show = false;
      this.pickerShow = false;
    },
    inputHandler() {
      this.value = "";
    },

    formatValue({ minDate, maxDate }) {
      const ds = [
        conversionTimeFmt("yyyy-MM-dd", minDate),
        conversionTimeFmt("yyyy-MM-dd", maxDate),
      ];
      this.value = ds.join(SPLIT_CHART);
    },
    changeHandler(val) {
      if (val == TODAY) {
        this.formatValue({
          minDate: new Date(),
          maxDate: new Date(),
        });
      }
      if (val == YESTERDAY) {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        this.formatValue({
          minDate: date,
          maxDate: date,
        });
      }
      if (val == WEEK) {
        const [minDate, maxDate] = getWeek();
        this.formatValue({
          minDate,
          maxDate,
        });
      }

      if (val == LAST_WEEK) {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        const [minDate, maxDate] = getWeek(date);
        this.formatValue({
          minDate,
          maxDate,
        });
      }

      if (val == MONTH) {
        const [minDate, maxDate] = getMonth();
        this.formatValue({
          minDate,
          maxDate,
        });
      }

      if (val == LAST_MONTH) {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        const [minDate, maxDate] = getMonth(date);
        this.formatValue({
          minDate,
          maxDate,
        });
      }

      this.reset();
      this.time = this.value.split(SPLIT_CHART);
    },
    onPick({ maxDate, minDate }) {
      if (!maxDate || !minDate) return;
      this.reset();
      this.formatValue({ maxDate, minDate });
      this.quickValue = "";
    },
    focusHandlder() {
      this.show = true;
    },
    showPicker() {
      this.pickerShow = true;
      this.$nextTick(() => {
        const { picker } = this.$refs;
        picker.focus();
        //重写picker组件handleClose方法
        const handleClose = picker.handleClose;
        picker.handleClose = () => {
          handleClose();
          this.pickerShow = false;
        };
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dateTimeComponent {
  width: 100%;
}
.dateTimeComponent-wrapper {
  position: relative;
  .quick-date {
    border: 1px solid $border-color;
    position: absolute;
    padding-top: 10px;
    width: 100%;
    background: #fff;
    min-width: 220px;
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    z-index: 1;
    .custom {
      margin-top: 3px;
      margin-top: 10px;
      line-height: 2rem;
      text-align: center;
      border-top: 1px solid $border-color;
      cursor: pointer;
      color: $color-primary;
    }
    .el-date-picker {
      position: relative;
      top: -2rem;
    }
    ::v-deep {
      .el-range-editor.el-input__inner {
        visibility: hidden;
        position: relative;
        top: -3rem;
      }
    }

    .el-radio-group {
      white-space: normal;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      .el-radio-button {
        flex: 25%;
        margin: 5px;
        text-align: center;
        ::v-deep {
          .el-radio-button__inner {
            border: none;
            border-radius: 0;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.dateTimeComponent-popper-class {
  border-radius: 0;
  // box-shadow: none;
  border: none;
}
</style>