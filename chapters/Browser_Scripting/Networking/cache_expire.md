## Pragma

HTTP 1.0协议中就开始支持的头，通过告诉浏览器`no-cache`来禁用缓存。


## Cache-Control

Cache-Control接受多个cache-directive

* `no-cache`强制每次忽略缓存，发送请求到服务器
* `no-store`强制不保留任何副本
* `max-age`在指定事件（以秒为单位）内不请求服务器
* `public`任何途径均可使用缓存
* `private`只针对某个实体使用缓存
* `must-revalidate`缓存失效后，要求服务器重新验证

Cache-Control是HTTP1.1中最重要的缓存设定，它会覆盖其他设定，例如`Expires`和`Last-Modified`。
而且，Cache-Control也是浏览器之间最一致的缓存策略。

## Expires

接受一个GMT格式的过期时间

## Last-Modified

作为缓存的验证器，如果服务器在给丁时间后没有修改资源，则可以判定条目有效（返回304）。

## E-Tag

作为缓存的实体验证码，基于返回的内容，算法由服务器决定。


整体结论：

* 打开新窗口：如果指定cache-control的值为private、no-cache、must-revalidate,那么打开新窗口访问时都会重新访问服务器。而如果指定了max-age值,那么在此值内的时间里就不会重新访问服务器
* 在地址栏回车：如果值为private或must-revalidate,则只有第一次访问时会访问服务器,以后就不再访问。如果值为no-cache,那么每次都会访问。如果值为max-age,则在过期之前不会重复访问
* 回退按钮：如果值为private、must-revalidate、max-age,则不会重访问,而如果为no-cache,则每次都重复访问
* 刷新按钮：无论为何值,都会重复访问
