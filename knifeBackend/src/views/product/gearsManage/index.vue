<template>
  <div class="app-container shelvesPage">
    <div class="whole-wrapper">
      <el-button type="primary" size="mini" @click="addGears" class="add-gears"> + 新增档位 </el-button>
      <div>
        <div class="gears-item-wrapper">
          <div v-for="(gear, index) in gearsList" :key="index" class="gears-item gears-item-background">
            <span class="gears-item-label">{{ index + 1 }}档：</span>
            <div class="input-disabled">
              <el-input size="small" readonly v-model="gear.min_count"></el-input>
            </div>
            <span class="gears-line"></span>
            <el-input
              size="small"
              v-model="gear.max_count"
              class="product-count"
              @blur="handleBlured(gear, index)"
            ></el-input>
            <span class="product-quantity">件</span>
            <span class="delete-icon" @click="deleteGears(index)" v-if="index !== 0">删除</span>
          </div>
        </div>
        <div class="notice-info" v-if="gearsList.length !== 0">保存时最后一项会变为9999，表示不限上限</div>
        <div class="button-group" v-if="gearsList.length !== 0">
          <el-button type="primary" size="mini" @click="save"> 保存 </el-button>
          <el-button size="mini" @click="cancel" class="cancel-button"> 取消 </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentGears, saveGears } from '@/api/product/productApi'

export default {
  name: 'gearsManage',
  components: {},
  created() {
    this.id = Number(this.$route.params.id)
    this.getList()
  },
  data() {
    return {
      id: '',
      gearsList: []
    }
  },
  methods: {
    addGears() {
      const total = this.gearsList.length
      let count = 1
      if (total !== 0) {
        const countNotAssigned = this.gearsList.find((item) => item.max_count === '')
        const maxSmallerThanmin = this.gearsList.find((gear) => gear.min_count >= gear.max_count)
        const message = countNotAssigned ? '请先填写终止件数' : '终止件数应大于起始件数，请重新设置！'
        if (countNotAssigned || maxSmallerThanmin) {
          this.$message({
            type: 'error',
            message
          })
          return
        }
        const hasLastItem = this.gearsList.find((item) => item.max_count === 9999)
        if (hasLastItem) {
          this.gearsList[total - 1].max_count = ''
        } else {
          count = Number(this.gearsList[total - 1].max_count) + 1
          const newGears = {
            level: total + 1,
            min_count: count,
            max_count: '',
            gear_category: this.id
          }
          if (count !== 9999) {
            this.gearsList.push(newGears)
          } else {
            this.$message({
              type: 'error',
              message: '新增档位的起始件数不能为9999！'
            })
          }
        }
      } else {
        const gears = {
          level: 1,
          min_count: 1,
          max_count: '',
          gear_category: this.id
        }
        this.gearsList.push(gears)
      }
    },
    handleErrorOccurred() {
      this.$message({
        type: 'error',
        message: '终止件数应大于起始件数，请重新设置！'
      })
    },
    save() {
      const disabled = this.gearsList.find((gear) => gear.min_count >= gear.max_count)
      if (disabled) {
        this.handleErrorOccurred()
      } else {
        this.gearsList[this.gearsList.length - 1].max_count = 9999
        const data = {
          data: this.gearsList,
          gear_category: this.id
        }
        saveGears(data).then(() => {
          this.$router.push('/product/editGears')
          this.$message({
            type: 'success',
            message: '保存成功！'
          })
        })
      }
    },
    async cancel() {
      await this.getList()
      this.$router.push('/product/editGears')
      this.$message({
        type: 'warning',
        message: '您取消了操作！'
      })
    },
    handleBlured(gear, index) {
      const { level, max_count, min_count } = gear
      if (!/(^[1-9]\d*$)/.test(max_count)) {
        gear.max_count = ''
        return
      }
      if (max_count >= 9999) {
        this.$message({
          type: 'error',
          message: '请输入一个小于9999的正整数！'
        })
        gear.max_count = ''
        return
      }
      if (max_count <= min_count) {
        this.handleErrorOccurred()
        gear.max_count = ''
        return
      }
      if (level === this.gearsList.length) return
      const currentIndex = this.gearsList.indexOf(gear)
      if (this.gearsList[currentIndex + 1]) {
        if (index !== this.gearsList.length) {
          if (this.gearsList[index + 1].max_count) {
            if (max_count >= this.gearsList[index + 1].max_count - 1) {
              console.log('111111')
              gear.max_count = ''
            } else {
              this.gearsList[currentIndex + 1].min_count = Number(max_count) + 1
            }
          } else {
            this.gearsList[currentIndex + 1].min_count = Number(max_count) + 1
          }
        }
      }
    },
    getList() {
      getCurrentGears(this.id).then((data) => {
        this.gearsList = data.detail.results
      })
    },
    deleteGears(index) {
      this.gearsList.splice(index, 1)
      if (this.gearsList.length === index) return
      this.gearsList[index].min_count = Number(this.gearsList[index - 1].max_count) + 1
      for (let i = index; i < this.gearsList.length; i++) {
        this.gearsList[i].level = this.gearsList[i - 1].level + 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-input,
  .el-input__inner {
    width: 100px;
  }
}
.whole-wrapper {
  margin-left: 20px;
  .add-gears {
    margin-bottom: 40px;
  }
  .notice-info {
    margin: 20px 0 0 277px;
    color: #ff6f30;
  }
  .button-group {
    margin-top: 19px;
    .cancel-button {
      margin-left: 16px;
    }
  }
  .gears-item-wrapper {
    width: 440px;
    min-width: 440px;
    .gears-item-background:nth-child(odd) {
      background-color: #f7f8fa;
    }
    .gears-item:first-child {
      border-top: 1px solid#DCDEE0;
    }
    .gears-item:last-child {
      border-bottom: 1px solid#DCDEE0;
    }
    .gears-item {
      display: flex;
      border-left: 1px solid #dcdee0;
      border-right: 1px solid #dcdee0;
      align-items: center;
      height: 60px;
      .input-disabled {
        ::v-deep {
          .el-input__inner {
            background: #f0f0f0;
          }
        }
      }
      .product-quantity {
        margin-left: 10px;
      }
      .delete-icon {
        margin-left: 36px;
        color: #fb6161;
        cursor: pointer;
      }
      .gears-line {
        height: 1px;
        width: 10px;
        border: 1px solid #dcdee0;
        margin: 0 13px 0 13px;
      }
      .gears-item-label {
        padding-left: 40px;
        .product-count {
          margin-left: 50px;
        }
      }
    }
  }
}
</style>
