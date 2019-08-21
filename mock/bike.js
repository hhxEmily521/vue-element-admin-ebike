import Mock from 'mockjs'

const List = []
const count = 100
const monitorList = []
const warningList = []

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    IMEI: 'IMEI' + '@increment',
    bikeName: '车名' + '@title(1, 1)',
    'bikeType|1': ['noElectric', 'worthless', 'normal', 'problem', 'checking'],
    'useType|1': ['using', 'notUse'],
    'isMoving|1': ['isMoving', 'notMove'], // 以后可能有临时锁车其他状态
    lastUserId: 'u' + '@integer(1000, 5000)',
    lastUserPhone: '@integer(13000000000, 18000000000)',
    createTime: +Mock.Random.date('T'),
    updateTime: +Mock.Random.date('T'),
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)'
  }))
}
for (let i = 0; i < count; i++) {
  let addnum = 0
  const divBy = Math.random()
  addnum = divBy / 20
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
    address: '@region@province@city@county',
    pageviews: '@integer(300, 5000)',
    lngLat: { 'lng': 117.211855 + addnum, 'lat': 29.297727 + addnum },
    polyLine: [
      [116.362209 + addnum, 39.887487 + addnum],
      [116.422897 + addnum, 39.878002 + addnum],
      [116.372105 + addnum, 39.90651 + addnum],
      [116.379105 + addnum, 39.97651 + addnum],
      [116.428945 + addnum, 39.89663 + addnum]
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
    url: '/bike/list',
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

