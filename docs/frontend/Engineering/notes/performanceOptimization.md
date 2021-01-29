---
title: 性能优化介绍
date: 2021-01-21
tags:
 - JavaScript
 - Webpack
 - 前端工程化
categories:
 - front
---

首先webpack的性能优化，我们可以概括归纳为两种：

- 开发环境性能优化
- 生产环境性能优化

## 开发环境性能优化

- 优化打包构建速度
  - [HMR](../../webpack/notes/hot_update)
- 优化代码调试
  - [source-map](../../webpack/notes/webpack_sourceMap)

## 生产环境新能优化

- 优化打包构建速度
  - [oneOf](../../webpack/notes/webpack_loader.html#oneof)
  - [babel缓存](./Cache.mdl#babel-loader)
  - [多进程打包](../../webpack/notes/webpack_thread)
  - [externals](../../webpack/notes/webpack_externals.md)
  - [Dll](../../webpack/notes/webpack_dll.md)
- 优化代码运行的性能
  - [cache](./Cache.html#cache-loader)
  - [Tree Shaking](../../webpack/notes/treeShakingAndSideEffects)
  - [Code Split](../../webpack/notes/webpack_CodeSplitting)
  - [懒加载/预加载](./lazyLoading.md)
  - [pwa](./PWA.md)

