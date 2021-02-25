---
title: 编程题汇总（二）
date: 2021-02-22
tags:
 - JavaScript
 - 面试
categories:
 - front
---

## 1、请输出代码结果

```js
Promise.resolve(5)
```

::: tip 参考答案

我们可以将我们想要的任何类型的值传递给 Promise.resolve，该方法本身返回带有已解析值的 Promise。如果传递常规函数，它将是具有常规值的已解决 promise。

上述情况，我们传了一个数字5，因此返回了一个 resolved 状态的promise，resolve 的值为5.

:::



## 2、下面代码输出什么？

```js
const shape = {
    radius: 10,
    diamaeter() {
        return this.radius * 2;
    },
    perimeter: () => 2 * Math.PI * this.radius
}
```

::: tip 参考答案

20  NaN

这里考察的是普通函数和箭头函数内部 this 的指向问题，那对于箭头函数，this 关键字指向是它所在上下文（**定义时**的位置）的环境，与普通函数不同！这意味着我们调用 perimeter 函数时，它指向的不是 shape 对象，而是其定义时的 window 对象。此时它是没有 radius 属性的，返回的是 undefined。

:::

## 3、输出下面代码运行结果

```js
async function* range(start, end) {
    for(let i = start; i <= end; i++) {
        yield Promise.resolve(i);
    }
}

(async () => {
    const gen = range(1,3);
    for await (const item of gen) {
        console.log(item)
    }
})();
```

::: tip 参考答案

1 2 3

我们给函数 range 传递：Promise{1}, Promise{2}, Promise{3}，Generator 函数 range 返回一个全是 async object promise 数组。我们将 async object 赋值给变量 gen，之后我们使用 for wait ... of 进行循环遍历。我们将返回的 Promise 实例赋值给 item：第一个返回 Promise{1}，第二个返回 Promise{2}，之后是 Promise{3}。因为我们正 awaitting item 的值，resolved 状态的 promise，promise 数组的 resolved 值依次为：1,2,3

:::