---
title: webpack配置之optimization
date: 2021-01-31
tags:
 - JavaScript
 - Webpack
categories:
 - front
---

 那么对于 optimization 来说，是要对生产环境做一些优化的配置，所以我们一般会在生产环境也就是 `mode: production` 时使用它。

- optimization
  - splitChunks：代码分割
    - chunks：
    - minSize：30 * 1024，分割的 chunk 最小体积为30KB
    - maxSize：0，最大没有限制
    - minChunks：1，要提取的 chunk 最少被引用1次
    - maxAsyncRequests：5，按需加载时并行加载的文件的最大数量
    - maxInitialRequests：3，入口 js 文件最大并行请求数量
    - automaticNameDelimiter：'~'，名称连接符
    - name: true，可以使用命名规则
    - cacheGroups：分割 chunk 的组
      - 