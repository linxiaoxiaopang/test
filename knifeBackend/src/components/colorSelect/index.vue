<template>
  <div>
    <el-select
      filterable
      style="width: 100%"
      v-model="value"
      placeholder="请选择"
    >
      <el-option
        v-for="item in data"
        :key="item.id"
        :label="item.color_name"
        :value="item.id"
      >
        <div class="color-select-wrapper-item">
          <span class="label">{{ item.color_name }}</span>
          <span class="color" :style="{ background: item.color_value }"></span>
          <!-- <i class="el-icon-edit-outline close" @click="editHandler(item)"></i> -->
          <Edit class="close" :data="item" :sup_this="m_this" />
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
      :isAdd="true"
      title="新增顔色"
    />
  </div>
</template>

<script>
import { list, del } from '@/api/product/colorApi'
import { commonEheaderMixin } from '@/mixins'
import Edit from './module/edit'
import EForm from './form'
export default {
  mixins: [commonEheaderMixin],
  components: {
    EForm,
    Edit,
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
    }
  },
  created() {
    this.init()
  },
  watch: {
    value(newVal) {
      this.$emit('update:color', newVal)
    },
    color(newVal) {
      this.value = newVal
    },
  },
  methods: {
    async delHandler(id) {
      const bool = await this.$confirm(
        '此操作将删除选中色值, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          return true
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
          return false
        })
      if (!bool) return
      const { code } = await del(id)
      if ($SUC({ code })) {
        this.$message.success('删除成功')
        this.init()
      }
    },
    to() {
      this.dialogVisible = true
    },
    async init() {
      const { detail, code } = (await list()) || []
      if ($SUC({ code })) {
        this.data = detail
        // console.log('value', this.value)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.color-select-wrapper-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 20px;
  .color {
    position: relative;
    display: inline-block;
    width: 15px;
    height: 15px;
    border-radius: 50%;
  }
  .close {
    right: 10px;
    position: absolute;
    top: 50%;
    margin-top: 3px;
    transform: translateY(-50%);
    cursor: pointer;
  }
  .label {
    display: inline-block;
    width: 70%;
    @include overflow;
  }
}
</style>
