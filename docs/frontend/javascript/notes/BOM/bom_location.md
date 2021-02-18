---
title: BOM对象之location
date: 2021-02-18
tags:
 - JavaScript
categories:
 - front
---

![](../../imgs/bom_location.png)

## Location 对象

location 提供了当前窗口中加载文档的信息，以及通常的导航功能。它独特的地方在于：**既是 window 的属性，又是 document 的属性——window.location 和 document.location 指向同一个对象**。

它不仅保存着当前加载文档的信息，也保存着把 URL 解析为离散片段后能够通过属性访问的信息。

假设浏览器当前加载的 URL 是 `http://foouser:barpassword@www.wrox.com:80/WileyCDA/?q=javascript#contents`。那么 location 对象的内容如下表所示：

| 属性              | 值                                                       | 说明                                                        |
| ----------------- | -------------------------------------------------------- | ----------------------------------------------------------- |
| location.hash     | "#contents"                                              | URL散列值，如果没有则为空字符串                             |
| location.host     | "www.wrox.com:80"                                        | 服务器名及端口号                                            |
| location.hostname | "www.wrox.com"                                           | 服务器名                                                    |
| location.href     | "http://www.wrox.com:80/WileyCDA/?q=javascript#contents" | 当前加载页面的完整 URL。location 的 toString 方法返回这个值 |
| location.pathname | "/WileyCDA/"                                             | URL 中的路径和文件名                                        |
| location.port     | "80"                                                     | 请求的端口。如果 URL 中没有端口，则返回空字符串             |
| location.protocol | "http:"                                                  | 页面使用的协议。通常是 "http:" 或 "https:"                  |
| location.search   | "?q=javascript"                                          | URL 的查询字符串。这个字符串以问号开头                      |
| location.username | "foouser"                                                | 域名前指定的用户名                                          |
| location.password | "barpassword"                                            | 域名前指定的密码                                            |
| location.origin   | "http://www.wrox.com"                                    | URL 的源地址。只读                                          |

我们来说说主要的几个。

### 查询字符串

location.search 是我们在实际开发过程中经常要用到的属性，但是它不容易使用。虽然它返回了从问好开始直到 URL 末尾的所有内容，但没有办法逐个访问每个查询参数。

我们可以写一个解析查询字符串的方法，返回一个以每个查询参数为属性的对象：

```js
let getQueryStringArgs = function () {
    // 首先取得查询字符串
    let qs = (location.search.length > 0 ? location.search.substring(1) : ""),
    // substring(1) 去掉了前面的 ? 号
    args = {};
    
    // 把每个参数都添加到 args 对象里
    for (let item of qs.split("&").map(kv => kv.split("="))) {
        // qs.split("&").map(kv => kv.split("=")) 返回的是一个二维数组，每一项都是 key-value 的组合
        let name = decodeURIComponent(item[0]),
            value = decodeURIComponent(item[1]);
        if (name.length) {
            args[name] = value;
        }
        return args;
    }
}
```



