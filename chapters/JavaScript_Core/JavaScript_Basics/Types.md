# JavaScript数据类型

计算机程序的运行需要对值进行造作。在编程语言中，能够表示并操作的值的类型称做数据类型。

JavaScript的数据类型分为两类： 原始类型和对象类型。JavaScript中的原始类型包括数字，字符串和布尔值。

    1
    "hello world"
    true
JavaScript中有两个特殊的原始值： null和undefined。

    null
    undefined

JavaScript除了上述的就是对象了，对象是属性的集合，每个属性都由 键值对组成。

    var i = {x: 1, y: 2}

通常对象是无序，JavaScript定义了一种特殊对象数组，他是有序的集合。

    var a[10];

JavaScript还定义了另一种特殊的对象-函数。函数是具有与它相关联的可执行代码的对象。通过调用函数来运行执行的代码，并返回结果。

    function a(){
	  console.log("hello world");
    }

## 数字

* 不区分整数值和浮点数， JavaScript中所有数字均用64位浮点数值标识（IEEE 754）。
* 就像java程序员所熟悉的double类型
* 取值范围在 ±1.7976931348623157 × 10 308 到 ±5 × 10 −324 之间
* 文字:
  * 整数
    * 十六进制 0x
    * 八进制 0
  * 浮点表示
  * Math类
    * 方法
      * pow // 求幂
      * **round** //四舍五入
      * **ceil** //向上取整
      * **floor** //向下取整
      * **abs** //求绝对值
      * **max** //最大值
      * **min**  //最最小值
      * sqrt
      * log
      * exp
      * acos
      * asin
      * atan
      * atan2
      * **random**
      * sin
      * cos
    * 常量
      * PI
      * E
      * LN2
      * LN10
      * LOG2E
      * LOG10E
      * PI
      * SQRT1_2
      * SQRT2    
  * 无限值
    * 正无穷
      * Infinity //rw 
      * Number.POSITIVE_INFINITY // r
      * 1/0
      * Number.MAX_VALUE + 1
    * 负无穷
      * Number.NEGATIVE_INFINITY //rw
      * -Intifinty //r
      * -1/0
      * -Number.MAX_VALUE - 1
    * NaN
      * 不与任何值相等 包括它自己.
      * NaN //rw
      * Number.NaN //r
      * 0/0 //计算结果为NaN
    * Zero
      * Number.MIN_VALUE/2
      * -Number.MIN_VALUE/2
      * -1/Infinity
      * -0
  * Rounding-error
    
			  var x = .3 - .2 
			  var y = .2 - .1
			  x == y
			  x == .1 // => false .3 -.2 不等于 ./
			  y == .1 // => true .2 - .1 等于 .1
      

## 布尔值

布尔值指代真或假，这个类型只有两个值， 保留字true和false

通常比较语句的结果是布尔值 例如：

    a==4

这段代码检测a是否等于4

任何JavaScript的值都可以转换为布尔值。下面这些值会被转换为false

    undefined
    null
    0
    -0    
    NaN
    "" // the empty string

所有其他的值，包括所有对象都会转换成true

## null和undefined

null表示一个特殊值，常用来描述空值。 对null执行typerof，结果返回object, 也就是null被认为是一种特殊的对象值，含义是非对象。

JavaScript使用undefined标识变量没有初始化。例如函数没有返回值，则返回undefined。undefined是预定义的全局变量（与null不一样，它不是关键字）。

## 日期与时间

JavaScript语言核心包括Date()构造函数， 用来创建表示日期和时间的对象。这些日期对象的方法为日期计算通过了简单的API:

	var then = new Date(2011, 0, 1); // 2011年1月1日
    var later = new Date(2011, 0, 1, 17, 10, 30) //同一天，当地时间5：10:30pm,
    var now = new Date(); //当前日期和时间
    var elapsed = now - then; //日期减法： 计算时间间隔的毫秒数
    later.getFullYear() // => 2011
    later.getMonth() // => 0 从0开始计数的月份
    later.getDate() // => 1 从1开始计数的天数
    later.getDay() // => 5 得到星期几， 0代表星期日， 5代表星期一
    later.getHours() // => 当地时间17   5pm
    later.getUTHours() // 使用UTC表示小时的时间，基于时区

## 文本

字符串是一组由16位值组成的不可变的有序序列，每个字符通常来自于Unicode字符集。

    var i = "abcdefg";  

在JavaScript字符串中，反斜线\有着特殊的用途，反斜线符号后加一个字符，就不再表示它们的字面含义了，不如\n就是一个转义字符，它表示一个换行符。
		
    'You\'re right, it can\'t be a quote'

JavaScript的内置功能之一就是字符串连接：

    msg = "Hello, " + "world";

字符串的length属性可以查看字符串的长度：

    s.length

除了length属性， 字符串还提供许多可以调用的方法：

    var s = "hello, world" //定义一个字符串
    s.charAt(0)      // => "h" 第一个字符
    s.charAt(s.length-1) // => "d" 最后一个字符
    s.substring(1, 4) // => "ell" 第2-4个字符
    s.slice(1,4) // => "ell" 同上
    s.slice(-3)  // => "rld": 最后三个字符
    s.indexOf("l") // => 2 字符l首次出现的位置
    s.lastIndexOf("l") // => 10: 字符l最后一次出现的位置
    s.indexOf("l", 3) // => 在位置3及之后首次出现字符l的位置
    s.split(",") // => ["hello", "world"]分割成子串
    s.replace("h", "H") // => "Hello, world": 全文字符替换
    s.toUpperCase() // => "HELLO WORLD"

## 全局对象

全局对象在JavaScript中有着重要的用途： 全局对象的属性是全局定义的符号， JavaScript程序可以直接使用，当解释器启动时，它将创建一个新的全局对象，并给它一组定义的初始属性：

* 全局属性，比如undefined, Infinity
* 全局函数，比如parseInt()
* 构造函数，比如Data(),
* 全局对象，比如Math和JSON


## 包装对象

看这样一个例子：

    var s = "hello world!";
    var word = s.substring(s.indexOf(" ")+1, s.length);

字符串既然不是对象，为什么它会有属性呢？只要引用了字符串s的属性，JavaScript就会将字符串值通过调用new String(s)的方式转换成对象，
同字符串一样，数字和布尔值也有相应的方法。其他类似的包装类：

* Number object
* String object
* Boolean Object
* Function Object
* RegExp Object
* Error
    * SyntaxError
    * ReferenceError
    * TypeError
* ...


### 不可变的原始值和可变的原始对象引用

原始值是不可改变的，原始值的比较是值比较， 对象的比较并非值比较：即使两个对象包含同样的属性以及相同的值，他们也不是相等的。我们通常将对象称为引用类型，对象的值都是引用，对象的比较也是引用的比较，当且仅当他们引用同一个基独享，他们才相等；

## 类型转换

当期望使用一个布尔值的时候，可以提供任意类型值，JavaScript将根据需要自行转换类型。类型转换可以分为隐式转换和显式转换，所谓隐式转换即程序在运行时进行的自动转换，显式转换则是人为的对类型进行强制转换。

### 显式转换

通过手动进行类型转换，JavaScript提供了以下转型函数：

* 转换为数值类型：Number(mix)、parseInt(string,radix)、parseFloat(string)

* 转换为字符串类型：toString(radix)、String(mix)

* 转换为布尔类型：Boolean(mix)

Number(mix)函数，可以将任意类型的参数mix转换为数值类型。其规则为：

- 如果是布尔值，true和false分别被转换为1和0 
          
        Number(true); //=> 1 
- 如果是数字值，返回本身。

        Number(5); //=> 5

- 如果是null，返回0.

        Number(null); //=>0
       
- 如果是undefined，返回NaN。

        Number(undefined); //=> NaN

如果是字符串，遵循以下规则：

- 如果字符串中只包含数字，则将其转换为十进制（忽略前导0）

        Number("00001"); //=> 1

- 如果字符串中包含有效的浮点格式，将其转换为浮点数值（忽略前导0）

        Number("1.234"); //=> 1.234

- 如果是空字符串，将其转换为0

        Number(""); //=> 0

- 如果字符串中包含非以上格式，则将其转换为NaN
- 如果是对象，则调用对象的valueOf()方法，然后依据前面的规则转换返回的值。如果转换的结果是NaN，则调用对象的toString() 方法，再次依照前面的规则转换返回的字符串值。

下表列出了对象的valueOf()的返回值：
    
    对象	返回值
    Array	数组的元素被转换为字符串，这些字符串由逗号分隔，连接在一起。其操作 与 Array.toString 和 Array.join 方法相同。
    Boolean	Boolean 值。
    Date	存储的时间是从 1970 年 1 月 1 日午夜开始计的毫秒数 UTC。
    Function	函数本身。
    Number	数字值。
    Object	对象本身。这是默认情况。
    String	字符串值。


parseInt(string, radix)函数，将字符串转换为整数类型的数值。它也有一定的规则：

- 忽略字符串前面的空格，直至找到第一个非空字符
- 如果第一个字符不是数字符号或者负号，返回NaN
- 如果第一个字符是数字，则继续解析直至字符串解析完毕或者遇到一个非数字符号为止
- 如果上步解析的结果以0开头，则将其当作八进制来解析；如果以0x开头，则将其当作十六进制来解析
- 如果指定radix参数，则以radix为基数进行解析

        parseInt("12", 10); // => 12
        parseInt("12", 16); // => 18
        parseInt("1E", 10); // => 1
        parseInt("E", 10); // => NaN


parseFloat(string)函数，将字符串转换为浮点数类型的数值。
它的规则与parseInt基本相同，但也有点区别：字符串中第一个小数点符号是有效的，另外parseFloat会忽略所有前导0，如果字符串包 含一个可解析为整数的数，则返回整数值而不是浮点数值。

    parseFloat("1.222.2") // => 1.222
    parseFloat("1.0") // => 1


toString(radix)方法。除undefined和null之外的所有类型的值都具有toString()方法，其 作用是返回对象的字符串表示。

    对象	操作
    Array	将 Array 的元素转换为字符串。结果字符串由逗号分隔，且连接起来。
    Boolean	如果 Boolean 值是 true，则返回 “true”。否则，返 回 “false”。
    Date	返回日期的文字表示法。
    Error	返回一个包含相关错误信息的字符串。
    Function	返回如下格式的字符串，其中 functionname 是被调 用 toString 方法函数的名称： 
    function functionname( ) { [native code] }
    Number	返回数字的文字表示。
    String	返回 String 对象的值。
    默认	返回 “[object objectname]”，其中 objectname 是 对象类型的名称。


String(mix)函数，将任何类型的值转换为字符串，其规则为：

- 如果有toString()方法，则调用该方法（不传递radix参数）并返回结果
- 如果是null，返回”null”
- 如果是undefined，返回”undefined”

Boolean(mix)函数，将任何类型的值转换为布尔值。
以下值会被转换为false：false、”"、0、NaN、null、undefined，其余任何值都会被转换为true。

### 隐式转换

考虑一下情况：

* null == undefined
* undefined == null
* 2 == "2"
* "2" == 2
* NaN != NaN

在某些情况下，即使我们不提供显示转换，JavaScript也会进行自动类型转换，主要情况有：

### 用于检测是否为非数值的函数：isNaN(mix)
isNaN()函数，经测试发现，该函数会尝试将参数值用Number()进行转换，如果结果为“非数值”则返回true，否则返回false。

### 递增递减操作符（包括前置和后置）、一元正负符号操作符
这些操作符适用于任何数据类型的值，针对不同类型的值，该操作符遵循以下规则（经过对比发现，其规则与Number()规则基本相同）：

- 如果是包含有效数字字符的字符串，先将其转换为数字值（转换规则同Number()），在执行加减1的操作，字符串变量变为数值变量。
- 如果是不包含有效数字字符的字符串，将变量的值设置为NaN，字符串变量变成数值变量。
- 如果是布尔值false，先将其转换为0再执行加减1的操作，布尔值变量编程数值变量。
- 如果是布尔值true，先将其转换为1再执行加减1的操作，布尔值变量变成数值变量。
- 如果是浮点数值，执行加减1的操作。
- 如果是对象，先调用对象的valueOf()方法，然后对该返回值应用前面的规则。如果结果是NaN，则调用toString()方法后再应用前 面的规则。对象变量变成数值变量。

### 加法运算操作符
加号运算操作符在JavaScript也用于字符串连接符，所以加号操作符的规则分两种情况：

#### 如果两个操作值都是数值，其规则为：

- 如果一个操作数为NaN，则结果为NaN
- 如果是Infinity+Infinity，结果是Infinity
- 如果是-Infinity+(-Infinity)，结果是-Infinity
- 如果是Infinity+(-Infinity)，结果是NaN
- 如果是+0+(+0)，结果为+0
- 如果是(-0)+(-0)，结果为-0
- 如果是(+0)+(-0)，结果为+0

#### 如果有一个操作值为字符串，则：

- 如果两个操作值都是字符串，则将它们拼接起来
- 如果只有一个操作值为字符串，则将另外操作值转换为字符串，然后拼接起来
- 如果一个操作数是对象、数值或者布尔值，则调用toString()方法取得字符串值，然后再应用前面的字符串规则。对于undefined和 null，分别调用String()显式转换为字符串。


可以看出，加法运算中，如果有一个操作值为字符串类型，则将另一个操作值转换为字符串，最后连接起来。
### 乘除、减号运算符、取模运算符

这些操作符针对的是运算，所以他们具有共同性：如果操作值之一不是数值，则被隐式调用Number()函数进行转换。具体每一种运算的详细规则请参 考ECMAScript中的定义。
### 逻辑操作符（!、&&、||）
逻辑非（！）操作符首先通过Boolean()函数将它的操作值转换为布尔值，然后求反。
逻辑与（&&）操作符，如果一个操作值不是布尔值时，遵循以下规则进行转换：

- 如果第一个操作数经Boolean()转换后为true，则返回第二个操作值，否则返回第一个值（不是Boolean()转换后的值）
- 如果有一个操作值为null，返回null
- 如果有一个操作值为NaN，返回NaN
- 如果有一个操作值为undefined，返回undefined

逻辑或（||）操作符，如果一个操作值不是布尔值，遵循以下规则：

- 如果第一个操作值经Boolean()转换后为false，则返回第二个操作值，否则返回第一个操作值（不是Boolean()转换后的值）
- 对于undefined、null和NaN的处理规则与逻辑与（&&）相同

### 关系操作符（<, >, <=, >=）

与上述操作符一样，关系操作符的操作值也可以是任意类型的，所以使用非数值类型参与比较时也需要系统进行隐式类型转换：

- 如果两个操作值都是数值，则进行数值比较
- 如果两个操作值都是字符串，则比较字符串对应的字符编码值
- 如果只有一个操作值是数值，则将另一个操作值转换为数值，进行数值比较
- 如果一个操作数是对象，则调用valueOf()方法（如果对象没有valueOf()方法则调用toString()方法），得到的结果按照前 面的规则执行比较
- 如果一个操作值是布尔值，则将其转换为数值，再进行比较

注：NaN是非常特殊的值，它不和任何类型的值相等，包括它自己，同时它与任何类型的值比较大小时都返回false。

### 相等操作符（==）
相等操作符会对操作值进行隐式转换后进行比较：

- 如果一个操作值为布尔值，则在比较之前先将其转换为数值
- 如果一个操作值为字符串，另一个操作值为数值，则通过Number()函数将字符串转换为数值
- 如果一个操作值是对象，另一个不是，则调用对象的valueOf()方法，得到的结果按照前面的规则进行比较
null与undefined是相等的
- 如果一个操作值为NaN，则相等比较返回false
- 如果两个操作值都是对象，则比较它们是不是指向同一个对象

需要注意的是一个值转换为另一个值并不代表两个值相等。


## References

* http://webreflection.blogspot.com/2010/10/javascript-coercion-demystified.html
* http://www.yaldex.com/javascript_tutorial_2/LiB0022.html
* http://stackoverflow.com/questions/13266616/primitive-value-vs-reference-value
* http://dailyjs.com/2012/05/07/js101-object/
* http://javascriptweblog.wordpress.com/2010/09/27/the-secret-life-of-javascript-primitives/