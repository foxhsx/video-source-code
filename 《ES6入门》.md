# 《ES6入门》

![alt 书面](https://es6.ruanyifeng.com/images/cover_thumbnail_3rd.jpg)

## 1.let 和 const 命令

```
1. let 命令
2. 块级作用域
3. const 命令
4. 顶层对象的属性
5. globalThis 对象
```

<hr>

### 1.let 命令

#### 基本用法

ES6 新增` let `命令，用来声明变量。它的用法类似于` var `，但是所声明的变量，只在` let `命令所在的代码块内有效。

```javascript
{
    let a = 10;
    var b = 1;
}

a // ReferenceError: a is not defined.
b // 1
```

上面代码在代码块之中，分别用了`let`和`var`声明了两个变量。然后在代码块之外调用这两个变量，结果`let`声明的变量报错，`var`声明的变量返回了正确的值。这表明，`let`声明的变量只在它所在的代码块有效。

` for `循环的计数器，就很合适使用` let `命令。

```javascript
for (let i = 0; i < 10; i++) {
    // ...
}

console.log(i);
// ReferenceError: i is not defined.
```

上面代码中，计数器`i`只在`for`循环体内有效，在循环体外引用就会报错。

下面的代码如果使用`var`，最后输出的是`10`。

```javascript
var a = [];
for (var i = 0; i < 10; i++) {
    a[i] = function () {
        console.log(i);
    };
}
a[6](); // 10
```

上面代码中，变量`i`是`var`命令声明的，在全局范围内都有效，所以全局只有一个变量`i`。每一次循环，变量`i`的值都会发生改变，而循环内被赋给数组`a`的函数内部的`console.log(i)`，里面的`i`指向的就是全局的`i`。也就是说，所有数组`a`的成员里面的`i`，指向的都是同一个`i`，导致运行时输出的是最后一轮的`i`的值，也就是10.因为此时已经是在循环体外了，循环已经执行完毕，此时的` i `是10，所以打印出来的结果也就是10.

如果使用` let `，声明的变量仅在块级作用域内有效，最后输出的是6.

```javascript
var a = []
for (let i = 0; i < 10; i++) {
    a[i] = function () {
        console.log(i);
    };
}
a[6]();  // 6
```

上面代码中，变量`i`是`let`声明的，当前的`i`只在本轮循环中有效，所以每一次循环的`i`其实都是一个新的变量，所以最后输出的是6.你可能会问，如果每一轮循环的变量`i`都是重新声明的，那它怎么知道上一轮循环的值，从而计算出本轮循环的值？这是因为JavaScript引擎内部会记住上一轮循环的值，初始化本轮的变量`i`时，就在上一轮循环的基础上进行计算。

另外，`for`循环还有一个特别之处，就是设置循环变量的那部分是一个父作用域，而循环体内部是一个单独的子作用域。

```javascript
for (let i = 0; i < 10; i++) {
    let i = 'abc';
    console.log(i);
}
// abc
// abc
// abc
```

上面代码正确运行，输出了三次`abc`。这表明函数内部的变量`i`与循环变量`i`不在同一个作用域，有各自单独的作用域。

<hr>

#### 不存在变量提升

`var`命令会发生**变量提升**现象，即变量可以在声明之前使用，值为`undefined`。这种现象多多少少是有些奇怪的，按照一般的逻辑，变量应该在声明语句之后，才可以使用。

为了纠正这种现象，`let`命令改变了语法行为，它所声明的变量一定要在声明后使用，否则报错。

```javascript
// var 的情况
console.log(foo);   // 输出 undefined
var foo = 2;

// let 的情况
console.log(bar);   // 报错 ReferenceError
let bar = 2;
```

上面代码中，变量`foo`用`var`命令声明，会发生变量提升，即脚本开始运行时，变量`foo`已经存在了，但是没有值，所以会输出`undefined`。变量`bar`用`let`命令声明，不会发生变量提升。这表示在声明它之前，变量`bar`是不存在的，这时如果用到它，就会抛出一个错误。

****

#### 暂时性死区

只要块级作用于内存在`let`命令，它所声明的变量就“绑定”(binding)这个区域，不再受外部的影响。

```javascript
var tmp = 123;

if (true) {
    tmp = 'abc';  // ReferenceError
    let tmp;
}
```

​	上面代码中，存在全局变量`tmp`，但是块级作用域内`let`又声明了一个局部变量`tmp`，导致后者绑定这个块级作用域，所以在`let`声明变量前，对`tmp`赋值会报错。

ES6 明确规定，如果区块中存在`let`和`const`命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。

总之，在代码块内，使用`let`命令声明变量之前，该变量都是不可用的。这在语法上，成为“暂时性死区”(temporal dead zone，简称TDZ)。

```javascript
if (true) {
    // TDZ 开始
    tmp = 'abc';  // ReferenceError
    console.log(tmp);   // ReferenceError
    
    let tmp;   // TDZ 结束
    console.log(tmp);   // undefined
    
    tmp = 123;
    console.log(tmp);  // 123
}
```

上面代码中，在`let`命令声明变量`tmp`之前，都属于变量`tmp`的“死区”。

“暂时性死区”也就意味着`typeof`不再是一个百分百安全的操作。

```javascript
typeof x;   // ReferenceError
let x;
```

上面代码中，变量`x`使用`let`命令声明，所以在声明之前，都属于`x`的“死区”，只要用到该变量就会报错。因此，`typeof`运行时就会跑出一个`ReferenceError`。

作为比较，如果一个变量根本没有被声明，使用`typeof`反而不会报错。

```javascript
typeof undeclared_variable  // undefined
```

上面代码中，`undeclared_variable`是一个不存在的变量名，结果返回"undefined"。所以，在没有`let`之前，`typeof`运算符是百分百安全的，永远不会报错。现在这一点不成立了。这样的设计是为了让大家养成良好的编程习惯，变量一定要在声明之后使用，否则就报错。

有些“死区”比较隐蔽，不太容易发现。

```javascript
function bar(x = y, y = 2) {
    return [x, y];
}

bar();  // 报错
```

上面代码中，调用`bar`函数之所以报错（某些实现可能不报错），是因为参数`x`默认值等于另一个参数`y`，而此时`y`还没有声明，属于“死区”。如果`y`的默认值是`x`，就不会报错，因为此时`x`已经声明了。

```javascript
function bar(x = 2, y = x) {
    return [x, y];
}
bar();  // [2, 2]
```

另外，下面的代码也会报错，与`var`的行为不同。

```javascript
// 不报错
var x = x;

// 报错
let x = x;
// ReferenceError: x is not defined
```

上面代码报错，也是因为暂时性死区。使用`let`声明变量时，只要变量在还没有声明完成前使用，就会报错。上面这行就属于这个情况，在变量`x`的声明语句还没有执行完成前，就去取`x`的值，导致报错“x 未定义”。

ES6 规定暂时性死区和`let`，`const`语句不出现变量提升，主要是为了减少运行时错误，防止在变量声明前就使用这个变量，从而导致意料之外的行为。这样的错误在ES5 是很常见的，现在有了这种规定，避免此类错误就很容易了。

总之，暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的哪一行代码出现，才可以获取和使用该变量。

****

#### 不允许重复声明

`let`不允许在相同作用域内，重复声明同一个变量。

```javascript
// 报错
function func() {
    let a = 10;
    var a = 1;
}

// 报错
function func () {
    let a = 10;
    let a = 1;
}
```

因此，不能再函数内部重新声明参数。

```javascript
function func(arg) {
    let arg;
}
func()   // 报错

function func(arg) {
    {
        let arg;
    }
}
func()  // 不报错
```

****

### 2.块级作用域

****

#### 为什么需要块级作用域？

ES5 只有全局作用域和函数作用域，没有块级作用域，这带来很多不合理的场景。

第一种场景，内层变量可能会覆盖外城变量。

```javascript
var tmp = new Date();

function f() {
    console.log(tmp);
    if (false) {
        var tmp = 'hello world';
    }
}

f();  // undefined
```

上面代码的原意是，`if`代码块的外部使用外层的`tmp`变量，内部使用内层的`tmp`变量。但是，函数`f`执行后，输出结果为`undefined`，原因在于变量提升，导致内层的`tmp`变量覆盖了外层的`tmp`变量。

第二种场景，用来计数的循环变量泄露为全局变量。

```javascript
var s = 'hello';

for (var i = 0; i < s.length; i++) {
    console.log(s[i]);
}

console.log(i);  // 5
```

上面代码中，变量`i`只用来控制循环，但是循环结束后，它并没有消失，泄露成了全局变量。



****

#### ES6 的块级作用域

`let`实际上为 JavaScript 新增了块级作用域。

```javascript
function f1 () {
    let n = 5;
    if (true) {
        let n = 10;
    }
    console.log(n);   // 5
}
```

上面的函数有两个代码块，都声明了变量`n`，运行后输出5。这表示外层代码块不受内层代码块的影响。如果两次都使用`var`定义变量`n`，最后输出的值才是10.

ES6 允许块级作用域的任意嵌套。

```javascript
{{{{
    {let insane = `Hello World`}
    console.log(insane);   // 报错
}}}}
```

上面代码使用了一个五层的块级作用域，每一层都是一个单独的作用域。第四层作用域无法读取第五层作用域的内部变量。

内层作用域可以定义外层作用域的同名变量。

```javascript
{{{{
    let insane = 'Hello World';
    {let insane = 'Hello World'}
}}}}
```

块级作用域的出现，实际上使得获得广泛应用的匿名立即执行函数表达式（匿名IIFE）不在必要了。

```javascript
// IIFE 写法
(function(){
    var tmp = ...;
    ...
}());
    
// 块级作用域写法
{
    let tmp = ...;
    ...
}
```





****

#### 块级作用域和函数声明

函数能不能在块级作用域之中声明？这是一个相当令人混淆的问题。

ES5 规定，函数只能在顶层作用域和函数作用域之中声明，不能在块级作用域声明。

```javascript
// 情况一
if (true) {
    function f() {}
}

// 情况二
try {
    function f() {}
} catch (e) {
    // ...
}
```

上面两种函数声明，根据 ES5 的规定都是非法的。

但是，浏览器没有遵守这个规定，为了兼容以前的旧代码，还是支持在块级作用域之中声明函数，因此上面两种情况实际都能运行，不会报错。

ES6 引入了块级作用域，明确允许在块级作用域之中声明函数。ES6 规定，块级作用域中，函数声明语句的行为类似 `let`，在块级作用域外不可引用。

```javascript
function f() {
    console.log('I am outside')
}

(function () {
    if (false) {
        // 重复声明一次函数f
        function f() {
            console.log('I am inside')
        }
    }
    
    f();
}());
```

上面代码在 ES5 中运行，会得到“I am inside”，因为在`if `内声明的函数`f`会被提升到函数头部，实际运行的代码如下。

```javascript
// ES5 环境
function f() {
    console.log('I am outside')
}

(function () {
    function f() {
        console.log('I am inside')
    }
    if (false) {
        
    }
    
    f();
}());
```

ES6 就完全不一样了，理论上会得到“I am outside!”。因为块级作用域内声明的函数类似于`let`，对作用域之外没有影响。但是，如果你真的在ES6 浏览器中运行一下上面的代码，是会报错的，这是为什么呢？

```javascript
// 浏览器的 ES6 环境
function f() {
    console.log('I am outside')
}

(function (){
    if (false) {
        // 重复声明一次函数f
        console.log('I am inside')
    }
    
    f();
}());
// Uncaught TypeError: f is not a function
```

上面的代码在 ES6 中，都会报错。

原来，如果改变了块级作用域内声明的函数的处理规则，显然会对老代码产生很大影响。为了减轻因此产生的不兼容问题，ES6 在附录B 里面规定，浏览器的实现可以不遵守上面的规定，有自己的行为方式。

	-  允许在块级作用域内声明函数。
	-  函数声明类似于`var`，即会提升到全局作用域或函数作用域的头部。
	-  同时，函数声明还会提升到所在的块级作用域的头部。

注意，上面三条规则只对 ES6 的浏览器实现有效，其他环境的实现不用遵守，还是将块级作用域的函数声明当做`let`处理。

根据这三条规则，浏览器的 ES6 环境中，块级作用域内声明的函数，行为类似于`var`声明的变量。上面的例子实际运行的代码如下。

```javascript
// 浏览器的 ES6 环境
function f() {
    console.log('I am outside!');
}

(function () {
    var f = undefined;
    if (false) {
        function f () {
            console.log('I am inside!');
        }
    }
    
    f();
}());
// Uncaught TypeError: f is not a function
```

考虑到环境导致的行为差异太大，应该避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是函数声明语句。

```javascript
// 块级作用域内部的函数声明语句，建议不要使用
{
    let a = 'secret';
    function f() {
        return a;
    }
}

// 块级作用域内部，优先使用函数表达式
{
    let a = 'secret';
    let f = function () {
        return a;
    }
}
```

另外，还有一个需要注意的地方。ES6 的块级作用域必须有大括号，如果没有，JavaScript 引擎就认为不存在块级作用域。

```javascript
// 第一种写法，报错
if (true) let x = 1;
// Uncaught SyntaxError: Lexical declaration cannot appear in a single-statement context

// 第二种写法，不报错
if (true) {
    let x = 1;
}
```

上面代码中，第一种写法没有大括号，所以不存在块级作用域，而`let`只能出现在当前作用域的顶层，所以报错。第二种则成立。

函数声明也是如此，严格模式下，函数只能声明在当前作用域的顶层。

```javascript
// 不报错
'use strict';
if (true) {
    function f() {}
}

// 报错
'use strict';
if (true)
    function f() {}
```



****

### 3.const命令



****

#### 基本用法

`const`声明一个只读的常量。一旦声明，常量的值就不能改变。

```javascript
const PI = 3.1415;
PI  // 3.1415

PI = 3;
// TypeError: Assignment to constant variable
```

上面代码表明改变常量的值会报错。

`const`声明的变量不得改变值，这意味着，`const`一旦声明变量，就必须立即初始化，不能留到以后赋值。

```javascript
const foo;
// SyntaxError: Missing initializer in const declaration
```

上面代码表示，对于`const`来说，只声明不赋值，就会报错。

`const`的作用域与`let`命令相同：只在声明所在的块级作用域内有效。

```javascript
if (true) {
    const MAX = 5;
}

MAX  // Uncaught ReferenceError: MAX is not defined
```

`const`命令声明的常量也是不提升，同样存在暂时性死区，只能在声明的位置后面使用。

```javascript
if (true) {
    console.log(MAX);  // ReferenceError
    const MAX = 5;
}
```

上面代码在常量`MAX`声明之前就调用，结果报错。

`const`声明的常量，也与`let`一样不可重复声明。·

```javascript
var message = 'Hello!';
let age = 25;

// 以下两行都会报错
const message = 'Goodbye!';
const age = 30;
```



****

#### 本质

`const`实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但是对于复合类型的数据（主要是对象和数组），**变量指向的内存地址，保存的只是一个指向实际数据的指针，`const`只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了。**因此，将一个对象声明为常量必须非常小心。

```javascript
const foo = {};

// 为 foo 添加一个属性，可以成功
foo.prop = 123;
foo.prop // 123

// 将 foo 指向另一个对象，就会报错
foo = {};  // TypeError: "foo" is read-only
```

上面代码中，常量`foo`储存的是一个地址，这个地址指向一个对象。不可变的只是这个地址，即不能把`foo`指向另一个地址，但对象本身是可变的，所以依然可以为其添加新属性。

下面是另一个例子。

```javascript
const a = [];
a.push('Hello');  //  可执行
a.length = 0;     //  可执行
a = ['Dave'];     // 报错
```

上面代码中，常量`a`是一个数组，这个数组本身是可写的，但是如果将另一个数组赋值给`a`，就会报错。

如果真的想将对象冻结，应该使用`Obejct.freeze`方法。

```javascript
const foo = Object.freeze({});

// 常规模式时，下面一行不起作用
// 严格模式时，该行会报错
foo.prop = 123;
```

上面代码中，常量`foo`指向一个冻结的对象，所以添加新属性不起作用，严格模式时还会报错。

除了将对象本身冻结，对象的属性也应该冻结。下面是一个将对象彻底冻结的函数。

```javascript
var constantize = (obj) => {
    Object.freeze(obj);
    Object.keys(obj).forEach( (key, i) => {
        if (typeof obj[key] === 'object') {
            constantize(obj[key])
        }
    })
}
```



****

#### ES6 声明变量的6中方法

ES5 只有两种声明变量的方法：`var`命令和`function`命令。ES6 除了添加`let`和`const`命令，后面还会提到另外两种声明变量的方法：`import`命令和`class`命令。所以，ES6 一共有6中声明变量的方法。

1. `var`
2. `let`
3. `function`
4. `const`
5. `import`
6. `class`



****

### 4.顶层对象的属性

顶层对象，在浏览器环境指的是`window`对象，在 Node 指的是`global`对象。ES5 之中，顶层对象的属性与全局变量时等价的。

```javascript
window.a = 1;
a // 1

a = 2;
window.a // 2
```

上面代码中，顶层对象的属性赋值与全局变量的赋值，是同一件事。

顶层对象的属性与全局变量挂钩，被认为是 JavaScript 语言最大的设计败笔之一。这样的设计带来了几个很大的问题，首先是没法在编译时就报出变量未声明的错误，只有运行时才能知道（因为全局变量可能是顶层对象的属性创造的，而属性的创造是动态的）；其次，程序员很容易不知不觉地就创建了全局变量（比如打字出错）；最后，顶层对象的属性是到处可以读写的，这非常不利于模块化编程。另一方面，`window`对象有实体含义，指的是浏览器的窗口对象，顶层对象是一个有实体含义的对象，也是不合适的。

ES6 为了改变这一点，一方面规定，为了保持兼容性，`var`命令和`function`命令声明的全局变量，依旧是顶层对象的属性；另一方面规定，`let`命令、`const`命令、`class`命令声明的全局变量，不属于顶层对象的属性。也就是说，从 ES6 开始，全局变量将逐步与顶层对象的属性脱钩。

```javascript
var a = 1;
// 如果在 node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1

let b = 1;
window.b  // undefined
```

上面代码中，全局变量`a`由`var`命令声明，所以它是顶层对象的属性；全局变量`b`由`let`命令声明，所以它不是顶层对象的属性，返回`undefined`。



****

### 5.globalThis对象

JavaScript 语言存在一个顶层对象，它提供全局环境（即全局作用域），所有代码都是在这个环境中运行。但是，顶层对象在各种实现里面是不统一的。

- 浏览器里面，顶层对象是`window`，但是 Node 和 Web Worker 没有`window`。
- 浏览器和Web Worker 里面，`self`也指向顶层对象，但是 Node 没有`self`。
- Node 里面，顶层对象是`global`，但是其他环境都不支持。

同一段代码为了能够在各种环境，都能取到顶层对象，现在一般是使用`this`对象，但是有局限性。

- 全局环境中，`this`会返回顶层对象。但是，Node 和 ES6 模块中，`this`返回的是当前模块。
- 函数里面的`this`，如果函数不是作为对象的方法运行，而是单纯作为函数运行，`this`会指向顶层对象。但是，严格模式下，这时`this`会返回`undefined`。
- 不管是严格模式，还是普通模式，`new Function('return this')()`，总是会返回全局对象。但是，如果浏览器用了 CSP （Content Security Policy，内容安全策略），那么`eval`、`new Function`这些方法都可能无法使用。

综上所述，很难找到一种方法，可以在所有情况下，都取到顶层对象。下面是两种勉强可以使用的方法。

```javascript
// 方法一
(typeof window !== 'undefined'
	? window
	: (typeof process === 'object' &&
       typeof require === 'function' &&
       typeof global === 'object')
	 ? global
	 : this);

// 方法二
var getGlobal = function () {
    if (typeof self !== 'undefined') {return self;}
    if (typeof windwo !== 'undefined') {return window;}
    if (typeof global !== 'undefined') {return global;}
    throw new Error('unable to locate global object');
}
```

ES2020 在语言标准的层面，引入`globalThis`作为顶层对象。也就是说，任何环境下，`globalThis`都是存在的，都可以从它拿到顶层对象，指向全局环境下的`this`。

垫片库`global-this`模拟了这个提案，可以在所有环境拿到`globalThis`.

## 2.变量的解构赋值

### 1.数组的解构赋值



****

**基本用法**

ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构（Destructuring）。

以前，为变量赋值，只能直接指定值。

```javascript
let a = 1;
let b = 2;
let c = 3;
```

ES6  允许写成下面这样。

```javascript
let [a, b, c] = [1, 2, 3]
```

上面代码表示，可以从数组中提取值，按照对应位置，对变量赋值。

本质上，这种写法属于“模式匹配”，只要等号两边的模式相同，左边的变量就会被赋予对应的值。下面是一些使用嵌套数组进行解构的例子。

```javascript
let [foo, [[bar], baz]] = [1, [[2], 3]];
foo  // 1
bar  // 2
baz  // 3

let [ , , third] = ['foo', 'bar', 'baz']
third // 'baz'

let [x, , y] = [1, 2, 3]
x // 1
y // 3

let [head, ...tail] = [1, 2, 3, 4]
head // 1
tail // [2, 3, 4]

let [x, y, ...z] = ['a']
x // 'a'
y // undefined
z // []
```

如果解构不成功，变量的值就等于`undefined`

```javascript
let [foo] = []
let [bar, foo] = [1]
```

以上两种情况都属于解构不成功，`foo`的值都会等于`undefined`.

另一种情况是不完全解构，即等号左边的模式，只匹配一部分的等号右边的数组。这种情况下，解构依然可以成功。

```javascript
let [x, y] = [1, 2, 3];
x  // 1
y  // 2

let [a, [b], d] = [1, [2,3], 4]
a // 1
b // 2
d // 4
```

上面两个例子，都属于不完全解构，但是可以成功。

如果等号的右边不是数组（或者严格地说，不是可遍历的结构，参见《Iterator》一章），那么将会报错。

```javascript
// 报错
let [foo] = 1;
let [foo] = false;
let [foo] = NaN;
let [foo] = undefined;
let [foo] = null;
let [foo] = {};
```

上面的语句都会报错，因为等号右边的值，要么转为对象以后不具备 Iterator 接口（前五个表达式），要么本身就不具备 Iterator 接口（最后一个表达式）。

对于 Set 结构，也可以使用数组的解构赋值。

```javascript
let [x, y, z] = new Set(['a', 'b', 'c']);
x // 'a'
```

事实上，只要某种数据结构具有 Iterator 接口，都可以采用数组形式的解构赋值。

```javascript
function* fibs() {
    let a = 0;
    let b = 1;
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}

let [first, second, third, fourth, fifth, sixth] = fibs();
sixth // 5
```

上面代码中，`fibs`是一个 Generator 函数（参见《Generator 函数》一章），原生具有 Iterator 接口。解构赋值会一次从这个接口获取值。

<p style="border: 1px dashed #ccc"></p>
**默认值**

解构赋值允许指定默认值。

```javascript
let [foo = true] = [];
foo // true

let [x, y = 'b'] = ['a'];  // x='a'  y='b'
let [x, y = 'b'] = ['a', undefined];  // x='a'  y='b'
```

注意，ES6 内部使用严格相等运算符（`===`），判断一个位置是否有值。所以，只有当一个数组成员严格等于`undefined`，默认值才会生效。

```javascript
let [x = 1] = [undefined];
x // 1

let [x = 1] = [null];
x // null
```

上面代码中，如果一个数组成员是`null`，默认值就不会生效，因为`null`不严格等于`undefined`。

如果默认值是一个表达式，那么这个表达式是惰性求值的，即只有在用到的时候，才会求值。

```javascript
function f() {
    console.log('aaa')
}

let [x = f()] = [1];
```

上面代码中，因为`x`能取到值，所以函数`f`根本不会执行。上面的代码其实等价于下面的代码。

```javascript
let x;
if ([1][0] === undefined) {
    x = f();
} else {
    x = [1][0];
}
```

默认值可以引用解构赋值的其他变量，但该变量必须依据声明。

```javascript
let [x = 1, y = x] = [];   // x = 1; y = 1
let [x = 1, y = x] = [2];  // x = 2; y = 2
let [x = 1, y = x] = [1, 2];  // x = 1; y = 2
let [x = y, y = 1] = [];   // ReferenceError: y is not defined
```

<p style="border:1px solid #000"></p>
### 2. 对象的解构赋值

<p style="border: 1px dashed #ccc"></p>
**简介**

解构不仅可以用于数组，还可以用于对象。

```javascript
let { foo, bar } = { foo: 'aaa', bar: 'bbb' };
foo // 'aaa'
bar // 'bbb'
```

对象的解构与数组有一个重要的不同。数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值。

```javascript
let { bar, foo } = { foo: 'aaa', bar: 'bbb' };
foo // 'aaa'
bar // 'bbb'

let { baz } = { foo: 'aaa', bar: 'bbb' };
baz  // undefined
```

上面代码的第一个例子，等号左边的两个变量的次序，与等号右边两个同名属性的次序不一致，但是对取值完全没有影响。第二个例子的变量没有对应的同名属性，导致取不到值，最后等于`undefined`。

如果解构失败，变量的值等于`undefined`。

```javascript
let { foo } = { bar: 'baz' }
foo // undefined
```

上面代码中，等号右边的对象没有`foo`属性，所以变量`foo`取不到值，所以等于`undefined`。

对象的解构赋值，可以很方便地将现有对象的方法，赋值到某个变量。

```javascript
// 例一
let { log, sin, cos } = Math;

// 例二
const { log } = console;
log('hello') // hello
```

上面代码的例一将`Math`对象的对数、正弦、余弦三个方法，赋值到对应的变量上，使用起来就会方便很多。例二将`console.log`赋值到`log`变量。

如果变量名与属性名不一致，必须写成下面这样。

```javascript
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // 'aaa'

let obj = { first: 'hello', last: 'world' };
let { first: f, last: l } = obj;
f // 'hello'
l // 'world'
```

这实际上说明，对象的解构赋值是下面形式的简写（参见《对象的扩展》一章）

```javascript
let { foo: foo, bar: bar } = { foo: 'aaa', bar: 'bbb' };
```

也就是说，对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。真正被赋值的是后者，而不是前者。

```javascript
let { foo: baz } = {foo: 'aaa', bar: 'bbb'};
baz // 'aaa'
foo // error: foo is not defined
```

上面代码中，`foo`是匹配的模式，`baz`才是变量。真正被赋值的是变量`baz`，而不是模式`foo`。

与数组一样，解构也可以用于嵌套结构的对象。

```javascript
let obj = {
    p: [
        'Hello',
        {
            y: 'World'
        }
    ]
};

let { p:[x: { y }] } = obj;
x // 'Hello'
y // 'World'
```

注意，这时`p`是模式，不是变量，因此不会被赋值。如果`p`也要作为变量赋值，可以写成下面这样。

```javascript
let obj = {
    p: [
        'Hello',
        {
            y: 'World'
        }
    ]
};

let { p,p:[x: { y }] } = obj;
x // 'Hello'
y // 'World'
p // ['Hello', {y: 'World'}]
```

下面是另一个例子。

```javascript
const node = {
    loc: {
        start: {
            line: 1,
            column: 5
        }
    }
};

let { loc, loc: { start }, loc: { start: { line }} } = node;
line // 1
loc // Object {start: Object}
start // Object {line: 1, column: 5}
```

上面代码有三次解构赋值，分别是对`loc`、`start`、`line`三个属性的解构赋值。注意，最后一次对`line`属性的解构赋值之中，只有`line`是变量，`loc`和`start`都是模式，不是变量。

下面是嵌套赋值的例子。

```javascript
let obj = {};
let arr = [];

({ foo: obj.prop, bar: arr[0] } = {foo: 123, bar: true});

obj  // {prop: 123}
arr  // [true]
```

如果解构模式是嵌套的对象，而且子对象所在的父属性不存在，那么将会报错。

```javascript
// 报错
let {foo: {bar}} = {baz: 'baz'};
```

上面代码中，等号左边对象的`foo`属性，对应一个子对象。该子对象的`bar`属性，解构时会报错。原因很简单，因为`foo`这时等于`undefined`，再取子属性就会报错。

注意，对象的解构赋值可以取到继承的属性。

```javascript
const obj1 = {};
const obj2 = { foo: 'bar' };
Object.setPrototypeOf(obj1, obj2);

const { foo } = obj1;
foo  // "bar"
```

上面代码中，对象`obj1`的原型对象是`obj2`。`foo`属性不是`obj1`自身的属性，而是继承自`obj2`的属性，解构赋值可以取到这个属性。

<p style="border: 1px dashed #ccc"></p>
**默认值**

对象的解构也可以指定默认值。

```javascript
var {x = 3} = {};
x // 3

var {x,y = 5} = {x: 1};
x  // 1
y  // 5

var {x:y = 3} = {}
y  // 3

var {x:y = 3} = {x: 5}
y  // 5

var { message: msg = 'Something went wrong' } = {}
msg  // "Something went wrong"
```

默认值生效的条件是，对象的属性值严格等于`undefined`。

```javascript
var {x = 3} = {x: undefined}
```

