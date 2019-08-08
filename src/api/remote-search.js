import request from '@/utils/request'

export function searchUser(name) {
  return request({
    url: '/search/user',
    method: 'get',
    params: { name }
  })
}

export function transactionList(query) {
  return request({
    url: 'https://restapi.amap.com/v3/geocode/regeo?parameters', // web服务	ad71eb8813c6eb07587d7d25ef5a171d
    method: 'get',
    params: query
  })
}
