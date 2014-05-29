诚惶诚恐的写下这篇文章。用JavaScript实现继承模型，已经是非常成熟的技术，各种大牛也已经写过各式的经验总结和最佳实践。在这里，我只能就我所能，写下我自己的思考和总结。

在阅读之前，我们先假设几个在面向对象编程中的概念是大家熟悉的：

* 类, Class
* 构造函数, Constructor
* 继承, Inheritance
* 实例, Instance
* 实力化, Instantiation
* 方法, Method
* 多态, Polymorphism
* 接口, Interface

由于讲解这些概念是十分复杂的，所以还请参阅其他资料。

## 了解原型

面向对象是当代编程的主流思想。无论是C++还是Java，都是面向对象的。严格上来讲，JavaScript并不是面向对象的，而是“基于对象的”(Object-based)，因为它的确缺乏面向对象里的很多特性，例如：

* 继承
* 接口
* 多态
* ...

但再另一方面，JavaScript是基于原型(Prototype)的对象系统。它的继承体系，叫做原型链继承。不同于继承树形式的经典对象系统，基于原型的对象系统中，对象的属性和方法是从一个对象原型（或模板）上拷贝或代理(Delegation)的。JavaScript也不是唯一使用这种继承方法的编程语言，其他的例子如：

* Lisp
* Lua
* ...

那么，`prototype`在哪里呢？

### 访问构造函数的原型

```
// 访问Array的原型
Array.prototype
```

```
// 访问自定义函数Foo的原型
var Foo = function() {}
Foo.prototype
```

### 访问一个实例的原型

`__proto__`不是标准属性，但是被大多数浏览器支持

```
var a = {}
a.__proto__;
```

使用ES5的`Object.getPrototypeOf`:

```
Object.getPrototypeOf([]) === Array.prototype;
```

再来点绕弯的：

```
[].constructor.prototype === Array.prototype
```

## `new`关键字

大多数面向对象语言，都有`new`关键字。他们大多和一个构造函数一起使用，能够实例化一个类。JavaScript的`new`关键字是异曲同工的。

等等，不是说JavaScript不支持经典继承么！的确，其实`new`的含义，在JavaScript中，严格意义上是有区别的。

当我们，执行

```
new F()
```

实际上是得到了一个从`F.prototype`继承而来的一个对象。这个说法来自Douglas的很早之前的一篇文章[^1]。在如今，如果要理解原型继承中`new`的意义，还是这样理解最好。

如果我们要描述`new`的工作流程，一个接近的可能流程如下：

1. 分配一个空对象
2. 设置相关属性、方法，例如`constructor`和`F.prototype`上的各式方法、属性。注意，这里执行的并不是拷贝，而是代理。后文会讲解这点。
3. 将这个新对象作为构造函数的执行上下文（其`this`指向这个对象），并执行构造函数
4. 返回这个对象


## 原型继承

我们来定义一个简单的“类”和它的原型：

```
var Foo = function() {};
Foo.prototype.bar = function() {
    console.log("haha");
};
Foo.prototype.foo = function() { console.log("foo"); };
```
我们在原型上定义了一个`bar`方法。看看我们怎么使用它：

```
var foo = new Foo();
foo.bar(); // =>  "haha"
foo.foo(); // => "foo"
```

我们要继承`Foo`:

```
var SuperFoo = function() {
    Foo.apply(this, arguments);
};
SuperFoo.prototype = new Foo();
SuperFoo.prototype.bar = function() {
    console.log("haha, haha");
};
var superFoo = new SuperFoo();
superFoo.foo(); // => "foo"
superFoo.bar(); // => "haha, haha"

```

注意到几个要点：

1. 在`SuperFoo`中，我们执行了父级构造函数
2. 在`SuperFoo`中，我们让然可以调用`foo`方法，即使`SuperFoo`上没有定义这个方法。这是继承的一种表现：我们可以访问父类的方法
3. 在`SuperFoo`中，我们重新定义了`bar`方法，实现了方法的重载

我们仔细想想第二点和第三点。我们新指定的`bar`方法到底保存到哪里了？`foo`方法是如何找到的？

## 原型链

要回答上面的问题，必须要介绍原型链这个模型。相比树状结构的经典类型系统，原型继承采取了另一种线性模型。

当我们要在对象上查找一个属性或方法时：

1. 在对象本身查找，如果没有找到，进行下一步
2. 在该对象的构造函数自己的`prototype`对象上查找，如果没有找到进行下一步
3. 获取该对象的构造函数的`prototype`对象作为当前对象；如果当前对象存在`prototype`，就能继续，否则不存在则查找失败，退出；在该对象上查找，如果没有找到，将前面提到的“当前对象”作为起始对象，重复步骤3

这样的递归查找终究是有终点的，因为:

```
Object.prototype.__proto__ === null
``` 
也就是Object构造函数上，`prototype`这个对象的构造函数上已经没有`prototype`了。

我们来看之前`Foo`和`SuperFoo`的例子，我们抽象出成员查找的流程如下:

```
superFoo本身 => SuperFoo.prototype => Foo.prototype => Object.prototype
```
解读原型链的查找流程：

* `superFoo本身`意味着`superFoo`这个实例有除了能够从原型上获取属性和方法，本身也有存储属性、方法的能力。我们称其为`own property`，我们也有不少相关的方法来操作：
    * obj.hasOwnProperty(name)
    * Object.getOwnPropertyNames(obj)
    * Object.getOwnPropertyDescriptor(obj)
* `SuperFoo.prototype`：
    * 回忆一下这句`SuperFoo.prototype = new Foo();`，也就是说`SuperFoo.prototoye`就是这个新创建的这个Foo类型的对象
    * 这也就解释了为啥我们能访问到`Foo.prototype`上的方法和属性了
    * 也就是说，我们要在这个新建的Foo对象的本地属性和方法中查找
* `Foo.prototype`:
    *  查找到这一次层，纯粹是因为我们制定了`SuperFoo.prototype`的值，回想上一条
* `Object.prototype`
    * 这是该原型链的最后一环，因为`Object.prototype`这个对象的原型是`null`，我们无法继续查找 
    * 这是JavaScript中所有对象的祖先，上面定义了一个简单对象上存在的属性和方法，例如`toString`

那么，当在`SuperFoo`上添加`bar`方法呢？这时，JavaScript引擎会在`SuperFoo.prototype`的本地添加`bar`这个方法。当你再次查找`bar`方法时，按照我们之前说明的流程，会优先找到这个新添加的方法，而不会找到再原型链更后面的`Foo.prototype.bar`。

也就是说，我们既没有删掉或改写原来的`bar`方法，也没有引入特殊的查找逻辑。


## 模拟更多的经典继承

基本到这里，继承的大部分原理和行为都已经介绍完毕了。但是如何将这些看似简陋的东西封装成最简单的、可重复使用的工具呢？本文的后半部分将一步一步来介绍如何编写一个大体可用的对象系统。

### 热身

准备几个小技巧，以便我们在后面使用。


#### beget

如果要以一个对象作为原型，创建一个新对象：

```
function beget(o) {
    function F() {}
    F.prototype = o;
    return new F();
}
var foo = beget({bar:"bar"});
foo.bar === "bar"; //true
```
理解这些应该困难。我们构造了一个临时构造函数，让它的`prototype`指向我们所期望的原型，然后返回这个构造函数所创建的实例。有一些细节：

* 我们不喜欢直接做`A.prototype = B.prototype`这样的事情，因为你对子类的修改，有可能直接影响到父类以及父类的所有实例。大多数情况下这不是你想看到的结果
* 新建`F`的实例，创建了一个`本地对象`，可以持有(own)自身的属性和方法，便可以支持之后的任意修改。回忆一下`superFoo.bar`方法。

如果你使用的JavaScript引擎支持`Object.create`，那么同样的事情就更简单：

```
Object.create({bar:"bar"});
```

要注意`Object.create`的区别：

* 我们可以创建没有原型的对象: `Object.create(null)`
* 我们可以配置创建的对象，参阅`Object.create`的文档[^2]
* 我们不必去运行一遍父类构造函数，这样可以避免不需要的副作用

#### 函数的序列化、解义

JavaScript的函数可以在运行时很方便的获取其字符串表达：

```
var f = function(a) {console.log("a")};
f.toString(); // 'function(a) {console.log("a")};'
```

这样的能力其实时很强大的，你去问问Java和C++工程师该如何做到这点吧。

这意味着，我们可以去分析函数的字符串表达来做到：

1. 了解函数的函数列表
2. 了解函数体的实际内容
3. 了解一个函数是否有别名
4. ...

#### 动态的`this`

JavaScript中的`this`是在运行时绑定的，我们往往需要用到这个特性，例如：


````
var A = function() {};
A.methodA = function() {
    console.log(this === A);
};
A.methodA();// => true
````
以上这段代码有如下细节：

* `A.methodA()`运行时，其上下文对象指定的是`A`，所以`this`指向了`A`
* 我们可以用这个来模拟“类的静态方法或类方法”
* 我们能够通过这里的`this`引用到类（构造函数）本身

## 若干版本

### 最简单版本

单纯实现一个`extend`方法：

```
var extend = function(Base) {
  var Class = function() {
    Base.apply(this, arguments);
  }, F;
  if(Object.create) {
    Class.prototype = Object.create(Base.prototype);
  } else {
    F = function() {};
    F.prototype = Base.prototype;
    Class.prototype = new F();
  }
  Class.prototype.constructor = Class;
  return Class;
};

var Foo = function(name) {
  this.name = name;
};
Foo.prototype.bar = function() {
  return "bar";
};

var SuperFoo = extend(Foo);
var superFoo = new SuperFoo("super");
console.log(superFoo.name);// => "super"
console.log(superFoo.bar());// => "bar"
```

由于过于简单，我就不做讲解了。

### 更复杂的例子

* 我们需要一个根对象`XObject`
* 根对象有各种继承方法，并能传入一些子类的方法和属性
* 我们要复用上个例子里的`extend`，但是会有修改

```
var extend = function(Base) {
  var Class = function() {
    Base.apply(this, arguments);
  }, F;
  if(Object.create) {
    Class.prototype = Object.create(Base.prototype);
  } else {
    F = function() {};
    F.prototype = Base.prototype;
    Class.prototype = new F();
  }
  Class.prototype.constructor = Class;
  return Class;
};

var merge = function(target, source) {
  var k;
  for(k in source) {
    if(source.hasOwnProperty(k)) {
      target[k] = source[k];
    }
  }
  return target;
};

// Base Contstructor
var XObject = function() {};

XObject.extend = function(props) {
  var Class = extend(this);
  if(props) {
    merge(Class.prototype, props);
  }
  
  // copy `extend`
  // should not use code like this; will throw at ES6
  // Class.extend = arguments.callee;
  Class.extend = XObject.extend;
  
  return Class;
};


var Foo = XObject.extend({
  bar: function() { return "bar"; },
  name: "foo"
});

var SuperFoo = Foo.extend({
  name: "superfoo",
  bar: function() { return "super bar"; }
});

var foo = new Foo();
console.log(foo.bar()); // => "bar"
console.log(foo.name); // => "foo"

var superFoo = new SuperFoo();
console.log(superFoo.name); // => "superfoo"
console.log(superFoo.bar()); // => "super bar"
```

上面的例子中，

* `XObject`是我们对象系统的根类
* `XObject.extend`可以接受一个包含属性和方法的对象来定义子类
* `XObject`的所有子类，都没有定义构造函数逻辑的机会！真是难以接受的：
    * 我们偏好一个类上的`init`方法来初始化对象，而将构造函数本身最简化
        * 绕开工厂方法的实现过程中，参数传递如何传递到构造函数的问题
    * 可以支持更多新的特性，例如`super`属性、`mixin`特性等

## 总结，然后呢？

我们解决了一部分问题，又发现了一些新问题。但本文的主要内容在这里就结束了。一个更具实际意义的对象系统，实际随处可见，`Ember`和`Angular`中的根类。他们都有更强大的功能，例如：

* Ember中的binding，setter、getter
* Angular中的函数依赖注入
* ...

但是，这些框架中对象系统的出发点都在本文所阐述的内容之中。如果作为教学，John Resig在2008年的一篇博客中[^3]，总结了一个现代JavaScript框架中的对象系统的雏形。我创建了[docco代码注解](/docco/john_resig_extend.html)来立即这段代码，本文也会结束在这段代码的注解。

还有一些更高级的话题和技巧，会在另外一篇文章中给出。

[^1]: http://javascript.crockford.com/prototypal.html
[^2]: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create
[^3]: http://ejohn.org/blog/simple-javascript-inheritance/