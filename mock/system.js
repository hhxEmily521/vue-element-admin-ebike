import Mock from 'mockjs'

const List = []
const count = 100
const transactionList = []
const accountList = []

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    'messageType|1': ['problem', 'illegalReport', 'adviceBack', 'anormalPlay'],
    content: '扣费问题' + '@integer(3, 30)' + '元',
    isDeal: Mock.Random.boolean(),
    lastUserId: 'u' + '@integer(1000, 5000)',
    lastUserPhone: '@integer(13000000000, 18000000000)',
    createTime: +Mock.Random.date('T')
  }))
}
for (let i = 0; i < count; i++) {
  let addnum = 0
  const divBy = Math.random()
  addnum = divBy / 20
  transactionList.push(Mock.mock({
    id: '@increment',
    acceptAccount: '@integer(610000, 620000)' + '12559852658',
    payAccount: '@integer(610000, 630000)' + '895656565625',
    transactionId: '@integer(10000, 60000)',
    money: '@integer(5, 20)',
    'transactionType|1': ['depositPay', 'depositWithdraw', 'prepaid', 'business', 'Refund'], // 押金充值  押金提现 余额充值 业务订单 退款
    createTime: +Mock.Random.date('T')
  }))
}
for (let i = 0; i < count; i++) {
  accountList.push(Mock.mock({
    id: '@increment',
    account: '@integer(1000, 9000)',
    password: '@integer(500000, 2000000)',
    phone: '@integer(13000000000, 18000000000)',
    'role|1': ['admin','webOperate','bikeManager'],
    'useType|1': ['using', 'notUse'],
    lastLoginTime: +Mock.Random.date('T'),
  }))
}

export default [
  {
    url: '/system/list',
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
    url: '/system/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const system of List) {
        if (system.id === +id) {
          return {
            code: 20000,
            data: system
          }
        }
      }
    }
  },
  {
    url: '/system/pv',
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
    url: '/system/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/system/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/system/transactionList',
    type: 'get',
    response: config => {
      const { id, type, title } = config.query

      const mockList = transactionList.filter(item => {
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
    url: '/system/accountList',
    type: 'get',
    response: config => {
      const { id, type, title } = config.query
      const mockList = accountList.filter(item => {
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

