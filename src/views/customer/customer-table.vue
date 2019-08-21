<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.wxUserId"
        placeholder="会员id"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.phone"
        placeholder="会员手机"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.orderId"
        placeholder="订单编号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <br>
      <el-label>会员类型</el-label>
      <el-select
        v-model="listQuery.customStatus"
        placeholder="会员类型"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option v-for="item in customStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>

      <el-date-picker
        v-model="listQuery.duringDay"
        class="filter-item"
        style="width: 300px"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="-"
        start-placeholder="账号注册开始时间"
        end-placeholder="账号注册结束时间"
        :picker-options="pickerOptions"
      />

      <el-input
        v-model="listQuery.min_point "
        placeholder="会员积分下限"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.max_point "
        placeholder="会员积分上限"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <!--<el-date-picker-->
      <!--v-model="listQuery.rentCarEnd"-->
      <!--class="filter-item"-->
      <!--style="width:400px"-->
      <!--type="daterange"-->
      <!--align="right"-->
      <!--unlink-panels-->
      <!--range-separator="-"-->
      <!--start-placeholder="结算时间开始"-->
      <!--end-placeholder="结算时间结束"-->
      <!--:picker-options="pickerOptions"-->
      <!--/>-->
      <br>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索

      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        icon="el-icon-delete"
        @click="handleReset"
      >
        重置
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
      <el-table-column label="会员ID" prop="id" align="center" width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.wxUserId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员OPENID" prop="id" align="center" width="220">
        <template slot-scope="scope">
          <span>{{ scope.row.openId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员昵称" prop="id" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="会员昵称" prop="id" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.realName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账户状态" prop="id" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.status|statusOptionsTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别" prop="id" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.sex?'女':'男' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生日" prop="id" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.birthday }}</span>
        </template>
      </el-table-column>

      <el-table-column label="会员电话" min-width="190px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.phone }}  <i icon="el-icon-copy-document" /></span>
        </template>
      </el-table-column>
      <el-table-column label="用户类型" min-width="190px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.userType|customStatusFilter }}  <i icon="el-icon-copy-document" /></span>
        </template>
      </el-table-column>
      <el-table-column label="已消费" min-width="190px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.money }}  <i icon="el-icon-copy-document" /></span>
        </template>
      </el-table-column>
      <el-table-column label="余额" min-width="190px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.balance }}  <i icon="el-icon-copy-document" /></span>
        </template>
      </el-table-column>
      <el-table-column label="订单数" min-width="190px">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.orderNum }}  <i icon="el-icon-copy-document" /></span>
        </template>
      </el-table-column>

      <el-table-column label="时间" min-width="180px">
        <template slot-scope="{row}">
          <span class="link-type">创建：{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}<br></span>
        </template>
      </el-table-column>
      <el-table-column label="时间" min-width="180px">
        <template slot-scope="{row}">
          <span class="link-type">修改：{{ row.updateTime | parseTime('{y}-{m}-{d} {h}:{i}') }}<br></span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="300px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" style="width:80px" @click="dialogBackMoneyFuntion(row)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <!--<el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>-->

    <el-dialog
      title="查看详情"
      :visible.sync="dialogBackMoney"
      style=" min-width: 200px;"
      class="my-dialog"
    >
      <div :data="temp" style="margin-left: 20px">
        <p>基本信息</p><br>
        <table style="border-bottom:1px solid #dad9d9;padding-bottom: 20px">
          <tr>

            <td style="width: 80px">会员ID:</td>
            <td style="width: 350px">{{ temp.wxUserId }}</td>
            <td style="width: 80px">手机号:</td>
            <td style="width:350px">{{ temp.phone }}</td>
          </tr>
          <br>
          <tr>
            <td style="width: 80px">会员积分:</td>
            <td style="width:350px">{{ temp.points }}</td>
            <td style="width: 80px">会员等级:</td>
            <td style="width: 350px">{{ temp.level }}</td>
          </tr>
          <br>
          <tr>
            <td style="width: 80px">会员类型:</td>
            <td style="width:350px">{{ temp.userType |customStatusFilter}}</td>
            <td style="width: 80px">会员订单:</td>
            <td style="width: 350px">{{ temp.orderNum }}</td>
          </tr>
          <br>
          <!--<tr>-->
            <!--<td style="width: 80px">创建时间:</td>-->
            <!--<td style="width:350px">{{ temp.rentCarStart | parseTime('{y}-{m}-{d} {h}:{i}') }}</td>-->
            <!--<td style="width: 80px">修改时间:</td>-->
            <!--<td style="width: 350px">{{ temp.editTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</td>-->
          <!--</tr>-->

        </table>
        <p>账户信息</p><br>
        <table style="border-bottom:1px solid #dad9d9;padding-bottom: 20px">
          <tr>
            <td style="width: 80px">账户余额:</td>
            <td style="width:350px">{{ temp.balance }}</td>
            <td style="width: 80px">会员共计已消费金额:</td>
            <td style="width: 350px">{{ temp.money }}</td>
          </tr>
          <br>
          <tr>
            <td style="width: 80px">押金</td>
            <td style="width:350px"></td>
            <td style="width: 80px">租金</td>
            <td style="width: 350px"></td>
          </tr>
          <br>
          <tr>
            <td style="width: 80px">押金支付金额:</td>
            <td style="width:350px">{{ temp.promiseMoney }}</td>
            <td style="width: 80px">租金支付金额:</td>
            <td style="width:350px">{{ temp.rentalPayMoney }}</td>
            <td style="width: 80px">有效期开始时间:</td>
            <td style="width:350px">{{ temp.canUseStartTime }}</td>
          </tr>
          <br>
          <tr>
            <td style="width: 80px">押金支付时间:</td>
            <td style="width: 350px">{{ temp.promiseTime }}</td>
            <td style="width: 80px">租金支付时间:</td>
            <td style="width: 350px">{{ temp.rentalPayTime }}</td>
            <td style="width: 80px">有效期结束时间:</td>
            <td style="width:350px">{{ temp.canUseEndTime }}</td>
          </tr>
          <br>
          <tr>
            <td style="width: 80px">支付流水号:</td>
            <td style="width:350px">{{ temp.promisePayId }}</td>
            <td style="width: 80px">支付流水号:</td>
            <td style="width: 350px">{{ temp.rentalPayId }}</td>
          </tr>
          <br>
          <tr>
            <td style="width: 80px">订单状态:</td>
            <!--<td style="width:350px">{{ temp.orderType | orderTypeFilter }}</td>-->
            <td style="width: 80px">会员账户:</td>
            <td style="width: 350px">{{ temp.vipAccount }}</td>
          </tr>
          <br>

          <tr>
            <td style="width: 130px">订单开始时间:</td>
            <td style="width:350px">{{ temp.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
            <td style="width: 80px">会员等级:</td>
            <td style="width: 350px">{{ temp.vipLevel |customStatusFilter }}</td>

          </tr>
          <br>
          <tr>
            <td style="width: 130px">订单支付时间:</td>
            <td style="width:350px">{{ temp.payTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
            <td style="width: 130px">订单结算时间:</td>
            <td style="width: 350px">{{ temp.rentCarEnd | parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
          </tr>
        </table>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBackMoney = false">
          关闭页面
        </el-button>

      </div>

      <div />
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchPv, createBike, updateBike } from '@/api/backMoney'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import clip from '@/utils/clipboard' // use clipboard directly
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
// type : normal | noElectric | worthless | problem

const statusOptions = [
  { key: '0', display_name: '正常' },
  { key: '1', display_name: '冻结' }
]

const statusOptionsKeyValue = statusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const operateRoleOptions = [
  { key: 'admin', display_name: '管理员' },
  { key: 'common', display_name: '普通用户' }
]

const operateRoleKeyValue = operateRoleOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const customStatusOptions = [
  { key: '0', display_name: '一般会员' },
  { key: '1', display_name: '充值会员' }

]

const customStatusKeyValue = customStatusOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

const backMoneyReasonOptions = [
  { key: 'carBroken', display_name: '车坏了' },
  { key: 'moneyError', display_name: '扣费有误' },
  { key: 'otherReason', display_name: '其他原因' }
]

const backMoneyReasonKeyValue = backMoneyReasonOptions.reduce((acc, cur) => {
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
/* const useTypeKeyValue = useTypeOptions.reduce((acc, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  }, {})*/

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
    // useTypeFilter(type) {
    //   return useTypeKeyValue[type]
    // },
    statusOptionsTypeFilter(type) {
      return KeyValue[type]
    },
    customStatusFilter(type) {
      return customStatusKeyValue[type]
    },
    backMoneyReasonFilter(type) {
      return backMoneyReasonKeyValue[type]
    },

    operateRoleFilter(type) {
      return operateRoleKeyValue[type]
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
      listQuery: { // 订单参数
        wxUserId: '',
        phone: '',
        level: '',
        useType: 'using',
        duringDay: '',
        start_time: '',
        end_time: '',
        max_point: '',
        min_point: '',
        page: 1,
        limit: 20,
        importance: undefined,
        bikeId: undefined, // 车辆编号
        vipNumber: '', // 会员手机
        payNumber: '', // 支付流水号
        rentCarStart: '', // 租车开始时间开始，租车开始时间结束
        rentCarEnd: '', // 租车结束时间开始，租车结束时间结束
        payTime: '', // 支付时间
        vipAccount: '', // 会员账户
        vipLevel: '', // 会员等级
        integral: '', // 会员积分
        orderId: '', // 订单编号
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      statusOptions,
      customStatusOptions,
      isMovingOptions,
      useTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      // statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        /* id: undefined,*/
        id: 1,
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
      dialogBackMoney: false,
      dialogStatus: '',
      textMap: {
        orderInfo: '订单详情',
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
    handleCopy(text, event) {
      clip(text, event)
    },
    getList() {
      this.listLoading = true
      this.listQuery.start_time = this.listQuery.duringDay[0]
      this.listQuery.end_time = this.listQuery.duringDay[1]
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
              title: '成功',
              message: '创建成功',
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
      this.dialogStatus = 'orderInfo'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        /* this.$refs['dataForm'].clearValidate()*/
      })
    },
    dialogBackMoneyFuntion(row) {
      this.temp = Object.assign({}, row)
      this.temp.updateTime = new Date()
      this.dialogBackMoney = true
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
      this.$notify({
        title: '成功',
        message: '删除成功',
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
    handleReset() {
      this.listQuery.id = ''
      this.listQuery.bikeId = ''
      this.listQuery.vipNumber = ''
      this.listQuery.orderType = ''
      this.listQuery.customStatus = ''
      this.listQuery.payNumber = ''
      this.listQuery.duringDay = ''
      this.listQuery.rentCarStart = ''
      this.listQuery.rentCarEnd = ''
      this.listQuery.payTime = ''
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
  .my-dialog .el-dialog {
    margin: 10vw 10vw !important;
    width: 80%;
  }
</style>
