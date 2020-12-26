---
title: webpack打包html资源
date: 2020-12-21
tags:
 - JavaScript
 - Webpack
categories:
 - front
---

[[toc]]

## **下载插件**

```sh
npm i html-webpack-plugin -D
```

然后在 webpack.config.js 中去引入插件，引入的插件实际上是一个构造函数，我们在使用时，在对应的 plugins 配置项里去new一个实例出来，再在里面添加需要的配置即可。

```javascript
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    ...
    plugins: [
       // html-webpack-plugin
        // 功能：默认会创建一个空的 HTML，自动引入打包输出的所有资源（js/css）
        // 需求：需要有结构的 HTML 文件——加 template 配置
        new HtmlWebpackPlugin({
            // 复制对应的 html 文件，并自动引入打包输出的所有资源（js/css）
            template： './src/index.html'
        })
    ]
    ...
}
```

打包输出之后会发现，打包的目录里会多出来 html 文件，并且此文件是以 `./src/index.html` 为模板的。