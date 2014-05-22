# JavaScript Objects

## 创建对象

* 对象直接量


	var  o = {
	    foo : "bar"
	}


* 构造函数

	var o = new Object();


* 原型继承


	var p = Object.create(o);


## 类继承


JavaScript对象拥有自有属性和继承属性。

 * 在查询对象o的属性x时，先查找o中的属性x，如果没找到，则查找o的原型对象中的x属性，直到查找到x或者一个原型是null的对象为止

 * 在给对象o的x属性赋值时，如果o中已经有一个自有属性x，则改变x的值，若o中不存在属性x，则为o创建一个x属性并赋值

 * 也就是说，只有在查询时原型链才会起作用。


	var O = {
		x : 1
	};

	function P() {
		this.y = 2;
	}

	P.prototype = O;

	var t = new P();
	console.log(t);
	console.log('x' in t);//true
	console.log(t.hasOwnProperty('x'));//false


可以使用in 或者 hasOwnProperty 来判断对象中是否存在属性。

## 对象属性

* 遍历对象属性

可以使用 `for..in` 来遍历对象的属性

使用`for..in`时会遍历到原型链上的属性。遍历顺序是以广度优先遍历

所以使用hasOwnProperty便可以判断是否是对象自有的属性。

 * 对象属性的特性

使用Object.getOwnPropertyDescriptor()获取对象特定属性的描述符

*可写性(writable)* 表示对象属性是否可写

例如


	var o = {
		foo	: 'bar'
	}

	Object.defineProperty(o, "foo", { writable : false });

	o.foo = 'world';
	console.log(o.foo);//仍然输出bar


*可枚举性(enumerable)* 表示对象属性是否可枚举

例如
Array中的length等属性的 enumerable是false，所以，

	
	for (p in Array) {
		console.log(p);
	}
	
什么也不输出

*可配置性(configurable)* 表示可否修改属性的可配置性和可枚举性

可以用Object.defineProperties来定义这些配置属性。


	Object.defineProperty(o, "foo", { writable : false });

*Get 表示获取对象属性的方法*
*Set 表示设置对象属性的方法*

示例


	var book = {
		_year: 2004,
		edition: 1
	};
	Object.defineProperty(book, "year", {
		get: function () {
			console.log('get year');
			return this._year;
		},
		set: function (newValue) {
			console.log('set year');
			if (newValue > 2004) {
				this._year = newValue;
				this.edition += newValue - 2004;
			}
		}
	});
	book.year = 2005;//控制台输出‘set year’
	console.log(book.year);//控制台输出‘get year’和year的值



## 对象方法

* `toString` 将对象转换成字符串，默认的转换会是[object Object]之类的东西，所以需要转成json格式的话可以用`JSON.stringify`

* `valueOf` 需要将对象转换成其他类型的时候要用到。同样的，默认转换没什么值得说的。

## 可执行对象

通过如下方法可以创建一个可执行对象


	function bar(o) {
	    var f = function() { return "Hello World!"; }
	    o.__proto__ = f.__proto__;
	    f.__proto__ = o;
	    return f;
	}

	var o = { x: 5 };
	var foo = bar(o);

	console.log(foo());
	console.log(foo.x);
	console.log(typeof foo);//function


既可以当作对象来使用（有原型链），也可以当作函数来直接调用