import { expressCompanyList } from '@/api/system/expressCompany'
import Vue from 'vue'

let EXPRESS_COMPANY_LIST = []
const EXPRESS_COMPANY_PROPS = {
  label: 'companyName',
  value: 'id'
}
const EXPRESS_COMPANY = {
  EXPRESS_COMPANY_LIST,
  EXPRESS_COMPANY_PROPS
}

expressCompanyList().then(res => {
  EXPRESS_COMPANY.EXPRESS_COMPANY_LIST = res.detail
})

export default EXPRESS_COMPANY

Vue.observable(EXPRESS_COMPANY)