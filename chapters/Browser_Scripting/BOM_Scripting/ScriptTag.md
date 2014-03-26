# Script Tags

这里详细聊聊和script标签相关的脚本执行顺序。

## Script标签的默认行为

几个首要特性：

* script标签（不带`defer`或`async`属性）的会阻止文档渲染。相关脚本会立即下载并执行。
* `document.currentScript`可以获得当前正在运行的脚本(Chrome 29+, FF4+)
* 脚本顺序再默认情况下和script标签出现的顺序一致

假设如下简单代码[^1]，最终会产生三个alert依次为“A”、“B”、“C”。

    <!-- HTML Code -->
    <script>alert("A");</script>
    <script>alert("B");</script>
    <script>alert("C");</script>


我们再考虑有网络请求的情况[^2]：
    
    <!-- HTML code -->
    <script  src="https://snipt.net/raw/7b08744009c450e07c0bfc1d606fc72e/"></script>
    <script  src="https://snipt.net/raw/a2e8c05c1f6fc0e47d259aa899304e89/"></script>
    <script  src="https://snipt.net/raw/4fab3017d3d46cbfc4bbd88aab006650/"></script>
    
三个文件都需要先下载再运行，且第二个文件的尺寸远大于另外两个文件。但结果依然是弹出三个alert，内容分别是"A"、"B"、"C"。

从上面两个例子，可以充分了解到script标签的柱塞式执行。

## async属性

async属性是HTML5的新特性[^3]，这意味着其兼容性并不乐观（IE10+）。

async表示该script标签并不柱塞，也不同步执行。浏览器只需要在脚本下载完毕后再执行即可——不必柱塞页面渲染等待该脚本的下载和执行。

如下代码[^4]，会得到三个alert，但是alert的内容分别是"A","C","B"。

    <!-- HTML code -->
    <script  src="https://snipt.net/raw/7b08744009c450e07c0bfc1d606fc72e/"></script>
    <script  src="https://snipt.net/raw/a2e8c05c1f6fc0e47d259aa899304e89/" async=true></script>
    <script  src="https://snipt.net/raw/4fab3017d3d46cbfc4bbd88aab006650/"></script>

可以看到，第二个script标签在加入`async`并没有阻止后续文档解析和脚本执行。

考究这个属性产生的原有，其实有大量的脚本加载器在做这样的事情：

```
var script = document.createElement("script");
script.src = "file.js";
document.body.appendChild(script);
```

不难想象，通过脚本异步插入的script标签达到的效果和带async属性的script标签是一样的。换句话说，由脚本插入的script标签默认是async的。

另外，对內联脚本设置async属性是没有意义的，也不产生其他效果。其包含的脚本总是立即执行的。

## defer属性

带有defer属性的脚本，同样会推迟脚本的执行，并且不会阻止文档解析。就如同这个脚本，放置到了文档的末尾（`</body>`之前）。

如下代码[^5]的宏观现象和加了async属性的例子是一样的，都会得到"A"、"C"、"B"的三个alert。但是其原理是不一样的。

    <!-- HTML code -->
    <script  src="https://snipt.net/raw/7b08744009c450e07c0bfc1d606fc72e/"></script>
    <script  src="https://snipt.net/raw/a2e8c05c1f6fc0e47d259aa899304e89/" defer=true></script>
    <script  src="https://snipt.net/raw/4fab3017d3d46cbfc4bbd88aab006650/"></script>

defer属性是会确保脚本在文档解析完毕后执行的——即使这个脚本在文档解析过程中就已经下载完毕变成可执行的状态，浏览器也会推迟这个脚本的执行，直到文档解析完毕[^6]，并在DOMContentLoaded之前[^7]。

同时，带有defer的脚本彼此之间，能保证其执行顺序。

注意，defer属性并不是每个浏览器支持，即便支持的浏览器，也会因为版本不一样导致具体行为不一致。另外，大家可以通过将script标签放置到文档末尾这种简单的做法达到defer属性一样的效果。

defer属性早在IE4就被支持，但是这个defer属性和现代浏览器的行为是有区别的。只有IE10以上，才开始按照标准执行defer属性。

## async与defer的影响

参考W3C的官方文档[^8]，defer和async两个属性是可以互相影响的：

> There are three possible modes that can be selected using these attributes. If the async attribute is present, then the script will be executed asynchronously, as soon as it is available. If the async attribute is not present but the defer attribute is present, then the script is executed when the page has finished parsing. If neither attribute is present, then the script is fetched and executed immediately, before the user agent continues parsing the page.

简单的归纳：

* 仅有async属性，脚本会异步执行
* 仅有defer属性，脚本会在文档解析完毕后执行
* 两个属性都没有，脚本会被同步下载并执行，期间会柱塞文档解析

规范里没有提到两种属性都有时的效果，但这是文档中被允许的。这样的具体效果会在后面讨论。

## document.write的影响

docuemnt.write允许向打开的文档流中写入文档内容；内嵌到HTML里面的docuemnt.write可以就地添加文档内容。考虑到docuemnt.write写入script标签的情况[^9]:

    <!-- HTML code -->
    <script  src="https://snipt.net/raw/7b08744009c450e07c0bfc1d606fc72e/"></script>
    <script>document.write("\<script  src=https://snipt.net/raw/a2e8c05c1f6fc0e47d259aa899304e89 \/\>\<\/script\>");</script>
    <script  src="https://snipt.net/raw/4fab3017d3d46cbfc4bbd88aab006650/"></script>

观察到执行顺序和普通的script标签没有区别。即使你插入的标签带有async或defer，其行为也是没有区别的。

让人纠结的是反过来[^10]使用。由于第二个脚本是通过`document.write`写入的。被延迟的脚本在执行时，document已经关闭，`document.write`是没有任何效果的。所以，不管使用defer还是async，第二个脚本始终没有运行。

## 浏览器兼容性

### defer属性

<iframe src="http://caniuse.com/script-defer/embed/" style="width:100%;" seamless border=0></iframe>

### async属性

<iframe src="http://caniuse.com/script-async/embed/" style="width:100%;" seamless border=0></iframe>

### 测试用例

[^1]: http://jsfiddle.net/nGeZP/
[^2]: http://jsfiddle.net/uPk4z/3/
[^3]: http://www.w3.org/html/wg/drafts/html/master/scripting-1.html#attr-script-async
[^4]: http://jsfiddle.net/6234b/
[^5]: http://jsfiddle.net/P85kR/
[^6]: http://peter.sh/experiments/asynchronous-and-deferred-javascript-execution-explained/
[^7]: https://www.webkit.org/blog/1395/running-scripts-in-webkit/
[^8]: http://www.w3.org/html/wg/drafts/html/master/scripting-1.html#attr-script-defer
[^9]: http://jsfiddle.net/3uEKM/1/
[^10]: http://jsfiddle.net/fV9Sv/