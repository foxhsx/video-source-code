---
title: indexOf 和 findIndex 的区别
date: 2021-04-08
tags:
 - JavaScript
 - 面试
categories:
 - front
---

## 链式问题
1. indexOf
2. findIndex
3. 相同点
4. 不同点
5. 为什么？
6. 手写 indexOf 和 findIndex

## indexOf

首先 indexOf 方法在**数组**中可以找到一个给定元素的第一个索引，并返回。如果不存在，就返回 -1。

而在**String**中则是返回调用其字符串对象中第一次出现的指定值的索引，从 fromIndex 处进行搜索。如果没有找到，则返回 -1。

语法上不管是数组还是 String 都是：

```js
[arr[, string]].indexOf(searchElement[, fromIndex])
```

第一个参数 searchElement 很好理解，就是我们要查找的元素，第二个参数 fromIndex 表示我们开始查找的位置，这个参数一般很少用，在一些特殊的场景下会用到。

> 如果没有提供确切的查找元素，searchElement 会被强制设置为 undefined，这种情况下一般会返回 -1，除非 arr 或者 string 里也有 undefined 的字符串。

数组中 indexOf 底层实现上其实是使用的三等（===）进行判断 searchElement 与调用者包含的元素之间的关系。

## findIndex

## 相同点

## 不同点

## 为什么会有两个功能相似的 API？

## 手写 indexOf

```js
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {
    var k; // 定义返回值变量
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var O = Object(this);  // 将调用者转为对象

    var len = O.length >>> 0;  // Let len be ToUint32(lenValue).

    if (len === 0) {
      return -1;
    }

    // 隐式转换 fromIndex 为数字
    var n = +fromIndex || 0;

    // 考虑到无穷的情况，要做判断，避免这种情况发生
    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 如果传进来的起始位置大于数组的长度，则直接返回 -1
    if (n > len) {
      return -1;
    }

    // 计算 k 值
    // 如果 n 大于等于 0 就使用 n 来跟 0 做对比，返回 n
    // 如果 n 小于0，则使用数组长度减去 n 的绝对值，这里其实相当于从最后往前数
    // 如果计算出来的 k 小于0，则返回 0
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0)

    while(k < len) {
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  }
}
```

## 手写 findIndex