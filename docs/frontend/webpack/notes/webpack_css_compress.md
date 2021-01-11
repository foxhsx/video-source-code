---
title: webpack之css压缩
date: 2021-01-09
tags:
 - JavaScript
 - Webpack
categories:
 - front
---

css 压缩，是前端打包中比不可少的部分，因为压缩过后的代码，体积会较之前小很多。

那么对于 css 压缩，也是一件很简单的事情，只需要引入一个插件即可。

```sh
npm i optimize-css-assets-webpack-plugin -D
```

安装完成之后，只需要在配置文件中引入即可：

```js
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
    ...
    plugins: [
        new OptimizeCssAssetsWebpackPlugin()
    ]
    ...
}
```

这里呢，我们不需要再去配置其他东西，因为 OptimizeCssAssetsWebpackPlugin 这个插件的默认配置已经足够我们去使用了。

再次执行 webpack 命令可以看到，打包后的 css 被压缩成了一行，而大小也成了 825 bytes；而在未使用压缩之前的大小为 976 bytes。