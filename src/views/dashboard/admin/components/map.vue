<template>
  <div>
    <div id="container" />
    <!--<div class="green-btn" @click="getMapCenter"> 中心位置</div>-->
  </div>

</template>

<script>
import { MP } from '@/utils/tmap.js'
import { getCarType, getMarkers } from '@/api/dashboard'
export default {
  name: 'Map',
  data() {
    return {
      myLatlng: [117.214664, 29.29256],
      theMap: null,
      carType: null,
      thmarkers: null
    }
  },
  mounted() {
    const that = this
    this.getCarType()
    MP('f69c443f1f4d2801d4bfb6d31841705b').then(function(AMap) {
      that.init(AMap)
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    async getCarType() {
      const res = await getCarType()
      this.carType = res.data // res
      console.log(res)
      this.getMarkers()
    },
    async getMarkers() {
      const that = this
      const res = await getMarkers()
      this.thmarkers = res.data
      console.log(this.thmarkers)
      setTimeout(function() {
        that.loadMarkers(that.thmarkers)
      }, 2000)
    },
    init() {
      const that = this
      const myOptions =
        {
          zoom: that.mapZoom, // 设置地图显示的缩放级别
          center: that.myLatlng, // 设置地图中心点坐标
          mapStyle: 'amap://styles/light',
          // layers: [new AMap.TileLayer.Satellite()],
          lang: 'zh_cn' // 设置地图语言类型

        }
      // 获取dom元素添加地图信息
      that.theMap = new AMap.Map('container', myOptions)
      that.theMap.plugin(['AMap.ControlBar', 'AMap.ToolBar'], function() {
        const controlBar = new AMap.ControlBar({ position: { top: '30px', right: '10px' }, showZoomBarz: true, showControlButton: true })
        that.theMap.addControl(new AMap.ToolBar())
        that.theMap.addControl(controlBar)
      })
    },
    loadMarkers(data) {
      console.log(data)
      const that = this
      const markerArray = []
      // 添加标记
      for (let i = 0; i < data.length; i++) {
        // 设置Marker自定义图标的属性，size是图标尺寸，该尺寸为显示图标的实际尺寸，origin是切图坐标，该坐标是相对于图片左上角默认为（0,0）的相对像素坐标，anchor是锚点坐标，描述经纬度点对应图标中的位置
        const marker = new AMap.Marker({
          position: new AMap.LngLat(data[i].lng, data[i].lat),
          offset: new AMap.Pixel(-10, -10),
          icon: that.carType[data[i].type].imgUrl, // 根据车辆类型显示图标
          title: '北京'
        })
        markerArray.push(marker)
        that.theMap.add(marker)
      }
      this.setFitView(markerArray)// 自动调整地图显示范围
    },
    setFitView(coords) {
      // 一组坐标点
      if (coords.length > 0) {
        this.theMap.setFitView(coords)
      } else {
        this.theMap.setFitView()
      }
    },
    getMapCenter() {
      // 获取地图中心点
      const centerLatLng = this.theMap.getCenter()
      console.log('lat:' + centerLatLng.lat, 'lng:' + centerLatLng.lng)
    },
    // 修改地图中心点
    changeMapCenter(lat, lng) {
      this.theMap.setCenter(new qq.maps.LatLng(lat, lng))
    }
  }
}
</script>

<style scoped>
  #container{
    width: 100%;
    min-height:450px ;
  }
  .green-btn{
    text-align: center;
    color: white;
    padding: 10px;
    width: 150px;
  }
</style>
