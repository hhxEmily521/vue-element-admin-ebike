import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/fence/list',
    method: 'get',
    params: query
  })
}

export function fetchFence(id) {
  return request({
    url: '/fence/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchEbikeNum(id) {
  return request({
    url: '/fence/ebikeNum',
    method: 'get',
    params: { id }
  })
}

export function createFence(data) {
  return request({
    url: '/fence/create',
    method: 'post',
    data
  })
}

export function updateFence(data) {
  return request({
    url: '/fence/update',
    method: 'post',
    data
  })
}
export function delFence(data) {
  return request({
    url: '/fence/delFence',
    method: 'post',
    data
  })
}
export function fetchPolyonList(query) {
  return request({
    url: '/fence/fetchPolyonList',
    method: 'get',
    params: query
  })
}

