---
title: webpack不同环境配置
date: 2021-01-14
tags:
 - JavaScript
 - Webpack
categories:
 - front
---
因为生产环境和开发环境有很大差异，在生产环境中我们强调要以更少量、更高效的代码完成业务功能，也就是注重运行效率。而开发环境中我们是需要注重开发效率的。

[[toc]]

## 不同环境下的配置
我们应该为不同的环境创建不同的配置文件。创建不同环境配置的方式主要有两种：
1. 在配置文件中添加相应的判断条件，根据环境不同导出不同的配置；
2. 为不同的环境单独添加一个配置文件，即一个环境对应一个配置文件。

### 同一个文件
webpack 配置文件还支持导出一个函数，然后在函数中返回所需要的配置对象。这个函数可以接收两个参数，一个是env，是我们通过 CLI 传递的环境名参数，第二个是 argv，是运行 CLI 过程中所有的参数。
```js
// ./webpack.config.js
module.exports = (env, argv) => {
  return {
    // ...webpack 配置
  }
}
```

我们可以借助这个特点，对开发环境和生产环境创建不同的配置。首先我们将不同环境下的公共配置提取出来：
```js
// ./webpack.config.js
module.exports = (env, argv) => {
  // 公共配置
  const config = {
    //...不同环境下的公共配置
  }
  return config
}
```

然后通过判断，为 config 对象添加不同环境下的特殊配置：
```js
// ./webpack.config.js
module.exports = (env, argv) => {
  // 公共配置
  const config = {
    //...不同环境下的公共配置
  }

  if (env === 'development') {
    // 为 config 添加开发模式下的特殊配置
    config.mode = 'development'
    config.devtool = 'cheap-eval-module-source-map'
  } else if (env === 'production') {
    // 为 config 添加生产模式下的特殊配置
    config.mode = 'production'
    config.devtool = 'nosources-source-map'
  }
  return config
}
```

通过这种方式配置完成后，我们再执行 webpack 命令时就可以通过 `--env="环境"` 参数去指定具体的环境名称，从而实现不同环境中使用不同的配置。

### 不同文件
通过判断环境名参数返回不同配置对象的方式只适用于中小型项目，因为一旦项目变得复杂，我们的配置也会一起变得复杂起来。所以对于大型的项目来说，还是建议使用不同环境对应不同配置文件的方式来实现。

一般在这种方式下，项目中最少会有三个 webpack 的配置文件。其中两个用来分别适配开发环境和生产环境，另外一个则是公共配置。因为开发环境和生产环境的配置并不是完全不同的，所以需要一个公共文件来抽象两者相同的配置。
```md
.
├── webpack.common.js ···························· 公共配置
├── webpack.dev.js ······························· 开发模式配置
└── webpack.prod.js ······························ 生产模式配置
```