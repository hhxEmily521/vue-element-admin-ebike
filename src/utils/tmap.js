
const key = 'Pad71eb8813c6eb07587d7d25ef5a171d'
var url = 'https://webapi.amap.com/maps?v=1.4.15&key=' + key + '&callback=onLoad' + '&plugin=AMap.ToolBar,AMap.Driving,AMap.ControlBar,AMap.MouseTool'
var jsapi = document.createElement('script')
jsapi.charset = 'utf-8'
jsapi.src = url
document.head.appendChild(jsapi)
window.onLoad = function() {
  var map = new AMap.Map('container')
}
