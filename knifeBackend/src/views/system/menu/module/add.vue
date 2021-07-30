<template>
  <div>
    <el-button size="mini" type="success" @click="to">新建</el-button>
    <eForm ref="form" :menus="menus" :sup_this="sup_this" v-on="$listeners" v-bind="$attrs" :is-add="true" />
  </div>
</template>
<script>
import { shakingChildren } from '@/utils'
import superRouter from '@/router/superRouter'
import { parse } from 'path-to-regexp'
import eForm from './form'

export default {
  components: { eForm },
  props: {
    data: {
      type: Object,
      required: true
    },
    sup_this: {
      type: Object,
      required: true
    },
    menus: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      pid: undefined
    }
  },
  methods: {
    to() {
      const _this = this.$refs.form
      const component = this.data.component === 'Layout' ? '' : this.data.component
      _this.form = {
        id: this.data.id,
        component,
        name: this.data.name,
        sort: this.data.sort,
        pid: undefined,
        path: this.data.path.replace(/^\//, ''),
        is_show: !this.data.hidden,
        is_frame: !!this.data.is_frame,
        icon: this.data.icon
      }
      const pidData = shakingChildren(superRouter).filter(({ id }) => this.data.pid === id)
      const pidObj = pidData[0] || {}
      this.mapTreeData(this.menus, pidObj)
      _this.form.pid = this.pid || null
      this.$nextTick(() => {
        _this.dialog = true
      })
    },
    mapTreeData(data, pidObj) {
      const _this = this.$refs.form
      data.map((mItem) => {
        const { component, path, id } = mItem || {}
        const pCompnent = pidObj.component === 'Layout' ? '' : pidObj.component
        const pPath = pidObj.path && pidObj.path.replace(/^\//, '')
        if (component === pCompnent && path === pPath) {
          this.pid = id
        }
        if (this.pid === undefined && mItem.children && mItem.children.length) {
          this.mapTreeData(mItem.children, pidObj)
        }
      })
    }
  }
}
</script>

<style scoped>
div {
  display: inline-block;
  margin-right: 3px;
}
</style>
