---
title: 前端模块化发展史
date: 2020-12-31
tags:
 - Webpack
categories:
 - front
---

我们说 webpack 最初的目标就是实现前端项目的模块化，那今天咱们就来看看前端模块化的发展史。

[[toc]]

## 文件划分方式

最早的方式是通过文件划分来实现模块化，也就是 web 最原始的模块系统。具体做法是将每个功能及其相关状态数据各自单独放到不同的 JS 文件中，约定每个文件是一个独立的模块。使用某个模块将这个模块引入到页面中，一个 script 标签对应一个模块，然后直接调用模块中的成员（变量/函数）。

```md
└─ stage-1
    ├── module-a.js
    ├── module-b.js
    └── index.html
```

```javascript
// module-a.js 
function foo () {
   console.log('moduleA#foo') 
}
```

```javascript
// module-b.js 
var data = 'something'
```

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Stage 1</title>
</head>
<body>
  <script src="module-a.js"></script>
  <script src="module-b.js"></script>
  <script>
    // 直接使用全局成员
    foo() // 可能存在命名冲突
    console.log(data)
    data = 'other' // 数据可能会被修改
  </script>
</body>
</html>
```



## 命名空间方式

## IIFE

## IIFE 依赖参数

## 模块加载的问题

## 模块化规范的问题

## 模块化的标准规范

## ES Modules 特性

## 模块打包工具的出现

