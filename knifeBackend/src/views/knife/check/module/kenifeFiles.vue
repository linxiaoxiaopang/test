<template>
  <el-collapse class="kenifeFiles" v-model="activeName" accordion>
    <el-collapse-item :name="0">
      <template #title>
        <div style="line-height: 1">
          <i class="fa fa-folder-open"></i>
          <span>Psd文件</span>
        </div>
      </template>
      <div>
        <div
          v-for="(item, index) in data"
          :key="index"
          :class="['thumbnail', curIndex == index && 'active']"
          @click="toggleIndex(index)"
        >
          <img
            class="img"
            @load="loadend"
            @error="loadend"
            :src="thumbnails[index]"
            fit="contain"
          />
          <div class="code">
            <slot name="name" :item="item" :index="index">
              {{ item.size_name }}
            </slot>
          </div>
          <el-button
            size="mini"
            type="text"
            class="auto-check"
            v-if="btnStatus(item).loading"
            :loading="btnStatus(item).loading"
          >
            处理中
          </el-button>

          <el-button
            size="mini"
            type="text"
            class="doing"
            v-if="btnStatus(item).doing"
          >
            等待处理
          </el-button>

          <el-button
            class="success"
            size="mini"
            type="text"
            v-if="btnStatus(item).success"
          >
            处理成功
          </el-button>
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      required: true,
    },
    thumbnails: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      loadNum: 0,
      activeName: 0,
      curIndex: 0,
    };
  },

  computed: {
    btnStatus() {
      return (row) => {
        const { success, loading, children, nodes } = row;
        if (success) return { success };
        if (loading)
          return {
            loading,
          };
        // const fIndex = this.data.findIndex(({ success }) => success);
        // if (fIndex >= 0) {
        //   const doneItem = this.data[fIndex];
        //   const { children: doneChildren } = doneItem;
        //   if (children.length == doneChildren.length) {
        //     const autoCheck = this.getGroup(doneChildren).every(
        //       ({ children: mapChildren }, index) => {
        //         return (
        //           (this.getGroup(children)[index].children || []).length ===
        //           mapChildren.length
        //         );
        //       }
        //     );
        //     if (autoCheck) {
        //       const { nodes: doneNodes } = this.data[fIndex];
        //       const doneFormsArr = doneNodes
        //         .filter(({ forms }) => forms)
        //         .map(({ forms }) => forms);
        //       const rowFormsArr = nodes
        //         .filter(({ forms }) => forms)
        //         .map(({ forms }) => forms);
        //       doneFormsArr.map((doneForms, index) => {
        //         doneForms.map(({ type: doneType }, dIndex) => {
        //           this.$set(rowFormsArr[index][dIndex], "type", doneType);
        //         });
        //       });
        //       return { autoCheck };
        //     }
        //   }
        // }
        return {
          doing: true,
        };
      };
    },
  },
  methods: {
    toggleIndex(index) {
      this.curIndex = index;
      this.$emit("toggleCurPsd", index);
    },
    getGroup(data) {
      return data.filter((item) => item.type == "group");
    },
    loadend() {
      if (++this.loadNum >= this.data.length) {
        this.$emit("loadend");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.kenifeFiles {
  box-shadow: 0 0 10px 1px #999;
  padding: 0 10px;
  height: 100%;
  .thumbnail {
    display: flex;
    height: 44px;
    border: 1px solid $border-color;
    border-radius: 4px;
    cursor: pointer;
    .img {
      width: 60px;
      display: inline-block;
      object-fit: contain;
      flex: 0 0 60px;
    }
    .code {
      display: inline-block;
      flex: 1;
      line-height: 44px;
      padding: 0 10px;
      margin-left: 5px;
      @include overflow;
      background-color: rgb(228, 220, 220);
    }
    .el-button {
      width: 70px;
      font-size: 12px;
      margin: 0 5px;
    }
    .doing {
      color: $color-gray;
    }
    .success {
      color: $color-success;
    }
  }
  .thumbnail + .thumbnail {
    margin-top: 10px;
  }
  .thumbnail.active {
    .code {
      background-color: $color-primary;
      color: #fff;
    }
  }
}
</style>