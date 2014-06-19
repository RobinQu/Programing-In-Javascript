## Cookie


```
var allCookies = document.cookie;
```

设置cookie
```
document.cookie = updatedCookie;
```

`updateCookie`是简单的`key=value`字符串，同时可以设置其他附加属性：

* `;path=path` 设置有效的路径范围，默认是当前路径
* `;domain=domain` 设置有效的域名，默认是当前主域名
* `;max-age=max-age-in-seconds`
* `expires=date-in-GMTString-format` 过期事件，以GTM的时间串
* `;secure` 标示这个cookie是否可以在HTTPS通讯中使用

Cookie的局限：

* Cookie有不允许超过（必须小于）4096字节的限制
* Cookie会随HTTP的头`Cookies`重复传输
* 没有方便的存取API，需要通过字符串处理来进行读取、设置


## LocalStorage、SessionStroage

* 每个域名有5MB的默认空间
* 有相应的API

## userData

IE私有API，通过将一个元素赋予特殊的`behavior`

```
#el {
  behavior: url('#default#userData');
}
```

或者

```
el.addBehavior("#default#userdata");
```


然后在元素上正常的设置attribute即可。

默认每个域名1024KB的[存储限制](http://msdn.microsoft.com/en-us/library/ms531424(v=vs.85).aspx)。
