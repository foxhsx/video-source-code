---
title: typeof null 等于什么？为什么？用什么方法可以拿到比较准确的类型判断？
date: 2021-04-08
tags:
 - JavaScript
 - 面试
categories:
 - front
---

## 来看看今天的链式问题：
1. typeof null 等于什么？
2. 为什么？
3. 用什么方法可以拿到比较准确的类型判断？
4. 自己实现一个 typeof 方法怎么实现？

今天我们来带着问题一个个解决。

### typeof null 等于什么？

这个问题我们可以在控制台打印一下即可得到：

```js
typeof null; // 'object'
```

可以看到，得到了一个值为 `object` 的字符串。

### 为什么会得到 object 的字符串？

在 JavaScript 最初的实现中，JavaScript 的值是由一个表示类型的标签和实际数据值表示的。对象的类型标签是0.由于 null 代表的是空指针（大多数平台下值为 0x00），因此，null 的类型标签是0，`typeof null` 也因此返回 `'object'`。

### 用什么方法可以拿到比较准确的类型判断？

有人问，可不可以用 instanceof 来判断呢？

答案是不行的。

首先我们得知道 instanceof 是干嘛的？——它是用来检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

```js
function Car(make, model, year) {
  this.make = make;
  this.model = model;
  this.year = year;
}
const auto = new Car('Honda', 'Accord', 1998);

console.log(auto instanceof Car);
// expected output: true

console.log(auto instanceof Object);
// expected output: true

```

那么从语法上来讲，我们只能说判断 null 在哪个实例对象的原型链上（这句话比较扯淡，因为没有这种场景）。所以使用 instanceof 是解决不了我们的问题的。

我们可以使用 Object 里的 toString 方法来得到一个比较准确的类型判断，具体代码实现如下：

```js
function toRawType(value) {
  return Object.prototype.toString.call(value).slice(8, -1)
}

toRawType(null) // 'Null'
toRawType(1)    // 'Number'
toRawType('1')  // 'String'
toRawType({})   // 'Object'
toRawType([])   // 'Array'
toRawType(true) // 'Boolean'
```

## 自己实现 typeof 如何实现？

其实这个问题的解决方法已经在上个问题中实现了。我们可以在上一个的基础上将值都转为小写即可。

```js
function typeOf(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLocaleLowerCase()
}
```