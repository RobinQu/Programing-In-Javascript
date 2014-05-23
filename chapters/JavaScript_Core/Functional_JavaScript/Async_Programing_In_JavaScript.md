# Async Programing in JavaScript

本文从异步风格讲起，分析JavaScript中异步变成的技巧、问题和解决方案。具体的，从回调造成的问题说起，并谈到了利用事件、Promise、Generator等技术来解决这些问题。

## 异步之殇

### non-blocking无限好?

异步，是没有线程模型的JavaScript的救命稻草。说得高大上一些，就是运用了`Reactor`设计模式[^1]。

JavaScript的一切都是围绕着“异步”二子的。无论是浏览器环境，还是node环境，大多数API都是通过“事件”来将请求（或消息、调用）和返回值（或结果）分离。而“事件”，都离不开回调(Callback)，例如，

```
var fs = require("fs");
fs.readFile(__filename, function(e, data) {
	console.log("2. in callback");
});
console.log("1. after invoke");
```

fs模块封装了复杂的IO模块，其调用结果是通过一个简单的callback告诉调用者的。看起来是十分不错的，我们看看Ruby的`EventMachine`：


```
require "em-files"

EM::run do
  EM::File::open(__FILE__, "r") do |io|
    io.read(1024) do |data|
      puts data
      io.close
    end
    EM::stop
  end
end
```

由于Ruby的标准库里面的API全是同步的，异步的只有类似EventMachine这样的第三方API才能提供支持。实际风格上，两者类似，就我们这个例子来说，JavaScript的版本似乎更加简洁，而且不需要添加额外的第三方模块。

异步模式，相比线程模式，损耗更小，在部分场景性能甚至比Java更好[^2]。并且，`non-blocking`的API是node默认的，这使nodejs和它的异步回调大量应用。 

例如，我们想要找到当前目录中所有文件的尺寸：

```
fs.readdir(__dirname, function(e, files) {//callback 1
	if(e) {
		return console.log(e);
	}
	dirs.forEach(function(file) {//callback 2
		fs.stat(file, function(e, stats) {//callback 3
			if(e) {
				return console.log(e);
			}
			if(stats.isFile()) {
				console.log(stats.size);
			}
		});
	});
});
```

非常简单的一个任务便造成了3层回调。在node应用爆发的初期，大量的应用都是在这样的风格中诞生的。显然，这样的代码风格有如下风险：

1. 代码难以阅读、维护：嵌套多层回调之后，作者自己都不清楚函数层次了。
2. 潜在的调用堆栈消耗：JavaScript中，远比你想像的简单去超出最大堆栈。不少第三方模块并没有做到异步调用，却装作支持回调，堆栈的风险就更大。
3. 还想更遭么？前两条就够了……

不少程序员，因为第一条而放弃nodejs，甚至放弃JavaScript。而关于第二条，各种隐性bug的排除和性能损耗的优化工作在向程序员招手。

等等，你说我一直再说node，没有提及浏览器中的情况？我们来看个例子：

```
/*glboal $ */
// we have jquery in the `window`
$("#sexyButton").on("click", function(data) {//callback 1
	$.getJSON("/api/topcis", function(data) {//callback 2
		var list = data.topics.map(function(t) {
			return t.id + ". " + t.title + "\n";
		});
		var id = confirm("which topcis are you interested in? Select by ID : " + list);
		$.getJSON("/api/topics/" + id, function(data) {//callback 3
			alert("Detail topic: " + data.content);
		});
	});

});
```

我们尝试获取一个文章列表，然后给予用户一些交互，让用户选择希望详细了解的一个文章，并继续获取文章详情。这个简单的例子，产生了3个回调。

事实上，异步的性质是JavaScript语言本身的固有风格，跟宿主环境无关。所以，回调漫天飞造成的问题是JavaScript语言的共性。

## 解决方案

### Evented

JavaScript程序员也许是最有创造力的一群程序员之一。对于回调问题，最终有了很多解决方案。最自然想到的，便是利用事件机制。

还是之前加载文章的场景：

```
var TopicController = new EventEmitter();

TopicController.list = function() {//a simple wrap for ajax request
	$.getJSON("/api/topics", this.notify("topic:list"));
	return this;
};

TopicController.show = function(id) {//a simple wrap for ajax request
	$.getJSON("/api/topics/" + id, this.notify("topic:show", id));
	return this;
};

TopicController.bind = function() {//bind DOM events
	$("#sexyButton").on("click", this.run.bind(this));
	return this;
};

TopicController._queryTopic = function(data) {
	var list = data.topics.map(function(t) {
		return t.id + ". " + t.title + "\n";
	});
	var id = confirm("which topcis are you interested in? Select by ID : " + list);
	this.show(id).listenTo("topic:show", this._showTopic);
};

TopicController._showTopic = function(data) {
	alert(data.content);
};

TopicController.listenTo = function(eventName, listener) {//a helper method to `bind`
	this.on(eventName, listener.bind(this));
};

TopicController.notify = function(eventName) {//generate a notify callback internally
	var self = this, args;
	args = Array.prototype.slice(arguments, 1);
	return function(data) {
		args.unshift(data);
		args.unshift(eventName);
		self.emit.apply(self, args);
	};
};

TopicController.run = function() {
	this.list().lisenTo("topic:list", this._queryTopic);
};

// kickoff
$(function() {
	TopicController.run();
});
```

可以看到，现在这种写法B格就高了很多。各种封装、各种解藕。首先，除了万能的jQuery，我们还依赖`EventEmitter`，这是一个观察者模式的实现[^3]，比如[asyncly/EventEmitter2](https://github.com/asyncly/EventEmitter2)。简单的概括一下这种风格：

1. 杜绝了大部分将匿名函数用作回调的场景，达到零嵌套，代码简介明了
2. 每个状态（或步骤）之间，利用事件机制进行关联
3. 每个步骤都相互独立，方便日后维护

如果你硬要挑剔的话，也有缺点；

1. 由于过度分离，整体流程模糊
2. 代码量激增，又加大了另一种维护成本

## 高阶函数

利用高阶函数，可以顺序、并发的将函数递归执行。

我们可以编写一个高阶函数，让传入的函数顺序执行：

```
var runInSeries = function(ops, done) {
	var i = 0, next;
	next = function(e) {
		if(e) {
			return done(e);
		}
		var args = Array.prototype.slice.call(arguments, 1);
		args.push(next);
		ops[0].apply(null, args);
	};
	next();
};
```

还是我们之前的例子：

```
var list = function(next) {
	$.getJSON("/api/topics", function(data) { next(null, data); });
};

var query = function(data, next) {
	var list = data.topics.map(function(t) {
		return t.id + ". " + t.title + "\n";
	});
	var id = confirm("which topcis are you interested in? Select by ID : " + list);
	next(null, id);
};

var show = function(id, next) {
	$.getJSON("/api/topics/" + id, function(data) { next(null, data); });
};

$("#sexyButton").on("click", function() {
	runInSeries([list, query, show], function(e, detail) {
		alert(detail);
	});
});

```

看起来还是很不错的，简洁并且清晰，最终的代码量也没有增加。如果你喜欢这种方式，去看一下[caolan/async](https://github.com/caolan/async)会发现更多精彩。

## Promise

> A promise represents the eventual result of an asynchronous operation. The primary way of interacting with a promise is through its then method, which registers callbacks to receive either a promise’s eventual value or the reason why the promise cannot be fulfilled.

除开文绉绉的解释，Promise是一种对一个任务的抽象。Promise的相关API提供了一组方法和对象来实现这种抽象。

Promise的实现目前有很多：

* ECMAScript Promise[^4]
	* 即原生的Promise对象, Chrome32+以上支持
* Promise/A+[^5]标准
	* [kriskowal/q](https://github.com/kriskowal/q)
	* [cujojs/when](https://github.com/cujojs/when)
	* [tildeio/rsvp.js](https://github.com/tildeio/rsvp.js)
* 其他厂商标准
	* [jQuery.Deferred](https://api.jquery.com/jQuery.when/)
	* [WinJS](http://msdn.microsoft.com/en-us/library/windows/apps/br211867.aspx)

虽然标准很多，但是所有的实现基本遵循如下基本规律：

* Promise对象
	* 是一个有限状态机
		* 完成（fulfilled）
		* 否定（rejected）
		* 等待（pending）
		* 结束（settled）
	* 一定会有一个`then([fulfill], [reject])`方法，让使用者分别处理成功失败
	* 可选的`done([fn])`、`fail([fn])`方法
	* 支持链式API
* Deffered对象
	* 提供`reject`和`resolve`方法，来完成一个Promise

笔者会在专门的文章内介绍[Promise的具体机制和实现](JavaScript_Promise.md)。在这里仅浅尝辄止，利用基本随处可得的jQuery来解决之前的那个小场景中的异步问题：

```
$("#sexyButton").on("click", function(data) {
	$.getJSON("/api/topcis").done(function(data) {
		var list = data.topics.map(function(t) {
			return t.id + ". " + t.title + "\n";
		});
		var id = confirm("which topcis are you interested in? Select by ID : " + list);
		$.getJSON("/api/topics/" + id).done(function(done) {
			alert("Detail topic: " + data.content);
		});
	});
});
```

很遗憾，使用Promise并没有让回调的问题好多少。在这个场景，Promise的并没有体现出它的强大之处。我们把jQuery官方文档中的例子拿出来看看：

```
$.when( $.ajax( "/page1.php" ), $.ajax( "/page2.php" ) ).done(function( a1, a2 ) {
  // a1 and a2 are arguments resolved for the page1 and page2 ajax requests, respectively.
  // Each argument is an array with the following structure: [ data, statusText, jqXHR ]
  var data = a1[ 0 ] + a2[ 0 ]; // a1[ 0 ] = "Whip", a2[ 0 ] = " It"
  if ( /Whip It/.test( data ) ) {
    alert( "We got what we came for!" );
  }
});
```

这里，同时发起了两个AJAX请求，并且将这两个Promise合并成一个，开发者只用处理这最终的一个Promise。

例如`Q.js`或`when.js`的第三方库，可以支持更多复杂的特性。也会让你的代码风格大为改观。可以说，Promise为处理复杂流程开启了新的大门，但是也是有成本的。这些复杂的封装，都有相当大的开销[^6]。

### Geneartor

ES6的Generator引入的`yield`表达式，让流程控制更加多变。[node-fiber](https://github.com/laverdet/node-fibers)让我们看到了`coroutine`在JavaScript中的样子。

```
var Fiber = require('fibers');

function sleep(ms) {
    var fiber = Fiber.current;
    setTimeout(function() {
        fiber.run();
    }, ms);
    Fiber.yield();
}

Fiber(function() {
    console.log('wait... ' + new Date);
    sleep(1000);
    console.log('ok... ' + new Date);
}).run();
console.log('back in main');
```

但想象一下，如果每个JavaScript都有这个功能，那么一个正常JavaScript程序员的各种尝试就会被挑战。你的对象会莫名其妙的被另外一个fiber中的代码更改。

也就是说，还没有一种语法设计能让支持fiber和不支持fiber的JavaScript代码混用并且不造成混淆。node-fiber的这种不可移植性，让coroutine在JavaScript中并不那么现实[^7]。

但是`yield`是一种Shallow coroutines，它只能停止用户代码，并且只有在`GeneratorFunction`才可以用`yield`。

笔者在[另外一篇文章](JavaScript_Generator.md)中已经详细介绍了如何利用Geneator来解决异步流程的问题。

利用`yield`实现的`suspend`方法，可以让我们之前的问题解决的非常简介：

```
$("#sexyButton").on("click", function(data) {
	suspend(function *() {
		var data = yield $.getJSON("/api/topcis");
		var list = data.topics.map(function(t) {
			return t.id + ". " + t.title + "\n";
		});
		var id = confirm("which topcis are you interested in? Select by ID : " + list);
		var detail = yield $.getJSON("/api/topics/");
		alert("Detail topic: " + detail.content);
	})();
});
```

为了利用`yield`，我们也是有取舍的：

1. Generator的兼容性并不好，仅有新版的node和Chrome支持
2. 需要大量重写基础框架，是接口规范化(thunkify)，来支持`yield`的一些约束
3. `yield`所产生的代码风格，可能对部分新手造成迷惑
4. 多层`yield`所产生堆栈及其难以调试

## 结语

说了这么多，异步编程这种和线程模型迥然不同的并发处理方式，随着node的流行也让更多程序员了解其与众不同的魅力。如果下次再有C或者Java程序员说，JavaScript的回调太难看，请让他好好读一下这篇文章吧！


[^1]: http://en.wikipedia.org/wiki/Reactor_pattern
[^2]: http://strongloop.com/strongblog/node-js-is-faster-than-java/
[^3]: en.wikipedia.org/wiki/Observer_pattern
[^4]: http://wiki.ecmascript.org/doku.php?id=strawman:concurrency
[^5]: http://promises-aplus.github.io/promises-spec/
[^6]: http://thanpol.as/javascript/promises-a-performance-hits-you-should-be-aware-of/
[^7]: http://calculist.org/blog/2011/12/14/why-coroutines-wont-work-on-the-web/
