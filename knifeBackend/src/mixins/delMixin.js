export default {
  methods: {
    // 删除
    async del(id, $el) {
      $el.loading = true
      try {
        const { code } = await this.delApi(id)
        const size = this.size || this.sup_this.size || 0
        const delLen = id.idList ? id.idList.length : 1
        if (this.page) {
          this.page = Math.max(Math.min(this.page, Math.ceil((this.total - delLen) / size)), 1)
        } else {
          this.sup_this.page = Math.max(
            Math.min(this.sup_this.page, Math.ceil((this.sup_this.total - delLen) / size)),
            1
          )
        }

        if ($SUC({ code })) {
          this.$message.success('删除成功')
          this.init()
        }
      } catch (err) {
        console.log(err)
      }
      $el.$refs.popover && $el.$refs.popover.doClose()
      $el.loading = false
    },
    //批量删除
    async bulkDel(delKey, paramsKey, data) {
      // selectedData变量定义在initData中
      const selectedData = data || this.selectedData || this.sup_this.selectedData
      const delLen = selectedData.length
      if (!selectedData.length) {
        this.$message({
          type: 'warning',
          message: '请先选择需要删除的数据，再进行此操作'
        })
        return
      }

      const delArr = selectedData.map((item) => item[delKey])

      try {
        await this.$confirm('此操作将永久批量删除选择的信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const params = paramsKey
          ? {
              [paramsKey]: delArr
            }
          : delArr
        this.tableLoading = true
        const { msg } = await this.bulkDelApi(params)
        const size = this.size || this.sup_this.size || 0

        if (this.page) {
          this.page = Math.max(Math.min(this.page, Math.ceil((this.total - delLen) / size)), 1)
        } else {
          this.sup_this.page = Math.max(
            Math.min(this.sup_this.page, Math.ceil((this.sup_this.total - delLen) / size)),
            1
          )
        }

        this.$message({
          showClose: true,
          type: msg ? 'error' : 'success',
          message: msg || '删除成功!',
          duration: 2500
        })
        this.init && this.init()
        this.sup_this.init && this.sup_this.init()
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
