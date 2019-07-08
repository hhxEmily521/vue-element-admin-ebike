export function MP(key) {
  return new Promise(function(resolve, reject) {
    // const key = 'f69c443f1f4d2801d4bfb6d31841705b'
    window.onLoad = function() {
      resolve(AMap)
    }

    var url = 'https://webapi.amap.com/maps?v=1.4.15&key=' + key + '&callback=onLoad' +
  '&plugin=AMap.ToolBar,AMap.Driving,AMap.ControlBar,AMap.MouseTool,AMap.Autocomplete,AMap.PlaceSearch,' +
  'AMap.PolyEditor,AMap.RectangleEditor,AMap.OverlayGroup'
    var jsapi = document.createElement('script')
    jsapi.charset = 'utf-8'
    jsapi.src = url
    document.head.appendChild(jsapi)
  })
}

