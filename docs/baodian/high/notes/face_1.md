---
title: 面试整理（一）
date: 2021-03-17
tags:
 - 面试
categories:
 - front
---

## 单页与多页应用有什么区别？

::: tip 参考
首先我们先区分开两者的区别：

**单页面应用（SPA）**

时下流行的一种应用模式，只加载一个 html 文件，页面切换其实只是切换组件（页面片段），实际都是在这个页面内部通过动态加载组件来实现页面跳转的效果。从实现上来讲，主要是监听 url 变化，通过路由来动态加载或卸载某些组件。
- 优点
  - 页面切换快，响应更加迅速
  - 相对来说对服务器压力小，因为内容的改变不需要重新加载整个页面
  - 前后端分离，职责更加明确
- 缺点
  - 首屏加载速度慢
  - 不利于 SEO
  - 抛开易上手的 vue 来讲，其他的框架学习成本较高

**多页面应用**

多页面应用更倾向于传统的开发模式，每一次页面跳转的时候，后台服务器都会返回一个新的 html 文档，这种类型的网站就是多页网站，也叫做多页应用。
- 优点
  - 首屏加载速度快——首屏时间叫做页面首个屏幕的内容展现的时间，当我们访问页面的时候，服务器返回一个 html，页面就会展现出来，这个过程只经历了一个 HTTP 请求，所以页面展示的速度非常快。
  - 搜索引擎优化效果好（SEO）——搜索引擎在做网络排名的时候，要根据页面内容才能给网页权重，来进行网页的排名。搜索引擎是可以识别 html 内容的，而我们每个页面所有的内容都放在 html 中，所以这种多页应用的SEO效果是很好的。
- 缺点
  - 页面切换慢——这个相对于SPA来说是肯定的，因为它的每次跳转都需要发出一个 http 请求，如果网络比较慢，在页面之间来回跳转，就会有明显的卡顿。
:::

## 如何处理单页应用首次加载较慢问题

::: tip 参考
**分析问题**

首先单页应用首次加载慢的原因是什么？

单页应用只有一个空的 html，剩下的都是使用 js 去控制，所以在首屏加载时，会把 js 加载完之后，再等 js 执行完毕，才会显示出相应的内容出来。这就导致了单页应用首屏加载慢的问题。那么对于小型项目来说，可能不明显，因为打包出来的 vendor.js 也不会很大，但是对于一些中大型项目来说，会引许多第三方库，都就会导致打包之后的包体积会很大，首页加载 js 会花费很多时间，而执行 js 也是需要时间。

这里对于首屏应用加载慢的优化可以做以下几点：
1. 做分包处理，不要将所有的 js 文件都打包到一起去，使用 webpack 的分包功能，将 js 分成不同的部分，按需加载；
2. 路由懒加载（本质上也是分包处理）；
3. 使用 CDN 加速；
4. 做SSR服务端渲染；
:::

## ajax 和 fetch、asios 的区别

::: tip 参考
**Ajax**

我们说的 Ajax 是 `Asynchronous JavaScript and XML` 的缩写，意思是异步网络请求。区别于传统 web 开发中采用的同步方式。

Ajax 带来的最大影响就是页面可以无属性的请求数据。

传统 web 请求方式：

![](../imgs/CS_web.png)

使用 Ajax 后请求：

![](../img/../imgs/ajax_web.png)

**实现一个 ajax 请求**

在现代浏览器上实现一个 ajax 请求：

```js
var request = new XMLHttpRequest();  // 创建 XMLHttpRequest 对象

// ajax 是异步的，设置回调函数
request.onreadystatechange = function () {  // 状态发生变化时，函数被回调
  if (request.readyState === 4) {  // 成功完成
    // 判断响应状态码
    if (request.status === 200) {
      // 成功，通过 responseText 拿到响应的文本
      return success(request.responseText)
    } else {
      // 失败，根据响应码判断失败原因
      return fail(request.status)
    }
  } else {
    // HTTP 请求还在继续...
  }
}

// 发送请求
request.open('GET', '/api/details')
request.setRequestHeader('Content-Type', 'application/json')  // 设置请求头
request.send()  // 到这一步，请求才正式发出
```

实际项目中我们还是会采用一些封装好的库来使用，原生方法比较繁琐，比如经典的 jQuery 就有封装好的 ajax 方法，而且很好的解决了浏览器兼容的问题。

**axios**

其实 axios 并不是一种新的技术。它是基于 Promise 用于浏览器和 nodejs 的 HTTP 客户端，本质上也是对原生 XHR 的封装，只不过它是 Promise 的实现版本，符合最新的 ES 规范，有以下特点：
- 从浏览器中创建 XMLHttpRequests
- 从 nodejs 创建 http 请求
- 支持 Promise API
- 拦截请求和响应
- 转换请求数据和响应数据
- 取消请求
- 自动转换 JSON 数据
- 客户端支持防御 XSRF

在浏览器支持性上：

![](../imgs/broswer.png)

axios 在兼容性上只对现代浏览器友好，对于版本较低的浏览器不支持。

因为 axios 设计简洁，API 简单，支持浏览器和 node，所以现在已经被广泛使用。

**fetch**

fetch 是前端发展的一种新技术产物。

Fetch API 提供了一个 JavaScript 接口，用于访问和操纵 HTTP 管道的部分，例如请求和响应。它还提供了一个全局 fetch() 方法，该方法提供了一种简单、合理的方式来实现跨网络异步获取资源。

这种功能以前是使用 XMLHttpRequests 实现的。Fetch 提供了一个更好的替代方法，可以很容易地被其他技术使用。例如 Serive Workers。Fetch 还提供了单个逻辑位置来定义其他 HTTP 相关概念，例如 CORS 和 HTTP 的扩展。

在使用 fetch 的时候需要注意：
- 当接收到一个代表错误的 HTTP 状态码时，从 fetch() 返回的 Promise 不会被标记为 reject，即使该 HTTP 响应的状态码是 404 或 500.相反，它会将 Promise 状态标记为 resolve （但是会将 resolve 的返回值的 ok 属性设置为 false）。仅当网络故障或者请求被阻时，才会标记为 reject。
- 默认情况下，fetch 不会从服务端发送或接收任何 cookies，如果站点依赖于用户 session，则会导致未经认证的请求（要发送 cookies，必须设置 credentials 选项）。

来看个例子：

```js
fetch('http://example.com/movies.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
  });
```

fetch代表着更先进的技术方向，但是目前兼容性不是很好，在项目中使用的时候得慎重。
:::

## v-for 与v-if 哪个先加载

首先我们来说一下 `v-for` 和 `v-if` 可不可以同时在一个元素上使用？

在官网中我们可以看到这样一个提示：
::: tip TIP
注意，我们**不**推荐在同一元素上使用 `v-for` 和 `v-if`。
:::

所以这里是不推荐，但是不表示 `v-for` 和 `v-if` 不能同时使用。在实际项目中，如果二者同时使用，`v-for` 的优先级是大于 `v-if` 的，来看一段代码：

```vue
<template>
  <div class="about">
    <ul>
      <!-- eslint-disable-next-line vue/no-use-v-if-with-v-for -->
      <li v-for="item in list" :key="item" v-if="showLi">111</li>
    </ul>
  </div>
</template>

<script>
beforeCreate() {
  console.log(this.$options.render);
  // var render = function() {
  //   var _vm = this
  //   var _h = _vm.$createElement
  //   var _c = _vm._self._c || _h
  //   return _c("div", { staticClass: "about" }, [
  //     _c(
  //       "ul",
  //       _vm._l(_vm.list, function(item) {
  //         return _vm.showLi ? _c("li", { key: item }, [_vm._v("111")]) : _vm._e()
  //       }),
  //       0
  //     )
  //   ])
  // }
},
</script>
```

在这里 `_vm._l` 是渲染列表相关的函数，那可以看到的是，当二者同一级时，会先渲染数组，然后在内层再去判断是否渲染某一项。这对于性能而言是不友好的，在一些组件级别的渲染上会消耗很大的内存。

我们修改一下这里的代码，将 `v-for` 和 `v-if` 隔离开：

```vue
<template>
  <div class="about">
    <ul>
      <template v-if="showLi">
        <li v-for="item in list" :key="item">111</li>
      </template>
    </ul>
  </div>
</template>

<script>
beforeCreate() {
  console.log(this.$options.render);
  // var render = function() {
  //   var _vm = this
  //   var _h = _vm.$createElement
  //   var _c = _vm._self._c || _h
  //   return _c("div", { staticClass: "about" }, [
  //     _c(
  //       "ul",
  //       [
  //         _vm.showLi
  //           ? _vm._l(_vm.list, function(item) {
  //               return _c("li", { key: item }, [_vm._v("111")])
  //             })
  //           : _vm._e()
  //       ],
  //       2
  //     )
  //   ])
  // }
},
</script>
```

可以看到的是，我们会先判断 v-if 里的条件，然后再去渲染 list。

那有人就会问了，这只是一种场景，还有一种场景就是内层有 if 判断怎么办呢？官网也给出了解决的办法，比如此时我们有一组数据 list，在渲染之前，我们定义一个计算属性 computed，如下：

```vue
<template>
  <div class="about">
    <ul>
        <li v-for="item in activeList" :key="item">111</li>
    </ul>
  </div>
</template>

<script>
  computed: {
    activeList() {
      return this.list.filter(item => item > 2)
    }
  }
</script>
```

这样的话，等同于我们提前将 `v-if` 的判断写在了外层，只渲染筛选出来的数据，这样就使得渲染更加的高效。

就如同官网所说，我们会获得以下好处：
- 过滤后的列表只会在数组发生相关变化时才重新计算，过滤更高效。
- 使用计算属性将其过滤之后，我们只渲染活跃用户，渲染会更加高效。
- 解耦渲染层的逻辑，可维护性更强。

## vue的 get 与 set 方法区别及使用

::: tip 参考

:::

## 深拷贝浅拷贝

::: tip 参考
我们平常说的深拷贝和浅拷贝都是基于对对象的拷贝，而这个拷贝又分为浅拷贝和深拷贝。

**浅拷贝**

浅拷贝其实可以理解为赋值，将对象地址的引用赋值。这个时候修改对象中的属性或者值，会导致所有引用这个对象的值改变。
1. 赋值——最基础的赋值方式，只是将对象的引用赋值。
2. Object.assign()
```md
Object.assign() 是 ES6 里的新函数。
```

**深拷贝**

在内存空间中重新生成一个对象，
:::

## Object.keys()

## Object.assign()

## 原生的绑定事件的方法有几种

## 对 Typescript 有多少了解

## foreach和map的区别

