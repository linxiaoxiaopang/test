
import request from '@/service/request'


// 工厂订单 生产批次 - 创建一条
export function produceBatchList(data) {
  return request({
    url: '/order/produceBatch/list',
    method: 'post',
    data
  })
}

