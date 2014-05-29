// # 简单的JavaScript继承

// [原文](http://ejohn.org/blog/simple-javascript-inheritance/)的作者是John Resig。本文是对他的代码进行注释。

// 实现了几个目标:
// * 一个根类
// * 每个类上可以存在`extend`方法或者其他静态方法，并可以继承
// * 每个类的构造方法逻辑应该放到`init`的实例方法上
// * 每个方法可以通过`this._super`访问到父类的该方法；这在重载方法中非常有用


// 这里创建了一个匿名函数并立即运行。这时JavaScript中最常见的技巧，用来解决作用于污染等问题。
(function(){
      // `initializing` 是是个标志为，代表我们是否是因为得到子类的一个原型而运行一个构造函数。当`initializing`为`true`时，代表我们运行构造函数时，并不是为了实例化一个类。
  var initializing = false,
      // 这里涉及到了JavaScript的字符串解构特性。这个三元运算符的条件部分时这样计算的：
      // 1. 由于`Regex.prototype.test`只接受`String`类型的参数，这里引擎会进行隐式转换
      // 2. 将`function(){xyz;}`进行类型转换，自然会调用`Function.prototype.toString`
      // 3. 若当前引擎支持`Function.prototype.toString`,这个表达式当然会返回`true`，因为`"function(){xyz;}"`这个字符串表达中，当然包含`xyz`
      fnTest = /xyz/.test(function(){xyz;}) ?
      // 折腾了这么多，其实就是判断当前环境是否支持字符串解构的特性。后续的代码会利用这个特性去判断类的定义者是否使用了`_super`这个特殊的字段
      /\b_super\b/ :
      // 如果不支持，那么给了一个非常宽泛的正则，也会导致后续过程中，每个方法的执行上下文都加上`_super`属性
      /.*/;


  // 这里是对象系统的根类构造函数，
  // 这句话也很有争议：
  // * `this`被期望指向全局对象，这在`strict mode`中是不可能实现的，会*导致报错*
  // * 算然也叫`Class`，但是和后面我们返回Class并不是一回事。这无疑造成了混淆
  this.Class = function(){};

  // `extend`方法用来根据一个基类创建子类。显而易见，在这个对象系统的实现中，`Class`就是最顶层的根类
  // `props`作为唯一传入的参数，是一个简单的对象，其定义了子类上的属性和方法
  // 之所以我们能够获取我们之前定义的`Class`，完全是依赖闭包特性:
  // * 在当前作用域找不到`Class`
  // * 会在包含的上一层作用域中查找，在这里，就是全局作用域了
  // * 然后就找到了我们之前定义的`this.Class`
  Class.extend = function(prop) {
    // 持有当前类的`prototype`；这里利用了`this`的动态特性
    var _super = this.prototype;

    // 这里通过初始化一个基类，来建立子类的`prototype`。这里绝对不是最佳做法，但是原文是2008年写的，所以有所局限也很正常。
    initializing = true;
    // 这里我们的备选方法之一：
    // ```
    // var prototype = Object.create(this.prototype);
    // ```
    // 在不支持ES5的环境中：
    // ```
    // var prototype = (function(P) {
    //   var F = function() {};
    //   F.prototype = P.prototype;
    //   return new F();
    // })(this);
    //
    // 这两种方法都不需要引入`initializing`这个变量。这里为什么John Resig要这么做，只有问他本人了。
    var prototype = new this();
    initializing = false;

    // 复制属性到子类的`prototype`上
    // 注意这里的for循环所用到的变量，它并没有很规范的将其放到函数体的前端定义
    for (var name in prop) {
      // 对于函数成员，我们要做一些特殊处理，以让它执行时，可以放到`_super`
      prototype[name] =
        // 先判断是否是函数
        typeof prop[name] == "function" &&
        // 在判断这个函数体内是否用到了`_super`
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        // 如果用到了，我们就需要开始构建新的方法，这个方法执行时可以访问到`_super`
        (function(name, fn){
          return function() {
            // 保存原用"_super"；这个值在多层继承的情况下有可能存在的。
            var tmp = this._super;

            // 获取父类上的同名方法，并设置到`this`上
            this._super = _super[name];
            // 动态执行该方法
            var ret = fn.apply(this, arguments);
            // 执行完毕后，我们复原`_super`
            this._super = tmp;

            // 返回方法的执行结果
            return ret;
          };
        })(name, prop[name]) :
        // 如果是非函数数值，我们直接进行赋值
        prop[name];
    }

    // 我们的模拟类的实际构造函数
    function Class() {
      // 判断我们是否需要进行构造
      if ( !initializing && this.init )
        // 这里我们约定，所有的构造操作都是放在`init`方法上的，这也是非常流行的一种风格
        this.init.apply(this, arguments);
    }

    // 设置子类的`prototype`
    Class.prototype = prototype;

    // 修改`constructor`属性，指向正确的构造函数
    // 否则这个值是指向父类构造函数的
    Class.prototype.constructor = Class;

    // 在这个类上设置`extend`方法
    // 在`strict mode`中，`arguments.callee`*会抛出错误*，这里不推荐大家使用
    Class.extend = arguments.callee;

    return Class;
  };
})();
