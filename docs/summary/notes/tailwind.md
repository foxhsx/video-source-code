---
title: TailwindCSS 的安装及使用
date: 2021-04-25
tags:
 - CSS
categories:
 - front
---

```js
npm install tailwindcss@1.9.6 -S
```

安装完成以后，你还使用不了，这里我们需要使用命令再生成一个 `tailwind.config.js`，可以使用命令生成一个默认的：

```js
npx tailwindcss init -full
```

然后再在 `postcss.config.js` 中去加入两个插件，一个是 `tailwind`，一个是 `autoprefixer`：
```js
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ],
};
```

这里需要注意的是 `autoprefixer` 的版本不能过高，我们可以下载 `8.0.0` 版本的。

配置完成之后我们再从 VSCode 的插件中心下载几个插件，来提高我们的开发效率。