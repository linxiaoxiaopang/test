<template>
  <el-table
    :data="formatData"
    :row-style="showRow"
    v-loading="tableLoading"
    :tooltip-effect="$attrs['tooltip-effect'] || 'dark'"
    :style="{
      width: $attrs.width || '100%',
      'max-height': $attrs['max-height'] || 'auto',
      'min-height': $attrs['min-height'] || 'auto'
    }"
    :border="$attrs.border || true"
    v-bind="
      Object.assign(
        height === 'auto'
          ? {}
          : {
              height: 'calc(100vh - 180px)'
            },
        $attrs
      )
    "
    v-on="$listeners"
  >
    <template slot="empty">
      <slot name="empty">
        {{ $attrs['empty-text'] || '暂无数据' }}
      </slot>
    </template>

    <el-table-column
      v-if="selection"
      type="selection"
      width="55"
    ></el-table-column>

    <el-table-column
      v-for="(column, index) in columns.slice(0, 1)"
      :key="column.prop"
      :label="column.label"
      :minWidth="column.minWidth"
    >
      <template slot-scope="scope">
        <div style="display: flex">
          <span
            v-for="space in scope.row._level"
            v-if="index === 0"
            :key="space"
            class="ms-tree-space"
          />
          <span
            v-if="iconShow(index, scope.row)"
            class="tree-ctrl"
            @click="toggleExpanded(scope.$index)"
          >
            <i v-if="!scope.row._expanded" class="el-icon-plus" />
            <i v-else class="el-icon-minus" />
          </span>
          <span v-if="!column.slotName">
            {{
              scope.row[column.prop] == 'company'
                ? '公司'
                : scope.row[column.prop] == 'department'
                ? '部门'
                : scope.row[column.prop]
            }}
          </span>

          <slot
            v-else
            :name="column.slotName"
            :scoped="{ ...scope.row, prop: column.prop, $index: scope.$index }"
          ></slot>
        </div>
      </template>
    </el-table-column>

    <template
      v-for="(
        {
          prop,
          label,
          width,
          minWidth,
          headerSlotName,
          slotName,
          isSex,
          isPic,
          align,
          detailArr
        },
        index
      ) in columns.slice(1)"
    >
      <el-table-column
        v-if="isPic"
        show-overflow-tooltip
        :prop="prop"
        :label="label"
        :key="index"
        :width="width"
        :min-width="minWidth"
      >
        <template slot-scope="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            content="点击可以查看原图"
            placement="right"
          >
            <el-image
              style="width: 120px; height: 80px"
              :src="row[prop] | formatUrl"
              :preview-src-list="row[prop] | prvFormatUrl"
              fit="cover"
            />
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column
        v-else-if="detailArr"
        show-overflow-tooltip
        :prop="prop"
        :label="label"
        :key="index"
        :width="width"
        :min-width="minWidth"
      >
        <template slot-scope="{ row }">
          <span>{{ detailArr[row[prop]] }}</span>
        </template>
      </el-table-column>

      <template v-else-if="headerSlotName && slotName">
        <!-- 既自定义头部插槽 和 又自定义col插槽  -->
        <el-table-column
          :prop="prop"
          :key="index"
          :label="label"
          :width="width"
          :align="align"
          :min-width="minWidth"
        >
          <template slot="header" slot-scope="{ row }">
            <slot :name="headerSlotName" :scoped="{ ...row, prop }"></slot>
          </template>
          <template slot-scope="{ row }">
            <slot :name="slotName" :scoped="{ ...row, prop }"></slot>
          </template>
        </el-table-column>
      </template>
      <!-- 自定义col插槽 -->
      <el-table-column
        v-else-if="slotName"
        :prop="prop"
        :label="label"
        :key="index"
        :width="width"
        :min-width="minWidth"
        :align="align"
      >
        <template slot-scope="{ row, $index }">
          <slot :name="slotName" :scoped="{ ...row, prop, $index }"></slot>
        </template>
      </el-table-column>

      <!-- 自定义头部插槽 -->
      <el-table-column
        v-else-if="headerSlotName"
        :prop="prop"
        :label="label"
        :key="index"
        :width="width"
        :min-width="minWidth"
      >
        <template slot="header" slot-scope="{ row }">
          <slot :name="headerSlotName" :scoped="{ ...row, prop }"></slot>
        </template>
      </el-table-column>

      <el-table-column
        v-else-if="isSex"
        :prop="prop"
        :label="label"
        :key="index"
        min-width="100px"
      >
        <template slot-scope="{ row }">
          <el-tag type="danger" v-if="row[prop] == 0">未知</el-tag>
          <el-tag type="success" v-else-if="row[prop] == 1">男</el-tag>
          <el-tag type="warning" v-else-if="row[prop] == 2">女</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        v-else
        show-overflow-tooltip
        :prop="prop"
        :label="label"
        :minWidth="minWidth"
        :key="index"
      />
    </template>
    <slot></slot>
  </el-table>
</template>

<script>
/**
  Auth: Lei.j1ang
  Created: 2018/1/19-13:59
*/
import treeToArray from './eval'
export default {
  name: 'TreeTable',
  props: {
    selection: {
      type: Boolean,
      default: false
    },
    /* eslint-disable */
    data: {
      type: [Array, Object],
      required: true
    },
    columns: {
      type: Array,
      default: () => []
    },
    height: String,
    tableLoading: {
      type: Boolean,
      default: false
    },
    evalFunc: Function,
    evalArgs: Array,
    expandAll: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    // 格式化数据源
    formatData: function () {
      let tmp
      if (!Array.isArray(this.data)) {
        tmp = [this.data]
      } else {
        tmp = this.data
      }
      const func = this.evalFunc || treeToArray
      const args = this.evalArgs
        ? Array.concat([tmp, this.expandAll], this.evalArgs)
        : [tmp, this.expandAll]
      return func.apply(null, args)
    }
  },
  methods: {
    showRow: function (row) {
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true
      row.row._show = show
      // return show
      //   ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;"
      //   : "display:none;";
      return show
        ? {
            animation: 'treeTableShow 1s',
            '-webkit-animation': 'treeTableShow 1s'
          }
        : { display: 'none' }
    },
    // 切换下级是否展开
    toggleExpanded: function (trIndex) {
      const record = this.formatData[trIndex]
      record._expanded = !record._expanded
    },
    // 图标显示
    iconShow(index, record) {
      return index === 0 && record.children && record.children.length > 0
    }
  }
}
</script>
<style rel="stylesheet/css">
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<style lang="scss" rel="stylesheet/scss" scoped>
$color-blue: #2196f3;
$space-width: 18px;
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: $space-width;
  height: 14px;
  &::before {
    content: '';
  }
}
.processContainer {
  width: 100%;
  height: 100%;
}
table td {
  line-height: 26px;
}

.tree-ctrl {
  position: relative;
  cursor: pointer;
  color: $color-blue;
  margin-left: -$space-width;
}
</style>
