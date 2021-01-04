---
title: webpack快速配置
date: 2020-12-12
tags:
 - JavaScript
categories:
 - front
---

我们以多页面为例配置webpack.

1. 首先新建一个webpack.config.js配置文件，然后先引入 webpack 和 path，因为这两个我们待会儿就要用到。
2. 使用对象的方式配置多文件入口
3. 配置输出到当前目录下的 dist 文件中，用 path.resolve 做拼接，输出的文件名是 chunk 名加 chunkhash，这样可以做到缓存上的一个优化。
4. mode 暂时写为 development.
5. 接下来就是对文件内部进行一些资源配置。
   1. css
   2. html
   3. image
   4. 其他
6. 先将热替换插件用上，后面讲。
7. 安装 webpack-dev-server，[关于版本匹配问题看这篇](./webpack与dev)
8. 先写上基础的配置。
9. 因为项目里有用 scss，所以安装 sass-loader、node-sass、css-loader、style-loader，loader的执行是从右向左的，所以这里的意思是先执行sass，然后是css，最后是style。而且只有装了这些 loader 才能在 js 中去import css。
10. 由于图片的关系，这里也要使用 file-loader
11. 解析配置 resolve，使用里面的 alias 配置项，可以配置路径简写。——我们把 path.resolve封装成一个方法来调用。

```javascript
const webpack = require('webpack');
const { resolve } = require('path');

module.exports = {
  // 入口--多入口
  entry: {
    home: './src/views/home/index.js'
  },
  // 输出
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    open: true,
    hot: true,
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader','css-loader', 'sass-loader']
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: 'file-loader'
      }
    ]
  }
}
```

现在把 package.json 中的 scripts 中添加一项：

```json
"scripts": {
    "dev": "webpack-dev-server"
}
```

然后在命令行中跑一下：

```sh
npm run dev
```

需要注意的是，在最新的版本中（**webpack5**），启动方法改为了：

```javascript
webpack serve
```

且由于兼容问题，html-webpack-plugin插件的版本为：

```json
{
    "html-webpack-plugin": "^5.0.0-alpha.9",
}
```

### 让配置文件支持智能提示

默认 VSCode 并不知道 Webpack 配置对象的类型，我们通过 import 的方式导入 Webpack 模块中的 Configuration 类型，然后根据类型注释的方式将变量标注为这个类型，这样我们在编写这个对象的内部结构时就可以有正确的智能提示了，具体代码如下所示：

```javascript
// webpack.config.js
import { Configuration } from 'webpack'
/**
* @type {Configuration}
*/

const config = {
	entry: './src/index.js',
    output: {
        filename: 'bundle.js'
    }
}
module.exports = config
```

需要注意的是：我们添加的 import 语句只是为了导入 Webpack 配置对象的类型，这样做的目的是为了标注 config 对象的类型，从而实现智能提示。在配置完成后一定要记得注释掉这段辅助代码，因为在 Node.js 环境中默认还不支持 import 语句，如果执行这段代码会出现错误。

使用 import 语句导入 Configuration 类型的方式固然好理解，但是在不同的环境中还是会有各种各样的问题，例如我们这里在 Node.js 环境中，就必须要额外注释掉这个导入类型的语句，才能正常工作。

虽然我们这里只是一个 JavaScript 文件，但是在 VSCode 中的类型系统都是基于 TypeScript 的，所以也可以直接在类型注释中使用 import 动态导入类型。

```javascript
// ./webpack.config.js
/** @type {import('webpack').Configuration} */
const config = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'
  }
}
module.exports = config
```

