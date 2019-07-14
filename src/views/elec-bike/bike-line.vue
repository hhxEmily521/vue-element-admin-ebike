<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="电子围栏ID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.title" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="启用/停用" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>
    <fence-map :draw-type="'polyline'" />

  </div>
</template>

<script>
import { fetchMonitorList } from '@/api/bike'
import fenceMap from './components/map'
import waves from '@/directive/waves' // waves directive
const calendarTypeOptions = [
  { key: 'CN', display_name: '启用' },
  { key: 'US', display_name: '停用' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { fenceMap },
  directives: { waves },
  filters: {
    statusFilter(status) {
      let sta = ''
      switch (status) {
        case '发布':sta = 'success'; break
        case '草稿':sta = 'info'; break
        case '删除':sta = 'danger'; break
      }
      return sta
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        id: undefined,
        title: undefined,
        type: undefined
      },
      calendarTypeOptions,
      temp: {
        id: undefined,
        timestamp: new Date(),
        title: '',
        type: ''
      },
      markerList: [{ lat: '', lng: '' }, { lat: '', lng: '' }, { lat: '', lng: '' }, { lat: '', lng: '' }],
      ebikeNumData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchMonitorList(this.listQuery).then(response => {
        this.list = response.data.items
        this.$store.dispatch('map/setPolylineList', this.list)
        this.total = response.data.total
        console.log(this.list)
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    latLngIntActive() {

    },
    polygonChange() {

    },
    drawChange() {

    }

  }
}
</script>
<style lang="scss">
  .map-dialog .el-dialog{
    margin:0!important;
    width: 100%;
  }
  .el-form-item {
    margin-bottom: 22px;
    margin-left: 10px;
    .el-form--label-left .el-form-item__label{
      text-align: right;
    }
  }
  .el-row  {
    display: flex;
    /*flex-flow: row;*/
    align-content: space-around;
  }
  .el-input{
    margin-right: 20px;
  }
</style>
