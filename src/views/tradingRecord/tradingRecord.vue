<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="交易id" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.acceptAccount" placeholder="收款账号" style="width: 280px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.payAccount" placeholder="付款账号" style="width: 250px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.transactionId" placeholder="交易流水" style="width: 250px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.transactionType" placeholder="交易类型" clearable class="filter-item" style="width: 180px">
        <el-option v-for="item in transactionTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <!--<el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">-->
      <!--<el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />-->
      <!--</el-select>-->
      <el-date-picker
        v-model="listQuery.duringDay"
        class="filter-item"
        style="width: 320px"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="-"
        start-placeholder="支付时间开始"
        end-placeholder="支付时间结束"
        :picker-options="pickerOptions"
      />
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
      <el-table-column label="交易Id" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" prop="IMEI" sortable="custom" align="center" width="110">
        <template slot-scope="scope">
          <span>{{ scope.row.money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="流水号" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleCopy( row.transactionId,$event)">{{ row.transactionId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收款账号" prop="IMEI" sortable="custom" align="center" width="220">
        <template slot-scope="scope">
          <span class="link-type" @click="handleCopy( row.acceptAccount,$event)">{{ scope.row.acceptAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="付款账号" prop="IMEI" sortable="custom" align="center" width="220">
        <template slot-scope="scope">
          <span class="link-type" @click="handleCopy( row.payAccount,$event)">{{ scope.row.payAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="交易类型" min-width="80px">
        <template slot-scope="{row}">
          <el-tag>{{ row.transactionType | transactionTypeFilter }}</el-tag>
        </template>
      </el-table-column>
      <!--<el-table-column label="最后使用会员" min-width="180px">-->
        <!--<template slot-scope="{row}">-->
          <!--<span class="link-type" @click="handleCopy( row.lastUserId,$event)">会员ID：{{ row.lastUserId }}<br></span>-->
          <!--<span class="link-type" @click="handleCopy( row.lastUserPhone,$event)">会员手机：{{ row.lastUserPhone }}  <i icon="el-icon-copy-document" /></span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column label="支付时间" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
          <el-form-item label="车辆状态" prop="transactionType">
            <el-select v-model="temp.transactionType" placeholder="车辆状态" class="filter-item">
              <el-option v-for="item in transactionTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
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
import { fetchTransactionList} from '@/api/system'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import clip from '@/utils/clipboard' // use clipboard directly
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
// type : normal | noElectric | worthless | problem

const transactionTypeOptions = [
  { key: 'depositPay', display_name: '押金充值' },
  { key: 'all', display_name: '全部' },
  { key: 'depositWithdraw', display_name: '押金提现' },
  { key: 'prepaid', display_name: '余额充值' },
  { key: 'business', display_name: '业务订单' },
  { key: 'Refund', display_name: '退款' }

]
const transactionTypeKeyValue = transactionTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const isMovingOptions = [
  { key: 'isMoving', display_name: '是' },
  { key: 'notMove', display_name: '否' }

]
const isMovingKeyValue = isMovingOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})
const useTypeOptions = [
  { key: 'using', display_name: '使用中' },
  { key: 'notUse', display_name: '空闲' }
]

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
    transactionTypeFilter(type) {
      return transactionTypeKeyValue[type]
    },
    moveTypeFilter(type) {
      return isMovingKeyValue[type]
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
        transactionType: '',
        acceptAccount: '',
        payAccount: '',
        transactionId: '',
        duringDay: '',
        page: 1,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      transactionTypeOptions,
      isMovingOptions,
      useTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        transactionType: undefined,
        creatTime: new Date(),
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
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleCopy(text, event) {
      clip(text, event)
    },
    getList() {
      this.listLoading = true
      fetchTransactionList(this.listQuery).then(response => {
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.updateTime = new Date()
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
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
