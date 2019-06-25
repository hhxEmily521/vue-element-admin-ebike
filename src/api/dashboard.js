import request from '@/utils/request'

//
export function getCounts() {
  return request({
    url: '/dashboard/carInfo',
    method: 'post'
  })
}
