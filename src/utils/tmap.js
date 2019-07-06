
const key = 'f69c443f1f4d2801d4bfb6d31841705b'
var url = 'https://webapi.amap.com/maps?v=1.4.15&key=' + key + '&callback=onLoad' +
  '&plugin=AMap.ToolBar,AMap.Driving,AMap.ControlBar,AMap.MouseTool,AMap.Autocomplete,AMap.PlaceSearch'
var jsapi = document.createElement('script')
jsapi.charset = 'utf-8'
jsapi.src = url
document.head.appendChild(jsapi)
window.onLoad = function() {
  var map = new AMap.Map('container')
}

