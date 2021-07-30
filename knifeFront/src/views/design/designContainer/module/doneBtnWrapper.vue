<template>
  <div class="done-btn-wrapper">
    <Preview :data="previewData" :isNormalFont="true" />
    <el-button
      size="small"
      type="primary"
      @click="showSavePage"
      icon="el-icon-document"
      style="font-size: 14px; width: 111px"
      >下一步</el-button
    >
    <Save
      ref="savePage"
      :loading="loading"
      :previewData="previewData"
      :data="data"
      :quickDesignData="quickDesignData"
      :protoObj="protoObj"
      :sizeIds="sizeIds"
      v-if="saveShow"
      :visible.sync="saveShow"
      @hideSavePage="hideSavePage"
    />
  </div>
</template>

<script>
import Preview from './preview'
import Save from './save'
export default {
  components: {
    Preview,
    Save
  },
  props: {
    sup_this: {
      type: Object,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    quickDesignData: {
      type: Array,
      required: true
    },
    sizeIds: {
      type: Array,
      required: true
    },
    protoObj: {
      type: Object,
      required: true
    },
    previewData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      saveShow: false
    }
  },

  methods: {
    isDesigned() {
      return this.previewData.some((list) => {
        if (!Array.isArray(list)) return false
        return list.some((item) => {
          return item.base64Pic
        })
      })
    },

    hideSavePage(data) {
      this.saveShow = data
      this.sup_this.resetData()
    },
    showSavePage() {
      if (!this.isDesigned()) {
        return this.$message.warning('还未设计，请您先设计再执行保存操作！')
      }
      // return this.$message.warning('此功能暂未开放')
      this.saveShow = true
    },
    back() {
      // this.$router.replace("/design/index");
      this.$router.back()
    }
  }
}
</script>

<style lang="scss" scoped>
.done-btn-wrapper {
  position: absolute;
  display: flex;
  justify-content: center;
  background: #f7f9fb;
  padding: 10px 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 -20px;
}
</style>
