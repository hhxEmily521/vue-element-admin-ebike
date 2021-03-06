import request from '@/utils/request'

//
export function getCounts() {
  return request({
    url: '/dashboard/carInfo',
    method: 'post'
  })
}
export function getMarkers() {
  return request({
    url: '/dashboard/carMapLoc',
    method: 'post'
  })
}
export function getCarType() {
  return request({
    // url: 'https://www.xiaonuan.wang/order/hongxia/',
    url: '/dashboard/carType',
    method: 'post'
  })
}
export function getIndexInfo() {
  return request({
    url: '/dashboard/indexInfo',
    method: 'post'
  })
}

