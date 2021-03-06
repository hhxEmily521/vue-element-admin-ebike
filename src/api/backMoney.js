import request from '@/utils/request'
export function fetchList(query) {
  return request({
    url: '/backMoney/list',
    method: 'get',
    params: query
  })
}
export function fetchMonitorList(query) {
  return request({
    url: '/bike/monitorList',
    method: 'get',
    params: query
  })
} export function fetchWarningList(query) {
  return request({
    url: '/bike/warningList',
    method: 'get',
    params: query
  })
}

export function fetchBike(id) {
  return request({
    url: '/bike/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/bike/pv',
    method: 'get',
    params: { pv }
  })
}

export function createBike(data) {
  return request({
    url: '/bike/create',
    method: 'post',
    data
  })
}

export function updateBike(data) {
  return request({
    url: '/bike/update',
    method: 'post',
    data
  })
}

export function approveBackMoney(data) {
  return request({
    url: '/backMoney/audit',
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
