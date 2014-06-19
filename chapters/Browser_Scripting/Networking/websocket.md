# Websocket

## Protocol

Websocket链接有一个普通的HTTP请求开始，这个请求带有重要的`Upgrade`头：

```
GET ws://echo.websocket.org/?encoding=text HTTP/1.1
Origin: http://websocket.org
Cookie: __utma=99as
Connection: Upgrade
Host: echo.websocket.org
Sec-WebSocket-Key: uRovscZjNol/umbTt5uKmw==
Upgrade: websocket
Sec-WebSocket-Version: 13
```

如果远程服务器理解并支持Websocket，它会返回相关信息：

```
HTTP/1.1 101 WebSocket Protocol Handshake
Date: Fri, 10 Feb 2012 17:38:18 GMT
Connection: Upgrade
Server: Kaazing Gateway
Upgrade: WebSocket
Access-Control-Allow-Origin: http://websocket.org
Access-Control-Allow-Credentials: true
Sec-WebSocket-Accept: rLHCkw/SKsO9GAH/ZSFhBATDKrU=
Access-Control-Allow-Headers: content-type
```

然后，Websocket会通过这个HTTP请求下面的TCP/IP链接进行后续通讯，所以默认情况下，Websocket使用80或443端口。


Websocket的两端是以全双工的模式下发送数据帧(frame)。后面会详细介绍Websocket中允许的两种数据帧：文本数据帧(text frame)和二进制数据帧(binary frame)。

对于面向浏览器的开发者来说，使用Websocket非常简单：


客户端接受这些回调函数：

```
var myWebSocket = new WebSocket("ws://www.websockets.org");
myWebSocket.onopen = function(evt) { alert("Connection open ..."); }; myWebSocket.onmessage = function(evt) { alert( "Received Message: " + evt.data); }; myWebSocket.onclose = function(evt) { alert("Connection closed."); };
```

也可以主动发起一些操作，如发送消息、关闭链接：

```
myWebSocket.send("Hello WebSockets!");
myWebSocket.close();
```
