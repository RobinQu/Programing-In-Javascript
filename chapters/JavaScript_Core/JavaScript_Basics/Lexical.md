
# JavaScript的词法结构

## 字符集

JavaScript程序是用Unicode字符集。支持地球上几乎所有在用的语言。

    var π = 3.14;

JavaScript是区分大小写的语言的。需要注意的是,HTML并不区分大小。

    online 与 Online 在JavaScript是不同的，在HTML是相同的。

JavaScript会忽略程序中标识之前的空格。多数情况下也会忽略换行符。这样我们可以通过空格和换行，保持整齐，一致的编码风格。需要注意的是，如果当前语句和随后的非空格字符不能当成一个整句，JavaScript不会忽略换行符而是在语句行结束处填补分号。例如：

    var a
    a
    =
    3
    console.log(a)
JavaScript将其解析为：

    var a; a = 3; console.log(a);

在有些计算机硬件和软件里，无法显示或输入Unicode字符全集。为了支持那些使用老旧技术的程序员，JavaScript定义了一种特殊序列，使用6个ASCII字符代表任意16位Unicode内码，一般为转义序列均以\u为前缀，其后跟随4个十六进制数

    é // \u00E9

## 注释

JavaScript支持两种格式的注释：
   
    //这里是单行注释
    /*这里是一段注释*/

## 直接量

所谓直接量，就是程序中直接使用的数据值：

    12 //数字
    1.2 // 小数
    "hello world" // 字符串
    'Hi'// 字符串
    true // 布尔值
    false // 另一个布尔值
    /javascript/gi //正则表达式直接量

## 标识符

标识符就是一个名字，在JavaScrpt中，标识符用来对变量和函数进行命名

* JavaScript标识符必须以字母，下划线或者美元符开始
    
    var _secret, $dom;

* 后续的字符可以使字母，数字，下划线或美元符

    var _1234567, __super_secret__, _$;

* 通常使用ASCII字符

    var iVar;

## 保留字

常用的保留字

    break delete case do catch else continue false debugger finally default for function return typeof if switch var in this void instanceof throw while new true with null try

ECMAScript 5 的保留字

    class const enum export extends import super

在严格模式下的保留字

    implements let private public yield interface package protected static

ECMAScript 3, 保留了java语言中所有的关键字

    abstract double goto boolean enum implements byte export import char extends int class final interface const float long native static package super private synchronized protected throws public transient short volatile

预定义的全局变量

    arguments encodeURI Infinity Array encodeURIComponent isFinite Boolean Error isNaN Date eval JSON decodeURI EvalError Math decodeURIComponent Function NaN Number Object parseFloat parseInt RangeError ReferenceError RegExp String SyntaxError TypeError undefined URIError

## 分号

* 当没有分号就无法解析代码时，把换行符当成一个分号
* 当换行符的下一个非空字符无法解释为语句的延续时，把换行符当成一个分号
* 如果一条语句以 (, [, /, +, or -开头, 可能会被解释为是之前语句的延续
* 两个例子
  * 如果一个换行符后面没有任何字符，JavaScript会把它解释为分号

            function() {
             return
             1;
            }

      
  * ++ 和 −− 操作符
      * 必须与他们的表达式在同一行
      * 否则, 换行符会被当成是分号, ++ 或者 -- 会被解析为前缀的操作符在之后的代码上。
