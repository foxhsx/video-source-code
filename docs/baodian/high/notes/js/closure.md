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