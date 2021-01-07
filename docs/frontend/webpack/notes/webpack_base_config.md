---
title: webpack基础配置总结
date: 2020-12-26
tags:
 - JavaScript
 - Webpack
categories:
 - front
---

我们来把之前的基础配置总和到一起：

```javascript
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'js/built.js',
        path: resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/,
                loader: 'url-loader',
                options: {
                    limit: 8 * 1024,
                    name: '[hash:10].[ext]',
                    outputPath: 'imgs'
                }
            },
            {
                exclude: /\.(css|png|less|html)$/,
                loader: 'file-loader',
                options: {
                    name: '[hash:10].[ext]',
                    outputPath: 'media'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    devServer: {
        contentBase: resolve(__dirname, 'build'),
        compress: true,
        port: 3000,
        open: true
    },
    mode: 'development',
}
```

这样我们在打包之后在输出目录里获取到相对应的文件夹及文件。

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

