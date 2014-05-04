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

### Object.getOwnPropertyNames(o)

获取对象自身上可枚举和不可枚举的键名数组。注意，该方法会返回那些enumerable属性已经设置为false的propety。

### Object.is(a, b)[^11]

检测两个给定对象的值是否相同。该方法不会进行如同`==`操作符那样去进行数值转换。与`===`也有细微差别。仅当符合下面任意条件才返回`true`：

1. 都是`undefined`
2. 都是`null`
3. 都是`true`或`false`
4. 都是等长、内容相同的字符串
5. 都是同一个对象
6. 都是`number`，并且满足以下任一条件：
    1. 都是`+0`
    2. 都是`-0`
    3. 都是`NaN`
    4. 都是非零、非`NaN`，并且数值一样


### Object.setPrototypeOf(o, proto)

将对象`o`的原型修改为`proto`。和对象的`__proto__`属性行为一致。修改单个对象的`prototype`一般是不被推荐的。

### Object.assign(target, source1, source2, ...)

类似underscore和lodash的`_.extend`。将多个对象的值合并到一个对象。

## Number

数字和算数的API复杂而且不常用，但是却必备。

### Number.isFinite(v)

判断数字是否为有穷。判断过程不尝试将参数转换为`number`。

```
Number.isFinite(Infinity);  // false
Number.isFinite(NaN);       // false
Number.isFinite(-Infinity); // false

Number.isFinite(0);         // true
Number.isFinite(2e64);      // true
```

### Number.isInteger(v)

判断是否为正整数。

### Number.isNaN(v)

不将参数强制转行为`number`。判断是否确实为`NaN`。

### Number.isSafeInteger()[^12]

判断是否为在`MAX_SAFE_INTEGER`范围内的正整数。这里说明一下，`NUMBER.MAX_SAFE_INTEGER`是`2^53-1`。`NUMBER.MAX_VALUE`是`1.7976931348623157 × 10308`，这是IEE754中定义的double的最大值［^13］。

### Number.EPSILON[^14]

一个常量，代表正整数1与大于1的最小值之差。大约为： `2.2204460492503130808472633361816 x 10‍^16`。

## Math

### Math.clz32(v)

`CountLeadingZeroes32`。计算一个数字在32位无符号位整形数字的二进制形式开头有多少个`0`。

### Math.imul(v)

以32位正数的乘法方式来计算给定参数。该方法的一种可能的Javascript实现：

```
function imul(a, b) {
  var ah  = (a >>> 16) & 0xffff;
  var al = a & 0xffff;
  var bh  = (b >>> 16) & 0xffff;
  var bl = b & 0xffff;
  // the shift by 0 fixes the sign on the high part
  // the final |0 converts the unsigned value into a signed value
  return ((al * bl) + (((ah * bl + al * bh) << 16) >>> 0)|0);
}
```

### Math.sign(v)

判断一个数的符号位

```
Math.sign(3)     //  1
Math.sign(-3)    // -1
Math.sign("-3")  // -1
Math.sign(0)     //  0
Math.sign(-0)    // -0
Math.sign(NaN)   // NaN
Math.sign("foo") // NaN
Math.sign()      // NaN
```

### Math.log10(x)

lg(x)

### Math.log2(x)

log2(x)

### Math.log1p(x)

ln(1+x)

### Math.expm1(x)

e^x-1

### Math.cosh(x)

### Math.sinh(x)

### Math.tanh(x)

### Math.acosh(x)

### Math.asinh(x)

### Math.atanh(x)

### Math.hypot(v1,v2,v3....)

计算给定参数的平方平均数

### Math.trunc(v)

```
function trunc(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
}
```

### Math.fround(v)

返回数值的最接近的单精度浮点。

### Math.cbrt(x)

求x的立方根

## 其他推荐参考

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
[^11]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
[^12]: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.issafeinteger
[^13]: http://en.wikipedia.org/wiki/Double-precision_floating-point_format