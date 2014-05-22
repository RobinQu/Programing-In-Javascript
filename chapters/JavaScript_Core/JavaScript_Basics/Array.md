# 数组

## 创建数组

* 数组字面量 var a = [1, 2, 3];
* 使用构造函数 var a  = new Array();

数组本质上是object(type of [ ] == 'object');

所以要判断是不是数组，需要通过判断constructor。

`[].constructor//Array`

## 数组长度

使用length属性获取元素的个数。
数组的length属性是可写的。当length属性小于元素个数时，数组中索引值大于length属性的元素会被删掉。

## 数组元素的添加和删除

 * `push` 从数组尾部添加
 * `unshift` 从数组头部添加
 * `pop` 从尾部弹出
 * `shift` 从头部弹出

## 数组方法

* `join` 将数组中所有元素转换成字符串并连接在一起
* `reverse` 将数组中成员颠倒排序
* `sort` 将数组元素排序，可以指定一个排序函数
* `contact` 将数组连接起来
* `slice` 返回指定数组的一个片段或子数组
* `splice` 从数组中插入或删除元素


	var a = [1, 2, 3, 4];
	var b = a.splice(1,2);//a = 1,4,b = 2,3


## ECMAScript 5中的数组新方法

* `forEach` 从头到尾遍历数组，为每个元素调用制定的函数
* `map` 把数组的每个元素传给指定的函数，并返回一个数组。


	var a = [1, 2, 3];
	var b = a.map(function(x) {
		return x*x;
	});	//b = [1,4,9]


* `filter` 把数组的每个元素传给指定的函数，通过函数返回的布尔值决定是否在返回数组中添加该元素


	 var a = [1, 2, 3];
	 var b = a.filter(function(x){
		return x % 2 !== 0;
	});//b = [1, 3]


* `every` 把数组的每个元素传给指定的函数，如果全部调用返回true则every函数返回true
* `some` 把数组的每个元素传给指定的函数，如果有调用返回true则every函数返回true
* `reduce` 用指定的函数对数组进行组合，生成单个值


	var a = [1, 2, 3];
	var b = a.reduce(function(x, y){
		return x + y;
	}, 0); //b = 6;


* `indexOf/lastIndexOf`在整个数组中搜索制定的元素


## 类数组对象

通过为对象增加length自增的特性或者其他特性，可以生成一个‘类数组对象’，可以通过length进行遍历。例如函数的Arguments对象就是这样
