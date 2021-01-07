---
title: webpack之插件
date: 2021-01-07
tags:
 - JavaScript
 - Webpack
categories:
 - front
---

[[toc]]

webpack 插件机制的目的是为了增强 webpack 在项目自动化构建方面的能力。

我们常见的几种应用场景有：

- 实现自动打包之前删除 dist 目录；
- 自动生成应用所需要的HTML文件；
- 根据不同环境为代码注入类似API地址这种可能变化的部分；
- 拷贝不需要参与打包的资源文件到输出目录；
- 压缩 webpack 打包完成后的输出文件；
- 自动发布打包结果到服务器实现自动部署。

## 体验插件机制

### 自动清除输出目录的插件

webpack 每次打包的结果都是直接覆盖到 dist 目录。而在打包之前，dist 目录中就可能已经存入了一些在上一次打包操作时遗留的文件，当我们再次打包时，只能覆盖掉同名文件，而那些已经移除的资源文件就会一直累积在里面，最终导致部署上线时出现多余文件，这显然非常不合理。

那么最好是每次打包都把上次的 dist 目录删除，这样每次打出来的包就是最新的，而不会有其他积累的无用的、废弃的文件。

**clean-webpack-plugin**这个插件很好的实现了这一需求。我们先来安装一下：

```sh
npm install clean-webpack-plugin --save-dev
```

然后，我们回到 webpack 的配置文件中，导入 clean-webpack-plugin 插件，这个插件模块导出了一个 CleanWebpackPlugin 的成员，我们先把它解构出来。

```javascript
// ./webpack.config.js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js'
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
}
```

这样我们再次打包的时候，就会看到之前的包会被自动删掉了。最后的 dist 包就是本次打包的产物。

一般来说，当我们有了某个自动化的需求之后，可以先去找到一个合适的插件，最后将它配置到 webpack 配置对象的 plugins 数组中，这个过程唯一有可能不一样的地方就是有的插件会需要配置一些配置参数。

### 用于生成 HTML 的插件

除了自动清理 dist 目录，我们还有一个非常常见的需求，就是自动生成使用打包结果的 HTML，所谓使用打包结果指的是在 HTML 中自动注入 webpack 打包生成的 bundle。

为什么要使用这个插件？

1. 在没有使用插件之前，我们的HTML文件一般都是通过硬编码的形式，单独存放在项目根目录下的，这样的话，在项目发布时，我们需要同时发布根目录下的 HTML 文件和 dist 目录中所有的打包结果，非常麻烦，而且上线过后还要确保 HTML 代码中的资源文件路径是正确的。
2. 如果打包结果输出的目录或者文件名称发生变化，那 HTML 代码中所对应的 script 标签也需要我们手动修改路径。

解决这两个问题最好的办法就是让 Webpack 在打包的同时，自动生成对应的 HTML 文件，让 HTML 文件也参与到整个项目的构建过程。这样的话，在构建过程中，Webpack 就可以自动将打包的 bundle 文件引入到页面中。

那么它的优势就很明显：

1. HTML 也能输出到 dist 目录中，上线时我们只需要把 dist 目录发布出去就可以了；
2. HTML 中的 script 标签是自动引入的，所以可以确保资源文件的路径是正常的。

那么实现这一需求的插件就是——html-webpack-plugin。同样需要单独安装这个模块：

```sh
npm install html-webpack-plugin --save-dev
```

安装完成之后，去配置文件进行引入：

```javascript
// ./webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin()
    ]
}
```

