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
那它的本质实际上就是渲染子组件，所以我们这里只需要 return 掉 props 中的 chilren 即可。

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

现在基础架子我们已经搭建起来了，接下来就是去挨个儿优化它们，让其逐渐丰满起来。

## BrowserRouter
```js
import React, { Component } from 'react'
import { createBrowserHistory } from 'history'

export default class BrowserRouter extends Component {
  constructor(props) {
    super(props)
    this.history = createBrowserHistory()  // 创建 history 对象
  }
  render () {
    return this.props.children
  }
}
```

那之前说过除了 BrowserRouter 还有 HashRouter 等，那本质上都是基于 Router 的，都是把逻辑都放到 Router 里去，只是说 history 这个参数不同。那这样的话我们可以再新建一个 Router.js：
```js
// ./Router.js
import React, { Component } from 'react'

export default class Router extends Component{
  constructor(props) {
    super(props);
    this.state = {}
  }
  render() {
    return this.props.children;
  }
}
```
此时有一个问题是，我们如何将 Router 中的数据传递到 Link 和 Route 等组件中去？由于不知道嵌套层级，所以也不能冒然使用 props 去传递。但是有一点是我们可以确定的，那就是 Link 和 Route 都是 Router 的子组件，既然如此，我们可以考虑使用数据的跨层级传递来实现。

再新建一个 RouterContext.js：
```js
import React from 'react';

// 使用 context 对象做数据跨层级传递
// step1：创建 context 对象
export const RouterContext = React.createContext()

// step2：使用 context 对象的 provider 传递 value  --->  在 Router 中使用

// step3: 子组件使用 value
// 三种方式：Consumer、useContext、contextType
```

修改一下 Router.js，对应我们说的第二步：
```js
// ./Router.js
import React, { Component } from 'react'
import { RouterContext } from './RouterContext'

export default class Router extends Component{
  constructor(props) {
    super(props);
    this.state = {
      location: props.history.location  // 初始值是 props 中 history 的 location
    }

    // 监听路由变化--自带 listen 监听方法
    this.unlisten = props.history.listen((location) => {
      this.setState({ location })
    })
  }

  // 我们在使用监听的同时，也需要在组件销毁时将监听也取消掉
  componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten()
    }
  }

  render() {
    return <RouterContext.Provider
      value={{
        history: this.props.history,
        location: this.state.location
      }}
    >
      {
        this.props.children
      }
    </RouterContext.Provider>
  }
}
```
通过 RouterContext.Provider 来接收传进来的 props，并将 history 传递下去。location 也是如此，我们这里将 location 传递下去主要是为了在监听路由变化之后，更新对应组件内容。

那接下来，就可以在对应的子组件中去使用了，比如我们在 Link.js 中去使用：
```js
// ./Link
import React from 'react'
import { RouterContext } from './RouterContext'

export default function Link (/* props 解构 */{ to, children, ...restProps }) {
  // 调用 useContext()
  const context = React.useContext(RouterContext)
  const handleClick = e => {
    e.preventDefault();
    context.history.push(to)
  }

  render () {
    return (<a href={ to } {...restProps} onClick={handleClick}>{ children }</a>)
  }
}
```

当然，我们不光是要关注 Link，还需要关注 Route，当 location 发生变化时，我们需要实时去改变对应的组件，那这就需要接收到从 RouterContext.Provider 传递下来的 location 了。
```js
// ./Route
import React, { Component } from 'react'
import { RouterContext } from './RouterContext'

export default class Route extends Component {
  render () {
    return <RouterContext.Consumer>
      {
        context => {
          const { location } = context;
          const { path, component } = this.props;
          const match = location.pathname === path;  // 是否匹配
          /**
           * 匹配时：children >  component > render > null
           * 不匹配时：children && typeof children === 'function' > null
          */
          return match ? React.createElement(component) : null
        }
      }
    </RouterContext.Consumer>
  }
}
```

创建完之后，BrowserRouter 就可以这样去写：
```js
import React, { Component } from 'react'
import { createBrowserHistory } from 'history'
import Router from './Router'

export default class BrowserRouter extends Component {
  constructor(props) {
    super(props)
    this.history = createBrowserHistory()
  }
  render () {
    return <Router history={this.history} chilren={this.props.children} />
  }
}
```