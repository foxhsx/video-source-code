---
title: 编程题汇总（一）
date: 2021-02-22
tags:
 - JavaScript
 - 面试
categories:
 - front
---
## 1、输出下面代码结果
```js
function Person(firstName, lastName) {
  this.firstName = firstName;
  this.lastName = lastName;
}

const lydia = new Person('Lydia', 'Hallie');
const sarah = Person('Sarah', 'Smith');

console.log(lydia);
console.log(sarah);
```

::: tip 参考答案
`Person { firstName: 'Lydia', lastName: 'lastName' } and undefined`

lydia 是使用 new 关键字创建的，它指向创建时的新的空对象，所以此时对于 lydia 来说，打印出来的值就是这个对象的值。

而对于 sarah 来说，直接调用了 Person 函数，所以此时函数体内的 this 指向全局对象 window。也就是说 this.firstName 和 this.lastName 其实就是 window.firstName 和 window.lastName，而 sarah 本身的返回值是 undefined。
:::

## 2、输出下面代码结果
```js
// counter.js
let counter = 10;
export default counter;

// index.js
import myCounter from './counter';
myCounter += 1;
console.log(myCounter);
```

::: tip 参考答案
Error

**引入的模块是*只读的*：你不能修改引入的模块。**只有导出他们的模块才能修改其中的值。当我们给 myCounter 增加一个值的时候，会抛出一个异常：myCounter 是只读的，不能被修改、
:::

## 3、输出下面代码结果
```js
let num = 10;
const increaseNumber = () => num++;
const increasePassedNumber = (number) => number++;

const num1 = increaseNumber();
const num2 = increasePassedNumber(num1);

console.log(num1);
console.log(num2);
```

::: tip 参考答案

:::
