---
title: Vue3.0 响应式原理
date: 2021-04-22
tags:
 - Vue
categories:
 - front
---

## 什么是响应式？

直观一点讲：数据改变页面更新，页面更新改变数据。当然名字也很多，比如双向数据绑定、数据驱动等等。

## Vue2.x 响应式原理

Vue2.x 实现数据双向绑定的原理是调用了 Object 的 `defineProperty` API。通过 `setter\getter` 来劫持各个属性。这里还涉及到发布订阅模式，当属性数据变动的时候，就会发布信息给订阅者，触发相应的监听回调。

常规方式去添加和修改对象属性：

```js
var obj = {}
obj.name = 'cecil';
onsole.log(obj);  // { name: 'cecil' }
```

而使用 `Object.defineProperty` 添加或修改对象属性的话，我们先要知道 `defineProperty` 的一些属性和方法：

```js
// Object.defineProperty(
//   obj,  // 对象
//   prop, // 属性
//   {}    // 属性描述符，分两种，一种是存取描述符，一种是数据描述符（数据属性和访问器属性）
// )

/**
 * enumerable: 是否可枚举，默认是 false
 * configurable: 是否可被删除，默认是 false
 * writable: 是否只读，默认 true
 * value：值，默认是 undefined
 */
var vm = {}
// 一，数据描述
Object.defineProperty(vm, 'name', {
  value: 'cecil',
  writable: true,
  configurable: true,
  enumerable: true
})

console.log(vm);

Object.defineProperty(vm, 'age', {
  value: 27,
  writable: false,
  configurable: false,
  enumerable: true
})

vm.age = 18;
console.log(vm.age);  // 依旧是 27，因为是只读，不可被修改

// 二、存储描述

/**
 * set 方法 当我们修改属性的时候，会执行这个方法，新属性的值作为参数传递进来，默认值为 undefined
 * get 方法，当我们访问属性的时候，会执行这个方法，默认值是 undefined
 */

let name = '',
    getCount = 0,
    setCount = 0;

Object.defineProperty(vm, 'obs', {
  get: function () {
    console.log(`访问了 GET ${++getCount}次`);
    return name;
  },
  set: function (val) {
    console.log(`设置了 SET ${++setCount}次`);
    name = val;
  }
})

vm.obs;
vm['obs'];
vm.obs = '憨憨';
vm.obs = '真憨憨';

// 有个问题就是不能检测到数组长度的变换，也就是不具备监听数组的能力

/**
 * 原因--还不全，再查找下资料
 * 不能检测到数组长度的变化，准确的说，数组通过改变 length 而修改的长度是不能被检测到的，因为
 * Object.defineProperty 里面的几个属性的初始值都是 false，也就是说，不可被枚举，不可被删除，只读
 */

// 还有一个问题是无法检测到 对象属性（对象是可以的） 的添加和删除

// 所有属性必须再 data 对象上存在才能让 Vue 将其转换为响应式，所以要对 data 进行遍历，而
// 如果是深度监听则需要通过递归实现，我们也知道递归是对性能有一定影响的。
```



## Vue3.x 响应式原理

## 实现迷你Vue3

