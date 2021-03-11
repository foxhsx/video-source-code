---
title: 编程题汇总（四）
date: 2021-03-11
tags:
 - JavaScript
 - 面试
categories:
 - front
---
## 1、输出下面代码结果

```js
function checkAge(data) {
    if (data === { age: 18 }) {
        console.log('You are an adult!')
    } else if (data == { age: 18 }) {
        console.log('You are still an adult.')
    } else {
        console.log('Hmm.. You don`t have an age I guess')
    }
}

checkAge({ age: 18 })
```

::: tip 参考答案

Hmm.. You don`t have an age I guess



在比较相等性上，原始类型通过它们的**值**进行比较，而对象通过它们的**引用**进行比较。JavaScript 检查**对象是否具有对内存中相同位置的引用**。

我们作为参数传递的对象和我们用于检查相等性的对象在内存中位于不同位置，所以它们的引用是不同的。

:::

## 2、输出下面代码结果

```js
const value = { number: 10 }

const multiply = (x = {...value}) => {
    console.log(x.number *= 2)
}

multiply();
multiply();
multiply(value);
multiply(value);
```

::: tip 参考答案

20 20 20 40



首先我们将 value 解构并传到一个新对象中，此时 x 的默认值为 `{ number: 10 }`。默认参数在调用时才会进行计算，每次调用函数时，都会创建一个**新的对象**。我们前两次调用 multiply 函数且不传参，那么每一次 x 的默认值都是 `{ number: 10 }`，因此前两个打印出来该数字的乘积都是 20.

后面两次传参时，都传递了一个参数——value。现在实际上是将 value.number * 2，此时直接修改了 value.number 的值，并打印出计算得到的 20。紧接着再次计算得到 40。

:::

## 3、输出下面代码结果

```js
class Dog {
    constructor(name) {
        this.name = name;
    }
}

Dog.prototype.bark = functon() {
    console.log(`Woof I am ${this.name}`)
}

const pet = new Dog('Mara')

pet.bark()

delete Dog.prototype.bark;

pet bark();
```

::: tip 参考答案

Woof I am Mara  TypeError



我们在删除掉对象的属性后，再次访问这个对象属性，就会抛出 TypeError 异常。

:::

## 4、输出下面代码结果

```js
function compareMembers(person1, person2 = person) {
    if (person1 !== person2) {
        console.log('Not the same!')
    } else {
        console.log('They are the same!')
    }
}

const person = { name: 'Lydia' }

compareMembers(person)
```

::: tip 参考答案

They are the same!



还是检查的对象之间的相等性问题，我们说过检查对象的相等性是比较它们的引用。

我们将 person2 的默认值设置为 person 对象，并将 person 对象作为形参 person1 的值传递。这就意味着其实 person1 和 person2 都引用内存中的同一个位置，因此它们是相等的。

:::

## 5、JavaScript 中所有内容都是？

::: tip 参考答案

基本数据类型和引用数据类型，也可以说是基本类型和对象。

:::

## 6、输出下面代码结果
## 7、输出下面代码结果
## 8、输出下面代码结果
## 9、输出下面代码结果
## 10、输出下面代码结果