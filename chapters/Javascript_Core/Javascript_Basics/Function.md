# 函数

Javascript中，要记住函数是first-class citizen。

## 定义

* 函数声明语句 


        function plus(x ,y) {
        	
        }


* 函数定义表达式


    	var plus = function (x, y) {
    	 	
    	}


## 函数调用

* 作为函数调用


    	function a(){};
    	a();


* 作为方法调用

    	a={};
    	a.x = function(){};
    	a.x();

* 通过call和apply间接调用函数(改变this)

call 和 apply带有多个参数，call和apply把当前函数的this指向第一个参数给定的函数或对象中，并传递其余所有的参数作为当前函数的参数。


	var O = function () {
		this.foo  = 'hello';
		this.hello = function () {
			return 'world';
		}
	};

	var fn = function () {
		console.log('call', this);
	};

	var o = new O();

	fn.call(o);//此时fn的this指向o


call和apply的不同之处，在于call传递的参数是作为arguments依次传入的，例如

`fn.call(o, 1, 2, 3);`
而apply传递的参数是以一个数组的方式传入的，例如
`fn.apply(o, [1, 2, 3]);`

## 参数

当传入参数少于函数声明的参数时，留空的参数的值是`undefined`。

Javascript允许传入参数的个数大于声明时制定的参数个数。可以用`arguments`来访问这些参数


	function f(){
		var i;
		for( i = 0; i < arguments.length ; i++) {
			console.log(arguments[i]);
		}
	}

	f(1,2,3,4,5,6);

函数通过取得arguments的长度得到传入参数的个数，使用一个循环获取每一个参数。

arguments还有两个属性，`callee`和`caller`
`callee`表示正在执行的function对象，
`caller`表示调用当前function的function

例如


	function f(){
		console.log(arguments.callee);//[Function: f]
		console.log(arguments.callee.caller);[Function: g]
		var i;
		for( i = 0; i < arguments.length ; i++) {
			console.log(arguments[i]);
		}
	}

	function g(){
		f(1,2,3,4,5,6);
	}

	g();


 `callee` 的重要用法之一是在匿名函数中实现递归


	var result = function (x) {
		if (x <= 1) return 1;
		return x * arguments.callee(x - 1);
	}(3);

	console.log(result);

上例使用了一个匿名函数和callee实现了一个阶乘。

## 作为值的函数

javascript中的函数可以作为值来传递


	function square(x) {
		return x * x;
	}

	var s = square;
	s(4);


## 作为命名空间的函数


	(function() {
		
	}());


## 闭包

Javascript函数对象的内部状态不仅包含着函数的代码逻辑，还引用当前的作用域链。函数对象通过作用域链相互关联起来，函数体内部变量包含在函数作用域内，这就叫闭包。

例如


	var scope = 'global scope';
	function checkscope() {
		var scope = 'local scope';
		function f() { 
			return scope;
		}
		return f;
	}

	checkscope()();


这段checkscope声明了一个局部变量，定义了一个函数f，函数f返回了这个局部变量的值，最后返回了这个函数f。在定义函数f的作用域外调用f，得到的返回仍然是函数f创建时所在的作用域的局部变量scope。

又例如


	var counter = (function() {
		var count = 0;
		return function () {
			return count++ ;
		}
	}());


代码定义了一个立即执行函数并返回给counter，这个函数定义了一个局部变量count，返回了一个子函数，该子函数每次调用，都会吧count加一并返回。

*闭包的注意事项*

观察下面的示例：


	var add_the_handlers = function (nodes) {
		var i;
			for (i = 0; i < nodes.length; i += 1) {
				nodes[i].onclick = function (e) {
					alert(i);
				};
			}
	};


这个函数期望的结果，是在运行的时候为每个node在onclick的时候alert出各自的序号，但是实际运行的结果却不同：所有的node在单击的时候alert出来的数字总是同一个。

这是因为alert所在的匿名函数的闭包中存放的i是第一行的i，而不是在循环中获得的i的当前值。

所以如果希望达到预期结果，应该在循环中创建多个闭包，在闭包中存放当前循环的i的值：


	var add_the_handlers = function (nodes) {
		var i;
			for (i = 0; i < nodes.length; i += 1) {
				nodes[i].onclick = function (i) {
					return function(e){
						alert(e);
					};
				}(i);
			}
	};


这里使用一个立即执行函数并传递当前的i的值，返回一个新生成的函数。在这个新生成的函数的闭包中就保存了当前的i的值。

## 函数中的this对象

在一个对象中的this始终引用当前对象，但是在函数中，特别是在闭包中，this有一些特殊的行为。

函数中的this对象始终绑定在函数运行时的上下文环境上。所以在普通模式下调用一个全局函数，this始终指向window（客户端），在严格模式下调用一个全局函数，this始终是undefined

示例


	var name = "The Window";
	var object = {
		name: "My Object",
		getNameFunc: function () {
			return function () {
				return this.name;
			};
		},
		getName : function () {
			return this.name;
		}
	};

	console.log(object.getNameFunc()());
	console.log(object.getName());



getNameFunction()返回了一个匿名函数，这个匿名函数在调用的时候，上下文是window（浏览器中），所以在浏览器中输出的是the Window

而getName()调用的时候上下文是object，所以成功输出object的name

其实以上代码中
	object.getNameFunc()()
等效于
	var fnc = object.getNameFunc();//这时候的fnc已经脱离了object对象
	fnc();

所以如果想要getNameFunction()正确返回Object的Name，需要在返回的匿名函数的闭包中保存在函数声明时的this，


	getNameFunc: function () {
			var that = this;
			return function () {
				return that.name;
			};
		},

这样就可以了。。

## 函数柯里化

函数柯里化是指，把接受多个参数的函数转换成接受一个单一参数的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

示例

	var add1 = add.curry(1);
	console.log(add1(2));


其中，add是接受两个参数的函数，add调用了curry返回一个只接受一个参数的新函数，之后调用add1便等效于调用add(1, 2);

javascript并不原生支持curry，可以用prototype来模拟


	Function.prototype.curry = function () {
		var slice = Array.prototype.slice,
			args = slice.apply(arguments),
			that = this;
		return function () {
			return that.apply(null, args.concat(slice.apply(arguments)));
		};
	};


	function add(n1, n2) {
		return n1 + n2;
	}

	var add1 = add.curry(1);
	console.log(add1(2));

curry创建了一个新函数，在新函数的闭包中保存了原先传递的参数。



## 函数的属性和方法

* `length` 函数的length表示函数实参的数量，是只读的
* `prototype` 指向一个该函数的原型对象的引用
* `toString` 返回一个字符串