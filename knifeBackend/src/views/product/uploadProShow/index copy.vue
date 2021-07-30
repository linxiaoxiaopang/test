<template>
  <div
    class="app-container uploadProShowComponent app-flex-col-container"
    v-loading="loading"
  >
    <el-tabs type="card" v-model="activeName">
      <el-tab-pane
        :name="index + ''"
        :key="index + ''"
        :label="`款式：${structure}`"
        :disabled="!prim_show_groups.length"
        v-for="({ structure, prim_show_groups }, index) in structs"
      >
        <span slot="label" @click="clickHandler(prim_show_groups)">
          {{ `款式：${structure}` }}</span
        >
        <div
          class="struct-item-wrapper"
          :key="sIndex"
          v-for="(form, sIndex) in forms[index] || []"
        >
          <el-button
            v-if="showDelBtn(index)"
            type="danger"
            size="mini"
            class="del-btn"
            @click="delHandler(index, sIndex)"
            v-p="['prim_prod:prim_show_img:delete']"
          >
            删除
          </el-button>

          <el-image
            fit="contain"
            v-if="urls[index] && urls[index][sIndex]"
            :src="urls[index][sIndex]"
          ></el-image>
          <BaseForm
            customClass="customClass"
            ref="form"
            label-width="100px"
            :pos="index"
            :cols="formField"
            :form="form"
          >
            <template #coord_showSlot="{ scoped: { prop } }">
              <ImgUpload :files.sync="form[prop]" :limit="1" />
            </template>
            <template #white_showSlot="{ scoped: { prop } }">
              <ImgUpload :files.sync="form[prop]" :limit="1" />
            </template>
            <template #shadow_showSlot="{ scoped: { prop } }">
              <ImgUpload :files.sync="form[prop]" :limit="1" />
            </template>

            <template #show_masksSlot="{ scoped: { prop } }">
              <FolderUploadBtn
                v-if="showChooseDirBtn(index, sIndex)"
                :id="`formId${index}_${sIndex}`"
                @changeHandler="changeHandler($event, sIndex)"
                v-p="['prim_prod:change_show_mask:create']"
              >
                <span>
                  <i class="el-icon-plus"></i>
                  <span> 选择效果图文件夹</span>
                </span>
              </FolderUploadBtn>
              <el-button
                type="info"
                v-else
                style="height: 32px"
                icon="el-icon-plus"
                size="mini"
                @click="prompt"
                v-p="['prim_prod:change_show_mask:create']"
              >
                选择效果图文件夹
              </el-button>
              <div class="config-list" v-p="['prim_prod:change_show_mask:create']">
                <div
                  class="config-item"
                  :key="gIndex"
                  v-for="(fileGroup, gIndex) in form[prop] || []"
                >
                  <FileItem :data="fileGroup" />
                </div>
              </div>
            </template>
          </BaseForm>
        </div>
      </el-tab-pane>

      <el-tab-pane name="addNewTab" disabled>
        <span slot="label">
          <el-button
            @click="addHandler"
            icon="el-icon-plus"
            size="mini"
            type="primary"
            v-p="['prim_prod:create_show_info:create']"
          >
            添加效果图
          </el-button></span
        >
      </el-tab-pane>
    </el-tabs>
    <div class="bottom">
      <el-button type="primary" @click="doSubmit" :loading="loading" v-p="['prim_prod:prim_show_img:partial_update']">
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
import ImgUpload from "@/components/fileUpload/imgUpload";
import FileUpload from "@/components/fileUpload/fileUpload";
import FolderUploadBtn from "@/components/folderUploadBtn";

import FileItem from "./module/fileItem";

import cloneDeep from "lodash/cloneDeep";
import { getListByProtoId as list } from "@/api/product/protoStructApi";
import { uploadProShowField as formField } from "../field";

import {
  file2Content,
  getPrimShowImgs,
  getImgDom,
  getImgData,
  getFileNameWithoutExpand,
  isFile,
  getURLBlod,
  getFileSuffix,
  createRandomNum,
} from "@/utils";
import { KNIFE_PRO_SHOW_ITEM } from "@/utils/constant";

import { add, del, edit, change } from "@/api/product/primShowApi";

const SUFFIX = "json";

export default {
  name: 'uploadProShow',
  components: {
    ImgUpload,
    FileUpload,
    FolderUploadBtn,
    FileItem,
  },

  data() {
    return {
      formField,
      loading: false,
      structs: [],
      forms: [],
      oForms: [],
      urls: [],
      activeName: "0",
    };
  },
  created() {
    this.list();
  },
  computed: {
    showDelBtn() {
      return (index) => {
        return !!this.forms[index] && this.forms[index].length > 1;
      };
    },
    showChooseDirBtn() {
      return (index, sIndex) => {
        const curForm = this.forms[index] && this.forms[index][sIndex];
        if (!curForm) {
          return false;
        }
        if (
          !(
            curForm.coord_show.length &&
            curForm.white_show.length &&
            curForm.shadow_show.length
          )
        ) {
          return false;
        }
        return true;
      };
    },
  },
  methods: {
    watchForms() {
      this.$watch(
        "forms",
        () => {
          this.uploadCoordPic();
          this.updateUrls();
        },
        {
          deep: true,
        }
      );
    },
    clickHandler(group) {
      if (!(group && group.length)) {
        this.$message.warning(
          "当前款式坐标图未创建，请先创建坐标图，再进行此操作。"
        );
      }
    },
    prompt() {
      this.$message.warning("请先上传坐标图、背景图和效果图，再进行此操作！");
    },
    addHandler() {
      const curFormArr = this.forms[this.activeName];
      curFormArr.push(cloneDeep(KNIFE_PRO_SHOW_ITEM));
    },
    delHandler(index, sIndex) {
      this.forms[index].splice(sIndex, 1);
    },
    updateUrls() {
      const formsLen = this.forms.length;
      const urlsLen = this.urls.length;
      if (formsLen > urlsLen) {
        for (let i = 0; i < formsLen - urlsLen; i++) {
          this.urls.push([]);
        }
      }
      this.forms.map((fromGroup, index) => {
        const curUrlArr = this.urls[index];
        fromGroup.map((form, sIndex) => {
          if (!form.coord_show.length) {
            curUrlArr.splice(sIndex, 1, "");
            return;
          }
          if (!curUrlArr[sIndex]) {
            curUrlArr.splice(
              sIndex,
              1,
              isFile(form.coord_show[0])
                ? URL.createObjectURL(form.coord_show[0])
                : form.coord_show[0] && form.coord_show[0].path
            );
          }
        });
      });
    },
    uploadCoordPic() {
      this.forms.map((fromGroup, index) => {
        const curUrlArr = this.urls[index];
        fromGroup.map((form, sIndex) => {
          if (!form.coord_show.length) {
            return;
          }
          if (form.show_masks.length) {
            if (!curUrlArr[sIndex]) {
              this.proShowHandler(form.show_masks, index, sIndex);
              return;
            }
            if (curUrlArr[sIndex].indexOf("http") >= 0) {
              this.proShowHandler(form.show_masks, index, sIndex);
              return;
            }
          }
        });
      });
    },

    async validate() {
      const { form } = this.$refs;
      const forms = Array.isArray(form) ? form : [form];
      const successData = await Promise.all(
        forms.map(async (node) => {
          try {
            return await node.validate();
          } catch (err) {
            return false;
          }
        })
      );
      return successData;
    },

    async changeHandler(e, index) {
      const curFormArr = this.forms[this.activeName];
      const curDoingForm = curFormArr[index];
      const files = Array.from(e.target.files || []);
      const names = [
        ...new Set(
          files
            .map(({ name }) => getFileNameWithoutExpand(name))
            .filter((name) => name)
        ),
      ];
      const filesGroup = [];
      names.map((name) => {
        filesGroup.push([]);
        files.map((file) => {
          if (getFileNameWithoutExpand(file.name) == name) {
            filesGroup[filesGroup.length - 1].push(file);
          }
        });
      });
      this.$set(
        curDoingForm,
        "show_masks",
        filesGroup.filter((group) => {
          if (group && group.length == 2) {
            const names = group.map((file) => getFileSuffix(file.name));
            return (
              names.includes("json") &&
              (names.includes("png") || names.includes("jpg"))
            );
          }
          return false;
        })
      );
      this.proShowHandler(filesGroup, this.activeName, index);
    },
    async proShowHandler(filesGroup, index, sIndex) {
      const curFormArr = this.forms[index];
      const curDoingForm = curFormArr[sIndex];
      let showPathData = await getImgData(
        isFile(curDoingForm.coord_show[0])
          ? URL.createObjectURL(curDoingForm.coord_show[0])
          : curDoingForm.coord_show[0].path
      );
      let allFilesP = filesGroup.map(async (files) => {
        if (Array.isArray(files)) {
          const tmpArr = [];
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (isFile(file)) {
              tmpArr.push(file);
            }
            if (!isFile(file)) {
              if (getFileSuffix(file.path || "") === SUFFIX) {
                tmpArr.push(await getURLBlod(file.path));
              } else {
                tmpArr.push(file);
              }
            }
          }
          return tmpArr;
        }
      });
      filesGroup = await Promise.all(allFilesP);
      let configJsons = [];
      let doms = [];
      const c = document.createElement("canvas");
      const ctx = c.getContext("2d");
      c.setAttribute("id", createRandomNum() + "");
      const { width, height } = showPathData;
      c.width = width;
      c.height = height;
      const pArr = filesGroup.map(async (files, index) => {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];

          if (file.type === "application/json") {
            const configJson = await file2Content(file);
            configJsons[index] = configJson;
          }
          if (file.type === "image/png" || getFileSuffix(file.path) === "png") {
            let dom = await getImgDom(
              isFile(file) ? URL.createObjectURL(file) : file.path
            );
            dom.setAttribute("crossOrigin", "Anonymous");
            doms[index] = dom;
          }
        }
        return true;
      });
      await Promise.all(pArr);
      ctx.putImageData(showPathData, 0, 0);
      setTimeout(() => {
        doms.map((dom, index) => {
          const { show_mask_left, show_mask_top } = JSON.parse(
            configJsons[index] || "{}"
          );
          ctx.drawImage(dom, show_mask_left, show_mask_top);
        });
        setTimeout(() => {
          this.urls[index].splice(sIndex, 1, c.toDataURL());
        }, 50);
      }, 200);
    },
    async doSubmit() {
      this.loading = true;
      try {
        const validData = await this.validate();
        const validIndex = validData.findIndex((bool) => {
          return bool == false;
        });
        if (validIndex >= 0) {
          const { form } = this.$refs;
          const forms = Array.isArray(form) ? form : [form];
          const posArr = [];
          validData.map((bool, index) => {
            if (!bool) {
              posArr.push(forms[index].$attrs.pos);
            }
          });
          this.activeName = Math.min(...posArr) + "";
          this.loading = false;
          return;
        }
        const p = await this.forms.map((formGroup, index) => {
          if (!this.structs[index].prim_show_groups.length) return false;
          const { prim_show_groups: [{ id: primGroup }] = [{}] } =
            this.structs[index] || {};
          this.primGroup = primGroup;
          return this.doFunc(formGroup, this.oForms[index] || {});
        });
        const res = await Promise.all(p);
        const success = res.every((bool) => bool);
        if (success) {
          this.$message.success("操作成功");
          this.list();
        } else {
          this.$message.warning("发生错误，请刷新页面后重新操作");
        }
      } catch (err) {
        console.log(err);
      }
      this.loading = false;
    },
    async doFunc(formGroup, oFormGroup) {
      try {
        const res = await Promise.all([
          ...this.doDel(formGroup, oFormGroup),
          ...this.doAdd(formGroup, oFormGroup),
        ]);
        return res.every(({ code }) => $SUC({ code }));
      } catch (err) {
        this.$message.error(err.msg || err || "发生错误");
        return false;
      }
    },
    doDel(formGroup, oFormGroup) {
      const delArr = oFormGroup.filter(({ id }) => {
        return formGroup.every((item) => item.id != id);
      });
      return delArr.map(({ id }) => del(id));
    },
    doAdd(formGroup) {
      const [firstAdd, ...otherAdd] = formGroup;
      const addArr = otherAdd.filter(({ id }) => {
        return !id;
      });
      const editArr = otherAdd.filter(({ id }) => {
        return id;
      });
      const marksEditArr = formGroup.filter(({ id, show_masks }) => {
        return (
          id &&
          show_masks.every((showMask) => showMask.some((path) => isFile(path)))
        );
      });
      const tmpArr = [];
      if (firstAdd.id) {
        const { id } = firstAdd;
        const formData = new FormData();
        if (firstAdd.is_cover) {
          formData.append("is_cover", true);
        }
        formData.append("prim_group", this.primGroup);
        formData.append("proto_id", this.$route.query.protoId);
        const isChange = this.appendFormData(formData, firstAdd);
        if (!firstAdd.is_cover || isChange) {
          tmpArr.push(edit(id, formData));
        }
      }
      if (!firstAdd.id) {
        const formData = new FormData();
        this.addAppendFormData(formData, firstAdd);
        formData.append("is_cover", true);
        formData.append("prim_group", this.primGroup);
        formData.append("proto_id", this.$route.query.protoId);
        tmpArr.push(add(formData));
      }
      addArr.map((form) => {
        const formData = new FormData();
        this.addAppendFormData(formData, form);
        formData.append("prim_group", this.primGroup);
        formData.append("is_cover", false);
        formData.append("proto_id", this.$route.query.protoId);
        tmpArr.push(add(formData));
      });
      editArr.map((form) => {
        const { id } = form;
        const formData = new FormData();
        const isChange = this.appendFormData(formData, form);
        if (isChange) {
          formData.append("prim_group", this.primGroup);
          formData.append("is_cover", false);
          tmpArr.push(edit(id, formData));
        }
      });
      marksEditArr.map((form) => {
        const { id } = form;
        const formData = new FormData();
        formData.append("show_img_id", id);
        this.markAppendFormData(formData, form);
        tmpArr.push(change(formData));
      });
      return tmpArr;
    },
    addAppendFormData(formData, form) {
      const {
        coord_show: [coord_show],
        white_show: [white_show],
        shadow_show: [shadow_show],
        show_masks = [],
      } = form;
      if (isFile(coord_show)) {
        formData.append("coord_show", coord_show);
      }
      if (isFile(white_show)) {
        formData.append("white_show", white_show);
      }
      if (isFile(shadow_show)) {
        formData.append("shadow_show", shadow_show);
      }
      show_masks.map((showMask) => {
        showMask.map((file) => {
          if (isFile(file)) {
            formData.append("show_masks", file);
          }
        });
      });
    },
    appendFormData(formData, form) {
      let isAppend = false;
      const {
        coord_show: [coord_show],
        white_show: [white_show],
        shadow_show: [shadow_show],
      } = form;
      if (isFile(coord_show)) {
        formData.append("coord_show", coord_show);
        isAppend = true;
      }
      if (isFile(white_show)) {
        formData.append("white_show", white_show);
        isAppend = true;
      }
      if (isFile(shadow_show)) {
        formData.append("shadow_show", shadow_show);
        isAppend = true;
      }
      return isAppend;
    },
    markAppendFormData(formData, form) {
      const { show_masks = [] } = form;
      show_masks.map((showMask) => {
        showMask.map((file) => {
          if (isFile(file)) {
            formData.append("show_masks", file);
          }
        });
      });
    },
    async list() {
      this.loading = true;
      try {
        const { protoId } = this.$route.query || {};
        if (!protoId) {
          return this.$router.back();
        }
        const { code, detail = [] } = (await list(protoId)) || {};
        if ($SUC({ code })) {
          this.structs = detail;
          const tmpForms = getPrimShowImgs(cloneDeep(detail));
          this.forms = tmpForms.map((item) => {
            if (!item) {
              return [];
            }
            if (!item.length) {
              item.push(cloneDeep(KNIFE_PRO_SHOW_ITEM));
            } else {
              item.map((sItem) => {
                sItem.coord_show = sItem.coord_show
                  ? [
                      {
                        path: sItem.coord_show,
                      },
                    ]
                  : [];
                sItem.white_show = sItem.white_show
                  ? [
                      {
                        path: sItem.white_show,
                      },
                    ]
                  : [];

                sItem.shadow_show = sItem.shadow_show
                  ? [
                      {
                        path: sItem.shadow_show || "",
                      },
                    ]
                  : [];
                if (
                  Array.isArray(sItem.show_masks) &&
                  sItem.show_masks.length
                ) {
                  sItem.show_masks = sItem.show_masks.map((mItem) => {
                    const { map_json, mask } = mItem;
                    return [{ path: map_json }, { path: mask }];
                  });
                }
              });
            }
            return item;
          });
          this.oForms = cloneDeep(this.forms);
          this.updateUrls();
          this.uploadCoordPic();
          this.watchForms();
        }
      } catch (err) {
        console.log(err);
      }
      this.loading = false;
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.uploadProShowComponent {
  .el-tabs {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    // overflow-y: auto;
    ::v-deep {
      .el-tabs__content {
        flex: 1;
        overflow-y: auto;
      }
    }
  }
  .customClass {
    border: 1px solid $border-color;
    margin-bottom: 15px;
    min-height: 500px;
  }
  .struct-item-wrapper {
    position: relative;
    .del-btn {
      position: absolute;
      top: 0px;
      right: 0;
      z-index: 100;
      cursor: pointer;
    }
    .el-image {
      position: absolute;
      // height: 100%;
      width: 400px;
      z-index: 1000;

      top: 30px;
      right: 5px;
      padding: 10px;
      height: auto;
      border: 1px solid $border-color;
      box-shadow: 0 0 5px 1px #999;
    }
    .el-image::before {
      content: "设计区域参考图";
      color: $color-primary;
      line-height: 1;
      position: absolute;
    }
  }
  .config-list {
    margin-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;
    display: flex;
    width: 720px;
    flex-wrap: wrap;
    max-height: 300px;
    overflow: auto;
    box-shadow: 0 0 10px 1px #999;
  }
  .config-item {
    margin-top: 10px;
    padding: 10px 10px 0 10px;
    padding-left: 20px;
    display: block;
    width: 350px;
    border: 1px solid $border-color;
  }
  .config-item:nth-child(2n) {
    border-left: none;
  }
  .card {
    width: 100%;
  }
  .el-tabs {
    background: #fff;
    padding: 10px;
  }

  .bottom {
    .el-button {
      width: 150px;
    }
  }
}
</style>