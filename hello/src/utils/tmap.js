export function TMap() {
  const key = 'PTSBZ-G6DCS-243OV-6FJIH-G22W3-SCFNH'
  return new Promise(function(resolve, reject) {
    window.init = function() {
      resolve(qq) // eslint-disable-next-line
    }
    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'http://map.qq.com/api/js?v=2.exp&callback=init&key=' + key + '&libraries=drawing,geometry,place,convertor,visualization'
    script.onerror = reject
    debugger
    document.head.appendChild(script)
  })
}
