---
title: 什么是防抖和节流？有什么区别？如何实现？
date: 2021-03-12
tags:
 - JavaScript
 - 面试
categories:
 - front
---

## 函数节流

在实际项目中，我们会经常遇到一些高频触发事件，比如 resize、scroll 等等，如果在这些事件上绑定一个回调函数，那么在触发这些事件的时候，这个函数就会被疯狂调用，这对性能有很大影响。所以为了解决这个问题，引申出了函数节流的概念。

### 基本概念

让高频触发事件，在 n 秒内只会执行一次，节流就是通过这样来稀释函数执行的频率。举个例子，古时候人们治水，一般都是直接用堵起来的方式，把水堵住。但是后来发现，堵不如疏，你不能让水越聚越多，而是需要减缓水流的速度。那么放在 JS 中其实就是在较少高频事件执行的频率，从而降低性能消耗。

::: tip 实现思路

首先我们定义一个标记 `flag`，当标记为 true 的时候执行函数，然后我们在闭包中去判断一下，如果这个标记为 false 的时候，则直接 return 掉，不在向下执行。反之继续向下执行，并将这个标记立马赋值为 false，紧接着我们在 setTimeout 里将目标函数包装进来，并改变函数的 this 指向。

为什么要改变这个 this 指向呢？是因为如果我们的目标函数里使用了 this 之后，没有改变上下文环境中的 this，那么 this 会直接指向 window 对象，而不是指向 fn 。当执行完目标函数之后，再跟着将标记重置为 true，保证方法的执行。

:::

### 实例代码

```js
function throttle(fn, time) {
    let flag = true;
    return function (e) {
        if (!flag) return;
        flag = false;
        setTimeout(() => {
            fn.apply(fn, arguments);
            flag = true;
        }, time)
    }
}

function testScroll() {
    console.log('函数节流')
}

window.addEventListener('scroll', throttle(testScroll, 300))
```

函数节流的适用场景会在一些 scroll 和 resize 事件中用到。