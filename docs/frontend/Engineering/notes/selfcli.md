---
title: 自制vue-cli工具
date: 2021-04-12
tags:
 - Node
categories:
 - front
---

今天的问题链有三：

- 如何利用 Node 操作命令行
- 脚手架工具常用的包有哪些
- 如何自己实现一个 vue-cli

## 如何利用 node 操作命令行

问题：

> 我们运行 npm run build 执行了什么？

其实我们在 `package.json` 文件里可以看到这几行代码：

```json
"scripts": {
  "dev": "webpack dev server",
  "start": "npm run dev",
  "build": "node build/build.js"
}
```

也就是说，执行命令的时候，在电脑上使用 node 执行了 build 目录下的 build.js 而已。

我们来看一个 build.js 文件：

```js
'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

// 一个打包进度条，提示正在打包中
const ora = require('ora');
// nodejs 不能直接读取或者删除一个文件夹，这个库是帮助我们删除文件夹的
const rm = require('rimraf')
// node 内置的路径处理模块
const path = require('path')
// 在命令行中显示字体颜色的模块
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('./config')
const webpackConfig = require('./webpack.prod.conf')

// 开启进度条
const spinner = ora('building for production...')
spinner.start()

// 实际这行代码意思就是会先删除掉 dist 目录
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  // webpack 本质就是一个方法，在命令行执行和在代码中调用 webpack 方法本质是一样的
  webpack(webpackConfig, (err, stats) => {
    // 关闭进度条
    spinner.stop()
    // 有错误抛出
    if (err) throw err
    // 以下都是往线程中写了一堆的消息
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false, // 
      chunks: false,
      chunkModules: false
    }) + '\n\n')
    
    if (stats.hasErrors()) {
      console.log(chalk.red('Build failed with errors.\n'))
      process.exit(1)
    }
    
    console.log(chalk.cyan('Build complete.\n'))
    console.log(chalk.yellow(
    	'Tip: built files are meant to be served over an HTTP server.\n' +
      'Opening index.html ober file:// won\'t work.\n'
    ))
  })
})
```

那有了这个之后，我们还可以在这个基础上去添加拓展一些其他功能，比如再添加一些其他信息，或者使用 dll 优化等等。

> dll 先打包第三方库的文件，然后再打包项目本身

::: tip 小知识

在命令行直接输入 webpack 和在 package.json 中定义一个脚本命令执行 webpack 有什么不同？

1. 在命令行直接输入 webpack 是使用全局的 webpack 来打包的。
2. 而在 package.json 中则是利用项目本身的 webpack 来进行打包的。

:::

那除了上述我们说到的包之外，还有一些其他也常用的包：

- commander - 定义命令，解析命令
- inquirer - 做出交互，如提问
- Chalk - 命令行输出有色字体
- Ora - loading 效果，图标

## 脚手架工具常用的包有哪些

## 如何自己实现一个 vue-cli

