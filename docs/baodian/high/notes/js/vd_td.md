---
title: 虚拟DOM和真实DOM的区别
date: 2021-03-26
tags:
 - JavaScript
 - 面试
categories:
 - front
---

要说起 `虚拟DOM` 和 `真实DOM` 二者的区别，我们首先来大概了解一下什么是虚拟DOM，什么是真实DOM？

## 虚拟DOM

虚拟DOM，说简单一点，其实就是一个 JavaScript 对象，里面包含了 `tag props children` 三个属性。它最大的优势除了我们熟知的用 diff 算法，减少 JavaScript 操作真实 DOM 带来的性能消耗之外，更主要的还是它**抽象了原本的渲染过程，实现了跨平台的能力，而不仅仅局限于浏览器的DOM，还可以是安卓和IOS的原生组件，也可以是小程序**。

来看个例子：

```html
<div id="app">
  <p class="name">Hello World!</p>
</div>
```

转为虚拟 DOM 以后：

```js
{
  tag: 'div',
  props: {
    id: 'app'
  },
  children: [
    {
      tag: 'p',
      props: {
        className: 'name'
      },
      children: [
        'Hello World!'
      ]
    }
  ]
}
```

这个就是我们常说的虚拟 DOM 了，因为 DOM 是树形结构，所以使用 JavaScript 对象就能很形象的来表示。真实 DOM 即使创建一个空的 div 也要付出昂贵的代价。虚拟 DOM 提升性能的点就在于 DOM 发生变化时，先通过 diff 算法比对 JavaScript 原生对象，计算出需要变更的 DOM，然后只对变化的 DOM 进行操作，而不是更新整个视图。

## 真实DOM

什么是 DOM？我们说 DOM 是 document object model 的简称，也就是 DOM 翻译成中文就是 **文档对象模型**，那它有什么用？

我们平常所说的 DOM 其实大部分还是在指 HTML DOM，它是：
- HTML 的标准对象模型
- HTML 的标准编程接口
- W3C 标准
