# ES6语法特性

ES6包含了很多万众期待的特性支持：

* arrow functions
* const
* let
* default function params
* rest parameters
* call(...)
* array(...)
* class
* computed properties
* modules
* for...of
* Array comprehensions
* Generator comprehensions
* Iterators
* yield
* Template Strings
* block-level declaration
* destructing
* promoise


里面众多的特性都是让Javascript看起来更规范的好东西，但是大部分都没有被广泛支持。我们仅介绍其中已经至少被一种浏览器和`node --harmony`下支持的。

在写这篇文章的时候，有如下特性是较为广泛支持的：

* let[^1]
* const[^2]
* Block-delvel declaration
* yield


对，就这么多了。前三个是为了解决变量声明、定义的问题，而第四个则影响最大。会在单独篇幅中介绍。下文只介绍前三个特性。

## let和block-level declaration

* `var` is scoped to the nearest function block (or global if outside a function block)
* `let` is scoped to the nearest enclosing block (or global if outside any block),

很多文献、书籍都建议将for循环的起始变量`i`、`len`等放置到函数作用于的顶部声明，以避免后续变量持续存在所造成的迷惑。

```
function() {
    for(var i=0,len=5;i<len;i++) {
        //body
    }
    console.log(i,len);=> 5,5
}
```

这是因为ES5的Javascript的不支持块级作用域，变量仅仅被限制到函数作用域内。

在ES6内，可以通过let来定义块级作用域的变量：

```
function() {
    for(let i=0,len=5;i<len;i++) {
        //body
    }
    console.log(i,len);=> throw Reference Error
}
```
最后一个，函数定义的作用域问题：

```
function f() { console.log('I am outside!'); }
(function () {
  if(false) {
    // What should happen with this redeclaration?
    function f() { console.log('I am inside!'); }
  }

  f();
}());
```

如上代码，在ES5时代，每个浏览器都会得出不同的结果。但是ES6中，函数定义只在块级作用域内有效，结果很明确。


## const关键字

const关键字定义一个块级作用域的常量变量。

```
const a = "You shall remain constant!";

// SyntaxError: Assignment to constant variable
a = "I wanna be free!";
```

## yield

`yield`后面有一连串有关Generator和Iterator的内容，会在另外一片文章内详细介绍： [Javascript Generator](../../Functional_Javascript/Javascript_Generator.md)。


[^1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let
[^2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const