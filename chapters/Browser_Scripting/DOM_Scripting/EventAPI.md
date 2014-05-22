# Event接口

事件机制无时无刻伴随着JavaScript开发。在浏览器环境里有各种各样的事件。正是这些事件驱动着脚本的运行。

JavaScript的事件机制也是一个标准的观察者模式（Observer Pattern）的应用。通过抽象出订阅者（Subscriber）和发布者（Publisher）来达到接偶某个事物的目的。这样一种普遍的设计模式，不仅仅可以用在DOM里的事件机制，应用程序的脚本也可以构建自己的事件模型，产生自定义的事件来推动应用程序的进行，例如`Backbone.Event`就是一种常见的EventEmitter实现，它允许任何对象进行事件派发，而不局限于DOM中的文档元素。

作为浏览器中最完善也是最复杂的DOM事件，自然是JavaScript程序员首先要掌握的。

## DOM事件概述

### EventTarget和节点元素

DOM内的事件传播（或事件派发）总是沿着其文档节点和其附元素所构成的有序列表进行的。

在应用JavaScript进行DOM编程时时，事件的产生源头很多，同时，事件的订阅也存在多种形式。从事件源头看，拥有能够接受事件DOM事件的对象，都实现了`EventTarget`接口。下面这三个方法，大家应该都不陌生。

```
EventTarget.addEventListener ()
EventTarget.removeEventListener ()
EventTarget.dispatchEvent ()
```

DOM内的文档元素，大多都有如下的继承状态:

```
EventTarget -> Node -> |-> Element -> HTMLElement -> ...
                       |-> Document
                       |-> ...
```

如上所述，大多素我们获取的节点，都是有相关的事件方法的。但由于历史原因，有大量DOM0时期（即没有标准化）的代码，可以使用以下两种办法注册事件监听：

* 通过HTML属性

        <button onclick="alert('Hello world!')">

* 通过DOM元素属性

        myButton.onclick = function(event){alert('Hello world');};


### 事件派发

事件可以通过调用`EventTarget.dispatchEvent()`进行派发，浏览器自己也需要遵循该方法的行为自动派发相应事件。整个事件派发的流程如下：

首先，浏览器实现要决定时间对象的传播路径。事件传播路径是事件将要通过的节点组成的有序列表。在DOM里面，这个事件传播路径的最后一点就是事件对象（Event Target）本身，其之前的元素就是事件对象的祖先元素。

![Event Flow](eventflow.png)

关于事件派发的路径，有两个特性：

1. 一旦这个传播路径被确定，即使后续的操作改变了文档结构，也不会影响这个有序列表中的内容，更不会影响事件的派发

2. 事件处理函数（callback、handler、subscriber）的处理过程中出现了没有捕获的异常，也不会影响事件的派发

事件派发的过程，本身有三个阶段：

1. 捕获阶段(capture phase)
2. 目标阶段(target phase)
3. 冒泡阶段(bubble phase)

一个事件对象有很多相关的属性，来标记这三个阶段的状态，例如`Event.bubbles`描述一个事件是否可以经历冒泡阶段，`Event.eventPhase`来描述正在传播的这个事件正处于哪个阶段。
 
一个事件对象也有相关的方法对事件传播产生影响，例如`Event.stopPropagation()`会阻止事件的继续传播。

接着，浏览器实现会确定派发路径上每个对象所拥有的事件监听者(event listeners)。此时确定的监听者列表，在后续的操作中也不会被改变。

最后，浏览器实现会按照如下三个条件来决定向哪些事件监听者派发事件：

1. 事件对象没有调用`Event.stopImmediatePropagation()`来立刻停止事件传播
2. 该监听者的确注册在这个事件传播阶段(event pahase)
3. 该监听者的确注册了这个类型的事件(event type)

当一个事件完成了所有传播周期后，它的`Event.currentTarget`必须设置为`null`，`Event.eventPhase`必须为0。事件的其他属性保持不变。

事件派发是可递归产生的，如果在事件处理函数中，浏览器被要求派发新的事件，新产生的事件派发会被同步执行，并且只有在新的事件派发完毕后，之前的事件传播才会继续。

### 事件的默认行为

可以被阻止的事件（`Event.preventDefault()`），通常包含有一些浏览器默认行为。当事件被取消，这些默认行为会被抛弃。有一些事件的默认行为是在事件传播之前就执行了的，那么这些行为所产生的后果将被重置。事件的`Event.cancelable`描述该事件是否可以被取消；事件的`Event.defaultPrevented`描述一个事件的默认行为是否已经被阻止。如果一个事件是有脚本派发的，那么`EventTarget.dispatchEvent`方法的返回值也会反应这个事件是否被阻止执行默认行为。

激活事件（Activataion event）是有用户操作或者另外一个事件连带触发的一种事件。激活事件本身比较抽象，而且大多数浏览器都不支持，但是它和时间的默认行为相关。

例如，当用户在已经聚焦(Focused)的链接上敲击`Enter`键，那么页面会跳转或重新定位。此时，激活事件的触发者(Activation Trigger)是`keydown`事件，激活行为(Activation Behavior)是链接的跳转。

有趣的是，当激活事件并不是由一个`click`事件产生的，那么激活事件的默认行为会产生一个模拟的`click`事件，来描述一个鼠标的左键点击。即，除了`keypress`事件之外，还会产生一个`click`事件。

想象一下语音控制和触屏交互下的网页浏览场景，这样的做法是有道理的，也保证了大代码的兼容性。

### 可信事件

有用户交互DOM本身发生变化所产生的事件是可信事件。由`DocumentEvent.createEvent()`方法创建的事件、`Event.initEvent()`方法初始化的事件、`EventTarget.dispatchEvent()`方法派发的事件以及合成事件都是不可信的。事件的`Event.isTrusted`描述一个事件是否可信。大部分不可信事件不允许触发默认行为，`click`事件和`DOMActivate`事件除外。

## 事件模块

常见事件分类

### UIEvent

### MouseEvent和WheelEvent

### KeyboardEvent

### CompositionEvent

### 其他事件

* InputEvent
* FocusEvent

### 自定义事件



## 参考文档

* http://www.w3.org/TR/DOM-Level-3-Events
* http://www.w3.org/html/wg/drafts/html/master/webappapis.html#event-handler-attributes