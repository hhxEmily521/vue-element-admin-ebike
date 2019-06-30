<template>
  <el-table
    :data="tableData"
    border
    style="width: 100%"
  >
    <el-table-column
      prop="fenceId"
      label="电子围栏ID"
      width="120"
    />
    <el-table-column
      prop="name"
      label="名称"
      width="120"
    />
    <el-table-column
      prop="address"
      label="地址"
      width="300"
    />
    <el-table-column
      prop="state"
      label="状态"
      width="120"
    />
    <el-table-column
      fixed
      prop="date"
      label="创建时间"
      width="150"
    />
    <el-table-column
      fixed="right"
      label="操作"
      width="100"
    >
      <template slot-scope="scope">
        <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
        <el-button type="text" size="small">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {

  data() {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        state: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        fenceId: 200333
      }, {
        date: '2016-05-04',
        name: '王小虎',
        state: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1517 弄',
        fenceId: 200333
      }, {
        date: '2016-05-01',
        name: '王小虎',
        state: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1519 弄',
        fenceId: 200333
      }, {
        date: '2016-05-03',
        name: '王小虎',
        state: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1516 弄',
        fenceId: 200333
      }]
    }
  },
  methods: {
    handleClick(row) {
      console.log(row)
    }
  }
}
</script>
