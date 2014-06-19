# IE CSS Bugs

IE不是一个完美的浏览器，在IE还是主流浏览器的时候，这些bug让Web开发者痛不欲生。

以下这些臭名昭著的bug整理自[PositionIsEveryThing](http://www.positioniseverything.net/)，这里做简单的中文翻译和解释。

## 无法隐藏的内容

这个bug和利用JavaScript操纵CSS相关。影响范围：

* IE6
* IE7
* IE8的兼容模式

触发条件是非常简单，有一个简单的容器元素，容器内有一个任意内容元素。然后：

1. 将容器和内容都设置一个`position`（`aboslute`或者`relative`）
2. 将容器设置为`display:none`
3. 将内容设置为`display:none`
4. 将容器设置为`display:block`
5. 你会发现内容竟然没有隐藏，而是显示的的。

在线演示： http://www.positioniseverything.net/explorer/ienondisappearcontentbugPIE/index.htm


## 无法正常渲染的`noscript`标签

如果你为`noscript`标签设置了带有可是效果的属性，例如`border`、`padding`。当浏览器有JavaScript执行能力时，这些可视效果也依然存在。

影响对象：

* IE8

在线演示：http://www.positioniseverything.net/explorer/ie8stylednoscriptbug/index.html

## 浮动容器的双倍边距

这是非常有名的bug了，影响对象：

* IE5
* IE6


CSS样例：

```
.float-container {
  float: left;
  width: 150px;
  height: 150px;
  // 注意这里左边距只有100px
  margin: 5px 0 5px 100px;
}
```

HTML样例：

```
<div class="float-container">
Float
</div>
```

你很容易重现这个bug，最终效果是该容器产生了200px的左边距，而不是100px。这种双倍边距的产生条件就是当边距和浮动的方向一致，而且这个现象只发生在第一个浮动元素。

虽然有一些奇怪的方法可以去绕过这个bug，我更情愿去修改我的CSS来绕过这个bug:

1. 将float和margin分开到两个元素（产生额外的标签）
2. 将浮动元素设置为`display:inline`（但有时你可能需要`block`啊……）

在线演示： http://www.positioniseverything.net/explorer/doubled-margin.html

## 重复字符

当两个浮动元素之间有以下任意元素：

1. HTMl注释
2. 隐藏域
3. 任何`display:none`的元素


并且，两个浮动元素满足任一：

1. 单个容器宽度等于容器宽度（或宽度差小于3px）
2. 在同一行内，两者宽度之和等于容器宽度（或宽度和与容器宽度之差小于3px）

就会造成IE凭空制造出一个新元素，并且这个元素的内容是从第二个浮动元素的末尾截取的。这些多出来的字符的长度有一些规律，大家可以自行玩耍。


影响范围：

* IE6


## 被撑开的容器

假设一个容器被设定了宽度或高度，内容的溢出（overflow)部分不会显示在容器的外部（默认值`visible`），但不影响容器的尺寸。

但是对于IE6，容器会被撑开。有很多元素都会造成这个问题：

1. 一个很长的URL字符串
2. 一副很大的图片

可以用`overflow:hidden`来快速解决这个问题，但是溢出部分会被彻底隐藏起来。


## Guillotine bug

这是一个非常容易复现的bug。在IE7中也没有完全修复。复现过程：

1. 一个容器；这个容器没有采用任何clearfix
2. 容器内有一个浮动的元素，例如`div`
3. 浮动元素的后面跟随了不少非浮动内容，但这些内容的可视高度低于浮动元素
4. 这些内容中包含多个链接。并且链接的`:hover`状态下设置了`background`、`padding`等改变效果的样式。
5. 鼠标移过这些链接有可能导致容器被剪裁

在线演示： http://www.positioniseverything.net/explorer/guillotine.html

修复办法：

1. 若这个浮动元素不该包裹在容器元素内，可以在容器后方放置一个带有`clear:both`的元素
2. 若这个元素应该包裹在容器元素内，可以对容器采用clearfix


## 错误的浮动模型

如果在容器内，有两个元素：

1. 第一个元素是浮动的，并且有长宽
2. 第二个元素是静态的，并且有长宽

正确的渲染方式，应该会是：

* 浮动元素叠在静态元素之上
* 两个元素都紧贴父元素的左边缘


但是IE6、IE7将两个元素并列显示。并且在IE6下，两个元素之间还有3px的间距。

在线演示：http://www.positioniseverything.net/explorer/floatmodel.html

这个bug目前没有很好的解决方法。只能避免，或者为IE专门写样式。


## 3px文本缩进

当容器内有一个浮动元素以及紧跟其后的文本时，文本的会有3px的缩进。受影响的文字时在浮动元素的高度之内的相关行，其他的文字不受影响。这个只在IE6中出现。

在线演示：http://www.positioniseverything.net/explorer/threepxtest.html

没有很好的解决办法，可以通过IEHack为后续元素给一个`-3px`的边距。


## 包含斜体字的容器会被错误的渲染

包含斜体字的块级元素的宽度会多一些，这些多出来的长度和字体有关。

在线演示：http://www.positioniseverything.net/explorer/italicbug-ie.html

可以利用IE的hasLayout特性去解决：添加`zoom:1`。


## 表单元素会错误的继承边距

当在表单内嵌套容器时：

1. 父容器有边距
2. 子容器有hasLayout，例如设置了宽度等
3. 子容器包含text input、textarea、image时，这些自元素会继承父容器的margin。如果有多次嵌套带有边距的容器，margin数值会累加。

这个问题还是比较好修复的:

1. 不要让表单元素成为这些“问题”容器的直接子孙
2. 设定负数的margin
3. 去掉父元素的hasLayout
4. 将表单元素前面放置一些inline元素
5. 用span、label元素包裹表单元素

在线演示：http://www.positioniseverything.net/explorer/inherited_margin.html


## line-height渲染错误

在IE6中，当段落里包含可变元素（replaced elememnts），例如img, input, textarea, object等，包含这些元素的那一行的line-height不能正确的渲染。具体行为时，相关行的与其前后行的`half-leading`，也就是半间距产生了“坍塌”减半。

例如，`line-height: 100px`，在字体为16px的段落中，每行应该有84px的间距，但被错误渲染的相关行只有42px的间距。

在线演示： http://www.positioniseverything.net/explorer/lineheightbug.html

这个bug没有直接的修改方法，需要写特定版本的iehack。


## 边框渲染错误

在IE6中，当连续的块级容器包含边框时，假若第二容器有负数的边距值，边框会被错误的渲染，而且这些错误时毫无规律的。

在线演示：http://www.positioniseverything.net/explorer/border-chaos.html

最好的解决方法就是避免这么做。


## 列表元素上消失的背景色

在IE6中，当父元素有浮动并且相对定位时，内部的列表元素的背景色可能会消失。

在线演示：http://www.positioniseverything.net/explorer/ie-listbug.html

这个bug很可怕，但是修复起来也比较容易：

```
ul, dl, ol {
  position: relative;
}
```

## 消失的滚动条

在IE6中，如果满足如下条件：

1. 当父元素是相对定位的，并且没有给定的长宽
2. 父容器中有一个或者多个绝对定位的子容器
3. 子容器中的内容足以让浏览器产生滚动条

事实上，滚动条并没有出现。


## 浮动元素造成的多余缩进

当容器内有如下文档流：

1. 一个右浮动元素，并带有一个左边距
2. 紧跟随后一段文本

在IE6中，文本会的第一行会产生一个和浮动元素左边距数值一样的缩进。而且该行为也是对称的，也就是说当右浮动元素有左边距时，问题同样出现。

当文本有其他元素嵌套时，该bug不出现。

在线演示：http://www.positioniseverything.net/explorer/floatIndent.html

修复方式可以将浮动元素添加`display:inline`。


## 清除浮动错误

在IE6中，当一个容器内有多个给定尺寸的浮动元素，并且在末尾包含一个`clear:both`的元素作为清除浮动。那么：

1. 容器并没有被正确的清除浮动；容器只会包含最后一排浮动的子元素
2. 页面产生滚动条；滚动条的大小根据浮动内容和窗口尺寸发生变化

在线演示：http://www.positioniseverything.net/explorer/creep.html

## 文字被错误的缩进

在IE6中，嵌套的父子元素，其中父元素满足：

```
.outer {
  border-left: 1px solid red;
  padding-bottom: 1px;
}
```

当有有多组这样的嵌套时（多于两次），子容器内的文字会产生左缩进，数值为父容器边框宽度的两倍。

这个bug有对对称性，也就是右边框也会产生问题。

可以使用zoomfix让父容器带有hasLayout解决这个问题。

在线演示：http://www.positioniseverything.net/explorer/creep.html
