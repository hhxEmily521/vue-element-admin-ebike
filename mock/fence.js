import Mock from 'mockjs'

const List = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    address: '@region@province@city@county',
    reviewer: '@first',
    title: '@county',
    content_short: 'mock data',
    content: baseContent,
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['CN', 'US'],
    'status|1': ['发布', '草稿', '删除'],
    display_time: '@datetime',
    comment_disabled: true,
    pageviews: {},
    hasBike: '@integer(20, 500)',
    totalBike: '@integer(400, 550)',
    image_uri,
    platforms: ['a-platform']
  }))
}

export default [
  {
    url: '/fence/list',
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
    url: '/fence/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const fence of List) {
        if (fence.id === +id) {
          return {
            code: 20000,
            data: fence
          }
        }
      }
    }
  },

  {
    url: '/fence/ebikeNum',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          ebikeNumData: [
            { key: 'normal', text: '正常', ebikeNum: 524 },
            { key: 'noElectric', text: '低电', ebikeNum: 24 },
            { key: 'problem', text: '故障', ebikeNum: 18 },
            { key: 'worthless', text: '报废', ebikeNum: 12 }
          ]
        }
      }
    }
  },

  {
    url: '/fence/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/fence/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

