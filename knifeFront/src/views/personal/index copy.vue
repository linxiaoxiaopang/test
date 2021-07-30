<template>
  <div class="personal app-container">
    <h4>个人信息</h4>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="basicInformation">
        <el-row>
          <el-col>
            <p class="tips">您的资料完善度50%，完善信息让正丁更懂你</p>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="1">
            <span class="touxiang">头像</span>
          </el-col>
          <el-col :span="3">
            <div class="photo">
              <img :src="headPhoto" />
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="1">
            <p class="shouji">手机号</p>
          </el-col>
          <el-col :span="3">
            <div :class="{ showNumber: isShowNumber }">
              <span class="phoneNumber">{{ phone }}</span>
              <i class="el-icon-edit phoneChange" @click="changePhone"></i>
            </div>
          </el-col>
          <el-col :span="3">
            <el-input
              size="mini"
              v-model="phone"
              :class="{ showInput: isShowInput }"
              @change="inputChange"
            ></el-input>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="1">
            <p>微信绑定</p>
          </el-col>
          <el-col :span="3">
            <p class="binding">去绑定</p>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="1">
            <p>QQ绑定</p>
          </el-col>
          <el-col :span="3">
            <p class="binding">去绑定</p>
          </el-col>
        </el-row>

        <el-form
          ref="personalForm"
          :model="personalForm"
          label-width="70px"
          label-position="left"
        >
          <el-form-item label="公司名称">
            <el-row>
              <el-col :span="3">
                <el-input v-model="personalForm1.company" size="mini" :placeholder="personalForm.company"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="公司地址">
            <el-row>
              <el-col :span="3">
                <el-input v-model="personalForm1.address" :placeholder="personalForm.address" size="mini"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="联系人">
            <el-row>
              <el-col :span="3">
                <el-input v-model="personalForm1.people" :placeholder="personalForm.people" size="mini"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="主营产品">
            <el-row>
              <el-col :span="3">
                <el-input v-model="personalForm1.product" :placeholder="personalForm.product" size="mini"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item size="large">
            <el-button type="primary" size="mini">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="修改密码" name="changePassword">修改密码</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "basicInformation",
      headPhoto: "/img/1.jpg",
      phone: "17350888888",
      isShowInput: true,
      isShowNumber: false,
      personalForm: {
        company: "泉州正丁云商",
        address: "仅供活动寄送礼品",
        people: "杨超越",
        product: "儿童鞋",
      },
      personalForm1: {
        company: "",
        address: "",
        people: "",
        product: "",
      }
    };
  },
  methods: {
    changePhone() {
      this.isShowInput = false;
      this.isShowNumber = true;
    },
    inputChange() {
      this.isShowInput = true;
      this.isShowNumber = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.personal {
  height: 870px;
}
h4 {
  margin: 20px 0;
}
.el-tab-pane {
  font-size: 12px;
  padding-top: 20px;
}
.el-row {
  margin-bottom: 30px;
  .el-col {
    .touxiang {
      line-height: 70px;
    }
    .shouji {
      line-height: 28px;
    }
    .photo {
      height: 70px;
      width: 70px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
    .phoneNumber {
      line-height: 28px;
    }
    .phoneChange {
      margin-left: 10px;
      line-height: 28px;
      cursor: pointer;
    }
    .showInput {
      display: none;
    }
    .showNumber {
      display: none;
    }
    .binding {
      color: $color-primary;
      cursor: pointer;
      width: 40px;
    }
  }
}
.el-form {
  font-size: 12px !important;
  ::v-deep {
    .el-input__inner {
      border-radius: 0px;
    }
  }
  .el-row {
    margin-bottom: 15px;
  }
}
</style>
