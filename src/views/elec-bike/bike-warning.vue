<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="车辆编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.bikeName" placeholder="车辆名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.IMEI" placeholder="硬件IMEI" style="width: 240px;" class="filter-item" @keyup.enter.native="handleFilter" />
     <el-select v-model="listQuery.isDeal" placeholder="是否处理" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in isDealOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.warningType" placeholder="报警类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in warningTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
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
      <el-table-column label="车辆编号" prop="id" sortable="custom" align="center" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆名称" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.bikeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否处理" min-width="80px">
        <template slot-scope="{row}">
          <span>{{ row.isDeal | isDealTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报警类型" min-width="130px">
        <template slot-scope="{row}">
          <el-tag>{{ row.warningType | warningTypeFilter }}</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column label="Readings" align="center" width="95">-->
      <!--<template slot-scope="{row}">-->
      <!--<span v-if="row.pageviews" class="link-type" @click="handleFetchPv(row.pageviews)">{{ row.pageviews }}</span>-->
      <!--<span v-else>0</span>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆IMEI" prop="IMEI" align="center" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.IMEI }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="130" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="lookLocation(row)">
            更改状态
          </el-button>
          <!--<el-button type="primary" size="mini" @click="handleUpdate(row)">-->
          <!--修改-->
          <!--</el-button>-->
          <!--<el-button size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">-->
          <!--删除-->
          <!--</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style=" min-width: 200px;" class="my-dialog">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 94%; overflow: hidden;">
        <el-col :xs="24" :sm="12" :lg="12" class="editBox">
          <el-form-item label="车辆名称" prop="bikeName">
            <el-input v-model="temp.bikeName" />
          </el-form-item>
        </el-col>
        <el-col v-if="dialogStatus==='update'" :xs="24" :sm="12" :lg="12" class="editBox">
          <el-form-item label="创建时间" label-position="left" label-width="100px" prop="creatTime">
            <el-date-picker v-model="temp.createTime" :disabled="true" type="datetime" placeholder="创建时间" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="12" class="editBox">
          <el-form-item label="车辆IMEI" prop="title">
            <el-input v-model="temp.IMEI" :disabled="dialogStatus==='update'" />
          </el-form-item>
        </el-col>
        <el-col v-if="dialogStatus==='update'" :xs="24" :sm="12" :lg="12" class="editBox">
          <el-form-item label="修改时间" prop="updateTime">
            <el-date-picker v-model="temp.updateTime" :disabled="true" type="datetime" placeholder="修改时间" />
          </el-form-item>
        </el-col>
        <el-col v-if="dialogStatus==='update'" :xs="24" :sm="12" :lg="12" class="editBox">
          <el-form-item label="车辆编号" prop="id">
            <el-input v-model="temp.id" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col v-if="dialogStatus==='update'" :xs="24" :sm="12" :lg="12" class="editBox">
          <el-form-item label="业务状态">
            <el-select v-model="temp.useType" placeholder="业务状态" class="filter-item">
              <el-option v-for="item in useTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" :disabled="true" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="dialogStatus==='update'" :xs="24" :sm="12" :lg="12" class="editBox">
          <el-form-item label="车辆状态" prop="bikeType">
            <el-select v-model="temp.bikeType" placeholder="车辆状态" class="filter-item">
              <el-option v-for="item in bikeTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="dialogStatus==='update'" :xs="24" :sm="12" :lg="12" class="editBox">
          <el-form-item label="最后会员">
            <el-input v-model="temp.lastUserId" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-form>
      <!--<el-col :xs="24" :sm="24" :lg="24" class="editBox">-->
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
      <!--</el-col>-->
      <div />
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { fetchWarningList, fetchPv, createBike, updateBike } from '@/api/bike'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import clip from '@/utils/clipboard' // use clipboard directly
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
// type : normal | noElectric | worthless | problem

const bikeTypeOptions = [
  { key: 'noElectric', display_name: '空电' },
  { key: 'all', display_name: '全部' },
  { key: 'worthless', display_name: '报废' },
  { key: 'normal', display_name: '正常' },
  { key: 'problem', display_name: '故障' },
  { key: 'checking', display_name: '审核' }

]
const bikeTypeKeyValue = bikeTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const isMovingOptions = [
  { key: 'isMoving', display_name: '是' },
  { key: 'notMove', display_name: '否' }

]
const needNewBatteryOptions = [
  { key: true, display_name: '是' },
  { key: false, display_name: '否' }
]
const isDealOptions = [
  { key: true, display_name: '是' },
  { key: false, display_name: '否' }
]
const isMovingKeyValue = isMovingOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const useTypeOptions = [
  { key: 'using', display_name: '使用中' },
  { key: 'notUse', display_name: '空闲' }
]
const warningTypeOptions = [
  { key: 'noElectric', display_name: '低电量报警' },
  { key: 'illegalMove', display_name: '非法移动报警' },
  { key: 'outOfFence', display_name: '离栏报警' },
  { key: 'lost', display_name: '车辆丢失' }
]

const warningTypeKeyValue = warningTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const isDealTypeKeyValue = isDealOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
// arr to obj, such as { CN : "China", US : "USA" }
const useTypeKeyValue = useTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves, clipboard },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    useTypeFilter(type) {
      return useTypeKeyValue[type]
    },
    bikeTypeFilter(type) {
      return bikeTypeKeyValue[type]
    },
    moveTypeFilter(type) {
      return isMovingKeyValue[type]
    },
    warningTypeFilter(type) {
      return warningTypeKeyValue[type]
    },
    isDealTypeFilter(type) {
      return isDealTypeKeyValue[type]
    }
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        id: '',
        IMEI: '',
        bikeType: 'all',
        isMoving: '',
        useType: 'using',
        minvoltage: undefined,
        maxvoltage: undefined,
        duringDay: '',
        page: 1,
        limit: 20,
        importance: undefined,
        bikeName: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      needNewBatteryOptions,
      bikeTypeOptions,
      isDealOptions,
      isMovingOptions,
      useTypeOptions,
      warningTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        IMEI: undefined,
        bikeType: undefined,
        isMoving: '',
        useType: '',
        bikeName: '',
        creatTime: new Date(),
        updateTime: new Date(),
        lastUserId: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        updateTime: [{ type: 'date', required: true, message: 'updateTime is required', trigger: 'change' }],
        bikeName: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    lookLocation() {

    },
    handleCopy(text, event) {
      clip(text, event)
    },
    getList() {
      this.listLoading = true
      fetchWarningList(this.listQuery).then(response => {
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
        IMEI: undefined,
        bikeType: 'normal',
        isMoving: 'notMove',
        useType: 'notUse',
        bikeName: '',
        createTime: new Date(),
        updateTime: new Date(),
        lastUserId: undefined
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
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createBike(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.updateTime = new Date()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.updateTime = +new Date(tempData.updateTime) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateBike(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['updateTime', 'title', 'type', 'importance', 'status']
          const filterVal = ['updateTime', 'title', 'type', 'importance', 'status']
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
        if (j === 'updateTime') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
<style>
  .my-dialog .el-dialog{
    margin:10vw 10vw !important;
    width: 80%;
  }
</style>
