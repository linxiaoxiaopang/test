<template>
  <div>
    <el-button
      type="default"
      :loading="data.loading"
      v-if="back"
      @click="$router.go(-1)"
    >
      返回
    </el-button>
    <el-button
      type="primary"
      :loading="data.loading"
      v-if="!doneSuccess"
      @click="doSubmit"
    >
      保存
    </el-button>
    <el-button type="success" @click="successHandler" v-else>
      处理成功
    </el-button>
    <el-button @click="autoModify" v-if="showModefyBtn" type="info"
      >自动校验匹配图层</el-button
    >
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true
    },
    back: {
      type: Boolean,
      required: false,
      default: false
    },
    data: {
      type: Object,
      required: true
    },
    psdListData: {
      type: Array,
      required: true
    },
    index: {
      required: true
    }
  },
  computed: {
    doneSuccess() {
      return this.data.success
    },
    showModefyBtn() {
      const { success, loading, children } = this.data
      if (success || loading !== undefined) return false
      const fIndex = this.successIndex()
      if (fIndex >= 0) {
        const doneItem = this.psdListData[fIndex]
        const { children: doneChildren } = doneItem
        if (children.length == doneChildren.length) {
          const autoCheck = this.getGroup(doneChildren).every(
            ({ children: mapChildren }, index) => {
              return (
                (this.getGroup(children)[index].children || []).length ===
                mapChildren.length
              )
            }
          )
          return autoCheck
        }
      }
      return false
    }
  },
  methods: {
    doSubmit() {
      this.$emit('doSubmit', {
        data: this.data,
        index: this.index
      })
    },
    successHandler() {
      this.$message.warning('此尺码已经处理成功，请勿重复处理！')
    },
    getGroup(data) {
      return data.filter((item) => item.type == 'group')
    },
    successIndex() {
      return this.psdListData.findIndex(
        ({ success, loading }) => success || loading !== undefined
      )
    },
    async autoModify() {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(true)
        }, 300)
      })
      const { nodes } = this.data
      const fIndex = this.successIndex()
      const { nodes: doneNodes } = this.psdListData[fIndex]
      const doneFormsArr = doneNodes
        .filter(({ forms }) => forms)
        .map(({ forms }) => forms)
      const rowFormsArr = nodes
        .filter(({ forms }) => forms)
        .map(({ forms }) => forms)
      doneFormsArr.map((doneForms, index) => {
        doneForms.map(({ type: doneType }, dIndex) => {
          const formItem =
            (rowFormsArr[index] && rowFormsArr[index][dIndex]) || {}
          if (formItem.type != 0) {
            this.$set(formItem, 'type', doneType)
          }
        })
      })
      this.$message.success('校验完毕，请核查。')
    }
  }
}
</script>

<style></style>
