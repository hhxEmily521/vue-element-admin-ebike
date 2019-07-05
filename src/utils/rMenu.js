//自定义菜单类
let map = null
function ContextMenu(map1) {
  var me = this;
  map=map1
  //地图中添加鼠标工具MouseTool插件
  this.mouseTool = new AMap.MouseTool(map);

  this.contextMenuPositon = null;

  var content = [];
  content.push("<div class='info context_menu'>");
  content.push("  <p onclick='menu.closeMenu()'>结束绘制</p>");
  content.push("  <p onclick='menu.zoomMenu(0)'>缩小</p>");
  content.push("  <p class='split_line' onclick='menu.zoomMenu(1)'>放大</p>");
  content.push("  <p class='split_line' onclick='menu.distanceMeasureMenu()'>距离量测</p>");
  content.push("  <p onclick='menu.addMarkerMenu()'>添加标记</p>");
  content.push("</div>");

  //通过content自定义右键菜单内容
  this.contextMenu = new AMap.ContextMenu({isCustom: true, content: content.join('')});

  //地图绑定鼠标右击事件——弹出右键菜单
  map.on('rightclick', function (e) {
    me.contextMenu.open(map, e.lnglat);
    me.contextMenuPositon = e.lnglat; //右键菜单位置
  });
}

ContextMenu.prototype.closeMenu = function zoomMenu(tag) {
  this.contextMenu.close();
};
ContextMenu.prototype.zoomMenu = function zoomMenu(tag) {//右键菜单缩放地图
  if (tag === 0) {
    map.zoomOut();
  }
  if (tag === 1) {
    map.zoomIn();
  }
  this.contextMenu.close();
};

ContextMenu.prototype.distanceMeasureMenu = function () {  //右键菜单距离量测
  this.mouseTool.rule();
  this.contextMenu.close();
};

ContextMenu.prototype.addMarkerMenu = function () {  //右键菜单添加Marker标记
  this.mouseTool.close();
  var marker = new AMap.Marker({
    map: map,
    position: this.contextMenuPositon //基点位置
  });
  this.contextMenu.close();
};
export default {
  ContextMenu
}
