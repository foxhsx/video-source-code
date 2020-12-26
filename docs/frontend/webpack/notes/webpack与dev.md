---
title: webpack-cli与webpack-dev-server版本
date: 2020-12-11
tags:
 - JavaScript
categories:
 - front
---

在使用webpack的时候，我们会遇到webpack-cli与webpack-dev-server两个之间版本不匹配的问题，然而又对两个版本之间哪两个相匹配一头雾水，这里其实我们在启动webpack-dev-server的时候，如果出现不匹配的问题，会明确给我们指出来，我们只要顺着去找就OK了。

比如现在我启动webpack-dev-server的时候报错了，报错信息如下：

<img src="../imgs/webpack_dev_error.png" />

可以看到，提示在 node_modules目录下的 webpack-dev-server 中有一个bin目录，而正是这个目录里的 webpack-dev-server.js 文件里的第65行抛出的错误，那么我们进入到这个文件中去查看一下：

<img src="../imgs/cli_version.png" />

简直一目了然有没有，我的天，重新安装 webpack-cli，开搞！

那么webpack-dev-server的作用是为了什么呢？

1. 在没有使用 webpack-dev-server 之前，每次修改源代码都需要重新执行一遍打包命令，效率很低
2. 想在更改代码后即可在网页上看到最新的修改效果
3. 避免每次修改源代码都要进行打包和手动刷新页面
4. 帮助开发者自动打包
5. 自动编译，自动打开浏览器，自动刷新浏览器

::: tip

**特点**：只会在内存中编译打包，不会有任何输出。

:::

我们称它为开发服务器，在配置文件中是这样的：

```javascript
module.exports = {
    ...
    devServer: {
        // 运行项目目录，即构建后的目录
        contentBase: resolve(__dirname, 'build'),
        // 启动 gzip 压缩
        compress: true,
        port: 3000,
        open: true
    }
    ...
}
```

如果是本地安装，那么启动的时候输入：

```sh
npx webpack-dev-server
```

这样进程不会结束，会监听源码的改变而刷新页面。当退出服务后，进程结束，内存中的内容被删除。