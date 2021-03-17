---
title: 编程题汇总（八）
date: 2021-03-16
tags:
 - JavaScript
 - 面试
categories:
 - front
---
## 1、输出下面代码结果

```js
// ./module.js
export default () => 'Hello world'
export const name = 'Lydia'

// ./index.js
import * as data from './module'

console.log(data)
```

::: tip 参考答案
{ default: function default(), name: 'Lydia' }

使用 `import * as name` 语法，我们将 module.js 文件中所有 export 导入到 index.js 文件中，并且创建了一个名为 data 的新对象。在 module.js 中有两个导出：默认导出和命名导出。默认导出是一个返回字符串 'Hello world' 的函数，命名导出是一个名为 name 的变量。

data 对象具有默认导出的 default 属性，其他属性具有指定 exports 的名称及其对应的值。
:::

## 2、输出下面代码结果

```js
const numbers = [1, 2, 3];
numbers[10] = 11;
console.log(numbers);
```

::: tip 参考答案
[1, 2, 3, 7 x empty, 11]

当我们为数组中的元素设置一个超过数组长度的值时，JavaScript 会创建一个名为 '空插槽' 的东西。这些位置的值实际上是 undefined，但实际会看到类似的值：
```js
[1, 2, 3, 7 x empty, 11]
```
:::

## 3、输出下面代码结果

```js
const person = {
  firstName: 'Lydia',
  lastName: 'Hallie',
  pet: {
    name: 'Mara',
    breed: 'Dutch Tulip Hound'
  },
  getFullName() {
    return `${this.firstName} ${this.lastName}`
  }
}

console.log(person.pet?.name);
console.log(person.pet?.family?.name);
console.log(person.getFullName?.());
console.log(member.getLastName?.());
```

::: tip 参考答案
Mara undefined Lydia Hallie undefined

通过 ES10 或 TS3.7+ 的可选链操作符 `?.`，我们不再需要显式检测更深层的嵌套值是否有效。如果我们尝试获取 undefined 或者 null 的值(nullish)，**表达式将会短路并返回 undefined**。

person.pet?.name 中 person 有一个名为 pet 的属性，而 person.pet 不是 nullish。它有个名为 name 的属性，并返回字符串 Mara。

person.pet?.family?.name 中 person 有一个名为 pet 的属性，但是 pet 没有 family 的属性，此时 person.pet.family 是 nullish，表达式返回 undefined。

person.getFullName?.() 中 person 有一个 getFullName 的属性，所以 getFullName() 不是 nullish 并可以被调用，返回字符串 Lydia Hallie。

member.getLastName?.() 中，member 就是一个未定义的值，所以直接返回了 undedined。
:::

## 4、输出下面代码结果

```js
console.log(`${(x => x)('I love')} to program`)
```

::: tip 参考答案
I love to program

带有模板字面量的表达式首先被执行。相当于字符串会包含表达式，这个立即执行函数 `(x => x)('I love')` 返回的值。我们向箭头函数 x => x 传递 I love 作为参数，并返回。最后结果就是 I love to program。
:::

## 5、怎么在 index.js 中调用 sum.js 中的 sum 函数？

```js
// ./sum.js
export default function sum(x) {
  return x + x;
}

// ./index.js
import * as sum from './sum';
```

::: tip 参考答案
sum.default(4)

使用符号 *，我们引入文件中的所有值，包括默认和具名。默认值导出后的呈现方式是以 key-value 的形式出现：

```js
{ default: function sum(x) { return x + x } }
```
:::

## 6、输出下面代码结果

```js

```

::: tip 参考答案

:::

## 7、输出下面代码结果

```js

```


::: tip 参考答案

:::

## 8、输出下面代码结果

```md

```

::: tip 参考答案

:::

## 9、输出下面代码结果

::: tip 参考答案

:::

## 10、输出下面代码结果

```js

```

::: tip 参考答案

:::