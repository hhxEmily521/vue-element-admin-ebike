<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!--<el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">-->
      <!--<el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />-->
      <!--</el-select>-->
      <el-select v-model="listQuery.type" placeholder="启用/停用" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <!--<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">-->
      <!--导出-->
      <!--</el-button>-->
      <!--<el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">-->
      <!--操作人-->
      <!--</el-checkbox>-->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span class="link-type" @click="handleCopy(scope.row.id,$event)">复制ID</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" width="150px" sortable="custom" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="120px" align="center">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" min-width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.address }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column v-if="showReviewer" label="操作人" width="110px" align="center">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="color:red;">{{ scope.row.reviewer }}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--<el-table-column label="Imp" width="80px">-->
      <!--<template slot-scope="scope">-->
      <!--<svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon" />-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="车容比" align="center" width="95">
        <template slot-scope="{row}">
          <span v-if="row.totalBike" class="link-type" @click="handleFetchEbikeNum(row.id)">{{ (typeof row.hasBike!='undefined'?row.hasBike:'0') +'/'+ row.totalBike }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <el-tag effect="dark" :type="row.type =='US'?'danger':'' ">{{ row.type | typeFilter }}</el-tag>

          <!--<el-tag :type="row.status | statusFilter">-->
          <!--{{ row.status }}-->
          <!--</el-tag>-->
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <!--<el-button v-if="row.status!='发布'" size="mini" type="success" @click="handleModifyStatus(row,'发布')">-->
          <!--发布-->
          <!--</el-button>-->
          <!--<el-button v-if="row.status!='草稿'" size="mini" @click="handleModifyStatus(row,'草稿')">-->
          <!--草稿-->
          <!--</el-button>-->
          <!--v-if="row.status!='删除'"-->
          <el-button size="mini" type="danger" @click="handleDelete(row,'删除')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog class="map-dialog" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 90%; margin-left:50px;">
        <el-row>
          <el-form-item label="名称" prop="title" placeholder="输入名称">
            <el-input v-model="temp.title" />
          </el-form-item>
          <el-form-item label="可容纳" prop="辆" placeholder="(辆)">
            <el-input v-model="temp.totalBike" />
          </el-form-item>
          <!--<el-form-item label="保存为">-->
          <!--<el-select v-model="temp.status" class="filter-item" placeholder="请选择">-->
          <!--<el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />-->
          <!--</el-select>-->
          <!--</el-form-item>-->
          <!--</el-row>-->
          <!--<el-row>-->
          <el-form-item label="启用状态" prop="type">
            <el-select v-model="temp.type" class="filter-item" placeholder="请选择">
              <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
          </el-form-item>
          <el-form-item label="日期" prop="timestamp">
            <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="选择时间" />
          </el-form-item>
        </el-row>
        <!--<el-row>-->
        <!--<el-form-item v-for="(item,index) in latLngInputList" :key="index" prop="状态" placeholder="经纬度" :label="'经纬度'+index">-->
        <!--<el-input :value="item.latlng" @focus="inptFocus(index)" />-->
        <!--<div>-->
        <!--<i class="el-icon-circle-plus-outline" @click="addInputBox(index)" />-->
        <!--<i class="el-icon-remove-outline" @click="delInputBox(index)" />-->
        <!--</div>-->
        <!--</el-form-item>-->
        <!--</el-row>-->
        <!---->
        <fence-map v-if="dialogFormVisible" :polygons="temp.drawzPolygon" :draw-type="temp.drawType" :markers="markerList" :marker-idx="latLngIntActive" @drawChange="polygonChange" />

        <!--<el-form-item label="Imp">-->
        <!--<el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />-->
        <!--</el-form-item>-->
        <!--<el-form-item label="Remark">-->
        <!--<el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="">
      <el-table :data="ebikeNumData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="text" label="车辆状态" />
        <el-table-column prop="ebikeNum" label="辆" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, fetchEbikeNum, createFence, updateFence, delFence } from '@/api/fence'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import fenceMap from './components/map'
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
  components: { Pagination, fenceMap },
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
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID 增序', key: '+id' }, { label: 'ID 降序', key: '-id' }],
      statusOptions: ['已发布', '草稿', '删除'],
      showReviewer: false,
      temp: {
        id: undefined,
        totalBike: '',
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        drawzPolygon: [],
        drawType: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      markerList: [{ lat: '', lng: '' }, { lat: '', lng: '' }, { lat: '', lng: '' }, { lat: '', lng: '' }],
      latLngInputList: [{ lat: '', lng: '', latlng: '' }, { lat: '', lng: '', latlng: '' }, { lat: '', lng: '', latlng: '' }, { lat: '', lng: '', latlng: '' }],
      latLngIntActive: 0,
      dialogPvVisible: false,
      ebikeNumData: [],
      rules: {
        type: [{ required: true, message: '必填项', trigger: 'change' }],
        ebikeNum: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: '必填项', trigger: 'blur' }]
      },
      downloadLoading: false,
      editedPlygn: null
    }
  },
  watch: {
    // dialogFormVisible() {
    //   this.temp = {
    //     id: undefined,
    //     remark: '',
    //     timestamp: new Date(),
    //     title: '',
    //     type: ''
    //   }
    // }

  },
  created() {
    this.getList()
  },
  methods: {
    updateLatLng(lat, lng) {
      this.$set(this.latLngInputList, this.latLngIntActive, { lat: lat, lng: lng, latlng: lat + '_' + lng })
      this.$set(this.markerList, this.latLngIntActive, { lat: lat, lng: lng })
    },
    polygonChange(plgn) {
      this.editedPlygn = plgn
    },
    inptFocus(index) {
      this.latLngIntActive = index
      console.log(this.latLngIntActive)
    },
    addInputBox(index) {
      if (this.latLngInputList.length < 10) {
        this.latLngInputList.splice(index, 0, { inputBox: { lat: '', lng: '' }})
      } else {
        this.$message({
          message: '最多添加10个坐标点',
          type: 'warning'
        })
      }
    },
    delInputBox(index) {
      if (this.latLngInputList.length > 4) {
        this.latLngInputList.splice(index, 1)
      } else {
        this.$message({
          message: '至少添加4个坐标点',
          type: 'warning'
        })
      }
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

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
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        timestamp: new Date(),
        totalBike: '',
        title: '',
        type: '',
        drawzPolygon: [],
        drawType: 'createPolyon'
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id

          const that = this
          if (this.editedPlygn) {
            this.temp.drawzPolygon = this.editedPlygn.myPolygon
            this.temp.address = this.editedPlygn.address
            createFence(this.temp).then((res) => {
              that.temp.id = res.data.id
              this.list.unshift(that.temp)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            this.$notify({
              title: '提示：',
              message: '未绘制地图',
              type: 'error',
              duration: 2000
            })
          }
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.temp.drawType = 'polyon'
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.drawzPolygon = this.editedPlygn.myPolygon
          this.temp.drawType = this.editedPlygn.drawType
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateFence(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      const that = this
      delFence(row).then(response => {
        that.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        const index = that.list.indexOf(row)
        that.list.splice(index, 1)
      })
    },
    handleFetchEbikeNum(id) {
      fetchEbikeNum(id).then(response => {
        this.ebikeNumData = response.data.ebikeNumData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
          const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
          const data = this.formatJson(filterVal, this.list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'table-list'
          })
          this.downloadLoading = false
        })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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
  .el-table .caret-wrapper{
    display: none;
  }
</style>
