<template>
  <div>
    <div id="container" />
    <img src="../../../assets/images/local.svg"/>
    <div v-show="showLabel" class="latlngLabel" :style="{left:labelLeft+'px',top:labelTop+'px'}">{{cursorLatLng.lat+'--'+cursorLatLng.lng}}</div>
  </div>

</template>

<script>
import { getCarType, getMarkers } from '@/api/dashboard'
export default {
  name: 'Map',
  props:{markers:{type:Array}, markerIdx:{type: Number}},
  data() {
    return {
      imgUrl: '/static/img/local.ed3e6852.svg',
      theMap: null,
      carType: null,
      thmarkers: this.markers,
      labelLeft:0,
      labelTop:10,
      cursorLatLng:{lat:0,lng:0},
      showLabel:false,
      markersArray:[]
    }
  },
  mounted() {
    // this.getCarType()
    this.init()
  },
  watch:{
    thmarkers(val){
      // this.val = this.thmarkers;
      this.deleteOverlays()
      this.loadMarkers(this.thmarkers)
      this.loadPolyline(this.thmarkers)
    }
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
        'mousemove',
        function(event) {
          that.showLabel=true
          that.labelLeft = document.body.scrollLeft + event.cursorPixel.x;
          that.labelTop = event.cursorPixel.y+180;  //document.body.scrollTop
          that.cursorLatLng={lat:event.latLng.getLat(),lng:event.latLng.getLng()}
          // console.log('您mousemove的位置为:[' + event.latLng.getLng() +
          //     ',' + event.latLng.getLat() + ']')
        }
      )
      qq.maps.event.addListener(
        this.theMap,
        'mouseout',
        function(event) {
          that.showLabel=false
        }
      )
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
        this.addMarker(data[i].lat, data[i].lng)
        var infoWin = new qq.maps.InfoWindow({
          map: this.theMap
        })
        qq.maps.event.addListener(marker, 'click', function() {
          infoWin.open()
          infoWin.setContent('<div style="text-align:center;white-space:' +
              'nowrap;margin:10px;"> ' + data[i].lat + '<br>' + data[i].lng + '<br> 第' + i + ' </div>')
          infoWin.setPosition(new qq.maps.LatLng(data[i].lat, data[i].lng))
        })
      }
      // this.setBounds(data)// 自动调整地图显示范围
    },
    loadPolyline(data){
      let LatLngObj=[]
      for (let i = 0; i < data.length; i++) {
        LatLngObj.push( new qq.maps.LatLng(data.lat, data.lng))
      }
        var polyline = new qq.maps.Polyline({
        path:LatLngObj,
        strokeColor: '#000000',
        strokeWeight: 10,
        map:this.theMap
      });
    },
    //添加标记
    addMarker(lat,lng) {
  var marker = new qq.maps.Marker({
    position: new qq.maps.LatLng(lat,lng),
    map: this.theMap
  });
  // 设置Marker自定义图标的属性，size是图标尺寸，该尺寸为显示图标的实际尺寸，origin是切图坐标，该坐标是相对于图片左上角默认为（0,0）的相对像素坐标，anchor是锚点坐标，描述经纬度点对应图标中的位置
      var anchor = new qq.maps.Point(20,28)
      var size = new qq.maps.Size(42, 68)
      var origin = new qq.maps.Point(0, 0)
      var icon = new qq.maps.MarkerImage(
        this.imgUrl,
        size,
        origin,
        anchor
      )
      marker.setIcon(icon)
  this.markersArray.push(marker);
},

//清除覆盖层
 clearOverlays() {
  if (this.markersArray) {
    for (let i in this.markersArray) {
      this.markersArray[i].setMap(null);
    }
  }
},

//显示覆盖层
 showOverlays() {
  if (this.markersArray) {
    for (let i in this.markersArray) {
      this.markersArray[i].setMap(this.theMap);
    }
  }
},


//删除覆盖物
 deleteOverlays() {
  if (this.markersArray) {
    for (let i in this.markersArray) {
      this.markersArray[i].setMap(null);
    }
    this.markersArray.length = 0;
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
