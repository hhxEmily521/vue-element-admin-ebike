<template>
  <div>
    <div id="container" />
    <img src="../../../assets/images/local.svg">
    <div v-show="showLabel" class="latlngLabel" :style="{left:labelLeft+'px',top:labelTop+'px'}">{{ cursorLatLng.lat+'--'+cursorLatLng.lng }}</div>
  </div>

</template>

<script>
import { getCarType, getMarkers } from '@/api/dashboard'
import '@/utils/tmap.js'

export default {
  name: 'Map',
  props: { markers: { type: Array }, markerIdx: { type: Number }},
  data() {
    return {
      imgUrl: '/static/img/local.ed3e6852.svg',
      theMap: null,
      carType: null,
      thmarkers: this.markers,
      labelLeft: 0,
      labelTop: 10,
      cursorLatLng: { lat: 0, lng: 0 },
      showLabel: false,
      markersArray: []
    }
  },
  watch: {
    thmarkers(val) {
      // this.val = this.thmarkers;
      // this.deleteOverlays()
      // this.loadMarkers(this.thmarkers)
      // this.loadPolyline(this.thmarkers)
    }
  },
  mounted() {
    // this.getCarType()
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
      const that = this
      // 步骤：定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
      // 设置地图中心点
      const myLatlng = [116.397128, 39.916527]
      // 定义工厂模式函数
      const myOptions =
      {
        zoom: 10, // 设置地图显示的缩放级别
        center: myLatlng, // 设置地图中心点坐标
        layers: [new AMap.TileLayer.Satellite()], // 设置图层,可设置成包含一个或多个图层的数组
        cursor: 'crosshair',
        mapStyle: 'amap://styles/normal', // 设置地图的显示样式
        viewMode: '2D', // 设置地图模式
        lang: 'zh_cn' // 设置地图语言类型

      }
      // 获取dom元素添加地图信息
      that.theMap = new AMap.Map('container', myOptions)

      that.theMap.plugin(['AMap.ControlBar', 'AMap.ToolBar', 'AMap.MouseTool'], function() {
        var controlBar = new AMap.ControlBar({ position: { top: '30px', right: '10px' }, showZoomBarz: true, showControlButton: true })
        that.theMap.addControl(new AMap.ToolBar())
        that.theMap.addControl(controlBar)
        //图层切换控件
        // that.theMap.addControl(new AMap.BasicControl.LayerSwitcher({
        //   position: 'rt' //right top，右上角
        // }));
        var mouseTool = new AMap.MouseTool(that.theMap)

        // 用鼠标工具画多边形
        var drawPolygon = mouseTool.polygon()
        //在地图中添加MouseTool插件
        var distanceTool = new AMap.MouseTool(that.theMap);
        console.log(distanceTool.rule())


        //测量

        // 添加事件
        AMap.event.addListener(mouseTool, 'draw', function(e) {
          console.log(e.obj.getPath())// 获取路径/范围
          distanceTool.rule()

        })
      })
      that.theMap.on('mousemove',
        function(event) {
          that.showLabel = true
          that.labelLeft = document.body.scrollLeft + event.pixel.x
          that.labelTop = event.pixel.y + 180 // document.body.scrollTop
          that.cursorLatLng = { lat: event.lnglat.getLat(), lng: event.lnglat.getLng() }
          // console.log('您mousemove的位置为:[' + event.latLng.getLng() +
          //     ',' + event.latLng.getLat() + ']')
        }
      )
      that.theMap.on(
        'mouseout',
        function(event) {
          that.showLabel = false
        }
      )
      that.theMap.on(
        'click',
        function(event) {
          that.setMapZoom()
          that.$emit('update', event.lnglat.getLat(), event.lnglat.getLng())
          console.log('您点击的位置为:[' + event.lnglat.getLng() +
            ',' + event.lnglat.getLat() + ']')
        }
      )
    },
    loadMarkers(data) {
      // 添加标记
      for (let i = 0; i < data.length; i++) {
        this.addMarker(data[i].lat, data[i].lng)
      }
      // this.setBounds(data)// 自动调整地图显示范围
    },
    loadPolyline(data) {
      const LatLngObj = []
      for (let i = 0; i < data.length; i++) {
        LatLngObj.push(new qq.maps.LatLng(data.lat, data.lng))
      }
      var polyline = new qq.maps.Polyline({
        path: LatLngObj,
        strokeColor: '#000000',
        strokeWeight: 10,
        map: this.theMap
      })
    },
    // 添加标记
    addMarker(lat, lng) {
      var marker = new qq.maps.Marker({
        position: new qq.maps.LatLng(lat, lng),
        map: this.theMap
      })
      // 设置Marker自定义图标的属性，size是图标尺寸，该尺寸为显示图标的实际尺寸，origin是切图坐标，该坐标是相对于图片左上角默认为（0,0）的相对像素坐标，anchor是锚点坐标，描述经纬度点对应图标中的位置
      var anchor = new qq.maps.Point(20, 28)
      var size = new qq.maps.Size(42, 68)
      var origin = new qq.maps.Point(0, 0)
      var icon = new qq.maps.MarkerImage(
        this.imgUrl,
        size,
        origin,
        anchor
      )
      marker.setIcon(icon)
      var infoWin = new qq.maps.InfoWindow({
        map: this.theMap
      })
      qq.maps.event.addListener(marker, 'click', function() {
        infoWin.open()
        infoWin.setContent('<div style="text-align:center;white-space:' +
          'nowrap;margin:10px;"> ' + data[i].lat + '<br>' + data[i].lng + '<br> 第' + i + ' </div>')
        infoWin.setPosition(new qq.maps.LatLng(data[i].lat, data[i].lng))
      })
      this.markersArray.push(marker)
    },

    // 清除覆盖层
    clearOverlays() {
      if (this.markersArray) {
        for (const i in this.markersArray) {
          this.markersArray[i].setMap(null)
        }
      }
    },

    // 显示覆盖层
    showOverlays() {
      if (this.markersArray) {
        for (const i in this.markersArray) {
          this.markersArray[i].setMap(this.theMap)
        }
      }
    },

    // 删除覆盖物
    deleteOverlays() {
      if (this.markersArray) {
        for (const i in this.markersArray) {
          this.markersArray[i].setMap(null)
        }
        this.markersArray.length = 0
      }
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

<style type="scss">
  #container{
    width: 100%;
    min-height:350px ;
    &>{
      cursor: crosshair;
    }

  }
  .latlngLabel{
    border: 1px solid black;
    position: absolute;
    background: #fffff8;

  }
  .green-btn{
    text-align: center;
    color: white;
    padding: 10px;
    width: 150px;
  }
</style>
