---
title: 编程题汇总（三）
date: 2021-03-01
tags:
 - JavaScript
 - 面试
categories:
 - front
---
## 1、请输出下面代码结果
```js
class Person {
  constructor() {
    this.name = 'Lydia'
  }
}

Person = class AnotherPerson {
  constructor() {
    this.name = 'Sarah'
  }
}

const member = new Person()
console.log(member.name)
```

::: tip 参考答案
Sarah

我们可以将类被赋值于其他类/函数构造函数。在这种情况下，我们将 AnotherPerson 赋值给 Person。此时 Person 实例的指针指向 AnotherPerson 的实例，所以 member.name 属性的值是 Sarah。
:::

## 2、输出对对象 person 有副作用的表达式
```js
const person = {
  name: 'Lydia Hallie',
  address: {
    street: '100 Main St'
  }
}

Object.freeze(person)
```

::: tip 参考答案
`person.address.street = "101 Main St"`

使用 `Object.freeze` 方法是对一个对象进行**冻结**。即不能对其属性进行修改、添加、删除等操作。但是，这里只是对对象本身做了一个浅冻结，什么意思呢？这意味着只有当前对象的**直接属性**被冻结。如果属性是另一个 object，像上述代码中的 address，那 address 中的 street 属性并没有被冻结，仍然可以被修改。
:::

## 3、请输出下面代码结果
```js
const person = { name: 'Lydia' }

function sayHi(age) {
  console.log(`${this.name} is ${age}`)
}

sayHi.call(person, 21)
sayHi.bind(person, 21)
```

## 4、

## 5、

## 6、

## 7、

## 8、

## 9、

## 10、
