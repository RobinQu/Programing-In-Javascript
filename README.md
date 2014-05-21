[![Programing in Javascript](https://raw.githubusercontent.com/RobinQu/Programing-In-Javascript/master/lib/template/images/logo.png)](http://pij.robinqu.me/)

这是一本开源的Javascript编程指南。内容从最简单的语法基础，到复杂的框架编写、项目自动化，都有覆盖。这本开源书籍大致分为三个部分：Javacsript核心基础、浏览器编程、NodeJS环境编程。也希望大家能共同编写！

阅读入口： http://pij.robinqu.me/

## Buildbot

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)


`master`分支是书籍的工程项目，运用Grunt和一些自任务来完成转译、上传等任务。

安装依赖

```
npm install
npm install grunt-cli -g
```

### 转译任务

```
grunt build
```

Markdwon转换为HTML。输出文件将会保存在`dist`目录。

### 发布任务

前置任务为`build`任务。


```
grunt publish
```

由于发布是发布到该git repo，非contributor是无法发布成功的。

### 预览任务

开启开发服务器，预览生成后的结果。

```
grunt preview
```



## Contributions

非常欢迎大家一起来写完这本书！请直接联系我来获取合作。

* Email: robinqu@gmail.com
* Weibo: @ELFVision

有两方面大家可以来帮忙：

* 来抓bug：文章勘误、演示代码更正等等
* 补充内容
  * 对于某个主题，你希望添加内容
  * 或者你觉得你可以自主写一些相关主题
  * 或是你已经写过相关主题，我也很希望能够直接收录优秀的好文章！

大家也可以直接Fork项目，然后通过PullRequest来提交任何修改。