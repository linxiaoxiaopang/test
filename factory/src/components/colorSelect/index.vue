<template>
  <div>
    <el-select style="width: 100%;" v-model="value" placeholder="请选择">
      <el-option
        v-for="item in data"
        :key="item.id"
        :label="item.color_name"
        :value="item.id"
      >
        <div class="color-select-wrapper-item">
          <span class="label">{{ item.color_name }}</span>
          <span class="color" :style="{ background: item.color_value }"></span>
        </div>
      </el-option>
      <el-option
        key="color"
        label="color"
        style="text-align: center"
        value="color"
        disabled
      >
        <el-button style="width: 90%" size="mini" type="primary" @click="to">
          新增顔色
        </el-button>
      </el-option>
    </el-select>

    <EForm
      ref="form"
      v-if="dialogVisible"
      :dialogVisible.sync="dialogVisible"
      :sup_this="m_this"
      :isAdd="false"
      title="新增顔色"
    />
  </div>
</template>

<script>
import { list } from "@/api/product/colorApi";
import { commonEheaderMixin } from "@/mixins";
import EForm from "./form";
export default {
  mixins: [commonEheaderMixin],
  components: {
    EForm,
  },
  props: {
    color: {
      required: true,
    },
  },
  data() {
    return {
      m_this: this,
      data: [],
      value: this.color,
    };
  },
  created() {
    this.init();
  },
  watch: {
    value(newVal) {
      this.$emit("update:color", newVal);
    },
    color(newVal) {
      this.value = newVal;
    },
  },
  methods: {
    to() {
      this.dialogVisible = true;
    },
    async init() {
      const { detail, code } = (await list()) || [];
      if ($SUC({ code })) {
        this.data = detail;
        console.log('value', this.value)
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.color-select-wrapper-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .color {
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
  }
  .label {
    display: inline-block;
    width: 70%;
    @include overflow;
  }
}
</style>