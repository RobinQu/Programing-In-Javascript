# Strict Mode和Extended Mode

> 本文上一个版本盗用了别人的文章，经读者指出后我就删掉了。由于起草的时间在去年，我也不太清楚当初是怎么把别人的文章复制进来的。本文除了介绍所谓的Strict Mode之外，还会介绍其他关联内容。

JavaScript并不是一个完美的语言。事实上，第一个版本是Brendan Eich[^1]花费十天的时间创造的，你不能对它期望太多。之后，JavaScript在浏览器大战中，成为各方角逐的主要战场。各大厂商各显神通，其副作用是各种奇奇怪怪的行为和各式不一的API。在之后，W3C和其他社区团体花费了大量的精力来通过标准化来“净化”所有Web开发相关的技术标准。

但尴尬的是，浏览器厂商并不是那么完全的实现了W3C和ECMAScript的各种标准。最后，经验丰富的Javascript程序员，通过约束自身对Javascript的使用方法，来达到让Javascript更高的可拥度。可能大部分人都读过《JavaScript语言精粹》[^2]这本书，其讲述的就是如何在JavaScript语言中，取其精华，然后去其糟粕。

而JavaScript的严格模式，则是另一种紧箍咒，它的约束力来自运行时本身，而不是用户的主观行为。也就是说，有很多模棱两可，或是错误却被允许的操作，被彻底禁止了。目前支持严格模式的支持范围[^3]从IE10起跳，其他常青浏览器也都是支持的。

<iframe src="http://caniuse.com/use-strict/embed/" seamless width="100%"></iframe>

## 如何开启

开启全局模式只需在所有语句之前放置`"use strict"`字符串常量。

全局开启严格模式：

```
"use strict"
var v = "Hello world";
```

但注意，这样会导致整个脚本内的代码都在严格模式中执行。假如之前有些代码并没有考虑严格模式，这可能让你的整个应用程序突然失效。

我们更为推荐的是，在某个函数内开启严格模式：

```
function mySuperMethod() {
    "use strict";
    var v = "Hello world";
}

function mySuckingMethod {
    //not in strict mode
}
```

## 严格模式的具体行为

大家有需要记住一堆语言特性了。但是，还好这些内容是把“歪”的掰“直”了。有少数代码例子来自于MDC[^4]。

### 抛出`ReferenceError`

1. 试图隐式创建全局变量

        ```
        "use strict"
        hello = "world"//throw
        ```

### 抛出`TypeError`

1. 试图修改已经被定义为不可写的属性

        ```
        "use strict";
        var o = {};
        Object.defineProperty(o, "hello", {value:"world", writable:false});
        o.hello = "bad boy";//throw
        ```

    其他类似的还有：
    
    * 给只读属性赋值
    * 给不可扩展的对象新建属性        
        
2. 试图删除不可删除的属性

        ```
        "use strict";
        delete Object.prototype; //throw
        ```
3. `arguments.callee`不能被返回、删除、修改；

        ```
        "use strict";
        var fun = function() { 
            return arugments.callee;//throw
        };
        ```


### 抛出`SyntaxError`

1. 重复定义属性名

        ```
        "use strict";
        var o = {hello: 1, hello: 2};//throw
        ```

2. 禁用八进制字面量


        ```
        "use strict";
        var hello = 015;//throw
        ```

3. 不允许重复参数名

        ```
        function myMethod(a, b, b) {//throw
            "use strict";
        }
        ```

4. 不能使用`with`

        ```
        "use strict";
        var obj = {};
        with (obj) {};//throw
        ```
        
5. 不允许对`eval`或`arguments`赋值

        ```
        var fun = function(){
            "use strict";
            eval=16
        }();
        ```

6. 不可将`eval`或`arguments`作为参数名、变量名

        ```
        var fun = function(){
            "use strict"; 
            var obj = { 
                set p(arguments) {} 
            };
        }();
        ```


### `eval`被限制在临时的本地作用域

eval不再有权限直接修改其所在作用于，而只能影响自身创建的作用域。

```
var hello = "world";
var evalHello = eval("'use strict'; var hello = "girl"; hello");
// hello === "world"
// evalHello === "girl"
```

### `arguments`不再追踪实际参数值变化

```
function f(hello) {
  "use strict";
  hello = "girl";
  return [hello, arguments[0]];
}
var pair = f("world");
// pair[0] === "girl"
// pair[1] === "world";
```

### 函数的动态绑定后的`this`不做任何修改

* 即使指定`null`或`undefined`，引擎也不会重新指定全局对象作为`this`
* 指定基础数据类型时，也不会用包装类进行转换


```
"use strict";
function fun() { return this; }
// fun() === undefined
// fun.call(2) === 2
// fun.apply(null) === null
// fun.call(undefined) === undefined
// fun.bind(true)() === true
```

### 调用堆栈不可被追踪

以往，我们可以通过函数的`caller`和`arguments`来投影整个调用堆栈。但是，在严格模式中我们做不到。

```
function restricted() {
  "use strict";
  restricted.caller;    // throws a TypeError
  restricted.arguments; // throws a TypeError
}
```

### ECMAScript6的相关特性

#### 更多保留字

```
implements, interface, let, package, private, protected, public, static, yield
```

#### 仅允许在开头使用function语句

很多开发者喜欢如下代码风格，这在严格模式中会报错。

```
function foo() {
  "use strict";
  return g;
  function g() { }//throw SyntaxError
}
```

这个改变的原因是，JavaScript的`Hoisting`特性会让很多人迷惑：

```
function g() { }
function foo() {
    if (true)
    function g() { }
    return g;
}
```

## Extended Mode

ES6 Draft中引入了一个新的概念[^5]，叫`Extend Mode`，然后又被撤销了[^6]。但不幸的是，V8中已经支持了这个新模式。所以，作为事实标准，目前依赖V8的所有Javascript运行环境都有如下三个模式：

* Classic Mode，或者Non-strict mode
* Strict Mode
* Extended Mode

这个模式是备受争议的。这个模式的产生，也体会出制作一个标准的困难之处——你总要考虑新标准对老标准的兼容，尤其是Web技术。

有稍微了解ES6的同学都应该清楚，`module`、`class`这些东西已经完全颠覆了传统JavaScript的很多常识。但也有不少东西，开发者是可以接受，并立马去尝试的。于是乎，关于如何让代码部分进入`extended mode`也就成了最初讨论的重点[^7]。

实际表现上，node的0.11.x的版本，有些特性，仅仅使用`--harmony`并不能完全使用，还需加上`--use_strict`。在这里，已经可以看出V8团队有多纠结了[^8]。他们也没有想清楚，该如何进入`extended mode`，索性，也叫`strict`吧。

目前仅在`extended mode`下可用的ES6特性：

* let
* blockl-level function declaration

关于ES6的特性，请参考本书的相关章节。


[^1]: http://en.wikipedia.org/wiki/Brendan_Eich
[^2]: http://book.douban.com/subject/3590768/
[^3]: http://caniuse.com/#feat=use-strict
[^4]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Strict_mode
[^5]: http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts
[^6]: http://wiki.ecmascript.org/lib/exe/fetch.php?id=harmony%3Aspecification_drafts&cache=cache&media=harmony:working_draft_ecma-262_edition_6_11-7-11.pdf
[^7]: https://lists.webkit.org/pipermail/webkit-dev/2011-December/018903.html
[^8]: https://code.google.com/p/v8/source/detail?r=10062