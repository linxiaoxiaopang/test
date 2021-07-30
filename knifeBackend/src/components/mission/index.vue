<template>
  <div :class="[shake && 'shake', 'missionComponent']">
    <div class="count" v-show="data.length">
      <span v-if="data.length <= 99">{{
        data.filter(({ status }) => 3 > status).length
      }}</span>
      <span v-else-if="data.length > 99">99</span>
    </div>
    <el-button
      type="info"
      icon="el-icon-menu"
      size="large"
      circle
      @click="showHandler"
    ></el-button>
    <EForm ref="form" :sup_this="sup_this" :data="data" />
  </div>
</template>

<script>
import EForm from "./module/form";
import { mapGetters, mapMutations } from "vuex";
export default {
  components: {
    EForm,
  },
  data() {
    return {
      sup_this: this,
      shake: false,
    };
  },
  watch: {
    data() {
      this.shake = true;
      this.shakeTimer && clearTimeout(this.shakeTimer);
      this.shakeTimer = setTimeout(() => {
        this.shake = false;
      }, 2000);
    },
  },
  computed: {
    ...mapGetters({
      data: "tasks",
    }),
  },
  methods: {
    showHandler() {
      const _this = this.$refs.form;
      _this.dialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.missionComponent {
  position: fixed;
  right: 50px;
  bottom: 20px;
  z-index: 100;
  .count {
    position: absolute;
    top: 0px;
    right: -0px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 18px;
    height: 18px;
    color: #fff;
    font-size: 12px;
    line-height: 1;
    background: rgba(255, 87, 51, 1);
    border-radius: 50%;
  }
}
.missionComponent.shake {
  animation: shake 1s 2;
}
@keyframes shake {
  0%,
  100% {
    -webkit-transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    -webkit-transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    -webkit-transform: translateX(5px);
  }
}
</style>