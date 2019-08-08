<template>
  <div class="dashboard-editor-container">
    <!--<github-corner class="github-corner" />-->

    <panel-group :info-nums="infoNums" @handleSetLineChartData="handleSetLineChartData" />

    <el-row v-if="lineChartAllData" style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>
    <el-row>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 24}" :xl="{span:24}">
        <t-map />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import TMap from './components/map'
import { getIndexInfo } from '@/api/dashboard'
export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    TMap
  },
  data() {
    return {
      lineChartData: undefined,
      lineChartAllData: undefined,
      infoNums: []
    }
  },
  mounted() {
    this.getIndexInfo()
  },
  methods: {
    async getIndexInfo() {
      const res = await getIndexInfo()
      this.lineChartAllData = res.data.lineChartData // res
      this.infoNums = res.data.infoNums // res
      this.handleSetLineChartData('purchases')
      console.log(res)
    },
    handleSetLineChartData(type) {
      this.lineChartData = this.lineChartAllData[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
