<template>
  <div>
    <div id="container" />
    <div v-show="showLabel" class="latlngLabel" :style="{left:labelLeft+'px',top:labelTop+'px'}">{{ cursorLatLng.lat+'--'+cursorLatLng.lng }}</div>
    <div v-show="drawType == 'polyon'||drawType == 'rectangle'" class="input-card " style="width: 200px">
      <h5 style="margin: 6px 0 10px 0; font-weight: 600;text-align: center">绘制电子围栏</h5>
      <!--<button class="btn" @click="drawPolyline()" style="margin-bottom: 5px">绘制线段</button>-->
      <el-button v-show="drawType !== 'polyon'" class="btn " type="primary" plain style="margin-bottom: 5px" @click="drawPolygon()">绘制多边形</el-button>
      <el-button v-show="drawType !== 'polyon'" class="btn " type="primary" plain style="margin-bottom: 5px" @click="drawRectangle()">绘制矩形</el-button>
      <el-button v-show="drawType !== 'polyon'" class="btn " type="primary" plain style="margin-bottom: 5px" @click="removeAllOverlay()">清除绘制</el-button>
      <el-button v-show="drawType === 'polyon'" class="btn" type="primary" style="margin-bottom: 5px" @click="open()">开始编辑</el-button>
      <el-button v-show="drawType === 'polyon'" class="btn" type="primary" @click="close()">结束编辑</el-button>
      <el-select
        v-show="drawType !== 'polyon'"
        v-model="inptVal"
        clearable
        filterable
        remote
        reserve-keyword
        placeholder="请输入关键词"
        :remote-method="searchAddress"
        @change="selectTrigger(inptVal)"
      >
        <!--:loading="loading"-->
        <!--multiple-->

        <el-option
          v-for="item in resOptions.tips"
          :key="item.id"
          :label="item.name"
          :value="item.location.lng+'_'+item.location.lat"
        >
          <div style="">{{ item.name }}</div>
          <div style="color: #8492a6; font-size: 13px">{{ item.district+item.address }}</div>
        </el-option>
      </el-select>
    </div>
  </div>

</template>

<script>
import { getCarType, getMarkers } from '@/api/dashboard'
import rMenu from '../../../utils/rMenu.js'
import { MP } from '@/utils/tmap.js'
import { mapGetters } from 'vuex'
const carType = {
  normal: {
    imgUrl: '/static/img/local.ed3e6852.svg?type=normal'
  },
  noElectric: {
    imgUrl: '/static/img/local.ed3e6852.svg?type=noElectric'
  },
  worthless: {
    imgUrl: '/static/img/local.ed3e6852.svg?type=worthless'
  },
  problem: {
    imgUrl: '/static/img/local.ed3e6852.svg?type=problem'
  }
}
export default {
  name: 'Map',
  props: { markers: { type: Array }, markerIdx: { type: Number }, polygons: { type: Array }, drawType: { type: String }},
  computed: {
    ...mapGetters([
      'polygonList',
      'markerList',
      'polylineList'
    ])
  },
  data() {
    return {
      errNetwork: false,
      inptVal: '',
      resOptions: [],
      imgUrl: '/static/img/local.ed3e6852.svg',
      theMap: null,
      carType: null,
      thmarkers: this.markers,
      labelLeft: 0,
      labelTop: 10,
      cursorLatLng: { lat: 0, lng: 0 },
      showLabel: false,
      markersArray: [],
      myLatlng: [117.214664, 29.29256],
      mapZoom: 10,
      mouseTool: null,
      autoComplete: null,
      myPolygon: [],
      polyEditor: null,
      mapLd: false,
      editedPlygn: null
    }
  },
  watch: {
    polylineList(val) {
      this.removeAllOverlay()
      this.loadPolyline(val)
    },
    markerList(val) {
      this.removeAllOverlay()
      this.loadMarkers(val)
    },
    polygonList() {
      this.removeAllOverlay()
      this.showPolygons()
    },
    myPolygon(val) {
      // this.$emit('drawChange', { myPolygon: val, drawType: this.drawType })
    },
    inptVal(val) {
      if (!val) {
        this.resOptions = []
      }
    },
    thmarkers(val) {
      // this.val = this.thmarkers;
      // this.deleteOverlays()
      // this.loadMarkers(this.thmarkers)
      // this.loadPolyline(this.thmarkers)
    },
    mapZoom(val) {
      const that = this
      if (val > 16) {
        that.theMap.plugin(['AMap.MouseTool'], function() {
          that.mouseTool = new AMap.MouseTool(that.theMap)
          // 用鼠标工具画多边形
          var drawPolygon = that.mouseTool.polygon()
          // 在地图中添加MouseTool插件
          // var distanceTool = new AMap.MouseTool(that.theMap)
          // distanceTool.rule()
          AMap.event.addListener(that.mouseTool, 'draw', function(e) {
            // 获取路径/范围
            that.myPolygon = e.obj.getPath()
            console.log(that.myPolygon)
          })
        })
      }
    }
  },
  mounted() {
    const that = this
    MP('f69c443f1f4d2801d4bfb6d31841705b').then(function(AMap) {
      that.errNetwork = false
      that.init(AMap)
      if (that.drawType === 'polyon') {
        that.editPolygon(that.polygons)
      } else if (that.drawType === 'polygonsList') {
        that.showPolygons()
      } else if (that.drawType === 'markers') {
        that.loadMarkers(that.markerList)
      } else if (that.drawType === 'polyline') {
        that.loadPolyline(that.polylineList)
      }
    }).catch(err => {
      console.log(err)
      that.errNetwork = true
    })
  },
  methods: {
    loadPolyline(data) {
      console.log(data)
      const that = this
      const path = []
      // 添加标记
      for (let i = 0; i < data.length; i++) {
        path.push(data[i].polyLine[0], data[i].polyLine[1])
      }
      console.log(path)
      // 创建折线实例
      var polyline = new AMap.Polyline({
        path: path,
        borderWeight: 2, // 线条宽度，默认为 1
        strokeColor: 'red', // 线条颜色
        lineJoin: 'round' // 折线拐点连接处样式
      })
      that.theMap.add(polyline)
      this.setFitView(polyline)// 自动调整地图显示范围
    },
    loadMarkers(data) {
      console.log(data)
      const that = this
      const markerArray = []
      // 添加标记
      for (let i = 0; i < data.length; i++) {
        // 设置Marker自定义图标的属性，size是图标尺寸，该尺寸为显示图标的实际尺寸，origin是切图坐标，该坐标是相对于图片左上角默认为（0,0）的相对像素坐标，anchor是锚点坐标，描述经纬度点对应图标中的位置
        const marker = new AMap.Marker({
          position: new AMap.LngLat(data[i].lngLat.lng, data[i].lngLat.lat),
          offset: new AMap.Pixel(-10, -10),
          icon: '' // that.carType[data[i].type].imgUrl, // 根据车辆类型显示图标
        //  title: '北京'
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
    init(AMap) {
      const that = this
      var buildings = new AMap.Buildings({
        'zooms': [1, 18],
        'zIndex': 10,
        'heightFactor': 2// 2倍于默认高度，3D下有效
      })// 楼块图层
      const myOptions =
      {
        zoom: that.mapZoom, // 设置地图显示的缩放级别
        center: that.myLatlng, // 设置地图中心点坐标
        cursor: 'crosshair',
        //  viewMode: '3D',
        pitch: 60,
        // rotation: -35,
        features: ['bg', 'road', 'point'], // 隐藏默认楼块
        mapStyle: 'amap://styles/light',
        // layers: [new AMap.TileLayer.Satellite(), // 高德默认标准图层
        //   buildings],
        lang: 'zh_cn' // 设置地图语言类型

      }
      // 获取dom元素添加地图信息
      that.theMap = new AMap.Map('container', myOptions)
      that.theMap.plugin(['AMap.ControlBar', 'AMap.ToolBar'], function() {
        const controlBar = new AMap.ControlBar({ position: { top: '30px', right: '10px' }, showZoomBarz: true, showControlButton: true })
        that.theMap.addControl(new AMap.ToolBar())
        that.theMap.addControl(controlBar)
        // 图层切换控件
        // that.theMap.addControl(new AMap.BasicControl.LayerSwitcher({
        //   position: 'rt' //right top，右上角
        // }));
      })
      // that.theMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], function() {
      //   var autoOptions = {
      //     // 城市，默认全国
      //     city: '景德镇',
      //     // 使用联想输入的input的id
      //     input: 'input'
      //   }
      // that.autoComplete = new AMap.Autocomplete(autoOptions)
      // var placeSearch = new AMap.PlaceSearch({
      //   city: '景德镇',
      //   map: that.theMap
      // })
      // that.theMap.on(that.autoComplete, 'select', function(e) {
      //   // TODO 针对选中的poi实现自己的功能
      //   placeSearch.search(e.poi.name)
      // })
      // })
      // 创建右键菜单
      const menu = new rMenu.ContextMenu(that.theMap)
      // menu.contextMenu.open(that.theMap, lnglat)
      window.menu = menu
      that.theMap.on('mousemove',
        function(event) {
          that.showLabel = true
          that.labelLeft = document.body.scrollLeft + event.pixel.x
          that.labelTop = event.pixel.y + 150 // document.body.scrollTop
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
          // that.$emit('update', event.lnglat.getLat(), event.lnglat.getLng())
          console.log('您点击的位置为:[' + event.lnglat.getLng() +
            ',' + event.lnglat.getLat() + ']')
        }
      )
      // that.loadMarkers(that.markerList)
    },
    showPolygons() {
      const that = this
      const viewList = []
      for (let i = 0; i < that.polygonList.length; i++) {
        const polygons = that.polygonList[i].drawzPolygon
        var path = []
        for (const plgn in polygons) {
          path.push([polygons[plgn].lng, polygons[plgn].lat])
        }
        var polygon = new AMap.Polygon({
          path: path,
          strokeColor: '#FF3300',
          strokeWeight: 6,
          strokeOpacity: 0.8,
          fillOpacity: 0.4,
          fillColor: '#1791fc',
          zIndex: 50
        })

        viewList.push(polygon)
      }
      // 创建覆盖物群组，传入覆盖物组成的数组
      var overlayGroup = new AMap.OverlayGroup(viewList)

      // 对此覆盖物群组设置同一属性
      overlayGroup.setOptions({
        strokeColor: 'red',
        strokeWeight: 5
      })

      // 统一添加到地图实例上
      that.theMap.add(overlayGroup)
      that.theMap.setFitView(viewList)
    },
    selectTrigger(data) {
      const Latlng = data.split('_')
      this.theMap.setCenter(Latlng)
      this.addMarker(Latlng)
      this.setMapZoom()

      console.log(this.myLatlng)
    },
    searchAddress(keyword) {
      console.log(keyword)
      const that = this
      if (keyword.length > 3) {
        console.log('大于3')
        AMap.plugin('AMap.Autocomplete', function() {
          // 实例化Autocomplete
          var autoOptions = {
            city: '全国'
          }
          var autoComplete = new AMap.Autocomplete(autoOptions)
          autoComplete.search(keyword, function(status, result) {
            that.resOptions = result
            console.log(result)
            // 搜索成功时，result即是对应的匹配数据
            // var node = new PrettyJSON.view.Node({
            //   el: document.querySelector("#input-info"),
            //   data: result
            // });
          })
        })
      }
    },

    removeAllOverlay() {
      // 清除地图上所有添加的覆盖物
      this.theMap.clearMap()
    },

    drawPolyline() {
      this.mouseTool.polyline({
        strokeColor: '#3366FF',
        strokeOpacity: 1,
        strokeWeight: 6,
        // 线样式还支持 'dashed'
        strokeStyle: 'solid'
        // strokeStyle是dashed时有效
        // strokeDasharray: [10, 5],
      })
    },
    drawPolygon() {
      this.drawType = 'polyon'
      this.mouseTool.polygon({
        strokeColor: '#FF33FF',
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillColor: '#1791fc',
        fillOpacity: 0.4,
        // 线样式还支持 'dashed'
        strokeStyle: 'solid'
        // strokeStyle是dashed时有效
        // strokeDasharray: [30,10],
      })
    },
    drawRectangle() {
      this.drawType = 'rectangle'
      this.mouseTool.rectangle({
        strokeColor: 'red',
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: 'blue',
        fillOpacity: 0.5,
        // strokeStyle还支持 solid
        strokeStyle: 'solid'
        // strokeDasharray: [30,10],
      })
    }, drawCircle() {
      this.mouseTool.circle({
        strokeColor: '#FF33FF',
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillColor: '#1791fc',
        fillOpacity: 0.4,
        strokeStyle: 'solid'
        // 线样式还支持 'dashed'
        // strokeDasharray: [30,10],
      })
    },
    editPolygon(polygons) {
      const that = this
      var path = []
      for (const plgn in polygons) {
        console.log(polygons[plgn])
        path.push([polygons[plgn].lng, polygons[plgn].lat])
      }

      var polygon = new AMap.Polygon({
        path: path,
        strokeColor: '#FF33FF',
        strokeWeight: 6,
        strokeOpacity: 0.2,
        fillOpacity: 0.4,
        fillColor: '#1791fc',
        zIndex: 50
      })

      this.theMap.add(polygon)
      // 缩放地图到合适的视野级别
      this.theMap.setFitView([polygon])

      this.polyEditor = new AMap.PolyEditor(this.theMap, polygon)

      this.polyEditor.on('addnode', function(event) {
        console.log('触发事件：addnode')
      })

      this.polyEditor.on('adjust', function(event) {
        console.log('触发事件：adjust')
      })

      this.polyEditor.on('removenode', function(event) {
        console.log('触发事件：removenode')
      })

      this.polyEditor.on('end', function(event) {
        console.log('触发事件： end')
        // event.target 即为编辑后的多边形对象
        that.myPolygon = event.target.B.path
        that.editedPlygn = { myPolygon: event.target.B.path, drawType: 'polyon' }
        that.$emit('drawChange', that.editedPlygn)
        that.myPolygon = []
        console.log(event.target.B.path)
      })
    },
    open() {
      this.polyEditor.open()
    },
    close() {
      this.polyEditor.close()
    },
    editRectangle(data) {
      var Rectangle = new AMap.Rectangle({
        bounds: new AMap.Bounds(new AMap.LngLat(data[0].lng, data[0].lat), new AMap.Bounds(new AMap.LngLat(data[3].lng, data[3].lat)))
      })
      Rectangle.setMap(this.theMap)

      this.theMap.plugin(['AMap.RectangleEditor'], function() {
        var RectangleEditor = new AMap.RectangleEditor(this.theMap, Rectangle)
        RectangleEditor.open()
      })
    },
    loadMarkers1(data) {
      debugger
      // 添加标记
      for (let i = 0; i < data.length; i++) {
        this.addMarker(data[i].lat, data[i].lng)
      }
      // this.setBounds(data)// 自动调整地图显示范围
    },
    // 添加标记
    addMarker(latlng) {
      // 创建一个 Marker 实例：
      var marker = new AMap.Marker({
        position: new AMap.LngLat(latlng[0], latlng[1]) // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        // title: '北京'
      })
      this.theMap.add(marker)
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
    setMapZoom(z) {
      this.theMap.setZoom(18)
      this.mapZoom = 18
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
    bottom: 4rem;
    right: 1rem;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    padding: 0.75rem 1.25rem;
  }

  .input-text {
    line-height: 2rem;
    margin-right: 2rem;
  }

  .el-select-dropdown__item{
    height: 68px;
  }
   .btn {
     width: 100%;
     margin: 2px auto !important;
    /*top: 1rem;*/
    /*position: absolute;*/
    /*right: 1rem;*/
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
    height: 70vh;
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
