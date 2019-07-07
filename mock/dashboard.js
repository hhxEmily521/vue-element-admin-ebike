const carsInfo = {
  'sales': '',
  'cpu': '',
  'browsers': '',
  'user': {
    'id': '2c9009e369f815e0016ad3ec554b3fbb',
    'userName': '邹陈昌',
    'name': '邹陈昌',
    'nickName': '邹陈昌',
    'phone': '15079843888',
    'address': '江西省 景德镇市 乐平市',
    'email': '1436961666@q.com',
    'createTime': '1558333642000',
    'avator': '',
    'financeAccountId': '2c9009e369f815e0016ad3ec554a3fba',
    'balanceAmount': '3450',
    'fundAmount': '0',
    'permissions': {
      'visit': '',
      'roles': 'admin'
    },
    'male': false
  },
  'completed': '',
  'comments': [
    {
      'name': 'wu',
      'content': 'eeeeeee',
      'avatar': '',
      'date': '1560857476365'
    }
  ],
  'recentSales': '',
  'quote': '',
  'numbers': [
    {
      'icon': 'pay-circle-o',
      'color': '#64ea91',
      'title': '今日收益',
      'number': '0'
    },
    {
      'icon': 'shopping-cart',
      'color': '#f69899',
      'title': '今日订单数',
      'number': '0'
    },
    {
      'icon': 'car',
      'color': '#8fc9fb',
      'title': '拥有车辆',
      'number': '200'
    },
    {
      'icon': 'wifi',
      'color': '#d897eb',
      'title': '在线车辆',
      'number': '32'
    }
  ]
}
// type : normal | noElectric | worthless | problem
const carMapLoc = [{ lat: 39.775570, lng: 116.297190, type: 'normal' }, { lat: 39.735770, lng: 116.607190, type: 'noElectric' }, { lat: 39.715520, lng: 116.997190, type: 'worthless' }, { lat: 39.725520, lng: 116.697190, type: 'problem' }]
const carType = {
  normal: {
    imgUrl: '/static/img/local.ed3e6852.svg?type=normal'
  },
  noElectric: {
    imgUrl: '/static/img/local.ed3e6852.svg?type=noElectric'
  },
  worthless: {
    imgUrl: '/static/img/local.ed3e6852.svg?type=worthless'
  },
  problem: {
    imgUrl: '/static/img/local.ed3e6852.svg?type=problem'
  }
}
export default [
  // 获取首页收益信息
  {
    url: '/dashboard/carInfo',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: carsInfo
      }
    }
  }, {
    url: '/dashboard/carMapLoc',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: carMapLoc
      }
    }
  },
  {
    url: '/dashboard/carType', // 本地自取
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: carType
      }
    }
  }]

