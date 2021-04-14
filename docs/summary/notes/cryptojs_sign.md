---
title: 使用 CryptoJS 生成页面签名
date: 2021-4-14
tags:
 - JavaScript
 - 日常问题
categories:
 - front
---

链式问题：
- 为什么要做 sign 签名认证
- 前端如何实现
- 如何验证

## 为什么要做 sign 签名认证

首先我们来说一下为什么要做 sign 签名认证。

其实就这个问题来说，涉及到数据安全。后端在写了开放的 API 接口，并通过 HTTP POST 或者 GET 方式请求服务器时，会面临着许多的安全性问题，比如：
1. 请求来源（身份）是否合法
2. 请求参数被篡改
3. 请求的唯一性（不可复制）

而为了保证数据通信的安全性，我们就可以采用**签名认证**来进行相关验证。

举个例子，假如后端提供了一个 API 接口，而这个接口并没有进行任何的验证，这就导致了大家都可以通过这个接口来获取一些信息，从而导致信息泄露（当然这个信息，是一些私密信息）。而如果咱们使用签名认证的方式就可以来验证用户身份，并防止参数被篡改。

## 前端实现

在前端生成 sign 签名认证的方式上，我们可以使用 CryptoJS 提供的一系列加密方法，比如 MD5、SHA256等等。

那么在生成 sign 之前，我们需要确定：
1. clientSecret：做加密使用的一段字符串--不做传输用；
2. timestemp：时间戳，保证请求唯一性；
3. token：用户权限；
4. clientId：用户唯一ID；
5. nonceStr：如果要使用随机数，也可以加入随机数，但是与后端如何做校验比对，这里就还没有了解清楚，有的大佬请告知一下。

我们可以使用 SHA256 来进行加密：

```js
export function sign(cilentId, clientSecret, token) {
  const timestamp = Math.round(new Date().getTime()/1000);
  const str = `token=${token}&client_id=${cilentId}&timestamp=${timestamp}&secret=${clientSecret}`;
  const signStr = CryptoJS.SHA256(str).toString().toUpperCase();
  return signStr;
}
```

拿到加密后得到的 sign 后，我们可以选择将其加入到 url 地址后面做拼接，也可以选择直接放在请求头里，这两种方式都可以。

但是个人推荐放到请求头中更好一点。

## 如何验证

后端拿到前端传过来的 sign 后，跟自己生成的 sign 做对比，如果一致，则校验通过，如果不一致，则不通过。

::: tip 前端安全性
咱们虽然在前端做了加密处理，但是其实还是有安全性问题存在，但是相对比直接传参安全性会大大提高，如果想要很高的安全性的话，内网或者使用 vpn 加域名白名单会更加适合。
:::