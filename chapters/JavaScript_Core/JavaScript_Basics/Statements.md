# JavaScript语句

语句就是JavaScript的整句或者命令。JavaScript的语句是以；结束的。

## 表达式语句

表达式语句是JavaScript中最简单的语句：
例如：

    greeting = "Hello" + name;
    i *= 3;
    counter++;

这些都是简单的赋值语句。赋值语句是一类比较重要的表达式语句。
 delete运算符一般作为语句使用，而不是复杂表达式的一部分：

    delete o.x;

函数调用是表达式语句的另一个大类，例如：

    alert(greeting):
    window.close();

## 复合语句和空语句

JavaScript中可以将多条语句联合在一起，形成一条符合语句，只须用花括号将多条语句括起来：

    {
	    x = Math.PI;
	    cx = Math.cos(x);
    }

这样的语句块有几点需要注意的：
 
 * 语句块的结尾不需要分号。
 * JavaScript没有块级作用于，所有在语句中声明的变量并不是语句块私有的。

在JavaScript中，当希望多条语句被当做一条语句使用时，使用复合语句来替代。空语句则恰好相反，它允许包含0条语句。空语句如下所有：
 
    ；

空语句有时很有用处例如：

    for(i=0; i<a.length; a[i++]=0);

这里需要注意的是，在for循环，while循环或if语句在右圆括号后面的分号很不起眼，这很可能造成一些致命bug,而且这些bug很难定位，例如：

    if((a == 0) || (b == 0));//这行代码什么都没做。 

    0 = null; //这行代码总会执行。

## 声明语句

var和function都是声明语句。

var语句用来声明一个或者多个变量，声明的可以带有初始化表达式，用于指定变量的初始值，例如：

    var i；

    var j = 0;

    var p, q;

    var greeting = "hello" + name;

    var x = 2, y = x*x;

如果var语句出现在函数体内，那么它定义的是一个局部变量，其作用域就是这个函数，如果在顶层代码中使用了var语句，它声明的是全局变量，在整个JavaScript的程序中都可见的。全局变量是全局对象的属性。然而和其他全局对象属性不同的是， var声明的变量是无法通过delete删除的。

如果var语句中的变量没有指定初始化表达式，那么这个变量的初始值就是undefined,变量在声明他们的脚本或者函数中都有定义的，变量声明语句会被“提前”至脚本或者函数的顶部。但是初始化的操作还是在原来var语句的位置执行，在声明语句之前变量的值是undefined。例如：

    for(var i=0; i<10; i++); //var i; 会被提前到整个函数的顶部

function用来定义函数。例如：

* var f = function(x) { return x+1; } //将表达式赋值给一个变量
* function f(x) { return x+1; } //含有变量名的语句

## 条件语句

条件语句是通过判断指定表达式的值来决定执行还是跳过某些语句。

下面介绍JavaScript基本条件语句，例如if/else, switch。

if语句是一种基本的控制语句，这种语句有两种形式，第一种是：

    if (expresion)
        statement
在这种形式中， 需要计算expression的值，如果计算结果是真值， 那么就执行statement。如果expression的值是假值，那么就不执行statement。

if语句的第二种形式引进了else从句，当expression的值为false的时候，执行else中的逻辑：
   
    if (expression)
        statement1
    else
        statement2
和大多数的编程语言一样，JavaScript中的if, else匹配规则是，else总是和就近的if语句匹配。

if/else语句通过判断一个表达式的计算结果来选择执行两条分支中的一条。当代码中有多条分支，一种解决办法是使用else if语句。else if语句并不是真正的JavaScript语句，它只是多条if/else语句连在一起的一种写法。

    if( n == 1 ) {
       执行代码块 1
    }
    else if(n == 2) {
       执行代码块 2
    }
    else if(n == 3) {
       执行代码块 3
    }
    else {
      之前的条件都为false, 则执行这里的代码块 4
    }

像这样的有多条分支的情况， else if 不是最佳的解决方案。switch语句正适合处理这种情况。关键字switch之后紧跟着圆括号括起来的一个表达式，随后是一对花括号括起来的代码块：
    
    switch(expression) {
        statements
    }

switch语句的完整语法要复杂一些，代码中可以使用多个由case关键字标识的代码片段，case之后是一个表达式和一个冒号，当执行这条switch语句的时候，它首先计算expression的值，然后查找case子句的表达式是否和expression的值相同（按照“＝＝＝”比较）。如果找到匹配的case,那么将会执行这个case对应的代码块。如果找不到匹配的case.那么将执行default标签的代码。

注意的是，通常情况下case语句结尾处使用关键字break.break语句可以使解释器跳出switch语句或循环句。如果没有break语句，那么switch语句就会从与expression的值相匹配的case标签处的代码块开始执行，依次执行后续的语句。

如果switch表达式与所有case表达式都不匹配，则执行标识为default的语句块，如果没有default标签，则switch的整个语句块都将跳过。

## 循环

循环语句就是程序路径的一个回路，可以让一部分代码重复执行。 JavaScript中有4种循环语句： while, do/while, for和for/in。

while语句是一个基本的语句，它的语法如下：

    while (expression)
        statement

在执行while语句之前,JavaScript解释器首先计算expression的值， 如果它的值是假值，那么程序就跳过循环体中的逻辑statement转而执行程序中的下一个语句。反之，则执行statement.

通常来说，我们并不想让JavaScript反复执行同一操作。在几乎每一次循环中，都有一个或多个变量随着循环的迭代而改变，如果这些变量在expression中用到，那么每次循环表达式的值也不同。这一点非常重要。

循环最常用的用法就是用来遍历数组例如：

    var a[10] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var i = 0;
    while(i < 10) {
        console.log(a[i]);
        i++;
    }

do/while循环和while循环非常相似，只不过它是在循环的尾部而不是在顶部检测循环表达式，这就意味着循环体至少会执行一次：

    do
        statement
    while (expression);

do/while循环并不像while那么常用。

for语句提供了一种比while语句更加方便的循环控制结构。语法：

    for(initialize; test; increment)
        statement

initialize, test和increment三个表达式之间用分号分隔，他们分别负责初始化操作，循环条件判断和计数器变量的更新。

由于for语句的特点,for语句比while语句更适合遍历数组：

     var a[10] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
     for(var i = 0; i < 10; i++) {
         console.log(a[i]);
     }

for/in语句也使用for关键字，但它是和常规的for循环完全不同的一类循环。语法：

    for (variable in object)
        statement

variable通常是一个变量的名，也可以使一个可以产生左值的表达式或一个通过var语句声明的变量，object是一个表达式，这个表达式计算的结果是一个对象。for/in 循环用来方便的遍历对象属性成员：
    
	for(var p in o ) {
        console.log(o[p]);
    }

for/in循环并不会遍历对象所有属性，只有“可枚举”的属性才会遍历到。由JavaScript语言核心所定义的内置方法就不是“可枚举的”，例如所有对象都有方法toString().

## 跳转

JavaScript中另一类语句是跳转语句。例如break语句是跳转到循环或者其他语句的结束。 continue语句是终止本次循环的执行并开始下一次循环的执行。JavaScript中的语句可以命名或带有标签，break和continue可以标识目标循环或者其他语句标签。

return语句让解释器跳出函数体的执行， 并提供本次调用的返回值。throw语句触法或者"抛出"一个异常，他是与try/catch/finally语句一通使用的。

语句是可以添加标签的，标签是由语句前的标识符和冒号组成：

    identifier: statement

JavaScript中允许break关键字后面跟随一个语句标签：

    break labelname;

当break和标签一块使用时，程序将跳转到这个标签所标识的语句块的结束，或者直接终止这个闭合语句块的执行。 如果没有这个闭合语句块，就会产生一个语法错误。

单独使用break语句的作用是立即退出最内层的循环或switch语句。如果希望通过break来跳出非就近的循环体或者switch语句时，就会用到带标签的break语句.

continue语句和break语句非常类似，但它不是退出循环， 而是转而执行下一次循环。

函数中的return语句既是指定函数调用后的返回值。

    return expression;

return语句只能出现在函数体内。如果没有return语句，调用表达式的结果是undefined

JavaScript中，当产生运行时错误或者程序使用throw语句时就会显示地抛出异常。使用try/catch/finally语句可以捕获异常，

throw语句的语法：
   
    throw expression;

expression的值可以是任意类型的。JavaScript解释器抛出的异常的时候通常采用Error类型和其子类型，例如：
    
    function factorial(x) {
       if(x < 0) throw new Error("x不能是负数")；
       for(var f = 1; x > 1; f *= x, x--);
       return f;
    }

Error中有几个比较重要的属性 比如name 错误的名称 message 错误的信息 stack 错误发生时调用堆栈。

常见的几种Error类型：

    SyntaxError： 语法错误，无法通过解释器
    RangeError: 数值超出范围
    TypeError: 变量的类型不是预期的
    ReferenceError: 引用不可用

当抛出异常时， JavaScript解释器会立即停止当前正在执行的逻辑，并跳转到就近的异常处理程序。异常处理程序是用try/catch/finally语句的catch从句编写的。

try/catch/finally语句是JavaScript的异常处理机制。其中try从句定义了需要处理的异常所在的代码块。 catch从句跟随在try从句之后， 当try块内某处发生了异常时，调用catch内的代码逻辑。 catch从句后跟随finally快，后者中放置清理代码。不管try块中是否产生异常，finally块内的逻辑总是会执行。

## 其他语句

这里讨论三种JavaScript语句 with, debugger和 use strict

with语句用于临时扩展作用域链，语法：
    
    with (object)
    statement

这条语句将object添加到作用域链的头部，然后执行statement，最后把作用域链恢复到原始状态。

通常情况不推荐使用with语句。一般可以使用with语句来简化代码编写。例如：

    with(document.forms[0]) {
        name.value = "";
        address.value = "";
        email.value = "";
    }

debugger语句，用来产生一个断点，代码的执行会停在断点的位置，这时使用调试器来输出变量的值。