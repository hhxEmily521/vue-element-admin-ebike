<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.id"
        placeholder="订单编号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.bikeId"
        placeholder="车辆编号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.vipNumber"
        placeholder="会员手机"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <span>订单类型</span>
      <el-select v-model="listQuery.orderType" placeholder="订单类型" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in orderTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <span>退款状态</span>
      <el-select
        v-model="listQuery.backMoneyStatus"
        placeholder="退款状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option v-for="item in backMoneyStatusOptions" :key="item.key" :label="item.display_name" :value="item.key" />
      </el-select>
      <el-input
        v-model="listQuery.payNumber"
        placeholder="支付流水号"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <!--      <el-date-picker-->
      <!--        v-model="listQuery.duringDay"-->
      <!--        class="filter-item"-->
      <!--        style="width: 300px"-->
      <!--        type="daterange"-->
      <!--        align="right"-->
      <!--        unlink-panels-->
      <!--        range-separator="-"-->
      <!--        start-placeholder="创建开始时间"-->
      <!--        end-placeholder="创建结束时间"-->
      <!--        :picker-options="pickerOptions"-->
      <!--      />-->

      <el-date-picker
        v-model="listQuery.rentCarStart"
        class="filter-item"
        style="width:400px"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="-"
        start-placeholder="租车开始时间开始"
        end-placeholder="租车开始时间结束"
        :picker-options="pickerOptions"
      />

      <el-date-picker
        v-model="listQuery.rentCarEnd"
        class="filter-item"
        style="width:400px"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="-"
        start-placeholder="租车结束时间开始"
        end-placeholder="租车结束时间结束"
        :picker-options="pickerOptions"
      />

      <!--      <el-date-picker-->
      <!--        v-model="listQuery.payTime"-->
      <!--        class="filter-item"-->
      <!--        style="..."-->
      <!--        type="daterange"-->
      <!--        align="right"-->
      <!--        unlink-panels-->
      <!--        range-separator="-"-->
      <!--        start-placeholder="支付时间开始"-->
      <!--        end-placeholder="支付时间结束"-->
      <!--        :picker-options="pickerOptions"-->
      <!--      />-->

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
      <el-table-column label="订单编号" prop="id" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="车辆编号" prop="bikeId" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.bikeId }}</span>
        </template>
      </el-table-column>

      <el-table-column label="会员" min-width="190px">
        <template slot-scope="{row}">
          <span class="link-type">会员ID：{{ row.vipId }}<br></span>
          <span class="link-type">会员电话：{{ row.vipNumber }}  <i icon="el-icon-copy-document" /></span>
        </template>
      </el-table-column>

      <el-table-column label="金额（元）" min-width="190px">
        <template slot-scope="{row}">
          <span class="link-type">实付金额：{{ row.trueMoney }}<br></span>
          <span class="link-type">订单金额：{{ row.orderMoney }}<br></span>
          <span class="link-type">优惠金额：{{ row.preferentialMoney }}</span>
        </template>
      </el-table-column>

      <el-table-column label="退款" min-width="180px">
        <template slot-scope="{row}">
          <!--  <span class="link-type">退款状态：{{ row.orderBackType }}<br></span>-->
          <!-- <el-tag>{{ row.backMoneyStatus | backMoneyStatusFilter }}</el-tag>-->
          <span class="link-type">退款状态：{{ row.backMoneyStatus | backMoneyStatusFilter }}<br></span>
          <span class="link-type">退款金额：{{ row.backMoney }}  <i icon="el-icon-copy-document" /></span>
        </template>
      </el-table-column>

      <el-table-column label="订单状态" min-width="100px">
        <template slot-scope="{row}">
          <!--  <el-tag>{{ row.orderType | orderTypeFilter }}</el-tag>-->
          <span class="link-type">{{ row.orderType | orderTypeFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column label="时间" min-width="180px">
        <template slot-scope="{row}">
          <span class="link-type">创建：{{ row.rentCarStart | parseTime('{y}-{m}-{d} {h}:{i}') }}<br></span>
          <span class="link-type">开始：{{ row.createTime | parseTime('{y}-{m}-{d} {h}:{i}') }}<br></span>
          <span class="link-type">结束：{{ row.rentCarEnd | parseTime('{y}-{m}-{d} {h}:{i}') }}<br></span>
          <span class="link-type">修改：{{ row.editTime | parseTime('{y}-{m}-{d} {h}:{i}') }}<br></span>
        </template>
      </el-table-column>

      <el-table-column label="订单备注" min-width="100px">
        <template slot-scope="{row}">
          <span>{{ row.remarks }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="300px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" style="width: 80px" @click="handleUpdate(row)">
            订单详情
          </el-button>
          <el-button v-if="row.orderType!='finish'" size="mini" style="width: 80px" @click="lookLocation(row)">
            手动还车
          </el-button>
          <el-button size="mini" type="danger" style="width:80px" @click="openBackMoney(row)">
            退款
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

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      style=" min-width: 200px;"
      class="my-dialog"
    >

      <div :data="temp" style="margin-left: 20px">
        <p>基本信息</p><br>
        <table style="border-bottom:1px solid #dad9d9;padding-bottom: 20px">
          <tr>
            <td style="width: 80px">订单编号:</td>
            <td style="width:350px">{{ temp.id }}</td>
            <td style="width: 80px">会员ID:</td>
            <td style="width: 350px">{{ temp.vipId }}</td>
          </tr>
          <br>
          <tr>
            <td style="width: 80px">车辆编号:</td>
            <td style="width:350px">{{ temp.bikeId }}</td>
            <td style="width: 80px">会员手机:</td>
            <td style="width: 350px">{{ temp.vipNumber }}</td>
          </tr>
          <br>

          <tr>
            <td style="width: 80px">创建时间:</td>
            <td style="width:350px">{{ temp.rentCarStart | parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
            <td style="width: 80px">修改时间:</td>
            <td style="width: 350px">{{ temp.editTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
          </tr>

        </table>

        <p>订单详情</p><br>
        <table style="border-bottom:1px solid #dad9d9;padding-bottom: 20px">
          <tr>
            <td style="width: 80px">订单金额:</td>
            <td style="width:350px">{{ temp.orderMoney }}</td>
            <td style="width: 80px">实付金额:</td>
            <td style="width: 350px">{{ temp.trueMoney }}</td>
          </tr>
          <br>

          <tr>
            <td style="width: 80px">优惠金额:</td>
            <td style="width:350px">{{ temp.preferentialMoney }}</td>
            <td style="width: 80px">会员账户:</td>
            <td style="width: 350px">{{ temp.vipAccount }}</td>
          </tr>
          <br>
          <tr>
            <td style="width: 80px">订单状态:</td>
            <td style="width:350px">{{ temp.orderType | orderTypeFilter }}</td>
            <td style="width: 80px">会员等级:</td>
            <td style="width: 350px">{{ temp.vipLevel }}</td>
          </tr>
          <br>

          <tr>
            <td style="width: 130px">订单开始时间:</td>
            <td style="width:350px">{{ temp.rentCarStart | parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
            <td style="width: 130px">订单结算时间:</td>
            <td style="width: 350px">{{ temp.rentCarEnd | parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
          </tr>
          <br>
          <tr>
            <td style="width: 130px">订单支付时间:</td>
            <td style="width:350px">{{ temp.payTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
            <td style="width: 130px">会员积分:</td>
            <td style="width: 350px">{{ temp.integral }}</td>
          </tr>
        </table>
        <p>退款详情</p><br>
        <table style="border-bottom:1px solid #dad9d9;padding-bottom: 20px">
          <tr>
            <td style="width: 130px">退款单编号:</td>
            <td style="width:350px">{{ temp.backMoneyId }}</td>
            <td style="width: 130px">退款状态:</td>
            <td style="width: 350px">{{ temp.backMoneyStatus | backMoneyStatusFilter }}</td>
            <!--<td style="width:350px">{{temp.orderType | orderTypeFilter }}</td>-->
          </tr>
          <br>
          <tr>
            <td style="width: 130px">退款金额:</td>
            <td style="width:350px">{{ temp.backMoney }}</td>

          </tr>
        </table>

        <p>车辆信息</p><br>
        <table style="border-bottom:1px solid #dad9d9;padding-bottom: 20px">
          <tr>
            <td style="width: 130px">车辆最后经度:</td>
            <td style="width:350px">{{ temp.logitude }}</td>
            <td style="width: 130px">车辆最后纬度:</td>
            <td style="width: 350px">{{ temp.latiude }}</td>
          </tr>
          <br>
          <tr>
            <td style="width: 130px">车辆最后电量:</td>
            <td style="width:350px">{{ temp.electrucity }}</td>
            <td style="width: 130px">车辆停靠电子围栏:</td>
            <td style="width: 350px">{{ temp.elecFence }}</td>
          </tr>
        </table>

        <p>操作人详情</p><br>
        <table style="border-bottom:1px solid #dad9d9;padding-bottom: 20px">
          <tr>
            <td style="width: 130px">操作人ID:</td>
            <td style="width:350px">{{ temp.operateId }}</td>
            <td style="width: 130px">操作人电话:</td>
            <td style="width: 350px">{{ temp.operateMobile }}</td>
          </tr>
          <br>
          <tr>
            <td style="width: 130px">操作人角色:</td>
            <td style="width:350px">{{ temp.operateRole | operateRoleFilter }}</td>

          </tr>
        </table>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <!-- <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">-->
        <el-button type="primary" @click="dialogFormVisible = false">
          确认
        </el-button>
      </div>
      <!--</el-col>-->
      <div />
    </el-dialog>

    <el-dialog
      title="订单详情"
      :visible.sync="dialogBackMoney"
      style=" min-width: 200px;"
      class="my-dialog"
    >
      <div :data="temp" style="margin-left: 20px">
        <p>基本信息</p><br>
        <table style="border-bottom:1px solid #dad9d9;padding-bottom: 20px">
          <tr>
            <td style="width: 80px">订单编号:</td>
            <td style="width:350px">{{ temp.id }}</td>
            <td style="width: 80px">会员ID:</td>
            <td style="width: 350px">{{ temp.vipId }}</td>
          </tr>
          <br>
          <tr>
            <td style="width: 80px">车辆编号:</td>
            <td style="width:350px">{{ temp.bikeId }}</td>
            <td style="width: 80px">会员手机:</td>
            <td style="width: 350px">{{ temp.vipNumber }}</td>
          </tr>
          <br>

          <tr>
            <td style="width: 80px">创建时间:</td>
            <td style="width:350px">{{ temp.rentCarStart | parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
            <td style="width: 80px">修改时间:</td>
            <td style="width: 350px">{{ temp.editTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
          </tr>

        </table>
        <p>订单详情</p><br>
        <table style="border-bottom:1px solid #dad9d9;padding-bottom: 20px">
          <tr>
            <td style="width: 80px">订单金额:</td>
            <td style="width:350px">{{ temp.orderMoney }}</td>
            <td style="width: 80px">实付金额:</td>
            <td style="width: 350px">{{ temp.trueMoney }}</td>
          </tr>
          <br>

          <tr>
            <td style="width: 80px">优惠金额:</td>
            <td style="width:350px">{{ temp.preferentialMoney }}</td>
            <td style="width: 80px">会员账户:</td>
            <td style="width: 350px">{{ temp.vipAccount }}</td>
          </tr>
          <br>
          <tr>
            <td style="width: 80px">订单状态:</td>
            <td style="width:350px">{{ temp.orderType | orderTypeFilter }}</td>
            <td style="width: 80px">会员等级:</td>
            <td style="width: 350px">{{ temp.vipLevel }}</td>
          </tr>
          <br>

          <tr>
            <td style="width: 130px">订单开始时间:</td>
            <td style="width:350px">{{ temp.rentCarStart | parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
            <td style="width: 130px">订单结算时间:</td>
            <td style="width: 350px">{{ temp.rentCarEnd | parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
          </tr>
          <br>
          <tr>
            <td style="width: 130px">订单支付时间:</td>
            <td style="width:350px">{{ temp.payTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</td>
          </tr>
        </table>
        <p>退款详情</p><br>
        <el-form ref="dataForm" :rules="rules" label-position="left" label-width="80px" style="width: 100%; overflow: hidden;border-bottom:1px solid #dad9d9">
          <el-col :xs="24" :sm="12" :lg="12" class="editBox">
            <el-form-item label="退款金额:" prop="backMoney">
              <el-input v-model="temp.backMoney" placeholder="请输入金额" style="width:180px" />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :lg="12" class="editBox">
            <el-form-item label="退款备注:" prop="backMoney">
              <el-input type="textarea" placeholder="请填写退款原因" v-model="temp.remark" style="width:180px" />
            </el-form-item>
          </el-col>
        </el-form>
        <p>车辆信息</p><br>
        <table style="border-bottom:1px solid #dad9d9;padding-bottom: 20px">
          <tr>
            <td style="width: 130px">车辆最后经度:</td>
            <td style="width:350px">{{ temp.logitude }}</td>
            <td style="width: 130px">车辆最后纬度:</td>
            <td style="width: 350px">{{ temp.latiude }}</td>
          </tr>
          <br>
          <tr>
            <td style="width: 130px">车辆最后电量:</td>
            <td style="width:350px">{{ temp.electrucity }}</td>

          </tr>
        </table>

        <p>操作人详情</p><br>
        <table style="border-bottom:1px solid #dad9d9;padding-bottom: 20px">
          <tr>
            <td style="width: 130px">操作人ID:</td>
            <td style="width:350px">{{ temp.operateId }}</td>
            <td style="width: 130px">操作人电话:</td>
            <td style="width: 350px">{{ temp.operateMobile }}</td>
          </tr>
          <br>
          <tr>
            <td style="width: 130px">操作人角色:</td>
            <td style="width:350px">{{ temp.operateRole | operateRoleFilter }}</td>

          </tr>
        </table>

      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBackMoney = false">
          取消
        </el-button>
        <!-- <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">-->
        <el-button type="primary" @click="dialogBackMoneyFuntion(temp)">
          确认
        </el-button>
      </div>
      <!--</el-col>-->
      <div />
    </el-dialog>
    <el-dialog :visible.sync="dialogPvVisible" title="车辆位置">
      <fence-map :draw-type="'markers'" />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">取消</el-button>
        <el-button type="primary" @click="backEbikeByManual">确认还车</el-button>

      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, updateBike, backEbikeByManual, refundMoney } from '@/api/order'
import fenceMap from './components/map'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import clip from '@/utils/clipboard' // use clipboard directly
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive
// type : normal | noElectric | worthless | problem

const orderTypeOptions = [
  { key: 'all', display_name: '全部' },
  { key: 'unlock', display_name: '已解锁' },
  { key: 'waitPayMoney', display_name: '等待付款' },
  { key: 'finish', display_name: '交易完成' }

]

const orderTypeKeyValue = orderTypeOptions.reduce((acc, cur) => {
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

const backMoneyStatusOptions = [
  { key: 0, display_name: '初始化' },
  { key: 1, display_name: '待审核' },
  { key: 2, display_name: '审核通过，待微信退款' },
  { key: 3, display_name: '审核拒绝' },
  { key: 4, display_name: '微信退款成功' },
  { key: 5, display_name: '退款失败' }

]

const backMoneyStatusKeyValue = backMoneyStatusOptions.reduce((acc, cur) => {
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
  components: { Pagination, fenceMap },
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
    orderTypeFilter(type) {
      return orderTypeKeyValue[type]
    },
    backMoneyStatusFilter(type) {
      return backMoneyStatusKeyValue[type]
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
        id: '',
        orderType: 'all',
        backMoneyStatus: 'all',
        isMoving: '',
        useType: 'using',
        // duringDay: '',
        page: 1,
        limit: 20,
        importance: undefined,
        bikeId: undefined, // 车辆编号
        vipNumber: '', // 会员手机
        payNumber: '', // 支付流水号
        rentCarStart: '', // 租车开始时间开始，租车开始时间结束
        rentCarEnd: '', // 租车结束时间开始，租车结束时间结束
        // payTime: '', // 支付时间
        vipAccount: '', // 会员账户
        vipLevel: '', // 会员等级
        integral: '', // 会员积分
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      orderTypeOptions,
      backMoneyStatusOptions,
      isMovingOptions,
      useTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
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
    lookLocation(row) {
      this.temp = row
      this.dialogPvVisible = true
      const markerList = []
      markerList.push({ lngLat: row.lngLat })
      this.$store.dispatch('map/setMarkerList', markerList)
    },
    backEbikeByManual() {
      this.dialogPvVisible = false
      const tempData = Object.assign({}, this.temp)
      this.temp.orderType = 'finish'
      tempData.updateTime = +new Date(tempData.updateTime) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
      backEbikeByManual(tempData).then(() => {
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
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    getList() {
      this.listLoading = true
      // this.listQuery.duringDay= this.listQuery.duringDay[0]+'_'+this.listQuery.duringDay[1]
      this.listQuery.rentCarStart = this.listQuery.rentCarStart[0] + '_' + this.listQuery.rentCarStart[1]
      this.listQuery.rentCarEnd = this.listQuery.rentCarEnd[0] + '_' + this.listQuery.rentCarEnd[1]
      // this.listQuery.payTime= this.listQuery.payTime[0]+'_'+this.listQuery.payTime[1]
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
          this.temp.author = '共享电动车'
          // createBike(this.temp).then(() => {
          //   this.list.unshift(this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: '成功',
          //     message: '创建成功',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
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
    openBackMoney(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogBackMoney = true
    },
    dialogBackMoneyFuntion(row) {
      this.temp = Object.assign({}, row)
      refundMoney(this.temp).then(() => {
        for (const v of this.list) {
          if (v.id === this.temp.id) {
            const index = this.list.indexOf(v)
            this.list.splice(index, 1, this.temp)
            break
          }
        }
        this.dialogBackMoney = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      })
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
    handleReset() {
      this.listQuery.id = ''
      this.listQuery.bikeId = ''
      this.listQuery.vipNumber = ''
      this.listQuery.orderType = ''
      this.listQuery.backMoneyStatus = ''
      this.listQuery.payNumber = ''
      // this.listQuery.duringDay = ''
      this.listQuery.rentCarStart = ''
      this.listQuery.rentCarEnd = ''
      // this.listQuery.payTime = ''
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
