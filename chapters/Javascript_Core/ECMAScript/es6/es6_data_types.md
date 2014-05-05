# ES6引入的数据结构

ES6新加入的数据类型有：

* WeakMap
* WeakSet
* Map
* Set
* Typed Objects[^1]
* Proxy[^2]
* Symbol[^3]
* Promise[^4]

这些数据结构的支持并不广泛，在写这篇文章的时候。仅有新版本的Firefox和Node v0.11.x以上版本（开启`--harmony`参数后）支持。

## Map

提供传统意义上的Map。支持任意对象作为key。

`new Map(iterable)`

iteralbe是Array或其他可枚举的对象，其每个元素是key、value的2元数组。

重要的属性和方法：

* Map.prototype.size
* Map.prototype.clear()
* Map.prototype.entries()
* Map.prototype.forEach(callback, thisArg)
* Map.prototype.get(k)
* Map.prototype.set(k,v)
* Map.prototype.has(k)
* Map.prototype.keys()
* Map.prototype.values()

## Set

传统意义上的`Set`。

* Set.prototype.size
* Set.prototype.add(v)
* Set.prototype.clear()
* Set.prototype.delete(v)
* Set.prototype.entries()
* Set.prototype.forEach(callback, thisArg)
* Set.prototype.has(v)
* Set.prototype.keys()
* Set.prototype.values()


## WeakMap

Weak开头的Set和Map不对key持有引用，不影响GC。因此，他们没有办法对自身entries的key进行直接的枚举。

构造函数和普通的Map相同：

`new WeakMap(iterable)`


* WeakMap.prototype.clear()
* WeakMap.prototype.delete(k)
* WeakMap.prototype.get(k)
* WeakMap.prototype.has(k)
* WeakMap.prototype.set(k,v)

## WeakSet

`new WeakSet(iterable)`

* WeakSet.prototype.add(v)
* WeakSet.prototype.clear()
* WeakSet.prototype.delete(v)
* WeakSet.prototype.has(v)


## Typed Objects

类似Ruby的Struct的，但是目前没有任何引擎实现。

## Proxy Objects

```
var proxy = Proxy(target, handler);
```

将`target`的函数调用转向到`handler`之上。目前除了Firefox支持，没有其他任何Javascript引擎支持。

## Symbol

笔者还在理解中。目前新版的Chrome和node支持。

## Prmoise

原生版本的Promise API，有关Promise的内容，会在另外一篇文章内详细说明： [Javascript Promise](../../Functional_Javascript/Javascript_Promise.md)。

## Proxy

Proxy是Javascript元编程的一道大门。Javascript在语言层面无法去重载操作符，但是通过Proxy API，我们可以彻底的修改一个对象的各种行为。这种强大的行为已经在`node --harmony`和Firefox中支持了。

待补充。可以参考：

* http://www.slideshare.net/BrendanEich/metaprog-5303821
* http://soft.vub.ac.be/~tvcutsem/proxies/
* http://ariya.ofilabs.com/2013/07/es6-and-proxy.html


[^1]: http://wiki.ecmascript.org/doku.php?id=harmony:typed_objects
[^2]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy
[^3]: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-symbol-constructor
[^4]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
