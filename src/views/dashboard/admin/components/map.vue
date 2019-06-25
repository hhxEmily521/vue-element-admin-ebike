<template>
  <div id="container" />
</template>

<script>
export default {
  name: 'Map',
  data() {
    return {
      thmarkers: [{ lat: 39.716520, lng: 116.997120 }, { lat: 39.716590, lng: 116.997420 }, { lat: 39.715520, lng: 116.997190 }, { lat: 39.725520, lng: 116.697190 }]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
    // 步骤：定义map变量 调用 qq.maps.Map() 构造函数   获取地图显示容器
    // 设置地图中心点

      const myLatlng = new qq.maps.LatLng(39.916527, 116.397128)
      // 定义工厂模式函数
      const myOptions = {
        zoom: 8, // 设置地图缩放级别
        center: myLatlng, // 设置中心点样式
        mapTypeId: qq.maps.MapTypeId.ROADMAP // 设置地图样式详情参见MapType
      }
      // 获取dom元素添加地图信息
      var map = new qq.maps.Map(document.getElementById('container'), myOptions)
      var anchor = new qq.maps.Point(0, 39)
      var size = new qq.maps.Size(42, 68)
      var origin = new qq.maps.Point(0, 0)
      var markerIcon = new qq.maps.MarkerImage(
        'https://rt0.map.gtimg.com/icons/1d/mapcfg_National.png',
        size,
        origin,
        anchor
      )
      // 添加提示窗
      var infoWin = new qq.maps.InfoWindow({
        map: map
      })
      // 添加标记
      const data = this.thmarkers
      for (let i = 0; i < data.length; i++) {
        // 设置Marker自定义图标的属性，size是图标尺寸，该尺寸为显示图标的实际尺寸，origin是切图坐标，该坐标是相对于图片左上角默认为（0,0）的相对像素坐标，anchor是锚点坐标，描述经纬度点对应图标中的位置
        var anchor = new qq.maps.Point(0, 39)
        var size = new qq.maps.Size(42, 68)
        var origin = new qq.maps.Point(0, 0)
        var icon = new qq.maps.MarkerImage(
          'https://i.gtja.com/wxcos/assets/themes/1.2.1/images/icons/app/shortcut/zijinguanli_f17272.svg',
          size,
          origin,
          anchor
        )
        // 设置Marker阴影图片属性，size是图标尺寸，该尺寸为显示图标的实际尺寸，origin是切图坐标，该坐标是相对于图片左上角默认为（0,0）的相对像素坐标，anchor是锚点坐标，描述经纬度点对应图标中的位置
        var anchorb = new qq.maps.Point(3, -30)
        var sizeb = new qq.maps.Size(42, 11)
        var origin = new qq.maps.Point(0, 0)
        var iconb = new qq.maps.MarkerImage(
          'https://i.gtja.com/wxcos/assets/themes/1.2.1/images/icons/app/shortcut/zijinguanli_f17272.svg',
          sizeb,
          origin,
          anchorb
        )
        var marker = new qq.maps.Marker({
          position: new qq.maps.LatLng(data[i].lat, data[i].lng),
          map: map
        })
        marker.setIcon(icon)
        marker.setShadow(iconb)
        qq.maps.event.addListener(marker, 'click', function() {
          infoWin.open()
          infoWin.setContent('<div style="text-align:center;white-space:' +
            'nowrap;margin:10px;"> ' + data[i].lat + '<br>' + data[i].lng + ' </div>')
          // 提示窗位置
          infoWin.setPosition(new qq.maps.LatLng(data[i].lat, data[i].lng))
        })
      }
    }
  }
}
</script>

<style scoped>
  #container{
    width: 100%;
    min-height:250px ;
  }
</style>
