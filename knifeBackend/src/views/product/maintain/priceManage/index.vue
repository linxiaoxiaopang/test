<template>
  <section>
    <BaseProductPage
      ref="BaseProductPage"
      :cols="cols"
      :formField="formField"
      :isEdit="true"
      :resetUrl="url"
    >
      <el-table-column fixed="right" align="center" label="操作" width="180px">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            size="mini"
            class="filter-item"
            @click="handleSettingPrice(row)"
            v-if="categoriesList.length !== 0"
          >
            {{ row.sizes[0] && row.sizes[0].price_confs.length ? "编辑" : "设置" }}价格
          </el-button>
          <div class="flex-warpper" v-else>
            <span>暂无档位</span>
            <el-button
              type="text"
              size="mini"
              class="filter-item"
              @click="$router.push({ path: '/product/editGears' })"
            >
              设置档位
            </el-button>
          </div>
        </template>
      </el-table-column>
    </BaseProductPage>
    <BaseDialog
      ref="baseeDialog"
      style="text-align: left"
      v-if="showEditPriceDialog"
      @closeHandle="handleClosed"
      :dialogVisible.sync="showEditPriceDialog"
      :append-to-body="false"
      :modal-append-to-body="false"
      width="60vw"
      height="562px"
      :title="product.sizes[0].price_confs.length ? '编辑价格' : '设置价格'"
    >
      <div class="base-dialog-wrapper" v-loading="loading">
        <div class="product-wrapper flex">
          <el-image
            style="width: 60px; height: 60px"
            :src="figure(product)"
            fit="contain"
          >
            <img
              slot="error"
              src="@/assets/images/default.png"
              width="60"
              height="60"
              alt=""
              class="block"
            />
          </el-image>
          <div>
            <div class="product-name">原型名称: {{ product.name }}</div>
            <div>原型分类: {{ product.category }}</div>
          </div>
        </div>
        <div class="price-wrapper">
          <label for="select" class="selectLabel">档位分类：</label>
          <el-select
            v-model="categories"
            filterable
            style="width: 240px"
            placeholder="请选择档位分类"
            id="select"
            @change="getCategorys"
          >
            <el-option
              v-for="{ id, cate_name } in categoriesList"
              :key="id"
              :value="id"
              :label="cate_name"
            ></el-option>
          </el-select>
          <el-form
            :inline="true"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="160px"
          >
            <el-form-item style="position: relative" label="初始价格：" prop="init_price">
              <helpDialog class="guide" />
              <el-input
                size="small"
                placeholder="请输入初始价格"
                v-model="ruleForm.init_price"
              ></el-input>
            </el-form-item>
            <el-form-item
              style="position: relative"
              label="尺码价格的公差(d)："
              prop="size"
            >
              <helpDialog class="guide" />
              <el-input
                size="small"
                placeholder="请输入尺码价格的公差（d）"
                v-model="ruleForm.size"
              ></el-input>
            </el-form-item>

            <div class="init-price">
              <el-form-item
                class="size-diff"
                label="档位价格的公差(d)："
                prop="gear"
                style="position: relative"
              >
                <helpDialog class="guide" />
                <el-input
                  size="small"
                  placeholder="请输入档位价格的公差（d）"
                  v-model="ruleForm.gear"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="mini"
                  class="generate-button"
                  @click="handleButtonClicked"
                >
                  生成价格
                </el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="setting-price-wrapper">
          <div>价格设置:</div>
          <setPriceTable
            class="setPriceStyle"
            ref="setPriceTable"
            v-if="geaData.length !== 0"
            @takeRef="takeRefs"
            :priceData="priceData"
            :priceColData="priceColData"
            :isSet="false"
            :isInputVisible="true"
          ></setPriceTable>
          <div v-else class="gears-wrapper">
            <router-link to="/product/editGears"> 前往设置档位 </router-link>
          </div>
        </div>
      </div>
      <template #footer>
        <LoadingBtn type="primary" @click="handleConfirmed"> 确认 </LoadingBtn>
        <LoadingBtn @click="handleCanceled"> 取消 </LoadingBtn>
      </template>
    </BaseDialog>
  </section>
</template>

<script>
import BaseProductPage from "../../baseProductPage";
import { priceField as formField } from "../../field";
import { priceManageCols as cols } from "../../cols";
import setPriceTable from "../../module/setPrice";
import { isMoreZero, notNegative } from "@/utils/validate";
import helpDialog from "../priceManage/module/helpDialog";
import {
  getGearsCategoryList,
  getCurrentGears,
  createPrice,
  getPrice,
} from "@/api/product/productApi";
import cloneDeep from "lodash/cloneDeep";
import { mapGetters } from "vuex";
export default {
  name: "priceMange",
  components: {
    BaseProductPage,
    setPriceTable,
    helpDialog,
  },
  data() {
    var validateSize = (rule, value, callback) => {
      const ruleForm = this.ruleForm;
      const notNull = Object.values(ruleForm).every((val) => val);
      if (!notNull) {
        return callback();
      }
      const priceData = cloneDeep(this.priceData);
      // console.log('priceData', priceData)
      priceData.map((item, index) => {
        if (index == 0) {
          item.price1 = this.ruleForm.init_price;
        }
        if (index !== 0) {
          item.price1 = Number(priceData[index - 1].price1) - Number(this.ruleForm.size);
        }
      });
      priceData.map((item, fIndex) => {
        const { ids, size, size_id, priceIds, ...rest } = item;
        const priceArr = Object.keys(rest).sort((a, b) => {
          return +a.replace("price", "") - +b.replace("price", "");
        });
        priceArr.map((key, index) => {
          item[key] = Number(item["price1"]) - index * Number(this.ruleForm.gear);
          if (fIndex === priceData.length - 1 && item[key] <= 0) {
            // console.log('priceArr', priceArr)
            return callback("为保证表格每一项都为正数，请输入合适的公差。");
          }
        });
      });
      callback();
    };

    var validateGear = (rule, value, callback) => {
      const ruleForm = this.ruleForm;
      const notNull = Object.values(ruleForm).every((val) => val);
      if (!notNull) {
        callback();
      }

      if (this.priceData[0].price1 && this.ruleForm.gear) {
        // this.priceData[0].price3 =
        //   Number(this.priceData[0].price1) - (this.keysArray.length - 2) * Number(this.ruleForm.gear)
      }

      callback();
    };

    var validateInitPrice = (rule, value, callback) => {
      this.priceData[0].price1 = Number(value);
      if (!value) {
        return callback(new Error("初始价格不能为空"));
      }
      if (!/(^[1-9]\d*$)/.test(value)) {
        return callback(new Error("初始价格必须为正数"));
      }
      callback();
    };

    return {
      cols,
      formField,
      loading: true,
      url: "/api/prim_prod/prim_prod_info/for_price",
      showEditPriceDialog: false,
      gearsNum: 0,
      categories: "",
      product: {},
      priceFormData: {},
      geaData: [],
      priceData: [],

      ruleForm: {
        size: null,
        gear: null,
        init_price: null,
      },
      rules: {
        size: [
          { required: true, message: "尺码公差不能为空", trigger: "blur" },
          { validator: notNegative, trigger: "blur" },
          { validator: validateSize, trigger: "blur" },
        ],
        gear: [
          { required: true, message: "档位公差不能为空", trigger: "blur" },
          { validator: notNegative, trigger: "blur" },
          { validator: validateSize, trigger: "blur" },
        ],
        init_price: [
          { required: true, message: "初始价格不能为空", trigger: "blur" },
          { validator: isMoreZero, trigger: "blur" },
          { validator: validateSize, trigger: "blur" },
        ],
      },
    };
  },
  activated() {
    this.initAllData();
  },
  watch: {
    showEditPriceDialog(newVal) {
      if (!newVal) {
        this.clearFormData();
      }
    },
  },
  methods: {
    clearFormData() {
      this.categories = "";
      this.product = {};
      this.priceFormData = {};
      this.geaData = [];
      this.priceData = [];
      this.ruleForm = {
        size: null,
        gear: null,
        init_price: null,
      };
    },

    initAllData() {
      this.showEditPriceDialog = false;
      this.sup_this;
    },
    initProduct() {
      const { sizes = [] } = this.product;
      const tempArr = [];
      sizes.map(({ size_name, id }) => {
        tempArr.push({
          size: size_name,
          size_id: id,
        });
      });
      this.priceData = tempArr;
    },

    updateProduct(data, priceList = []) {
      this.priceData = this.priceData.map((item) => {
        const { size, size_id } = item;
        item = {
          size,
          size_id,
        };
        this.$set(item, "ids", []);
        item.priceIds = {};
        let sizePriceList = priceList.filter((price) => price.size_spec === size_id);
        data.map(({ id }, index) => {
          let priceKey = `price${index + 1}`;
          let price = sizePriceList.find((price) => price.gear_conf.id === id) || {
            price: "",
          };
          item.priceIds[priceKey] = price.id;
          this.$set(item, priceKey, price.price);
          item.ids.push(id);
        });
        return item;
      });
      const { setPriceTable } = this.$refs;
      if (setPriceTable) {
        setPriceTable.priceFormData.list = this.priceData;
      }
      // console.log('this.priceData', this.priceData)
    },

    async handleSettingPrice(data) {
      this.product = data;
      this.initProduct();
      this.showEditPriceDialog = true;
      // 获取档位分类数据
      const categoriesList = this.categoriesList;
      if (categoriesList.length) {
        let categories = (this.categories = data.gear_category || categoriesList[0].id);
        console.log(this.categories);
        await this.getCategorys(categories, data.id);
      }
    },
    async getCategorys(categories, id) {
      this.loading = true;
      try {
        const [
          {
            detail: { results },
          },
          { detail },
        ] = await Promise.all([
          getCurrentGears(categories),
          id ? getPrice(id) : Promise.resolve({}),
        ]);
        this.updateProduct(results, detail || this.curPriceList);
        this.geaData = results;
        id && (this.curPriceList = detail);
      } catch (err) {}
      this.loading = false;
    },
    takeRefs(data, form) {
      this.this_ref = data;
      this.priceFormData = form;
    },
    handleError() {
      this.$message({
        type: "error",
        message: "价格设置失败",
      });
    },
    handleConfirmed() {
      //  获取表单里面的数据
      this.this_ref.validate(async (valid) => {
        if (valid) {
          let { list, ...form } = this.priceFormData;
          let formKeys = [];
          list.map((lItem) => {
            const { ids, size, size_id, priceIds, ...rest } = lItem;
            // console.log('rest', rest)
            formKeys = formKeys.concat(Object.keys(rest));
          });
          this.priceData.forEach((row, index) => {
            formKeys.map((key) => {
              this.$set(row, key, form[key + index]);
              // row[key] = form[key + index]
            });
          });

          const priceColData = this.priceColData;
          const priceData = this.priceData;
          const postData = [];
          priceData.map((item) => {
            // console.log(item)
            const { ids, size, size_id, priceIds, ...rest } = item;
            const tmpObj = {};
            tmpObj.size = size_id;
            tmpObj.priceInfo = [];
            let num = -1;
            for (let key in rest) {
              num++;
              const obj = {};
              obj.id = priceIds[key];
              obj.price = parseFloat(rest[key]);
              obj.gear_id = ids[num];
              tmpObj.priceInfo.push(obj);
            }
            postData.push(tmpObj);
          });

          // console.log('postData', postData)

          const { code } = await createPrice({
            gear_category: this.categories,
            size_price: postData,
          });
          if ($SUC({ code })) {
            this.$message({
              type: "success",
              message: "价格设置成功",
            });
            //调用保存价格数据接口,成功回调中提示保存成功并关闭对话框
            this.$refs.BaseProductPage.refreshPage();
            this.showEditPriceDialog = false;
          }
        } else {
          this.handleError();
        }
      });
    },
    handleCanceled() {
      this.showEditPriceDialog = false;
      this.$message.warning("您取消了操作！");
    },
    handleButtonClicked() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.priceData.map((item, index) => {
            if (index === 0) {
              item.price1 = this.ruleForm.init_price;
            }
            if (index !== 0) {
              item.price1 =
                Number(this.priceData[index - 1].price1) - Number(this.ruleForm.size);
            }
          });
          this.priceData.map((item) => {
            const { ids, size, size_id, priceIds, ...rest } = item;
            const priceArr = Object.keys(rest).sort((a, b) => {
              return +a.replace("price", "") - +b.replace("price", "");
            });
            priceArr.map((key, index) => {
              let data = Number(item["price1"]) - index * Number(this.ruleForm.gear);
              // if (
              //   data.toString().indexOf(".") + 1 > 0 &&
              //   data.toString().split(".")[1].length === 15
              // ) {
              //   data = data.toFixed(1);
              // }
              data = data.toFixed(2);
              this.$set(item, key, data);
            });
          });
        } else {
          this.$message({
            type: "error",
            message: "为确保表格每一项都为正数，请输入合适的公差",
          });
        }
      });
    },
    handleClosed() {
      this.ruleForm.size = null;
      this.ruleForm.gear = null;
      this.ruleForm.init_price = null;
    },
  },
  computed: {
    ...mapGetters({
      categoriesList: "gearsCategory",
    }),
    keysArray() {
      if (this.priceData[0]) return Object.keys(this.priceData[0]);
    },
    priceColData() {
      const priceColData = [{ prop: "size", label: "尺寸" }];
      this.geaData.map((item, index) => {
        const { max_count, min_count, id } = item;
        let label =
          index !== this.geaData.length - 1
            ? `${min_count}-${max_count}件价格（元）`
            : `${min_count}+件价格（元）`;
        priceColData.push({
          prop: `price${index + 1}`,
          label,
          id,
        });
      });
      return priceColData;
    },
    figure() {
      return (row) => {
        try {
          const {
            prim_struct: [{ figures = [] }],
          } = row || {};
          if (!figures || !figures.length) {
            return require("@/assets/images/default.png");
          }
          const cover = figures.filter(({ isCover }) => isCover);
          return (cover[0] && cover[0].path) || require("@/assets/images/default.png");
        } catch (err) {
          return require("@/assets/images/default.png");
        }
      };
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .dialog-title {
    font-size: 14px;
    color: #1a1a1a;
    height: 52px;
    display: flex;
    align-items: center;
  }
}

::v-deep {
  .el-form--inline .el-form-item__label {
    color: #595961;
    font-weight: normal;
  }
}

::v-deep {
  .el-input--small .el-input__inner {
    width: 240px;
    height: 36px;
    margin-left: 15px;
  }
}

.flex-warpper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.base-dialog-wrapper {
  color: #595961;

  .price-wrapper {
    .guide {
      position: absolute;
      z-index: 999;
      left: -10px;
    }
    .init-price {
      height: 36px;
      line-height: 36px;
      .generate-button {
        margin-left: 28px;
      }
      .el-button {
        height: 36px;
      }
    }
    .selectLabel {
      font-weight: normal;
      width: 155px;
      padding-right: 9px;
      text-align: right;
      display: inline-block;
    }
    .el-select {
      margin-bottom: 20px;
    }
  }
  .setting-price-wrapper {
    margin-top: 32px;
    .gears-wrapper {
      margin-top: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $color-primary;
      min-height: 80px;
      border: 1px solid $border-color;
    }
  }
  .product-wrapper {
    margin: 26px 0 30px 0;
    align-items: center;
    line-height: 23px;
    .el-image {
      margin-right: 10px;
    }
  }
  .flex {
    display: flex;
  }
}
.setPriceStyle {
  margin-right: 10px;
}
</style>
