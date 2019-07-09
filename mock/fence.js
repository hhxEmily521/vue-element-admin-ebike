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
    drawzPolygon: [{ 'P': 29.297727272494765, 'Q': 117.21185454457998, 'lng': 117.211855, 'lat': 29.297727 }, { 'P': 29.297708325587536, 'Q': 117.21179926961662, 'lng': 117.211799, 'lat': 29.297708 }, { 'P': 29.29767174050324, 'Q': 117.21169253915548, 'lng': 117.211693, 'lat': 29.297672 }, { 'P': 29.296882435842242, 'Q': 117.21203297719359, 'lng': 117.212033, 'lat': 29.296882 }, { 'P': 29.296923905339067, 'Q': 117.21222804889084, 'lng': 117.212228, 'lat': 29.296924 }],
    drawType: 'polyon',
    image_uri,
    platforms: ['a-platform']
  }))
}
let polyonList = []
let lng1 = 0
let addnum =0
let list =[]
for (let i = 0; i < count; i++) {
  let divBy = Math.random() * 1000000
  addnum = (i+ 1) / 10000
  // console.log(addnum)
  lng1 =(117.211855 + addnum)
  console.log(lng1)
  list = [{ 'P': (29.297727272494765 + addnum), 'Q': 117.21185454457998 + addnum, 'lng': lng1, 'lat': (29.297727 + addnum) }, { 'P': 29.297708325587536 + addnum, 'Q': 117.21179926961662 + addnum, 'lng': 117.211799 + addnum, 'lat': 29.297708 + addnum }, { 'P': 29.29767174050324 + addnum, 'Q': 117.21169253915548 + addnum, 'lng': 117.211693 + addnum, 'lat': 29.297672 + addnum }, { 'P': 29.296882435842242 + addnum, 'Q': 117.21203297719359 + addnum, 'lng': 117.212033 + addnum, 'lat': 29.296882 + addnum }, { 'P': 29.296923905339067 + addnum, 'Q': 117.21222804889084 + addnum, 'lng': 117.212228 + addnum, 'lat': 29.296924 + addnum }]
  let list2 = [{ 'P': (29.297727272494765 + addnum), 'Q': 117.21185454457998 + addnum, 'lng': 117.211555 + i, 'lat': (29.2977297 + addnum) }, { 'P': 29.297708325587536 + addnum, 'Q': 117.21179926961662 + addnum, 'lng': 117.218799 + addnum, 'lat': 29.297798 + addnum }, { 'P': 29.29767174050324 + addnum, 'Q': 117.21169253915548 + addnum, 'lng': 117.211693 + addnum, 'lat': 29.297672 + addnum }, { 'P': 29.296882435842242 + addnum, 'Q': 117.21203297719359 + addnum, 'lng': 117.212033 + addnum, 'lat': 29.296882 + addnum }, { 'P': 29.296923905339067 + addnum, 'Q': 117.21222804889084 + addnum, 'lng': 117.212228 + addnum, 'lat': 29.296924 + addnum }]

  list.push({ 'P': (29.297727272494765 + addnum), 'Q': 117.21185454457998 + addnum, 'lng': lng1, 'lat': (29.297727 + addnum) })
  polyonList.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    address: '@region@province@city@county',
    hasBike: '@integer(20, 500)',
    totalBike: '@integer(400, 550)',
    drawzPolygon: list,
    drawType: 'polyon'
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
  }, {
    url: '/fence/delFence',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  // fetchPolyonList
  {
    url: '/fence/fetchPolyonList',
    type: 'get',
    response: config => {
      const { id, type, title } = config.query

      const mockList = List.filter(item => {
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

