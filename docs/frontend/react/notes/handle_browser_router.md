---
title: 手写 BrowserRouter、Route 和 Link
date: 2021-03-05
tags:
 - JavaScript
 - React
categories:
 - front
---
我们来手动实现一下 BrowserRouter、Router、Route 和 Link。

首先我们在项目 src 目录中新建一个文件夹 `react-router-dom-nut`，然后在里面创建一个 BrowserRouter.js：
```js
import React, { Component } from 'react'

export default class BrowserRouter extends Component {
  render () {
    return this.props.children
  }
}
```
这里其实就是我们说的 Router，那它的本质实际上就是渲染子组件，所以我们这里只需要 return 掉 props 中的 chilren 即可。

接下来就是 Link.js：
```js
import React from 'react'

export default function Link (/* props 解构 */{ to, children, ...restProps }) {
  render () {
    return (<a href={ to } {...restProps} >{ children }</a>)
  }
}
```
这个也很简单了，直接返回一个 a 标签，然后将传进来的属性赋值即可。

再然后是 Route.js，这个组件实际就是做了 props 的传递：
```js
import React, { Component } from 'react'

export default class Route extends Component {
  render () {
    const { path, component } = this.props;
    const match = window.location.pathname === path;  // 是否匹配
    return match ? React.createElement(component) : null
  }
}
```

最后创建 index.js 进行导入导出：
```js
import Link from './Link'
import Route from './Route'
import BrowserRouter from './BrowserRouter'

export {
  Link,
  Route,
  BrowserRouter
}
```