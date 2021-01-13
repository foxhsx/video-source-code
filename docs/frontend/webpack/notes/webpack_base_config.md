---
title: webpack基础配置总结
date: 2021-01-14
tags:
 - JavaScript
 - Webpack
categories:
 - front
---

首先，还是 webpack 的五大核心要素：

```js
const { resovle } = require('path')

module.exports = {
    // 入口
    entry: './src/index.js',
    // 出口配置
    output: {
        filename: 'js/bundle.js',
        path: resovle(__dirname, 'dist')
    },
    // loader 配置
    module: {
        rules: []
    },
    // 插件
    plugins: [],
    // 模式
    mode: 'development'
}
```

入口和出口配置，我们先按单页面应用配置，就上面代码块中的配置即可。然后接下来我们来配置 loader 预处理器。

1. 首先是 CSS

   ```js
   {
       test: /\.css$/,
       use: [
           'style-loader',
           'css-loader'
       ]
   }
   ```

2. 然后是 less 预处理语言

   ```js
   {
       test: /\.less$/,
       use: [
           'style-loader',
           'css-loader',
           'less-loader'
       ]
   }
   ```

3. eslint

   在 package.json 中添加 eslintConfig，才能生效，而这里我们使用的规则是 airbnb。

   而且这里要排除 node_modules 里的内容，并且**优先级**要高于 babel-loader，因为 eslint 是做语法检查的，如果语法错误，那就不用再往下了，而且 babel 是做语法转换的，会把 ES6转成ES5，这个时候再去做eslint ，就会报错，比如提示你不要使用 var 关键字。

   优先级处理使用 `enforce: 'pre'` 来使其生效。

   我们还可以在配置选项里添加 fix ，让其自动修复出现的问题。

   ```js
   {
       test: /\.js$/,
       exclude: /node_modules/,
       enforce: 'pre',
       loader: 'eslint-loader',
       options: {
           fix: true
       }
   }
   ```

4. babel

   那在 babel 这里呢，同上我们先排除 node_modules 里的内容，然后预设转译的插件时，我们首先用了 `@babel/preset-env` ，但是这个只能做一些简单的语法操作，而对于复杂的，比如 Promise，就不能做到从 ES6 到 ES5了，所以我们还需要做一些其他配置：

   - useBuiltIns——按需加载
   - corejs——指定 core-js 版本
   - targets——指定兼容性做到哪个版本的浏览器

   ```js
   {
     test: /\.js$/,
     exclude: /node_modules/,
     loader: 'babel-loader',
     options: {
         // 预设
         presets: [
             [
                 '@babel/preset-env',
                 {
                     useBuiltIns: 'usage',
                     corejs: { version: 3 },
                     targets: {
                         chrome: '60',
                         firefox: '50'
                     }
                 }
             ]
         ]
     }
   },
   ```

5. 图片

   我们在这里做了一些额外的配置：

   - limit——图片大小限制在8KB。大于8KB就不做处理
   - name——给图片进行重命名——hash长度限制10位，ext 取原来的扩展名
   - outputPath——输出到指定目录里
   - esModule——关闭 url-loader 的 es6 模块化，使用commonjs 解析

   ```js
   {
       test: /\.(jpg|png|gif)$/,
       loader: 'url-loader',
       options: {
           limit: 8 * 1024,
           name: '[hash:10].[ext]',
           outputPath: 'imgs',
           esModule: false
       }
   }
   ```

6. html中的图片

   只是做了上述配置也是不行的，因为它只会包 css 文件里的图片，如果是页面 img 标签里的图片，就需要做以下的配置。

   ```js
   {
       test: /\.html$/,
       loader: 'html-loader'
   }
   ```

7. 其他文件

   其他不需要做处理的文件，只需要原封不动的输出出去就可以了。

   ```js
   {
       exclude: /\.(html|js|css|less|png|jpg|gif)$/,
       loader: 'file-loader',
       options: {
           outputPath: 'media'
       }
   }
   ```

再就是咱们的插件——plugins了：

1. 提取css

   安装并引入插件，并在 plugins 配置项里实例化插件，配置打包后的文件及文件名。

   ```js
   const MiniCssExtractPlugin = require('mini-css-extract-plugin');
   
   new MiniCssExtractPlugin({
     filename: 'css/build.css'
   }),
   ```

2. 压缩css

   ```js
   new OptimizeCssAssetsWebpackPlugin()
   ```

   没有过多的配置，直接实例化即可。

3. HTML处理

   我们提前做一个 html 模板，在生成 html 的时候使用它，并且开启 HTML 压缩——minify，配置去除空格和注释选项。

   ```js
   new HtmlWebpackPlugin({
         template: './src/index.html',
         minify: {
           // 去除空格
           collapseWhitespace: true,
           // 去除注释
           removeComments: true
         }
       })
   ```

最后的mode，就是当前的模式，我们先写成 development。

汇总一下，就直接贴代码了：

> 注意，因为这里我们会把 css 文件单独提取出来，所以后续又做了 Loader 相关的修改。
>
> 正常来讲，一个文件只能被一个 loader 处理，当一个文件要被多个 loader 处理，那么一定要指定 loader 执行的先后顺序

```js
// ./webpack.prod.config.js

const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 定义nodejs 环境变量：决定使用 browserslist 的哪个环境
process.env.NODE_ENV = 'development';

const commonCssLoader = [
  // 提取成单独文件
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    // 还需要在 package.json 中定义 browserslist
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      plugins: () => {
        require('postcss-preset-env')()
      }
    }
  }
]

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/bundle.js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [...commonCssLoader]
      },
      {
        test: /\.less$/,
        use: [
          ...commonCssLoader,
          'less-loader'
        ]
      },
      /**
       * 正常来讲，一个文件只能被一个 loader 处理，
       * 当一个文件要被多个 loader 处理，那么一定要指定 loader 执行的先后顺序
       *   先执行 eslint ，再执行 babel，因为 eslint 是做语法检查的，如果语法错误，
       * 那就不用再往下了，而且 babel 是做语法转换的，会把 ES6转成ES5，这个时候再去做
       * eslint ，就会报错，比如提示你不要使用 var 关键字
       */
      {
        // 在 package.json 中添加 eslintConfig  --> airbnb
        test: /\.js$/,
        exclude: /node_modules/,
        // 优先执行的意思
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          // 自动修复出现的问题
          fix: true
        }
      },
      {
        // 在 package.json 中添加 eslintConfig  --> airbnb
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          // 预设
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: 'usage',
                corejs: { version: 3 },
                targets: {
                  chrome: '60',
                  firefox: '50'
                }
              }
            ]
          ]
        }
      },
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          name: '[hash:10].[ext]',
          output: 'imgs',
          esModule: false
        }
      },
      {
        // HTML 中的图片问题
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        // 处理其他文件
        exclude: /\.(js|css|less|html|jpg|png|gif)$/,
        // 原封不动的输出文件
        loader: 'file-loader',
        options: {
          // 让输出的目录到 media下去
          outputPath: 'media'
        }
      }
    ]
  },
  plugins: [
    // 提取 css
    new MiniCssExtractPlugin({
      filename: 'css/build.css'
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        // 去除空格
        collapseWhitespace: true,
        // 去除注释
        removeComments: true
      }
    })
  ],
  mode: 'development',
  devServer: {
      contentBase: resolve(__dirname, 'dist'),
      port: 3000,
      compress: true,
      open: true
  }
};

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

