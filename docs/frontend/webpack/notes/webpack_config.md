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
const path = require('path');

function resolve(pathUrl) {
  return path.resolve(__dirname, pathUrl)
}

module.exports = {
  // 入口--多入口
  entry: {
    home: './src/views/home/index.js'
  },
  // 输出
  output: {
    path: resolve('dist'),
    filename: '[name].[chunkhash].js',
    publicPath: '/'
  },
  resolve: {
    alias: {
      '@': resolve('src')
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

