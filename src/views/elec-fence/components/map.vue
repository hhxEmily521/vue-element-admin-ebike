<template>
  <div>
    <div id="container" />
    <img src="../../../assets/images/local.svg">
    <div v-show="showLabel" class="latlngLabel" :style="{left:labelLeft+'px',top:labelTop+'px'}">{{ cursorLatLng.lat+'--'+cursorLatLng.lng }}</div>
    <div class="input-card " style="width: 200px">
      <h5 style="margin: 6px 0 10px 0; font-weight: 600;text-align: center">绘制电子围栏</h5>
      <!--<button class="btn" @click="drawPolyline()" style="margin-bottom: 5px">绘制线段</button>-->
      <button class="btn " type="primary" plain @click="drawPolygon()" style="margin-bottom: 5px">绘制多边形</button>
      <button class="btn " type="primary" plain @click="drawRectangle()" style="margin-bottom: 5px">绘制矩形</button>
      <button class="btn " type="primary" plain @click="removeAllOverlay()" style="margin-bottom: 5px">清除绘制</button>
    </div>
  </div>

</template>

<script>
import { getCarType, getMarkers } from '@/api/dashboard'
import '@/utils/tmap.js'
import rMenu from '../../../utils/rMenu.js'
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
      markersArray: [],
      myLatlng : [116.397128, 39.916527],
      mapZoom:10,
      mouseTool:null
    }
  },
  watch: {
    thmarkers(val) {
      // this.val = this.thmarkers;
      // this.deleteOverlays()
      // this.loadMarkers(this.thmarkers)
      // this.loadPolyline(this.thmarkers)
    },
    mapZoom(val){
      let that =this
      if(val>16){
        that.theMap.plugin(['AMap.MouseTool'], function() {
          that.mouseTool = new AMap.MouseTool(that.theMap)
          // 用鼠标工具画多边形
          var drawPolygon =  that.mouseTool.polygon()
          //在地图中添加MouseTool插件
          var distanceTool = new AMap.MouseTool(that.theMap);
          distanceTool.rule()
          AMap.event.addListener( that.mouseTool, 'draw', function(e) {
            console.log(e.obj.getPath())// 获取路径/范围
          })
        })
      }

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
      // 定义工厂模式函数
      const myOptions =
      {
        zoom: that.mapZoom, // 设置地图显示的缩放级别
        center: that.myLatlng, // 设置地图中心点坐标
        layers: [new AMap.TileLayer.Satellite()], // 设置图层,可设置成包含一个或多个图层的数组
        cursor: 'crosshair',
        mapStyle: 'amap://styles/normal', // 设置地图的显示样式
        viewMode: '2D', // 设置地图模式
        lang: 'zh_cn' // 设置地图语言类型

      }
      // 获取dom元素添加地图信息
      that.theMap = new AMap.Map('container', myOptions)
      that.theMap.plugin(['AMap.ControlBar', 'AMap.ToolBar'], function() {
        var controlBar = new AMap.ControlBar({ position: { top: '30px', right: '10px' }, showZoomBarz: true, showControlButton: true })
        that.theMap.addControl(new AMap.ToolBar())
        that.theMap.addControl(controlBar)
        //图层切换控件
        // that.theMap.addControl(new AMap.BasicControl.LayerSwitcher({
        //   position: 'rt' //right top，右上角
        // }));
      })
      //创建右键菜单
      console.log(rMenu)
     let menu = new rMenu.ContextMenu(that.theMap);
      var lnglat = new AMap.LngLat(116.397, 39.918);
      menu.contextMenu.open(that.theMap, lnglat);
      window.menu=menu
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
    removeAllOverlay(){

      // 清除地图上所有添加的覆盖物
      this.theMap.clearMap();
    },

    drawPolyline () {
      this.mouseTool.polyline({
    strokeColor: "#3366FF",
    strokeOpacity: 1,
    strokeWeight: 6,
    // 线样式还支持 'dashed'
    strokeStyle: "solid",
    // strokeStyle是dashed时有效
    // strokeDasharray: [10, 5],
  })
},drawPolygon () {
      this.mouseTool.polygon({
    strokeColor: "#FF33FF",
    strokeOpacity: 1,
    strokeWeight: 6,
    strokeOpacity: 0.2,
    fillColor: '#1791fc',
    fillOpacity: 0.4,
    // 线样式还支持 'dashed'
    strokeStyle: "solid",
    // strokeStyle是dashed时有效
    // strokeDasharray: [30,10],
  })
}, drawRectangle () {
      this.mouseTool.rectangle({
    strokeColor:'red',
    strokeOpacity:0.5,
    strokeWeight: 6,
    fillColor:'blue',
    fillOpacity:0.5,
    // strokeStyle还支持 solid
    strokeStyle: 'solid',
    // strokeDasharray: [30,10],
  })
}, drawCircle () {
      this.mouseTool.circle({
    strokeColor: "#FF33FF",
    strokeOpacity: 1,
    strokeWeight: 6,
    strokeOpacity: 0.2,
    fillColor: '#1791fc',
    fillOpacity: 0.4,
    strokeStyle: 'solid',
    // 线样式还支持 'dashed'
    // strokeDasharray: [30,10],
  })
},loadMarkers(data) {
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
      this.mapZoom=18
    }
  }
}
</script>

<style type="scss">
  .input-card {
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border-radius: .25rem;
    width: 22rem;
    border-width: 0;
    border-radius: 0.4rem;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    padding: 0.75rem 1.25rem;
  }

  .input-text {
    line-height: 2rem;
    margin-right: 2rem;
  }

  .info hr {
    margin-right: 0;
    margin-left: 0;
    border-top-color: grey;
  }

  .info {
    padding: .75rem 1.25rem;
    margin-bottom: 1rem;
    border-radius: .25rem;
    position: fixed;
    top: 1rem;
    background-color: white;
    width: auto;
    min-width: 22rem;
    border-width: 0;
    right: 1rem;
    box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
  }

  .code {
    left: 1.5rem;
    right: 1.5rem;
    top: 1.5rem;
    bottom: 1.5rem;
    overflow: auto;
    margin-bottom: 0rem;
  }

  .code .btn {
    top: 1rem;
    position: absolute;
    right: 1rem;
  }
  .context_menu{
    background: white;
    position: relative;
    min-width: 12rem;
    padding: 0;
  }

  .context_menu p{
    cursor: pointer;
    padding: 0.25rem 1.25rem;
  }

  .context_menu p:hover{
    background: #ccc;
  }
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
