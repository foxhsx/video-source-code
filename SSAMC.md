## BUS总线

作用：在vue中实现非父子组件之间通信。

场景：bus适合小项目、数据被更少组件使用，或者数据量少的项目。

本质：实际上是一个发布订阅者模式的使用，利用 vue 的自定义事件机制，在触发时通过 $emit 向外发布一个事件，而在需要使用的页面，通过 $on 监听事件或者说是注册事件。是一个不具备DOM的组件。它就像是所有组件共用相同的事件中心，用它来作为沟通桥梁，可以向该中心注册发送事件或接收事件。

实现：

1. 使用一个空的 Vue 实例(bus.js)作为中央事件总线。

   ```javascript
   // bus.js
   import Vue from 'vue';
   const bus = new Vue();
   export default bus
   ```

   然后在需要使用的组件中引入

2. 把 bus 定义在 vue 的 prototype 上，在全局使用。

   同样的我们在创建 bus 后，可以在 main.js 中去引入 bus，然后将其挂载在vue实例上。

   ```javascript
   import bus from './bus.js'
   
   Vue.prototype.$bus = bus
   ```

3. 或者使用插件 vue-bus。

   ```sh
   npm i vue-bus --save
   ```

   在 main.js 中引入：

   ```javascript
   import VueBus from 'vue-bus'
   
   Vue.use(VueBus)
   ```

4. 手动实现 Bus 类。

   ```javascript
   class Bus {
       constructor() {
           // 定义回调函数
           this.callback = {}
       }
    	// 事件注册监听   
       $on(name, fn) {
           this.callback[name] = this.callback[name] || []
           this.callback[name].push(fn)
       }
       // 触发事件
       $emit(name,args) {
           if (this.callback[name]) {
               // 遍历所有的 callback
               this.callback[name].map(cb => cb(args))
           }
       }
       // 移除事件
       $off(name) {
           if (this.callback[name]) {
               delete this.callback[name]
           }
       }
   }
   ```

   使用：

   ```javascript
   const bus = new Bus()
   bus.$on('fn1', function (msg) {
       alert(`订阅的消息是：${msg}`)
   })
   bus.$emit('fn1', 'Hello World!')
   ```

注意：注册的总线事件要在组件销毁时卸载，否则会多次挂载，造成触发一次但多个响应的情况。

如果想要移除事件的监听，如下：

```javascript
// 移除应用内所有对此事件的监听
bus.$off('fn1')
bus.$off('fn1', {})
// 移除所有事件频道
bus.$off()
```

那么在实际使用时，我们在需要触发组件里使用 $emit 来触发，并传递相关的值给监听器回调，而在需要接收的页面里使用 $on 去监听对应的自定义事件，并在回调函数中接收传来的值。

```javascript
// A组件
this.bus.$emit('fn', { value: 'test' })

// B组件
this.bus.$on('fn', data => {
    console.log(data);  // { value: "test" }
})
```

当在 B 组件中的 created 生命周期函数中调用了 $on 后，对应的事件就会被监听，当 $emit 触发后，$on 这边就会对应的产生响应。

$on 应该在 created 钩子中使用，如果在 mounted 里使用，它可能接收不到其他组件来自 created 钩子内发出的事件。

## ESlint

实际上我们在项目中启用 ESlint，不仅能统一代码规范，还能提前规避掉一些低级错误，包括书写和语法等方面，从而减轻代码出现BUG的几率，提高开发效率。

### 安装

首先我们在Vue项目初始化时，会有一个 ESlint 选项，如果我们选择了，那就不用再手动去安装 eslint 了。如果没有，那我们就要去安装一下：

```sh
npm i eslint -D
```

我们在项目中安装 eslint 。

### 定义规则

有两种方式：

1. 创建 .eslintrc.js
2. 在 package.json 文件中创建一个 eslintConfig 属性

这里我们主要说一下第一个：

在根目录下创建 .eslintrc.js，其实 `.yaml`、`.yal`、`.json`都可以，但是习惯上会写`.js`文件。

来看一个 vue 项目中的 eslint 配置：

```javascript
module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
        soureType: 'module'
    },
    env: {
        browser: true,
        node: true,
        es6: true
    },
    extend: ['plugin: vue/recommended', 'eslint:recommended'],
    rules: {
        'no-console': 'off'
    }
}
```

> 1. **root**：默认情况下，ESlint 会在所有父级目录里寻找配置文件，一直到根目录。如果发现配置文件中有 `root:true`，它就会停止在父级目录中寻找。
> 2. **parserOptions**：解析器选项。
>    1. **parser**：解析器。默认是使用 Espree
>    2. **soureType**：指定源的类型。`script`（默认）或 `module`（ECMAScript模块）
> 3. **env**：指定想要开启的环境。
> 4. **extend**：一个配置文件可以从基础配置中继承已启用的规则。
> 5. **rules**：ESLint 附带有大量的规则。你可以在rules选项中设置，设置的规则将覆盖上面继承的默认规则。要改变一个规则设置，你必须将规则 ID 设置为下列值之一：
>    1. `off` 或  0 - 关闭规则
>    2. `warn` 或 1 - 开启规则，使用警告级别的错误：warn （不会导致程序退出）
>    3. `error` 或 2 - 开启规则，使用错误级别的错误：error（当被触发的时候，程序会退出）

**注意**：如果使用插件，就需要先下载相关的插件依赖到项目中，否则启动会报错。