import request from '@/utils/request'
export function fetchList(query) {
  return request({
    url: '/vip/list',
    method: 'get',
    params: query
  })
}
export function createVip(data) {
  return request({
    url: '/vip/create',
    method: 'post',
    data
  })
}
export function updateVip(data) {
  return request({
    url: '/vip/update',
    method: 'post',
    data
  })
}
export function refundMoney(data) {
  return request({
    url: '/order/bike_refund',
    method: 'post',
    data
  })
}
