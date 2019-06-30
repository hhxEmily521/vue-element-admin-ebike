<template>
  <div>
    <div id="container" />
    <div class="green-btn" @click="getMapCenter"> 中心位置</div>
    <img src="../../../assets/images/local.svg"/>
  </div>

</template>

<script>
import { getCarType, getMarkers } from '@/api/dashboard'
export default {
  name: 'Map',
  data() {
    return {
      imgUrl: '/static/img/local.ed3e6852.svg',
      theMap: null,
      carType: null,
      thmarkers: null
    }
  },
  mounted() {
    this.getCarType()
    this.init()
  },
  methods: {
    async getCarType() {
      const res = await getCarType()
      this.carType = res // res.data
      console.log(res)
      this.getMarkers()
    },
    async getMarkers() {
      const res = await getMarkers()
      this.thmarkers = res.data
      console.log(this.thmarkers)
      this.loadMarkers(this.thmarkers)
    },
    init() {
      let that = this
      // 步骤：定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
      // 设置地图中心点
      const myLatlng = new qq.maps.LatLng(39.916527, 116.397128)
      // 定义工厂模式函数
      const myOptions = {
        zoom: 13, // 设置地图缩放级别
        center: myLatlng, // 设置中心点样式
        mapTypeId: qq.maps.MapTypeId.ROADMAP // 设置地图样式详情参见MapType
      }
      // 获取dom元素添加地图信息
      this.theMap = new qq.maps.Map(document.getElementById('container'), myOptions)
      qq.maps.event.addListener(
        this.theMap,
        'click',
        function(event) {
          that.setMapZoom()
          that.$emit('update',event.latLng.getLat(),event.latLng.getLng())
          console.log('您点击的位置为:[' + event.latLng.getLng() +
              ',' + event.latLng.getLat() + ']')
        }
      )
    },
    loadMarkers(data) {
      // 添加标记
      for (let i = 0; i < data.length; i++) {
        // 设置Marker自定义图标的属性，size是图标尺寸，该尺寸为显示图标的实际尺寸，origin是切图坐标，该坐标是相对于图片左上角默认为（0,0）的相对像素坐标，anchor是锚点坐标，描述经纬度点对应图标中的位置
        var anchor = new qq.maps.Point(0, 39)
        var size = new qq.maps.Size(42, 68)
        var origin = new qq.maps.Point(0, 0)
        console.log(this.carType[data[i].type].imgUrl)
        var icon = new qq.maps.MarkerImage(
          this.imgUrl,
          size,
          origin,
          anchor
        )
        var marker = new qq.maps.Marker({
          position: new qq.maps.LatLng(data[i].lat, data[i].lng),
          map: this.theMap
        })
        marker.setIcon(icon)
        var infoWin = new qq.maps.InfoWindow({
          map: this.theMap
        })
        // qq.maps.event.addListener(marker, 'click', function() {
        //   infoWin.open()
        //   infoWin.setContent('<div style="text-align:center;white-space:' +
        //       'nowrap;margin:10px;"> ' + data[i].lat + '<br>' + data[i].lng + '<br> 第' + i + ' </div>')
        //   // 提示窗位置
        //   infoWin.setPosition(new qq.maps.LatLng(data[i].lat, data[i].lng))
        // })
      }
      this.setBounds(data)// 自动调整地图显示范围
    },
    setBounds(coords) {
      // 一组坐标点
      // 创建LatLngBounds实例
      var latlngBounds = new qq.maps.LatLngBounds()
      // 将坐标逐一做为参数传入extend方法，latlngBounds会根据传入坐标自动扩展生成
      for (var i = 0; i < coords.length; i++) {
        latlngBounds.extend(new qq.maps.LatLng(coords[i].lat, coords[i].lng))
      }
      // 调用fitBounds自动调整地图显示范围
      this.theMap.fitBounds(latlngBounds)
    },
    getMapCenter() {
      // 获取地图中心点
      const centerLatLng = this.theMap.getCenter()
      console.log('lat:' + centerLatLng.lat, 'lng:' + centerLatLng.lng)
    },
    // 修改地图中心点
    changeMapCenter(lat, lng) {
      this.theMap.setCenter(new qq.maps.LatLng(lat, lng))
    },
    setMapZoom(z) {
      this.theMap.setZoom(18)
    }
  }
}
</script>

<style scoped>
  #container{
    width: 100%;
    min-height:350px ;
  }
  .green-btn{
    text-align: center;
    color: white;
    padding: 10px;
    width: 150px;
  }
</style>
