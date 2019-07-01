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
    url: '/dashboard/carType',
    method: 'post'
  })
}
