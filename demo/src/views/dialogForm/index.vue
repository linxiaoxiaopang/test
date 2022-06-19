<template>
  <div >
    <el-pagination :size="10" :total="100" layout="slot,slot,slot">
      <template>
        111
      </template>
    </el-pagination>
    DialogForm
  </div>
</template>

<script>
export default {
  methods: {
    clickHandler() {
      this.$DialogForm.show({
        title: "弹窗页面",
        width: "30%",
        menuPosition: "right",
        option: {
          submitText: "完成",
          span: 24,
          column: [
            {
              label: "姓名",
              prop: "name",
              rules: [
                {
                  required: true,
                  message: "请输入姓名",
                  trigger: "blur",
                },
              ],
            },
          ],
        },
        beforeClose: (done) => {
          this.$message.success("关闭前方法");
          done();
        },
        callback: (res) => {
          console.log(res.data);
          this.$message.success("关闭等待框");
          setTimeout(() => {
            res.done();
            setTimeout(() => {
              this.$message.success("关闭弹窗");
              res.close();
            }, 1000);
          }, 1000);
        },
      });
    },
  },
};
</script>

<style>
</style>