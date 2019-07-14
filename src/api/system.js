import request from '@/utils/request'
export function fetchList(query) {
  return request({
    url: '/system/list',
    method: 'get',
    params: query
  })
}
export function fetchTransactionList(query) {
  return request({
    url: '/system/transactionList',
    method: 'get',
    params: query
  })
}export function fetchAccountList(query) {
  return request({
    url: '/system/accountList',
    method: 'get',
    params: query
  })
}

export function fetchBike(id) {
  return request({
    url: '/system/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/system/pv',
    method: 'get',
    params: { pv }
  })
}

export function createBike(data) {
  return request({
    url: '/system/create',
    method: 'post',
    data
  })
}

export function updateAccount(data) {
  return request({
    url: '/system/update',
    method: 'post',
    data
  })
}
