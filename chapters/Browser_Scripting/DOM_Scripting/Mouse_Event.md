# MousEvent


* clientX/Y 相对于当前元素的本地坐标
* button 按键识别位，0-2，代表左中右
* buttons 事件发生时同时按下的按钮

## mouseenter和mouseover

* mouseenter： 鼠标指针进入容器（moved over）
* mouseover: 鼠标指针移到容器上方(moved onto)


前者不冒泡，而后者由于会冒泡，会多次在上层容器商绑定的监听器会多次触发。

mouseleave和mouseout同理。
