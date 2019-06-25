<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="5" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-money">
          <svg-icon icon-class="money" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日收益
          </div>
          <count-to :start-val="0" :end-val="infoNums[0]" :duration="1200" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="5" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('shoppings')">
        <div class="card-panel-icon-wrapper icon-shopping">
          <svg-icon icon-class="list" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日订单
          </div>
          <count-to :start-val="0" :end-val="infoNums[1]" :duration="1600" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="8" :lg="5" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            新增用户
          </div>
          <count-to :start-val="0" :end-val="infoNums[2]" :duration="1260" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="8" :lg="5" class="card-panel-col">
      <div class="card-panel" @click="handleSetLineChartData('messages')">
        <div class="card-panel-icon-wrapper icon-message">
          <!--<svg-icon icon-class="message" class-name="card-panel-icon" />-->
          <i class="el-icon-bell" class-name="card-panel-icon" style="font-size: 48px;font-weight:600" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            车辆报警
          </div>
          <count-to :start-val="0" :end-val="infoNums[3]" :duration="1300" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="8" :lg="4" class="card-panel-col last">
      <div class="card-panel" @click="handleSetLineChartData('availableCar')">
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
          <!--<i class="el-icon-s-opportunity" class-name="card-panel-icon" ></i>-->
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            可用车辆
          </div>
          <count-to :start-val="0" :end-val="infoNums[4]" :duration="1260" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { getCounts } from '@/api/dashboard'

export default {
  components: {
    CountTo
  },
  props: {
    infoNums: { type: [Array], // 规定此数据必须是Array类型
      required: true }

  },
  created() {
    this.getNumber()
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    async getNumber() {
      const res = await getCounts()
      this.displayNumbers = res.data.number
      console.log(res)
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
    &.last{
      .card-panel .card-panel-icon-wrapper{
        margin: 14px 0 0 8px;
        padding: 16px 8px;
      }
    }
  }

  .card-panel {
    display: flex;
    flex-flow: row nowrap;
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #34bfa3
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      &:last-of-type{
        margin: 26px 10px 26px 10px;
      }

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }
  .last{
    .card-panel .card-panel-icon-wrapper{
      margin: 14px 0 0 14px;
      padding: 16px;
    }
  }
  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
