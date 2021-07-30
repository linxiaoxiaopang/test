<template>
  <div>
    <menuTreeTable
      :data="addDomNewMenus"
      operationTitle="待新建菜单列表"
      :tableLoading="tableLoading"
    >
      <template #rightOperationBtn>
        <LoadingBtn
          v-if="!data.length"
          type="primary"
          size="mini"
          @click="bulkDoAdd"
        >
          新建全部
        </LoadingBtn>
      </template>
      <slot>
        <el-table-column
          label="操作"
          width="80px"
          align="center"
          v-if="data.length"
        >
          <template slot-scope="{ row }">
            <add
              :menus="menus"
              :delMenus="delDomMenus"
              :data="row"
              :sup_this="sup_this"
            />
          </template>
        </el-table-column>
      </slot>
    </menuTreeTable>

    <menuTreeTable
      :data="delDomMenus"
      operationTitle="待删除菜单列表"
      :tableLoading="tableLoading"
    >
      <slot
        ><el-table-column label="操作" width="80px" align="center">
          <template slot-scope="scope">
            <el-popover :ref="scope.row.id" placement="top" width="200">
              <p>确定删除吗,如果存在下级节点则节点上升，此操作不能撤销！</p>
              <div style="text-align: right; margin: 0">
                <el-button
                  size="mini"
                  type="text"
                  @click="$refs[scope.row.id].doClose()"
                  >取消</el-button
                >
                <el-button
                  :loading="delLoading"
                  type="primary"
                  size="mini"
                  @click="subDelete(scope.row.id)"
                  >确定</el-button
                >
              </div>
              <el-button
                slot="reference"
                :disabled="scope.row.id === 1"
                type="danger"
                size="mini"
                >删除</el-button
              >
            </el-popover>
          </template>
        </el-table-column></slot
      >
    </menuTreeTable>
    <menuTreeTable
      :data="domData"
      operationTitle="列表展示"
      :tableLoading="tableLoading"
    >
      <slot>
        <el-table-column label="操作" width="80px" align="center">
          <template slot-scope="scope">
            <edit :menus="menus" :data="scope.row" :sup_this="sup_this" />
          </template>
        </el-table-column>
      </slot>
    </menuTreeTable>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import initDataMixin from '@/mixins/initData'
import { shakingChildren, parseTime, bothDifferent, treeData } from '@/utils'
import { del, getMenuTree, bulkAdd } from '@/api/menu'
import CommonTreeTable from '@/components/commonTreeTable'
import eHeader from './module/header'
import edit from './module/edit'
import add from './module/add'
import createChild from './module/createChild'
import { cmmonMenuCols } from './cols'
import superRouter from '@/router/superRouter'
import menuTreeTable from './module/menuTreeTable'
import { mapActions } from 'vuex'
import { buildMenus } from '@/api/login'
import { filterAsyncRouter } from '@/store/modules/permission'
import router from '@/router'

import { MENU_TYPE } from '@/utils/constant'

export default {
  components: {
    menuTreeTable,
    CommonTreeTable,
    eHeader,
    edit,
    add,
    createChild,
    treeTable
  },
  mixins: [initDataMixin],
  data() {
    return {
      columns: [
        {
          text: '名称',
          value: 'name'
        }
      ],
      firstRresh: true,
      data: [], //数据库里的menu值
      clientMenus: [], //前端的menu值
      addNewMenus: [], //新增menu
      delMenus: [], //需要删除的menu
      cmmonMenuCols,
      delLoading: false,
      sup_this: this,
      menus: [],
      url: 'api/rbac/menus/',
      size: 1000,
      selectComponentList: [] //组件路径下拉框数据
    }
  },
  watch: {
    data: {
      handler() {
        this.$nextTick(() => {
          this.addNewMenus = treeData(
            bothDifferent(
              shakingChildren(superRouter).map((item) => {
                item.menu_type = MENU_TYPE
                return item
              }),
              shakingChildren(this.data)
            ),
            null
          )
          this.delMenus = treeData(
            bothDifferent(
              shakingChildren(this.data),
              shakingChildren(superRouter)
            ),
            null
          )
        })
      },
      deep: true
    }
  },
  computed: {
    addDomNewMenus() {
      return this.getOwnData(this.addNewMenus)
    },
    delDomMenus() {
      return this.getOwnData(this.delMenus)
    },
    domData() {
      return this.getOwnData(this.data)
    }
  },
  methods: {
    ...mapActions(['GenerateRoutes']),
    parseTime,
    getOwnData(data) {
      return data.filter(({ menu_type }) => menu_type === MENU_TYPE)
    },
    initCallBack() {
      // if (!this.firstRresh) {
      //   buildMenus().then((res) => {
      //     const detail = res.detail;
      //     const isRedirect =
      //       detail[0] &&
      //       detail[0].children &&
      //       Array.isArray(detail[0].children) &&
      //       detail[0].children.length > 0;
      //     if (isRedirect) {
      //       detail[0].path = "/";
      //       detail[0].redirect = `/${detail[0].children[0].path}`;
      //     }
      //     const asyncRouter = filterAsyncRouter(res.detail);
      //     asyncRouter.push({ path: "*", redirect: "/404", hidden: true });
      //     this.GenerateRoutes(asyncRouter).then(() => {
      //       // 存储路由
      //       router.addRoutes(asyncRouter); // 动态添加可访问路由表
      //       console.log(this.$router.options.routes);
      //     });
      //   });
      // }
      this.getMenus()
      this.firstRresh = false
    },
    subDelete(id) {
      this.delLoading = true
      del(id)
        .then((res) => {
          this.delLoading = false
          this.$refs[id].doClose()
          this.init()
          this.$message({
            showClose: true,
            type: 'success',
            message: '删除成功!',
            duration: 2500
          })
        })
        .catch((err) => {
          this.delLoading = false
          this.$refs[id].doClose()
          console.log(err)
        })
    },
    getMenus() {
      getMenuTree().then((res) => {
        const menus = res.detail || []
        this.menus = menus.filter(({ menu_type }) => menu_type === MENU_TYPE)
      })
    },
    //批量新增
    async bulkDoAdd(menu) {
      let params = []
      if (!menu) {
        params = this.fotmatBulkParams(shakingChildren(this.addNewMenus))
      } else {
        const {
          path,
          component,
          icon,
          id,
          pid,
          is_frame,
          is_show = true,
          name,
          sort
        } = menu
        params = [
          {
            path,
            component,
            icon,
            id,
            pid,
            is_frame: !!is_frame,
            is_show: !!is_show,
            name,
            sort
          }
        ]
      }
      try {
        params.map((item) => {
          item.menu_type = MENU_TYPE
        })

        await bulkAdd(params)
        this.init()
        this.$message({
          showClose: true,
          type: 'success',
          message: '新增成功!',
          duration: 2500
        })
      } catch (err) {
        console.log(err)
      }
    },
    fotmatBulkParams(data) {
      let tempArr = []
      data.map((item) => {
        const { component, id, pid, name, path, hidden, icon, sort } = item
        const params = {
          component: component === 'Layout' ? '' : component,
          id,
          pid,
          name,
          icon,
          path: path.replace(/^\//, ''),
          is_frame: false,
          is_show: !hidden,
          sort
        }
        tempArr.push(params)
        // if (Array.isArray(item.children) && item.children.length > 0) {
        //   tempArr = tempArr.concat(shakingChildren(item.children));
        // }
      })
      return tempArr
    }
  }
}
</script>

<style scoped></style>
