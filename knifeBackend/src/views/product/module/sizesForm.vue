<template>
  <BaseDialog :dialogVisible.sync="dialog" width="800px" :title="title">
    <div v-if="dialog">
      <el-tabs
        class="sizesEditComponent"
        closable
        type="border-card"
        v-model="activeName"
        @tab-remove="remove"
      >
        <el-tab-pane
          :label="form.size_name || '暂无尺码'"
          :name="form.id | paneName"
          :key="form.id | paneName"
          v-for="form in data.sizes"
        >
          <template>
            <BaseForm
              ref="form"
              label-width="100px"
              :cols="formField"
              :form="form"
              :formVisible="dialog"
            >
              >
              <!-- <template #standardSlot="{ scoped: { prop } }">
                <el-radio-group
                  v-model="form[prop]"
                  @change="changeHandler(form, $event)"
                >
                  <el-radio :label="0">否</el-radio>
                  <el-radio :label="1">是</el-radio>
                </el-radio-group>
              </template> -->
            </BaseForm>
          </template>
        </el-tab-pane>

        <el-tab-pane name="addNewTab" disabled>
          <span slot="label">
            <el-button
              @click="addNewSize"
              icon="el-icon-plus"
              size="mini"
              type="primary"
            >
              添加尺码
            </el-button></span
          >
        </el-tab-pane>
      </el-tabs>
    </div>
    <template #footer>
      <el-button :loading="loading" type="primary" @click="doSubmit">
        确认
      </el-button>
      <LoadingBtn @click="cancel"> 取消 </LoadingBtn>
    </template>
  </BaseDialog>
</template>
<script>
import CreateTags from "@/components/createTags";

import { sizesEditField as formField } from "../field";
import { commonFromMixin } from "@/mixins";
import { createRandomNum } from "@/utils";
import { SIZE_DETAIL, CUSTOM } from "@/utils/constant";
import { edit, del, add } from "@/api/product/protoSizeApi";

export default {
  mixins: [commonFromMixin],
  components: {
    CreateTags,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      formField,
      activeName: "",
      oSizes: [],
      loading: false,
    };
  },
  filters: {
    paneName(id) {
      return id && id.toString();
    },
  },
  methods: {
    // changeHandler(form, bool) {
    //   const sizes = this.data.sizes
    //   if (!bool && sizes.every(({ standard }) => standard == 0)) {
    //     this.$set(sizes[0], "standard", 1);
    //   }
    //   if (!bool) return;
    //   sizes.map((size) => {
    //     this.$set(size, "standard", 0);
    //   });
    //   this.$set(form, "standard", 1);
    // },
    existSameSizeName() {
      const sizes = this.data.sizes;
      const set = [
        ...new Set(sizes.map(({ size_name }) => size_name.toUpperCase())),
      ];
      return set.length < sizes.length;
    },
    remove(name) {
      const sizes = this.data.sizes;
      if (sizes.length <= 1) {
        return this.$message.warning("尺码至少需要存在一个！");
      }
      const nameIndex = this.data.sizes.findIndex(({ id }) => id == name);
      if (nameIndex >= 0) {
        const sIndex = Math.max(0, nameIndex - 1);
        this.$delete(sizes, nameIndex);
        this.activeName = sizes[sIndex].id.toString();
      }
    },

    addNewSize() {
      const tmpObj = {
        ...SIZE_DETAIL,
        id: `${CUSTOM}-${createRandomNum()}`,
      };

      this.data.sizes.push(tmpObj);
      this.activeName = tmpObj.id;
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
    async doSubmit() {
      const validData = await this.validate();
      const validIndex = validData.findIndex((bool) => {
        return bool == false;
      });
      if (validIndex >= 0) {
        this.activeName == this.data.sizes[validIndex].id.toString();
        return;
      }
      if (this.existSameSizeName()) {
        return this.$message.warning("存在两个一样的尺码，尺码名称必须唯一。");
      }
      this.doFunc();
    },
    async doFunc() {
      this.loading = true;
      try {
        const { id, sizes } = this.data || {};
        const delRes = await Promise.all([...this.doDel(sizes)]);
        const delSuccessBool = delRes.every(({ code }) => $SUC({ code }));
        if (!delSuccessBool) {
          return this.$message.error("发生错误");
        }
        const res = await Promise.all([
          ...this.doAdd(id, sizes),
          ...this.doEdit(sizes),
        ]);
        const successBool = res.every(({ code }) => $SUC({ code }));
        if (successBool) {
          this.success();
        }
      } catch (err) {
        this.$message.error(err.msg || err || "发生错误");
      }
      this.loading = false;
    },

    doDel(sizes) {
      const delArr = this.oSizes.filter(({ id }) => {
        return sizes.every((item) => item.id != id);
      });
      return delArr.map(({ id }) => del(id));
    },

    doAdd(id, sizes) {
      const addArr = sizes.filter(({ id }) => {
        if (!id) return true;

        return id.toString().indexOf(CUSTOM) >= 0;
      });
      return addArr.map((form) => {
        return add({
          ...form,
          id: undefined,
          prim_prod: id,
        });
      });
    },

    doEdit(sizes) {
      const editArr = sizes.filter(({ id }) => {
        return this.oSizes.some((item) => {
          if (id.toString().indexOf(CUSTOM) >= 0) return false;
          return item.id == id;
        });
      });
      return editArr.map(({ id, psd_file, ...form }) =>
        edit(id, {
          ...form,
        })
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.sizesEditComponent {
  ::v-deep {
    .is-disabled {
      .el-icon-close {
        opacity: 0;
      }
    }
  }
}
</style>