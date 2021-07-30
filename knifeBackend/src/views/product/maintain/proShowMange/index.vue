<template>
  <section>
    <BaseProductPage :cols="cols" :formField="formField" :resetUrl="url">
      <template #tips>
        <el-alert
          title="上架后的原型，无法编辑效果图以及校验效果图"
          type="warning"
          show-icon
        ></el-alert>
      </template>
      <template v-slot="{ sup_this }">
        <el-table-column fixed="right" align="center" label="操作" width="330px">
          <template slot-scope="{ row }">
            <color-text-btn
              class="line"
              type="info"
              size="mini"
              v-if="!isLack(row)"
              @click="downloadCoord(row)"
              >下载坐标图</color-text-btn
            >
            <color-text-btn
              class="line"
              style="margin-left: 0px"
              v-if="psdExist(row)"
              :type="isLack(row) ? 'info' : 'danger'"
              @click="linkToCodeKnifePic(row)"
              v-p="[
                'prim_prod:upload_coord_img:create',
                'prim_prod:change_coord_img:create',
              ]"
              >{{ isLack(row) ? "创建坐标图" : "更新坐标图" }}</color-text-btn
            >
            <color-text-btn
              type="warning"
              size="mini"
              class="line"
              v-if="!psdExist(row)"
              @click="psdFileEmpty"
              >未设置标准尺码</color-text-btn
            >
            <ProShowEdit
              v-if="someCoordExist(row) && psdExist"
              :sup_this="sup_this"
              :data="row"
              class="figure-edit"
              v-p="[
                'prim_prod:prim_struct:list',
                'prim_prod:create_show_info:create',
                'prim_prod:prim_show_img:delete',
                'prim_prod:prim_show_img:partial_update',
                'prim_prod:change_show_mask:create',
              ]"
            />
            <CheckReference :data="row" :isLack="isLack(row)"></CheckReference>
          </template>
        </el-table-column>
      </template>
    </BaseProductPage>
  </section>
</template>

<script>
import BaseProductPage from "../../baseProductPage";
import ProShowEdit from "./module/proShowEdit";
import CheckReference from "./module/checkReferenceBtn";

import { createRandomNum } from "@/utils";

import { proShowMangeField as formField } from "../../field";
import { proShowMangeCols as cols } from "../../cols";
export default {
  name: "proShowMange",
  components: {
    BaseProductPage,
    ProShowEdit,
    CheckReference,
  },
  data() {
    return {
      cols,
      formField,
      url: "/api/prim_prod/prim_product_show/",
    };
  },
  computed: {
    isLack() {
      return (row) => {
        try {
          const { prim_struct = [] } = row || {};
          const isLack = prim_struct.every(({ prim_show_groups = [] }) => {
            return prim_show_groups[0].coord_image;
          });
          return !isLack;
        } catch (err) {
          return true;
        }
      };
    },
    someCoordExist() {
      return (row) => {
        try {
          const { prim_struct = [] } = row || {};
          const isExist = prim_struct.some(({ prim_show_groups = [] }) => {
            prim_show_groups = Array.isArray(prim_show_groups) ? prim_show_groups : [];
            if (!prim_show_groups.length) {
              return false;
            }
            return prim_show_groups[0].coord_image;
          });
          return isExist;
        } catch (err) {
          return false;
        }
      };
    },
    psdExist() {
      return (row) => {
        const { base_sizes } = row || {};
        return base_sizes.some(({ psd_file }) => psd_file);
      };
    },
  },
  methods: {
    downloadCoord(row) {
      try {
        const {
          prim_struct: [
            {
              prim_show_groups: [{ coord_kl, white_kl, coord_image }],
            },
          ],
        } = row;
        this.downloadByPath([coord_kl, white_kl, coord_image]);
      } catch (err) {
        this.$message.warning("下载坐标图失败");
      }
      console.log("row", row);
    },
    // downloadByPath(paths) {
    //   const alinks = [];
    //   for (let i = 0; i < paths.length; i++) {
    //     const path = `${paths[i]}?uid=${createRandomNum()}`;
    //     console.log('path', path)
    //     const aLink = document.createElement("a");
    //     aLink.className = "thunder-link";
    //     aLink.setAttribute("href", path);
    //     document.body.append(aLink);
    //     alinks.push(aLink);
    //     setTimeout(() => {
    //       aLink.click();
    //     }, 50 * i + 1);
    //   }

    //   this.$nextTick(() => {
    //     thunderLink();

    //     this.$nextTick(() => {
    //       alinks.map((aLink, i) => {
    //         setTimeout(() => {
    //           document.body.removeChild(aLink);
    //         }, 50 * i + 1);
    //       });
    //     });
    //   });
    // },
    downloadByPath(paths) {
      const tasks = paths.map((url) => {
        return {
          name: "",
          url: `${url}?uid=${createRandomNum()}`,
        };
      });
      thunderLink.newTask({
        downloadDir: "", // 指定当前任务的下载目录名称，迅雷会在用户剩余空间最大的磁盘根目录中创建这个目录。【若不填此项，会下载到用户默认下载目录】
        tasks,
      });
    },
    psdFileEmpty() {
      this.$message.warning("标准尺码未设置，请前往刀版图管理页面处理。");
    },
    linkToCodeKnifePic(row) {
      const { base_sizes, prim_struct = [] } = row || {};
      // if (
      //   prim_struct[0] &&
      //   Array.isArray(prim_struct[0].prim_show_groups) &&
      //   prim_struct[0].prim_show_groups[0] &&
      //   prim_struct[0].prim_show_groups[0].prim_show_img.length
      // ) {
      //   return this.$message.warning("请先清空效果图，再进行此操作！！");
      // }
      this.$router.push(
        `/product/maintain/createCoordPic?id=${
          base_sizes[0] && base_sizes[0].id
        }&&structId=${prim_struct.map(({ id }) => id)}&&protoId=${row.id}`
      );
    },
  },
};
</script>

<style scoped>
.el-alert {
  margin-top: -20px;
  margin-bottom: 20px;
}
</style>
