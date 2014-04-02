# ES5特性

本文将简单列举ES5的核心特性。ES5多半是扩展原生对象的功能，让`Object`、`Array`、`Function`更加强大。其他的特性包括`strict mode`和一下期待已久的工具方法（例如`JSON.parse`等）。

ES5的大部分特性[^1]都在主流浏览器（IE9+）中支持了。而且大部分特性，都可以通过Javascript垫片(pollyfill)在运行时环境实现[^2]。

## Object

所有对象操作中，如果`o`不是`Object`类型，将会抛出`TypeError`异常。

### Object.getPrototypeOf(o)[^3]

获取给丁对象的`prototype`对象。等价于以前的`o.__proto__`。

### Object.getOwnPropertyDescriptor(o,p)[^4]

获取对象描述。和`Object.defineProperty`的相关方法。

### Object.getOwnPropertyNames(o)[^5]

获取自有属性名列表。结果列表将不包含原型链上的属性。

### Object.create(o,p)[^6]

以给丁对象`o`为`prototype`创建新的对象并返回。如果对象描述`p`存在，就使用其定义刚创建的对象（类似调用`Object.defineProperties(obj,p)`）。

### Object.defineProperty(o,p,attrs)[^7]

根据规则`attrs`定义对象`o`上，属性名为`p`的属性

### Object.defineProperties(o,props)[^8]

根据对象描述`props`来定义对象`o`，通常`props`包含多个属性的定义。

### Object.seal(o)[^9]

一个对象在默认状态下，

1. extensible: 可以添加新的属性
2. configurable: 可以修改已有属性的特性

`Object.seal`会改变这两个特性，既不能扩展新属性，也不能修改已有属性的特性。

### Object.freeze(o)[^10]

将对象的每个自有自有属性(own property)做如下操作：

* 属性的`writable`特性置为`false`
* 属性的`configurable`特性置为`false`

同时，该对象将不可扩展。可见，该方法比`Object.seal`更加严格的限制了对一个对象的未来改动。

### Object.preventExtensions(o)[^11]

将对象置为不可扩展。

### Object.isSealed(o)[^12]

判断一个对象是否`sealed`：

* 对象的每个自有属性：如果属性的`configurable`特性为`true`，则返回`false`
* 如果对象为`extensible`的，那么返回`false`
* 不满足以上两个条件，则返回`true`

### Object.isFrozen(o)[^13]

* 对每个自有属性，如果该属性的`configurable`或`writable`特性为`true`，则返回`false`
* 如果对象为`extensible`的，那么返回`false`
* 不满足以上两个条件，则返回`true`

### Object.isExtensible(o)[^14]

判对一个对象是否可扩展。

### Object.keys(o)[^15]

返回对象`o`的所有可枚举(`enumerable`)属性的名称。

### Object.prototype.isPrototypeOf(v)[^16]

检查对象是否是位于给定对象`v`的原型链上。

### Object.prototype.propertyIsEnumerable(p)

检查一个对象上的属性`p`是否可枚举。

## Array

### Array.isArray(a)

判断`a`是否为为真正的`Array`。

### Array.prototype.indexOf(e,i)[^17]

使用“严格等”来判断元素`e`在数组中的索引号。一个可选的搜索起点`i`。

### Array.prototype.lastIndexOf(e,i)[^18]

获取元素`e`在数组中最后出现的位置。起始位置`i`为可选。



### Array.prototype.every(t,c)

测试数组中的每个元素都满足测试`t`。之后介绍的所有数组遍历方法，都支持一个可选的上下文对象`c`，可以灵活设置回调函数的执行上下文。传递给数组的测试函数、遍历函数通常有如下签名：

```
function(item, index, array) {}
```

### Array.prototype.some(t,c)

测试数组中是否有元素满足测试`t`。

### Array.prototype.forEach(f,c)

使用函数`f`遍历每个数组的元素。

### Array.prototype.map(f,c)

使用函数`f`修改每个数组的每个元素。按顺序收集`f`的每个返回值，并返回这个新组成的数组。

### Array.prototype.filter(f,c)

收集通过函数测试`f`的书组元素。

### Array.prototype.reduce(r,v)[^19]

从左向右，使用函数`r`聚集数组的每个元素。可以可选的制定一个初始值`v`。

### Array.prototype.reduceRight(r,v)[^20]

`Array.prototype.reduce`的从右向左的版本。

## String

### String.prototpye.trim

去掉字符串两头的空白符和换行符。

### 字符订阅

```
//property access on strings
"abc"[2] === "b"
```

## Function

### Function.prototype.bind(thisTarget, arg1,...argn)[^21]

为了指定当前函数的上下文对象和运行参数，该函数创建一个新的函数，保留给定的`this`对象和运行参数。

## JSON

### JSON.parse(text)

根据rfc4627[^22]标准解析JSON文本。

### JSON.stringify(obj)

将指定的对象`obj`序列化为JSON文本。

## Date

### Date.now

获取当前时间距`1970.1.1 00:00:00`的毫秒数。

### Date.prototype.toISOString

根据ISO8601[^23]生成时间字符串。

```
(new Date).toISOString()
'2014-04-02T08:31:53.049Z'
```
## 其他特性

* 放开了关键字不允许作为属性名的限制[^24]
* getter和setter函数[^25]


[^1]: http://kangax.github.io/es5-compat-table/
[^2]: https://github.com/es-shims/es5-shim
[^3]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/GetPrototypeOf
[^4]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor
[^5]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames
[^6]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/create
[^7]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/defineProperty
[^8]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/defineProperties
[^9]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/seal
[^10]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/freeze
[^11]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/preventExtensions
[^12]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/isSealed
[^13]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/isFrozen
[^14]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/isExtensible
[^15]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
[^16]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/isPrototypeOf
[^17]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
[^18]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
[^19]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduce
[^20]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/reduceRight
[^21]: https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
[^22]: http://www.ietf.org/rfc/rfc4627.txt
[^23]: http://en.wikipedia.org/wiki/ISO_8601
[^24]: http://stackoverflow.com/questions/8099270/use-of-reserved-words-in-javascript
[^25]: http://ejohn.org/blog/javascript-getters-and-setters/