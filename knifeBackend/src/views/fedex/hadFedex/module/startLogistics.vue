<template>
  <div class="startLogistics" v-loading="loading">
    <!-- 面单设置 -->
    <div class="forms-content" v-if="show">
      <div class="app-container setFaceSheet">
        <div class="titlePart">
          <span class="titleFont">面单设置</span>
        </div>
        <el-form
          ref="setFaceSheetRef"
          label-width="120px"
          size="small"
          :model="setFaceSheetForm"
          :rules="setFaceSheetRules"
        >
          <template v-for="{ prop, label, placeholder } in setFaceSheetFile">
            <el-form-item v-if="label == '加打信息:'" :label="label" :prop="prop" :key="prop">
              <el-checkbox-group v-model="setFaceSheetForm[`${prop}`]" @change="changeAddInfo">
                <el-checkbox v-for="{ label } in addInfoData" :key="label" :label="label" name="addInfo"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item v-else :label="label" :prop="prop" :key="prop">
              <el-select v-model="setFaceSheetForm[`${prop}`]" :placeholder="placeholder" :style="iptWidth">
                <el-option v-for="{ label, value } in paperData" :key="value" :label="label" :value="value"></el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-form>
      </div>
      <!-- 地址信息 -->
      <div class="app-container addressInfo">
        <div class="titlePart">
          <span class="titleFont">地址信息</span>
          <span class="promptInfor">
            <i class="el-icon-warning titleIcon"></i> 以下信息必须以{{
              logisticsMethod === 1 ? '英文' : '中文'
            }}填写</span
          >
        </div>
        <el-form
          ref="addressInfoRef"
          label-width="120px"
          size="small"
          :model="addressInfoForm"
          :rules="addressInfoRules"
        >
          <template v-for="{ prop, label, placeholder } in addressInfoFile">
            <el-form-item :key="prop" :label="label" :prop="prop" v-if="label == '所在地区:'">
              <span class="locationHead"> {{ '中国' }} </span>
              <el-cascader
                :placeholder="placeholder"
                :options="cityData"
                filterable
                style="width: 286px"
                v-model="addressInfoForm[`${prop}`]"
                @change="locationHandle"
              >
              </el-cascader>
            </el-form-item>
            <el-form-item :key="prop" :label="label" :prop="prop" v-else-if="label == '详细地址:'">
              <el-input
                type="textarea"
                :placeholder="placeholder"
                v-model="addressInfoForm[`${prop}`]"
                :style="iptWidth"
                :rows="3"
                resize="none"
                :minlength="8"
                clearable
              >
              </el-input>
            </el-form-item>
            <el-form-item v-else :key="prop" :label="label" :prop="prop">
              <el-input :style="iptWidth" :placeholder="placeholder" v-model="addressInfoForm[`${prop}`]"></el-input>
            </el-form-item>
          </template>
        </el-form>
      </div>
      <!-- 运费设置 -->
      <div class="app-container freightSetting">
        <div class="titlePart">
          <span class="titleFont">运费设置</span>
        </div>
        <el-form
          ref="freightSettingRef"
          :model="freightSettingForm"
          :rules="freightSettingRules"
          label-width="120px"
          size="small"
        >
          <template v-for="{ prop, label, placeholder } in freightSettingFile">
            <el-form-item v-if="label == '运费模板:'" :key="prop" :prop="prop" :label="label">
              <el-select v-model="freightSettingForm[`${prop}`]" :placeholder="placeholder" :style="iptWidth">
                <el-option
                  v-for="{ value, label } in freightData"
                  :key="value"
                  :value="value"
                  :label="label"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item v-else-if="prop == 'startReferTimeLimitation'" :key="prop" :label="label" :prop="prop">
              <el-input style="width: 100px" v-model.number="freightSettingForm[`${prop}`]"></el-input>
              --
            </el-form-item>

            <el-form-item v-else-if="prop == 'endReferTimeLimitation'" :key="prop" :prop="prop" class="endTimeClass">
              <el-input style="width: 100px" v-model.number="freightSettingForm[`${prop}`]"></el-input>
              天
            </el-form-item>
          </template>
        </el-form>
      </div>
      <!-- 高级设置 -->
      <div class="app-container advancedSetting">
        <div class="titlePart">
          <span class="titleFont">高级设置</span>
        </div>
        <el-form
          ref="advancedSettingRef"
          :model="advancedSettingForm"
          :rules="advancedSettingRules"
          label-width="120px"
          size="small"
        >
          <template v-for="{ prop, label, placeholder } in advancedSettingFile">
            <el-form-item v-if="label == '报关设置:'" :key="prop" :prop="prop" :label="label">
              <el-input
                v-model="advancedSettingForm[`${prop}`]"
                filterable
                :placeholder="placeholder"
                :style="iptWidth"
              >
              </el-input>
            </el-form-item>
            <el-form-item
              v-else-if="label == '跟踪号类型:' && isExpressTrack === 1"
              :key="prop"
              :prop="prop"
              :label="label"
            >
              <el-radio-group v-model="advancedSettingForm[`${prop}`]" @change="expressTrackHandle">
                <el-radio :label="1">取最终单号</el-radio>
                <el-radio :label="2">取物流商单号</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
        </el-form>
      </div>
      <!-- 按钮 -->
      <div class="btnPart app-container">
        <div class="btnBox">
          <el-button size="small" @click="cancelClick">取消</el-button>
          <el-button
            size="small"
            type="primary"
            @click="ckeckAll('setFaceSheetRef', 'addressInfoRef', 'freightSettingRef', 'advancedSettingRef')"
            >保存</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addressInfoFile, setFaceSheetFile, advancedSettingFile, freightSettingFile } from './formtfile'
import { getPaperSize, sendInfo, getSomeNews, getNewsById, getCityData, getFreightTemplate } from './expressApi'
import {
  checkPostcode,
  checkPhone,
  checkEng,
  isCommonCharacters,
  isIntegerAndZero,
  checkCNname,
  isvalidChinaese,
  isMoney
} from './validateRules'
import { SYS_YES, SYS_NO } from '@/utils/constant'

export default {
  data() {
    var timeValidate = (rule, value, callback) => {
      if (this.freightSettingForm.startReferTimeLimitation >= this.freightSettingForm.endReferTimeLimitation) {
        callback(new Error('终止快递时效天数必须大于起始快递时效天数'))
      } else {
        callback()
      }
    }
    return {
      // 验证方法
      checkPostcode,
      checkPhone,
      checkEng,
      isCommonCharacters,
      isIntegerAndZero,
      tip: '',
      //获取的所有数据
      getData: {},
      loading: false,
      show: false,
      // id
      companyId: '',
      accountId: '',
      shippingMethodId: '',
      relationId: '',
      iptWidth: 'width: 400px',
      // 是否需要跟踪号方式 0-否  1-是
      isExpressTrack: '',
      // 物流支持方式 1-国际 2-国内
      logisticsMethod: '',
      // 面单
      setFaceSheetFile,
      setFaceSheetForm: {
        paperSizeId: '',
        addInfo: []
      },
      paperData: [],
      // 加打选项
      addInfoData: [{ label: 'SKU' }, { label: '用户名' }, { label: '价格' }],
      setFaceSheetRules: {
        paperSizeId: [
          {
            required: true,
            message: '请选择纸张大小',
            trigger: ['change', 'blur'],
            type: 'number'
          }
        ],
        addInfo: [
          {
            required: true,
            message: '至少选择一个加打信息',
            trigger: 'change',
            type: 'array'
          }
        ]
      },
      // 选择加打的部分
      addInfoPushData: [],
      // 地址
      addressInfoFile,
      addressInfoForm: {
        senderName: '',
        senderCompanyName: '',
        location: [],
        detailAddress: '',
        postCode: '',
        phoneNumber: ''
      },
      countryCode: 'CN',
      cityData: [],
      addressInfoRules1: {
        senderName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { validator: checkEng, trigger: 'blur' }
        ],
        senderCompanyName: [{ validator: checkEng, trigger: 'blur' }],
        location: [{ required: true, message: '请选择所在地区', trigger: 'change', type: 'array' }],
        detailAddress: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' },
          { min: 8, message: '详细地址至少8个字符', trigger: 'blur' },
          { validator: isvalidChinaese, trigger: 'blur' }
        ],
        postCode: [
          { required: true, message: '邮编不能为空', trigger: 'blur' },
          { validator: isCommonCharacters, trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '电话或手机号不能为空', trigger: 'blur' },
          { validator: isCommonCharacters, trigger: 'blur' }
        ]
      },
      addressInfoRules2: {
        senderName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { validator: checkCNname, trigger: 'blur' }
        ],
        location: [{ required: true, message: '请选择所在地区', trigger: 'change', type: 'array' }],
        detailAddress: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' },
          { min: 8, message: '详细地址至少8个字符', trigger: 'blur' }
        ],
        postCode: [
          { required: true, message: '邮编不能为空', trigger: 'blur' },
          { validator: checkPostcode, trigger: 'blur' }
        ],
        phoneNumber: [
          { required: true, message: '电话或手机号不能为空', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      // 运费
      freightSettingFile,
      freightSettingForm: {
        freightTemplateId: '',
        startReferTimeLimitation: '',
        endReferTimeLimitation: ''
      },
      freightData: [],
      freightSettingRules: {
        freightTemplateId: [
          {
            required: true,
            message: '请选择运费模板',
            trigger: 'change',
            type: 'number'
          }
        ],
        startReferTimeLimitation: [
          { required: true, message: '输入不可以为空', trigger: 'blur' },
          { validator: isIntegerAndZero, trigger: 'blur' }
        ],
        endReferTimeLimitation: [
          { required: true, message: '输入不可以为空', trigger: 'blur' },
          { validator: isIntegerAndZero, trigger: 'blur' },
          { validator: timeValidate, trigger: 'blur' }
        ]
      },
      // 高级
      advancedSettingFile,
      advancedSettingForm: {
        maxDeclaredPrice: '',
        expressTrackMethod: ''
      },
      advancedSettingRules: {
        maxDeclaredPrice: [
          { required: false, trigger: 'blur' },
          { validator: isMoney, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    addressInfoRules() {
      return this.logisticsMethod == 1 ? this.addressInfoRules1 : this.addressInfoRules2
    }
  },
  components: {},
  created() {
    this.init()
  },
  methods: {
    async init() {
      this.loading = true
      try {
        // 获取纸张大小数据
        const { companyId, id: shippingMethodId, accountId, relationId, isEdt } = this.$route.query
        isEdt ? this.tip = '编辑' : this.tip = '启用'
        this.relationId = Number(relationId)
        this.companyId = companyId
        this.shippingMethodId = shippingMethodId
        this.accountId = accountId
        const { detail: paperDataArr } = await getPaperSize({ companyId: companyId })
        // console.log('paperDataArr',paperDataArr)
        this.paperData = paperDataArr.map(({ labelName, id }) => {
          return { label: labelName, value: id }
        })
        // 获取原来的数据
        const { detail: getData } = await getNewsById({ id: relationId })
        // this.getData = getData
        // console.log('getData', getData)
        // 纸张
        this.setFaceSheetForm.paperSizeId = getData && getData.labelSizeId
        // this.$nextTick(() => {
        //   this.$refs.setFaceSheetRef.clearValidate()
        // })
        // 加打信息
        const addInfo = []
        if (getData && getData.isPriceShow == 1) {
          addInfo.push('价格')
        }
        if (getData && getData && getData.isSkuCodeShow == 1) {
          addInfo.push('SKU')
        }
        if (getData && getData.isUserNameShow == 1) {
          addInfo.push('用户名')
        }
        this.setFaceSheetForm.addInfo = addInfo
        // 姓名
        this.addressInfoForm.senderName = getData && getData.senderName
        // 公司名
        this.addressInfoForm.senderCompanyName = getData && getData.senderCompanyName
        // 地区
        this.addressInfoForm.location = [getData && getData.provinceCode, getData && getData.cityCode]
        // 详细地址
        this.addressInfoForm.detailAddress = getData && getData.detailAddress
        // 邮编
        this.addressInfoForm.postCode = getData && getData.postCode
        // 手机号
        this.addressInfoForm.phoneNumber = getData && getData.phoneNumber
        // 运费模板
        this.freightSettingForm.freightTemplateId = getData && getData.freightTemplateId
        // 时间
        this.freightSettingForm.startReferTimeLimitation = getData && getData.startReferTimeLimitation
        this.freightSettingForm.endReferTimeLimitation = getData && getData.endReferTimeLimitation
        // 报关设置
        this.advancedSettingForm.maxDeclaredPrice = Number(getData && getData.maxDeclaredPrice)
        this.advancedSettingForm.expressTrackMethod = getData && getData.expressTrackMethod
        // 启用状态 国际与是否需要跟踪号
        const {
          detail: { isExpressTrack, logisticsMethod }
        } = await getSomeNews({ id: companyId })
        this.logisticsMethod = logisticsMethod
        this.isExpressTrack = isExpressTrack
        // 获取行政地区数据
        // const { detail: cityData } = await getRegion()
        const { detail: cityData } = await getCityData()
        // console.log('cityData', cityData)
        const newCityData = cityData.map((item) => {
          let tempArr = []
          tempArr = item.children.map((item) => {
            return {
              label: item.areaCnName,
              value: item.areaCode
            }
          })
          return {
            label: item.areaCnName,
            value: item.areaCode,
            children: tempArr
          }
        })
        this.cityData = newCityData
        // console.log('newCityData',newCityData);
        // 获取运费模板列表
        const { detail: freightTemplateList } = await getFreightTemplate({ isEnabled: 1 })
        // console.log('freightTemplateList',freightTemplateList);
        const freightTemplateListData = freightTemplateList.map((item) => {
          return {
            value: item.id,
            label: item.templateName
          }
        })
        this.freightData = freightTemplateListData
        this.show = true
      } catch (err) {}
      this.loading = false
    },
    // 选择加打
    changeAddInfo() {
      // console.log('this.setFaceSheetForm.addInfo', this.setFaceSheetForm.addInfo)
      this.addInfoPushData = this.setFaceSheetForm.addInfo.map((item) => {
        if (item == 'SKU') {
          return { isSkuCodeShow: 1 }
        }
        if (item == '用户名') {
          return { isUserNameShow: 1 }
        }
        if (item == '价格') {
          return { isPriceShow: 1 }
        }
      })
      // console.log('this.addInfoPushData', this.addInfoPushData)
    },
    // 选择地区
    locationHandle() {
      // console.log('this.addressInfoForm.location', this.addressInfoForm.location)
    },
    // 选择跟踪号
    expressTrackHandle() {
      // console.log('this.advancedSettingForm.expressTrackMethod',this.advancedSettingForm.expressTrackMethod);
    },
    // 点击保存确定校验通过与否
    async ckeckAll(r1, r2, r3, r4) {
      let c1, c2, c3, c4
      this.$refs[r1].validate((valid) => {
        if (valid) {
          c1 = true
        } else {
          return false
        }
      })
      this.$refs[r2].validate((valid) => {
        if (valid) {
          c2 = true
        } else {
          return false
        }
      })
      this.$refs[r3].validate((valid) => {
        if (valid) {
          c3 = true
        } else {
          return false
        }
      })
      this.$refs[r4].validate((valid) => {
        if (valid) {
          c4 = true
        } else {
          return false
        }
      })
      if (c1 && c2 && c3 && c4) {
        // 弹出确认框
        const areYouSure = await this.$confirm(`确认${this.tip}该物流?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            return true
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: `已取消${this.tip}`
            })
            return false
          })
        if (areYouSure) {
          this.sendAllInfo()
        }
      }
    },
    // 发送请求
    async sendAllInfo() {
      const allData = {
        id: this.relationId,
        labelSizeId: this.setFaceSheetForm.paperSizeId,
        freightTemplateId: this.freightSettingForm.freightTemplateId,
        senderName: this.addressInfoForm.senderName,
        senderCompanyName: this.addressInfoForm.senderCompanyName,
        cityCode: this.addressInfoForm.location[this.addressInfoForm.location.length - 1],
        provinceCode: this.addressInfoForm.location[0],
        detailAddress: this.addressInfoForm.detailAddress,
        postCode: this.addressInfoForm.postCode,
        phoneNumber: this.addressInfoForm.phoneNumber,
        phoneNumber: this.addressInfoForm.phoneNumber,
        startReferTimeLimitation: this.freightSettingForm.startReferTimeLimitation,
        endReferTimeLimitation: this.freightSettingForm.endReferTimeLimitation,
        maxDeclaredPrice: this.advancedSettingForm.maxDeclaredPrice,
        expressTrackMethod: this.advancedSettingForm.expressTrackMethod,
        companyId: this.companyId,
        shippingMethodId: this.shippingMethodId,
        accountId: this.accountId,
        isEnabled: SYS_YES
      }
      this.setFaceSheetForm.addInfo.map(function (item) {
        if (item == 'SKU') {
          allData.isSkuCodeShow = 1
        } else if (item == '用户名') {
          allData.isUserNameShow = 1
        } else {
          allData.isPriceShow = 1
        }
      })
      const { code } = await sendInfo(allData)
      if (code === 0) {
        this.$router.push({
          path: '/fedex/had'
        })
        this.$message.success(`${this.tip}成功`)
      } else {
        this.$message.error('启用失败')
      }
      // console.log('allData', allData)
    },
    cancelClick() {
      this.$router.push('/fedex/had')
    }
  }
}
</script>

<style scoped lang="scss">
.startLogistics {
  position: relative;
  padding-bottom: 15px;
  min-width: 600px;
  min-height: calc(100vh - 60px);
  .app-container {
    overflow: hidden;
  }
  .app-container.setFaceSheet {
    padding: 20px;
    height: 188px;
    border-radius: 3px;
  }
  .app-container.addressInfo {
    padding: 20px;
    height: 500px;
    border-radius: 3px;
  }
  .app-container.freightSetting {
    padding: 20px;
    height: 215px;
    border-radius: 3px;
  }
  .app-container.advancedSetting {
    padding: 20px;
    height: 188px;
    border-radius: 3px;
  }
  .titlePart {
    position: relative;
    margin-left: -20px;
    margin-right: -20px;
    border-bottom: 1px solid #e7e8f0;
    .titleFont {
      color: #595961;
      margin-left: 20px;
      display: block;
      padding-left: 7px;
      border-left: 3px solid $--color-primary;
      line-height: 16px;
      font-size: 16px;
      margin-bottom: 8px;
    }
    .promptInfor {
      position: absolute;
      color: #595961;
      font-size: 14px;
      left: 100px;
      top: 0;
      .titleIcon {
        color: orange;
        font-size: 16px;
      }
    }
  }
  .el-form {
    margin-top: 20px;
    position: relative;
    .el-form-item {
      margin-bottom: 30px;
      color: #595961;
      .locationHead {
        display: inline-block;
        text-align: center;
        height: 32px;
        width: 104px;
        background-color: #f5f5f5;
        border: 1px solid #cdcdcd;
        color: #cdcdcd;
        margin-right: 10px;
      }
    }
    .el-form-item.endTimeClass {
      position: absolute !important;
      left: 237px;
      top: 63px;
      ::v-deep {
        .el-form-item__content {
          margin-left: 0 !important;
        }
      }
    }
    .el-form-item:last-of-type {
      margin-bottom: 0;
    }
  }
  .btnPart.app-container {
    height: 52px;
    margin-top: 0px;
    box-shadow: 0 0 3px 3px rgba($color: #ccc, $alpha: 0.5);
    border-radius: 0 0 3px 3px;
    padding: 0;
    .btnBox {
      text-align: center;
      line-height: 52px;
    }
  }
}
</style>
