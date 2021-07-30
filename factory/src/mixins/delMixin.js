export default {
  methods: {
    // 删除
    async del(id, $el) {
      $el.loading = true
      try {
        const { msg } = await this.delApi(id)
        const size = this.size
        this.page = Math.max(
          Math.min(this.page, Math.ceil((this.total - 1) / size)),
          1
        )
        this.$message({
          showClose: true,
          type: msg ? 'error' : 'success',
          message: msg || '操作成功!',
          duration: 2500
        })
        this.init()
      } catch (err) {
        console.log(err)
      }
      $el.$refs.popover.doClose()
      $el.loading = false
    },
    //批量删除
    async bulkDel(delKey, paramsKey) {
      // selectedData变量定义在initData中
      const delLen = this.selectedData.length
      if (!this.selectedData.length) {
        this.$message({
          type: 'warning',
          message: '请先选择需要删除的数据，再进行此操作'
        })
        return
      }

      const delArr = this.selectedData.map(item => item[delKey])

      try {
        await this.$confirm(
          '此操作将永久批量删除选择的信息, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        const params = paramsKey
          ? {
            [paramsKey]: delArr
          }
          : delArr
        this.tableLoading = true
        const { msg } = await this.bulkDelApi(params)

        const size = this.size
        this.page = Math.max(
          Math.min(this.page, Math.ceil((this.total - delLen) / size)),
          1
        )
        this.$message({
          showClose: true,
          type: msg ? 'error' : 'success',
          message: msg || '删除成功!',
          duration: 2500
        })
        this.init()
      } catch (err) {
        if (err === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }
        console.log(err)
      }
      this.tableLoading = false
    }
  }
}
