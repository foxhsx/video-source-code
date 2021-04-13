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

## 脚手架工具常用的包有哪些

那除了上述我们说到的包之外，还有一些其他也常用的包：

- commander - 定义命令，解析命令[文档](https://github.com/tj/commander.js/blob/HEAD/Readme_zh-CN.md#%e5%ae%89%e8%a3%85)

  ::: tip

  安装：`npm install commander`

  页面中使用：

  ```js
  const commander  = require("commander");
  // 定义版本号
  commander.version('1.0.0', '-v --version');
  // 定义指令
  commander.command('init <name>').action(() => {
    // 命令回调，输入命令后，需要做的事情
  
  });
  // 自定义执行
  commander.option('-h', 'cecil`s cli');
  ```

  :::

- inquirer - 做出交互，如提问

- Chalk - 命令行输出有色字体[文档](https://github.com/chalk/chalk#readme)

  ::: tip

  安装：`npm i chalk`

  这个库并不能直接在控制要输出，只是还是结合 `console.log` 来改变文字的颜色或者背景。

  文件中使用：

  ```js
  // 输出字体库
  const chalk = require("chalk");
  // 改变字体的颜色
  console.log(chalk.red.bgBlue('来看看chalk'));
  // 当然我们也可以使用自定义的方法，使用 rgb 和 bgRgb 来设置颜色
  console.log(chalk.rgb(212,99,23).bgRgb(33,44,66)('自定义的颜色'));
  // 我们也可以将其和 ora 来结合起来使用
  const spinner = ora(chalk.rgb(212,99,23).bgRgb(33,44,66)('转起来！')).start();
  ```

  :::

- Ora - loading 效果，图标[文档](https://github.com/sindresorhus/ora#readme)

  ::: tip

  安装：`npm install ora`

  文件中使用：

  ```js
  // loading 库
  const ora  = require("ora");
  // 开始在控制台 loading
  const spinner = ora('加油！').start();
  // 改变转动圆圈的颜色
  spinner.color = 'yellow';
  // 我们可以设置其在两秒之后终止
  setTimeout(() => {
    spinner.stop();
  }, 2000);
  ```

  :::

## 如何自己实现一个 vue-cli

### Vue-cli 属于什么工具？

它是一个项目脚手架，它的作用：

- 下载项目初始化模板
- 定义项目规则
- 定义项目操作命令

### 一个脚手架的工作流程

输入初始化命令 --》 执行交互的 js --》与用户交互 --》根据用户指令下载模板 --> 模板下载成功

- 输入初始化命令之后，当在命令行输入命令的时候，就会去执行一段 JS，这就跟在项目文件里用 node 执行 js 文件是一样的。在执行的过程中，会运用到一些前面说的依赖包，用这些包提供的 API 来跟用户进行交互。然后根据用户指令去下载对应的模板到本地。