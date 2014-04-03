# ES6特性概述

ES6比较ES5新特性更多。新加入的特性大致氛围三类：
    
* 扩展已有的原生对象API
    * Object上的新方法
    * String上的新方法
    * Math上的新方法
    * ...
* 全新的数据结构
    * WeakMap
    * Set
    * ...
* 语法特性：新表达式、语法糖等
    * arrow function
    * const
    * let
    * rest parameters, default parameters
    * spread call, spread array
    * class
    * computed properties
    * Modules
    * for-of loop
    * Array comprehensions
    * Generator
    * Iterator
    * Block-level function
    * Destructuring


由于新的语法特性非常复杂，本篇只描述部分ES6中新加入的API。之后后分篇描述目前已经比较成熟的语法特性（例如Generator和Iterator）。

## String

### String.fromCodePoint(n1,n2,n3,...)

从UTF16代码转换字符。这里笔者也不太清楚，应该和UTF编码有关[^1]。

### String.prototype.codePointAt

从字符串的字符上取CodePoint。

### String.prototype.repeat

```
"abc".repeat(2) // "abcabc"
```

### String.prototype.startsWith(a,p)[^2]

判断字符串是否以`a`开头；检索的起始位置`p`是可选的。

### String.prototype.endWith(a,p)[^3]

判断字符串是否以`a`结尾；检索的起始位置`p`是可选的。

### String.prototype.contains(a,p)[^4]

判断字符串是否包含子串`a`；检索的起始位置`p`是可选的。

## Array

### Array.from(arrayLike,map,thisArg)[^5]

根据类数组对象`arrayLike`创建数组；一个可选的`map`方法和其上下文对象`thisArg`。

### Array.of(...items)[^6]

从给定参数创建数组。

### Array.prototype.find(cb,thisArg)[^7]

寻找通过指定函数`cb`测试的第一个元素。

### Array.prototype.findIndex(cb,thisArg)

同上，但返回该元素的索引号。

### Array.prototype.fill(v,s,e)[^8]

在数组索引`s`和`e`之间添入多个元素`v`。

## Object

### Object.getOwnPropertyDescriptors(o,p)[^9]

获取对象`o`上属性`p`的特性描述对象。在搜寻属性时，不在原型链上搜索。

### Object.getPropertyDescriptor(o,p)[^10]

获取对象`o`上属性`p`的特性描述对象。

### Object.getPropertyNames

### Object.is

### Object.setPrototypeOf

## Number

### Number.isFinite

### Number.isInteger

### Number.isNaN

### Number.toInteger

## Math

### Math.clz32

### Math.imul

### Math.sign

### Math.log10

### Math.log2

### Math.log1p

### Math.expm1

### Math.cosh

### Math.sinh

### Math.tanh

### Math.acosh

### Math.asinh

### Math.atanh

### Math.hypot

### Math.trunc

### Math.fround

### Math.cbrt

## References

* http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts
* http://addyosmani.com/blog/a-few-new-things-coming-to-javascript/
* http://addyosmani.com/blog/ecmascript-6-resources-for-the-curious-javascripter/
* http://kangax.github.io/es5-compat-table/es6/
* https://github.com/paulmillr/es6-shim/
* https://github.com/addyosmani/es6-tools
* http://sankhs.com/jschannel-es6/
* http://esdiscuss.org/topic/es6-es7-es8-and-beyond-a-proposed-roadmap


[^1]: http://stackoverflow.com/questions/3744721/javascript-strings-outside-of-the-bmp
[^2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
[^3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
[^4]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/contains
[^5]: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-22.1.2.1
[^6]: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-22.1.2.1
[^7]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
[^8]: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-22.1.3.6
[^9]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor
[^10]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor