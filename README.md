# Programing in Javascript


**An open-sourced Javascript Guide and Tutorial**

**Javascript编程语言; 一本开源的Javascript编程指南**

[阅读入口](http://pij.robinqu.me/)

## Buildbot


`master`分支是书籍的工程项目，运用Grunt和一些自任务来完成转译、上传等任务。

安装依赖
```
npm install
npm install grunt-cli -g
```

### 转译任务（Markdwon转换为HTML）

```
grunt build
```
输出文件将会保存在`dist`目录。

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