# 脚本执行方式

## 执行入口

* script标签
* `eval`函数
* `Function`构造函数
* `setTimeout`和`setInterval`函数
* HTML标签内的事件绑定相关的內联函数（`onclick`等）
* 其他hacks


### script标签

最基本，最常用的脚本引入方式。例如：


    <script src="http://code.jquery.com/jquery-1.11.0.min.js"></script>

尽管在HTML4和XHTML里面，要求开发者使用`type`属性来制定脚本的类型。但是主流浏览器都默认认为脚本类型是`text/javascript`。

在HTML5的规范内[^1]，`script`标签的type属性是完全可选的。


### eval函数

* `eval` is evil
* `eval`有访问本地scope的权利

```
var a = 1;
eval("a=2");
a === 2; // ==> true
```

### Function构造函数

* function是“first-class citizen”[^2]；自然有相应的构造函数
* `new Function(arg1, arg2, ..., fnStr)`
* `Function`[^3]构造函数本质是创建一个函数对象；其创建的函数执行也并不能访问其所在创建环境的闭包，只能访问本地作用域（local scope）和全局作用域（global scope）
* `Function()`和`new Function()`效果一样

```
(function() {
  var a = 1;
  var func = new Function("a=2");
  func();
  a === 2; // ==> false
}());
a === 2; // ==> true

```

### setTimeout和setInterval

```
setTimeout("alert('haha')", 0);
```

这个和eval有异曲同工之妙，对作用域的访问也是类似的。

另外要说名，以上几点，除了script标签的方法之外，其他方法都在`strict`模式[^4]下不可用。

### HTML內联事件回调

```
<a href='#hello' onclick="alert(this.href)">Say hello</a>
```

这样如同在click事件的`Target Phase`运行了一个回调。`this`指向目标元素本身。

### 其他Hack

利用MessageChannel等新特性可以触发一些函数的执行[^5]。也许Javascript的其他的角落也有不少其他执行脚本的入口吧。


[^1]: http://www.w3.org/html/wg/drafts/html/master/scripting-1.html#the-script-element
[^2]: https://developer.mozilla.org/en-US/docs/functional-javascript/First-class_citizen
[^3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
[^4]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/Strict_mode
[^5]: https://github.com/kriskowal/asap/blob/master/asap.js