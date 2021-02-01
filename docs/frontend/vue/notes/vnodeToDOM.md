---
title: vnode到真实DOM是如何转变的
date: 2021-02-01
tags:
 - JavaScript
 - Vue
categories:
 - front
---

- 在 Vue.js 中，组件是一个非常重要的概念，整个应用的页面都是通过组件渲染来实现的，但是它内部是如何工作的？
- 从我们编写组件开始，到最终真实的 DOM 又是怎样的一个转变过程？

## 组件

组件是一个抽象的概念，它是对一颗 DOM 树的抽象。

比如我们在页面中写一个组件节点：

```html
<helloworld></helloworld>
```

它并不会在页面上渲染一个 helloworld 标签，它具体渲染成什么，取决你里面的模板。

比如组件内部是这样的：

```html
<template>
  <div>
  	<p>
    	Hello World    
    </p>    
  </div>
</template>
```

那在页面中 helloworld 组件就会渲染成 div 里包含一个 p 标签，标签内容是 Hello World 文本。

