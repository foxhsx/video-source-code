---
title: 浅谈闭包
date: 2021-03-31
tags:
 - JavaScript
 - 面试
categories:
 - front
---

## 什么是闭包？

> 官方解释：一个函数和其周围状态的引用捆绑在一起（或者说函数被引用包围），这样的组合就是**闭包**。也就是说，**闭包让你可以在一个内层函数中访问到其外层函数的作用域**。在 JavaScript 中，每当创建一个函数，闭包就会在函数创建的同时被创建出来。

来看个例子：

```js
function parent() {
  var name = 'closure';     // name 是在 parent 函数里创建的处于函数作用域内的一个局部变量
  function closure() {      // closure 是一个内部函数，它就是闭包
    alert(name);            // 使用了 父函数 parent 里创建的变量 name
  };

  closure();
}

parent();
```

可以看到 parent 函数中有一个局部变量 name 和 closure 的函数。closure 仅能在 parent 函数体内使用，没有自己的局部变量，但是它可以访问外部函数的变量。词法作用域根据源代码中变量声明的位置来确定该变量在何处可用。嵌套函数可访问声明于它们外部作用域的变量。

在现代实际项目中，我们会常用到闭包，比如一些工厂函数：

```js
function makeAdder(x) {
  return function (y) {
    return x + y;
  }
}

var add5 = makeAdder(5);
var add10 = makeAdder(10);

console.log(add5(2));  // 7
console.log(add10(2)); // 12
```

在这里 add5 和 add10 都是闭包。共享相同的函数定义，但是保存了不同的词法环境。

还有就是创建私有变量，只有闭包可以访问词法作用域内的变量，在词法作用域外是访问不到的。

```js
function self() {
  const name = 'cecil';
  return function () {
    return name;
  }
}

console.log(name); // ''
console.log(self()()); // 'cecil'
```

可以看到直接访问 name 变量是访问不到的，因为此时我们并没有定义，得到一个空字符串。只有调用闭包函数，才能读取到 name 变量。这里使用闭包来模拟私有方法或者说是变量，不仅仅有利于限制对代码的访问，还提供了管理全局命名空间的强大能力，避免非核心的方法弄乱了代码的公共接口部分。

闭包类似面向对象编程。在面向对象编程中，对象允许我们将某些数据（对象的属性）与一个或多个方法相关联。而闭包则是将函数与其所操作的某些数据（环境）关联起来。

来看一个例子：

```js
var Counter = (function () {
  var counter = 0;
  function changeBy(val) {
    counter += val;
  }

  return {
    increment: function () {
      changeBy(1);
    },
    decrement: function () {
      changeBy(-1)
    },
    value: function () {
      return counter;
    }
  }
})();

console.log(Counter.value()); /* logs 0 */
Counter.increment();
Counter.increment();
console.log(Counter.value()); /* logs 2 */
Counter.decrement();
console.log(Counter.value()); /* logs 1 */
```

我们在这里创建了一个词法环境，为三个函数所共享：`Counter.increment, Counter.decrement, Counter.value`。同时此环境包含两个私有项：`counter`变量 和 `changeBy`函数。这两个都无法在匿名函数外部直接访问。必须通过匿名函数返回的三个公共函数访问。

这三个公共函数是共享同一个环境的闭包。多亏 JavaScript 的词法作用域，它们都可以访问 counter 变量和 changeBy 函数。

使用闭包给我们提供了许多与面向对象编程相关的好处，特别是数据隐藏和封装。

但是如果不是特定的需求需要用到闭包，在其他函数中创建函数是不推荐的，它会带来一定的心智负担，因为闭包在处理速度和内存消耗方面对脚本性能会有负面影响。

例如，我们在创建新的对象和类时，方法通常应该关联到对象的原型，而不是定义到对象的构造器中，因为这样在每次调用构造器时，方法都会被重新赋值一次。

```js
function MyObject(name, message) {
  this.name = name.toString();
  this.message = message.toString();
  this.getName = function() {
    return this.name;
  };

  this.getMessage = function() {
    return this.message;
  };
}

const obj1 = new MyObject();
const obj2 = new MyObject();
const obj3 = new MyObject();
```

如上代码，如果 new 三次 MyObject 构造函数，里面的方法就会被重新赋值三次，这很不友好，因为方法是抽象的，并不需要每次都复制，我们可以这样修改：

```js
function MyObject(name, message) {
  this.name = name.toString();
  this.message = message.toString();
}

MyObject.prototype.getName = function() {
  return this.name;
};

MyObject.prototype.getMessage = function() {
  return this.message;
};
```

闭包可以创建一个独立的环境，每个闭包里面的环境都是独立的，互不干扰。闭包会发生内存泄漏，每次外部函数执行的时候，外部函数的引用地址不同，**都会重新创建一个新的地址**。但凡是当前活动对象中有被内部子集引用的数据，那么这个时候，这个数据不删除，保留一根指针给内部活动对象。

闭包内存泄漏为： key = value，key 被删除了 value 常驻内存中; 局部变量闭包升级版（中间引用的变量）最终成为了自由变量。

::: tip 总结
1. 闭包是说函数与其周围的引用捆绑在一起的组合。也就是说一个内层函数可以访问其外层函数的作用域（比如定义的变量和参数）。
2. 模拟私有变量，避免使用全局变量，防止全局变量污染
3. 局部变量会常驻内存中
4. 会造成内存泄露（内存被长期占用，而不被释放）
5. 闭包找到的是同一地址中父级函数里对应变量的最终值
6. 高阶函数中使用（除了接收函数为参数外，还能把函数作为结果返回），每次调用都会返回一个新的函数
7. 闭包函数可以理解为携带状态的函数
:::