import Mock from 'mockjs'

const List = []
const count = 100
const monitorList = []
const warningList = []

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  let addnum = 0
  const divBy = Math.random()
  addnum = divBy / Math.random() * 20
  List.push(Mock.mock({
    id: '@increment',
    // IMEI: 'IMEI' + '@increment',
    /* bikeName: '车名' + '@title(1, 1)',*/
    backMoney: '@integer(3, 50)',
    'orderBackType|1': ['finish', 'refuse'],
    /* 'useType|1': ['using', 'notUse'],
    'isMoving|1': ['isMoving', 'notMove'], // 以后可能有临时锁车其他状态
    lastUserId: 'u' + '@integer(1000, 5000)',
    lastUserPhone: '@integer(13000000000, 18000000000)',*/
    updateTime: +Mock.Random.date('T'),
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)',
    'orderType|1': ['all', 'unlock', 'waitPayMoney', 'finish'],
    'backMoneyStatus|1': ['all', 'applyBackMoney', 'agreeBackMoney', 'refuseBackMoney', 'finish'],
    bikeId: '@integer(1, 500)',
    vipNumber: '@integer(13000000000, 18000000000)',
    vipId: '@integer(1, 500)',
    trueMoney: '@integer(1, 500)', // 实付金额
    orderMoney: '@integer(1, 500)', // 订单金额
    preferentialMoney: '@integer(1, 500)', // 优惠金额
    createTime: +Mock.Random.date('T'), // 创建时间
    rentCarStart: +Mock.Random.date('T'), // 开始时间
    rentCarEnd: +Mock.Random.date('T'), // 结束时间
    payTime: +Mock.Random.date('T'), // 支付时间
    editTime: +Mock.Random.date('T'), // 修改时间
    remarks: 'mark' + '@integer(1, 500)', // 订单备注
    vipAccount: '@integer(1, 500)', // 会员账户
    vipLevel: 'v' + '@integer(1, 500)', // 会员等级
    integral: '@integer(1, 500)', // 会员积分
    backMoneyId: '2c9009e369f815e0016b0e3e7a' + '@integer(1, 500)', // 退款订单编号
    logitude: '@float(0.00000,50.00000)', // 车辆最后经度
    latiude: '@float(0.00000,50.00000)', // 车辆最后纬度
    lngLat: { 'lng': 117.211855 + addnum, 'lat': 29.297727 + addnum },
    electrucity: '@integer(0, 100)' + '%', // 车辆最后电量
    elecFence: 'N' + '@integer(1, 500)', // 车辆停靠电子围栏
    operateId: 'O' + '@integer(1, 500)', // 操作人ID
    operateMobile: 'O' + '@integer(10000, 500000)', // 操作人电话
    'operateRole|1': ['admin', 'common']// 操作人角色
  }))
}
for (let i = 0; i < count; i++) {
  let addnum = 0
  const divBy = Math.random()
  addnum = divBy / Math.random() * 20
  monitorList.push(Mock.mock({
    id: '@increment',
    batteryQuantity: '@integer(10, 100)',
    canRunKM: '@integer(5, 20)',
    needNewBattery: Mock.Random.boolean(),
    IMEI: 'IMEI' + '@increment',
    bikeName: '车名' + '@title(1, 1)',
    'bikeType|1': ['noElectric', 'worthless', 'normal', 'problem', 'checking'],
    'useType|1': ['using', 'notUse'],
    'isMoving|1': ['isMoving', 'notMove'], // 以后可能有临时锁车其他状态
    createTime: +Mock.Random.date('T'),
    updateTime: +Mock.Random.date('T'),
    changeBatteryTime: +Mock.Random.date('T'),
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)',
    lngLat: { 'lng': 117.211855 + addnum, 'lat': 29.297727 + addnum },
    polyLine: [
      [116.362209 + addnum + Math.random() / 22, 39.887487 + addnum + Math.random() / 20],
      [116.422897 + addnum + Math.random() / 18, 39.878002 + addnum + Math.random() / 19],
      [116.372105 + addnum + Math.random() / 22, 39.90651 + addnum + Math.random() / 20],
      [116.379105 + addnum + Math.random() / 22, 39.97651 + addnum + Math.random() / 20],
      [116.428945 + addnum + Math.random() / 16, 39.89663 + addnum + Math.random() / 26]
    ]
  }))
}
for (let i = 0; i < count; i++) {
  warningList.push(Mock.mock({
    id: '@increment',
    batteryQuantity: '@integer(10, 100)',
    canRunKM: '@integer(5, 20)',
    isDeal: Mock.Random.boolean(),
    IMEI: 'IMEI' + '@increment',
    bikeName: '车名' + '@title(1, 1)',
    'warningType|1': ['noElectric', 'illegalMove', 'outOfFence', 'lost'],
    'bikeType|1': ['noElectric', 'worthless', 'normal', 'problem', 'checking'],
    'useType|1': ['using', 'notUse'],
    'isMoving|1': ['isMoving', 'notMove'],
    createTime: +Mock.Random.date('T'),
    updateTime: +Mock.Random.date('T'),
    pageviews: '@integer(300, 5000)'
  }))
}

export default [
  {
    url: '/order/list',
    type: 'get',
    response: config => {
      const { importance, type, title, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (importance && item.importance !== +importance) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/bike/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const bike of List) {
        if (bike.id === +id) {
          return {
            code: 20000,
            data: bike
          }
        }
      }
    }
  },
  {
    url: '/bike/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/bike/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/bike/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/bike/backEbikeByManual',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/bike/monitorList',
    type: 'get',
    response: config => {
      const { id, type, title } = config.query

      const mockList = monitorList.filter(item => {
        if (id && item.id.indexOf(id) < 0) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })
      const randMax = Math.random() * 18
      const randMin = Math.random() * 5

      const pageList = mockList.filter((item, index) => index < randMax && index > randMin)

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },
  {
    url: '/bike/warningList',
    type: 'get',
    response: config => {
      const { id, type, title } = config.query
      const mockList = warningList.filter(item => {
        if (id && item.id.indexOf(id) < 0) return false
        if (type && item.type !== type) return false
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })
      const randMax = Math.random() * 18
      const randMin = Math.random() * 5

      const pageList = mockList.filter((item, index) => index < randMax && index > randMin)

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  }
]

/**
 * Created by cjx on 2019/7/13.
 */
