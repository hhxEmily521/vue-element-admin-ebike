import request from '@/utils/request'
export function fetchList(query) {
  return request({
    url: '/vip/list',
    method: 'get',
    params: query
  })
}
export function createVip(query) {
  return request({
    url: '/vip/create',
    method: 'post',
    params: query
  })
}
