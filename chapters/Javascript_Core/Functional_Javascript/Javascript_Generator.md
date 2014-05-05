# Javascript Generator


ES6中的Generator的引入，极大程度上改变了Javascript程序员对迭代器的看法，并为解决callback hell[^1]提供了新方法。

Generator是一个与语言无关的特性，理论上它应该存在于所有Javascript引擎内，但是目前真正完整实现的，只有在`node --harmony` 下。所以后文所有的解释，都以node环境举例，需要的启动参数为`node --harmony --use_strict`。

V8中所实现的Generator和标准之中说的又有区别，这个可以参考一下MDC的相关文档[^2]。而且，V8在写作这篇文章时，并没有实现Iterator。

## 用作迭代器

我们以一个简单的例子[^3]开始：


```
function* argumentsGenerator() {
  for (let i = 0; i < arguments.length; i += 1) {
    yield arguments[i];
  }
}
```

我们希望迭代传入的每个实参：

```
var argumentsIterator = argumentsGenerator('a', 'b', 'c');

// Prints "a b c"
console.log(
    argumentsIterator.next().value,
    argumentsIterator.next().value,
    argumentsIterator.next().value
);
```

我们可以简单的理解：

* Generator其实是生成Iterator的方法。`argumentsGenerator`被称为`GeneartorFunction`，也有些人把`GeneartorFunction`的返回值称为一个`Geneartor`。
*  `yield`可以中断`GeneartorFunction`的运行；而在下一次`yield`时，可以恢复运行。
* 返回的`Iterator`上，有`next`成员方法，能够返回迭代值。其中`value`属性包含实际返回的数值，`done`属性为布尔值，标记迭代器是否完成迭代。要注意的是，在`done`属性为`true`后继续运行`next`方法会产生异常。

完整的ES实现中，`for-of`循环正是为了快速迭代一个`iterator`的：

```
// Prints "a", "b", "c"
for(let value of argumentsIterator) {
  console.log(value);
}
```

可惜，目前版本的node不支持`for-of`。

说到这里，大多数有经验的Javascript程序员会表示不屑，因为这些都可以通过自己编写一个函数来实现。我们再来看一个例子：

```
function* fibonacci() {
  let a = 0, b = 1;
  //1, 2
  while(true) {
    yield a;
    a = b;
    b = a + b;
  }
}

for(let value of fibonacci()) {
  console.log(value);
}
```

fibonacci序列是无穷的数字序列，你可以用函数的迭代来生成，但是远没有用Generator来的简洁。

再来个更有趣的。我们可以利用`yield*`语法，将yield操作代理到另外一个`Generator`。

```
let delegatedIterator = (function* () {
  yield 'Hello!';
  yield 'Bye!';
}());

let delegatingIterator = (function* () {
  yield 'Greetings!';
  yield* delegatedIterator;
  yield 'Ok, bye.';
}());

// Prints "Greetings!", "Hello!", "Bye!", "Ok, bye."
for(let value of delegatingIterator) {
  console.log(value);
}
```

## 用作流程控制

`yield`可以暂停运行流程，那么便为改变执行流程提供了可能[^4]。这和Python的coroutine类似。

[co](https://github.com/visionmedia/co)已经将此特性封装的非常完美了。我们在这里简单的讨论其实现。

> The classic example of this is consumer-producer relationships: generators that produce values, and then consumers that use them. The two generators are said to be symmetric – a continuous evaluation where coroutines yield to each other, rather than two functions that call each other.

Geneartor之所以可用来控制代码流程，就是通过yield来将两个或者多个Geneartor的执行路径互相切换。这种切换是语句级别的，而不是函数调用级别的。其本质是CPS变幻，后文会给出解释。

这里要补充yield的若干行为：

* next方法接受一个参数，传入的参数是yield表达式的返回值；即yield既可以产生数值，也可以接受数值
* throw方法会抛出一个异常，并终止迭代
* `GeneratorFunction`的return语句等同于一个yield

### 将异步“变”为同步

假设我们希望有如下语法风格：

* suspend传入一个`GeneratorFunction`
* suspend返回一个简单的函数，接受一个node风格的回调函数
* 所有的异步调用都通过`yield`，看起来像同步调用
* 给定一个特殊的回调，让保证异步调用的返回值作为yield的返回值，并且让脚本继续
* `GeneratorFunction`的返回值和执行过程的错误都会会传入全局的回调函数


更具体的，如下例子：

```
var fs = require("fs");
suspend(function*(resume) {
  var content = yield fs.readFile(__filename, resume);
  var list = yield fs.readdir(__dirname, resume);
  return [content, list];
})(function(e, res) {
  console.log(e,res);
});
```

上面分别进行了一个读文件和列目录的操作，均是异步操作。为了实现这样的`suspend`和`resume`。我们简单的封装Generator的API：

```
var slice = Array.prototype.slice.call.bind(Array.prototype.slice);

var suspend = function(gen) {//`gen` is a generator function
  return function(callback) {
    var args, iterator, next, ctx, done;
    ctx = this;
    args = slice(arguments);
    
    next = function(e) {
      if(e) {//throw up or send to callback
        return callback ? callback(e) : iterator.throw(e);
      }
      var ret = iterator.next(slice(arguments, 1));
      if(ret.done && callback) {//run callback is needed
        callback(null, ret.value);
      }
    };
    
    resume = function(e) {
      next.apply(ctx, arguments);
    };
    
    args.unshift(resume);
    iterator = gen.apply(this, args);
    next();//kickoff
  };
};
```

### 有容乃大

目前我们只支持回调形势的API，并且需要显示的传入`resume`作为API的回调。为了像`co`那样支持更多的可以作为`yield`参数。`co`中，作者将所有形势的异步对象都归结为一种名为`thunk`的回调形式。

那什么是`thunk`呢？`thunk`就是支持标准的node风格回调的一个函数： `fn(callback)`。

首先我们将suspend修改为自动resume:

```
var slice = Array.prototype.slice.call.bind(Array.prototype.slice);

var suspend = function(gen) {
  return function(callback) {
    var args, iterator, next, ctx, done;
    ctx = this;
    args = slice(arguments);
    next = function(e) {
      if(e) {
        return callback ? callback(e) : iterator.throw(e);
      }
      var ret = iterator.next(slice(arguments, 1));
      
      if(ret.done && callback) {
        return callback(null, ret.value);
      }

      if("function" === typeof ret.value) {//shold yield a thunk
        ret.value.call(ctx, function() {//resume function
          next.apply(ctx, arguments);
        });
      }
      
    };
    
    iterator = gen.apply(this, args);
    next();
  };
};
```

注意，这个时候，我们只能`yield`一个`thunk`，我们的使用方法也要发生改变：

```
var fs = require("fs");
read = function(filename) {//wrap native API to a thunk
  return function(callback) {
    fs.readFile(filename, callback);
  };
};

suspend(function*() {//return value of this generator function is passed to callback
  return yield read(__filename);
})(function(e, res) {
  console.log(e,res);
});
```

接下来，我们要让这个suspend更加有用，我们可以支持如下内容穿入到yield

* GeneratorFunction
* Generator
* Thunk

```
var slice = Array.prototype.slice.call.bind(Array.prototype.slice);

var isGeneratorFunction = function(obj) {
  return obj && obj.constructor && "GeneratorFunction" == obj.constructor.name;
};

var isGenerator = function(obj) {
  return obj && "function" == typeof obj.next && "function" == typeof obj.throw;
};

var suspend = function(gen) {
  return function(callback) {
    var args, iterator, next, ctx, done, thunk;
    ctx = this;
    args = slice(arguments);
    next = function(e) {
      if(e) {
        return callback ? callback(e) : iterator.throw(e);
      }
      var ret = iterator.next(slice(arguments, 1));

      if(ret.done && callback) {
        return callback(null, ret.value);
      }
      
      if(isGeneratorFunction(ret.value)) {//check if it's a generator
        thunk = suspend(ret.value);
      } else if("function" === typeof ret.value) {//shold yield a thunk
        thunk = ret.value;
      } else if(isGenerator(ret.value)) {
        thunk = suspend(ret.value);
      }
      
      thunk.call(ctx, function() {//resume function
        next.apply(ctx, arguments);
      });
      
    };
    
    if(isGeneratorFunction(gen)) {
      iterator = gen.apply(this, args);
    } else {//assume it's a iterator
      iterator = gen;
    }
    next();
  };
};
```

在使用时，我们可以传入三种对象到yield：

```
var fs = require("fs");
read = function(filename) {
  return function(callback) {
    fs.readFile(filename, callback);
  };
};

var read1 = function*() {
  return yield read(__filename);
};

var read2 = function*() {
  return yield read(__filename);
};

suspend(function*() {
  var one = yield read1;
  var two = yield read2();
  var three = yield read(__filename);
  return [one, two, three];
})(function(e, res) {
  console.log(e,res);
});
```

当然，到这里，大家应该都明白如何让`suspend`兼容更多的数据类型，例如`Promise`、数组等。但更多的扩展，在这里就不再赘述。这里的`suspend`可以就说就是精简的`co`了。

`yield`的引入，让流程控制走上了一条康庄大道，不需要使用复杂的`Promise`、也不用使用难看的`async`。同时，从性能角度，yield可以通过V8的后续优化，性能进一步提升，目前来说`yield`的性能并不差[^5]。

## yield的转换

`yield`的本质是一个语法糖，底层的实现方式便是CPS变换[^6]。也就是说`yield`是可以用循环和递归重新实现的，根本用不着一定在V8层面实现。但笔者认为，纯Javascript实现的"yield"会造成大量的堆栈消耗，在性能上毫无优势可言。从性能上考虑，V8可以优化`yield`的编译，实现更高性能的转换。

关于CPS变换的细节，会在[之后的文章](../Continuation_Passing_Style.md)中详细解说。


[^1]: http://callbackhell.com/
[^2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
[^3]: https://github.com/JustinDrake/node-es6-examples#generators
[^4]: http://dailyjs.com/2013/05/31/suspend/
[^5]: http://dailyjs.com/2013/10/17/yield/
[^6]: http://en.wikipedia.org/wiki/Continuation-passing_style