<template>
  <el-table
    ref="table"
    :data="infoData"
    :class="['commonTableComponent', size === 'mini' && 'minicommonTableComponent']"
    v-loading="tableLoading"
    :tooltip-effect="$attrs['tooltip-effect'] || 'dark'"
    :style="{
      width: $attrs.width || '100%',
      'max-height': $attrs['max-height'] || 'auto',
      'min-height': $attrs['min-height'] || 'auto'
    }"
    :border="$attrs.border === undefined ? true : $attrs.border"
    v-bind="
      Object.assign(
        height === 'auto'
          ? {}
          : {
              height: height ? height : 'calc(100vh - 240px)'
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
    <el-table-column v-if="selection" type="selection" width="55"></el-table-column>
    <el-table-column type="expand" v-if="isExpand">
      <template slot-scope="scoped">
        <slot name="expand" :scoped="{ ...scoped.row, index: scoped.$index }"> </slot>
      </template>
    </el-table-column>
    <template
      v-for="(
        {
          prop,
          label,
          width,
          minWidth,
          align,
          fixed,
          headerSlotName,
          slotName,
          isSex,
          isPic,
          detailArr,
          children,
          required,
          sortable
        },
        index
      ) in cols"
    >
      <el-table-column
        v-if="children"
        :prop="prop"
        :label="label"
        :key="index"
        :width="width"
        :align="align"
        :min-width="minWidth"
        :sortable="sortable"
      >
        <template v-for="item in children">
          <el-table-column
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :min-width="item.minWidth"
            :sortable="sortable"
          >
            <template slot-scope="{ row, $index }">
              <slot :name="item.prop" :scoped="{ ...row, row, prop: item.prop, index: $index }">
                <span>{{ row[item.prop] }}</span>
              </slot>
            </template>
          </el-table-column>
        </template>
      </el-table-column>
      <el-table-column
        v-else-if="isPic"
        :prop="prop"
        :label="label"
        :key="index"
        :width="width"
        :min-width="minWidth"
        sortable
      >
        <template slot-scope="{ row }">
          <!-- <el-tooltip
            class="item"
            effect="dark"
            content="点击可以查看原图"
            placement="right"
          > -->
          <template v-if="Array.isArray(row[prop])">
            <el-image
              style="width: 60px; height: 60px"
              fit="contain"
              lazy
              :scroll-container="height === 'auto' ? undefined : '.el-table__body-wrapper'"
              :src="row[prop][0].path | formatUrl('min')"
              :preview-src-list="row[prop] | prvFormatUrl"
            />
          </template>
          <el-image
            style="width: 60px; height: 60px"
            fit="contain"
            lazy
            :scroll-container="height === 'auto' ? undefined : '.el-table__body-wrapper'"
            v-else
            :src="row[prop] | formatUrl('min')"
            :preview-src-list="row[prop] | prvFormatUrl"
          />
          <!-- </el-tooltip> -->
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
        :sortable="sortable"
      >
        <template slot-scope="{ row }">
          <span>{{ detailArr[row[row.prop]] }}</span>
        </template>
      </el-table-column>

      <template v-else-if="(headerSlotName || required) && slotName">
        <!-- 既自定义头部插槽 和 又自定义col插槽  -->
        <el-table-column
          :prop="prop"
          :key="index"
          :label="label"
          :width="width"
          :min-width="minWidth"
          :sortable="sortable"
        >
          <template slot="header" slot-scope="{ row }">
            <template v-if="required"> <span class="required">*</span> {{ label }} </template>
            <slot :name="headerSlotName" :scoped="{ ...row, row, prop }"></slot>
          </template>
          <template slot-scope="{ row, $index }">
            <slot :name="slotName" :scoped="{ ...row, row, prop, index: $index }"></slot>
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
        :sortable="sortable"
      >
        <template slot-scope="{ row, $index }">
          <slot :name="slotName" :scoped="{ ...row, row, prop, index: $index }"></slot>
        </template>
      </el-table-column>

      <!-- 自定义头部插槽 -->
      <el-table-column
        v-else-if="headerSlotName || required"
        :prop="prop"
        :label="label"
        :key="index"
        :width="width"
        :min-width="minWidth"
        :sortable="sortable"
      >
        <template slot="header" slot-scope="{ row }">
          <span class="required" v-if="required">*</span> {{ label }}
          <slot :name="headerSlotName" :scoped="{ ...row, row, prop }"></slot>
        </template>
      </el-table-column>

      <el-table-column
        v-else-if="isSex"
        :prop="prop"
        :label="label"
        :key="index"
        min-width="100px"
        :sortable="sortable"
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
        :fixed="fixed"
        :sortable="sortable"
      />
    </template>
    <slot></slot>
  </el-table>
</template>

<script>
export default {
  props: {
    selection: {
      type: Boolean,
      default: true
    },
    infoData: {
      type: Array,
      default: () => []
    },
    height: String,
    cols: {
      type: Array,
      default: () => []
    },
    tableLoading: {
      type: Boolean,
      default: false
    },
    size: {
      type: String
    },
    isExpand: Boolean
  },
  computed: {
    table() {
      return this.$refs.table
    }
  }
}
</script>
<style lang="scss" scoped>
.commonTableComponent {
  ::v-deepth {
    // background: rgb(245, 247, 250);
    font-weight: normal;
  }
  ::v-deep .el-table--border th {
    border-right: none;
    border-bottom: none;
  }
  .required {
    color: red;
  }
}
.minicommonTableComponent {
  ::v-deep td {
    padding: 0px;
  }
  ::v-deep.cell {
    line-height: 1.25;
    .el-image {
      padding: 5px 0;
    }
  }
}
</style>
