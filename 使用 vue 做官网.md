## 使用 vue 做商城

做PC端的网页，还是推荐使用一个第三方的UI库，可以省去大量的“搬砖”工作。我们可以使用element-UI，这里推荐使用按需引用的方式，因为一般的官网所用到的样式也不多，如果全局引用，会增加很多的无用代码，从而使得整个项目的体积增大。

那么在官网中，我们经常会用到一些动画，比如页面滚动到某处时，这块的内容会有一个刚加载进来的一个动态效果，那这里推荐使用——animate.css 动画库。

既然说到了页面滚动到某处才出现这个效果，那就不得不说一下懒加载，我们可以在项目里引入 vue-lazyload 库来实现——页面滚动到某处再加载某一组件或者模块的效果。

还有一点就是一般的官网顶部导航都会有一个hover效果，那这里因为我们已经引用了element-UI，所以可以直接使用它里面的 menu 组件。

具体实现思路：

1. 初始化项目

   ```javascript
   vue init webpack vue-ggn
   ```

2. 下载安装 element-UI

   ```javascript
   npm i element-ui -S
   ```

3. 下载安装 vue-lazyload

   ```javascript
   npm i vue-lazyload -S
   ```

4. 下载安装 animate.css

   ```javascript
   npm i animate.css -S
   ```

首先，我们先看看在官网里的懒加载动画。

在 main.js 中引入——vue-lazyload 和 animate.css

```javascript
import VueLazyload from 'vue-lazyload'
import 'animate.css'

// 设置lazyload属性
Vue.use(VueLazyload, {
  listenEvents: ['scroll'],
  lazyComponent: true
})
```

### vue-lazyload

**listenEvents**

默认配置的监听事件：`['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend', 'touchmove']`

为了提高页面性能，我们可以指定当前页面懒加载监听的事件，如['scroll']

**lazyComponent**

实现被 lazy-component 标签包含的元素延迟渲染

```javascript
<lazy-component @show="handler">
  <img class="mini-cover" :src="img.src" width="100%" height="400">
</lazy-component>

<script>
  {
    ...
    methods: {
      handler (component) {
        console.log('this component is showing')
      }
    }

  }
</script>
```

具体的可以看这边博客：

https://segmentfault.com/a/1190000014928116

### animate.css

当我们配置好 vue-lazyload 以后，在需要添加懒加载的页面里，使用 lazy-component 标签并添加对应的动画样式，关于 animate.css 里的类名我们可以到官网去看文档（https://animate.style/）：

```javascript
<lazy-component>
    <li class="animate__animated animate__backInLeft">
        <a href="http://vuex.vuejs.org/" target="_blank">vuex</a>
	</li>
</lazy-component>
<lazy-component>
    <li class="animate__animated animate__backInLeft animate__slow">
        <a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a>
	</li>
</lazy-component>
<lazy-component>
    <li class="animate__animated animate__backInLeft animate__slower">
        <a href="https://github.com/vuejs/awesome-vue" target="_blank">
            awesome-vue
		</a>
	</li>
</lazy-component>
```

写好之后，我们把页面往下滚动，会相对应的出现从左或者从右出现的动画，并且因为我们设置了动画时间或者说是速度的缘故，动画是一个有顺序的，渐进的效果。

官网是这样描述的：

Animate.css provides the following delays:

| Class name        | Default delay time |
| ----------------- | ------------------ |
| animate__delay-2s | 2s                 |
| animate__delay-3s | 3s                 |
| animate__delay-4s | 4s                 |
| animate__delay-5s | 5s                 |

**Slow, slower, fast, and Faster classes**

You can control the speed of the animation by adding these classes, as below:

```html
<div class="animate__animated animate__bounce animate__faster">Example</div>
```

| Class name      | Default speed time |
| --------------- | ------------------ |
| animate__slow   | 2s                 |
| animate__slower | 3s                 |
| animate__fast   | 800ms              |
| animate__faster | 500ms              |

### vue.config.js

我们需要对项目进行一些配置，@vue/cli3.0+已经帮我们做过了这些，但是如果你还需要添加一些其他的配置或者更改，可以在根目录下添加 `vue.config.js`：

```javascript
// vue.config.js
'use strict'
const path = require('path')
const defaultSettings = require('./settings.js')

const ENV = defaultSettings.ENV

const API_CONFIG = defaultSettings.API[ENV] || {}

// https://cli.vuejs.org/guide/mode-and-env.html#using-env-variables-in-client-side-code

Object.keys(API_CONFIG).forEach(key => {
  if (key.startsWith('VUE_APP_')) {
    process.env[key] = API_CONFIG[key]
  }
})

console.log(process.env.NODE_ENV, process.env.VUE_APP_API_URL, defaultSettings.title)

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'vue配置'

const port = 8082 // dev port

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: true,
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    port: port,
    open: false,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      '/frame-b2b2c-control': {
        target: process.env.VUE_APP_API_URL,
        changeOrigin: true,
        logger: 'debug',
        pathRewrite: {
          '^/frame-b2b2c-control': ''
        }
      }
    },
    before: app => {}
  },
  configureWebpack: {
    name: name,
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src'),
        '@/layout': resolve('src/layout')
      }
    }
  },
  chainWebpack(config) {
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
    // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development', config =>
        config.devtool('cheap-source-map')
      )

    config.when(process.env.NODE_ENV !== 'development', config => {
      config
        .plugin('ScriptExtHtmlWebpackPlugin')
        .after('html')
        .use('script-ext-html-webpack-plugin', [
          {
            // `runtime` must same as runtimeChunk name. default is `runtime`
            inline: /runtime\..*\.js$/
          }
        ])
        .end()
      // optimization 优化
      config.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          elementUI: {
            name: 'chunk-elementUI', // split elementUI into a single package
            priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
            test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      })
      config.optimization.runtimeChunk('single')
    })
  }
}
```

其中 `config.optimization`是webpack4开始，会根据不同的`mode`来执行的优化。

`optimization.splitChunks`对于动态导入模块，默认使用 webpack4+ 提供的全新的通用分块策略（可以认为是代码切割），而 `Splitchunks` 可以抽取公有代码，它是由内置的 `SplitChunksPlugin`插件提供的能力，可直接在 `optimization`里进行配置。

其默认配置：

```javascript
optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minRemainingSize: 0,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: '~',
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
```

官网文档上讲：

> 默认情况下，它仅影响按需块，因为更改初始块会影响HTML文件应包含的脚本标签以运行项目。
>
> webpack将根据以下条件自动拆分块：
>
> - 可以共享新块，或者模块来自`node_modules`文件夹
> - 新的块将大于30kb（在min + gz之前）
> - 按需加载块时并行请求的最大数量将小于或等于6
> - 初始页面加载时并行请求的最大数量将小于或等于4

我们对当前配置来进行说明：

**chunks**

这表明将选择哪些块进行优化。当提供一个字符串，有效值为`all`，`async`和`initial`。提供`all`可能特别强大，因为它意味着即使在异步和非异步块之间也可以共享块。

- initial: 对于匹配文件，非动态模块打包进该vendor,动态模块优化打包
- async: 对于匹配文件，动态模块打包进该vendor,非动态模块不进行优化打包
- all: 匹配文件无论是否动态模块，都打包进该vendor

webpack4的默认配置中，splitChunks.chunks默认是async,因为webpack更希望将代码中异步引入的部分作为独立模块进行打包，异步的部分在需要时引入，这种懒加载的方式更能提升页面性能。

**cacheGroups**

> 官网：缓存组可以继承和/或覆盖`splitChunks.*`;中的任何选项。但是`test`，`priority`并且`reuseExistingChunk`只能在缓存组级别上配置。要禁用任何默认缓存组，请将它们设置为`false`。

cacheGrouops的作用就相当于是一个分组条件，满足这个条件输出为一个chunks。splitChunks就是根据cacheGroups去拆分模块的，**cacheGroups 才是我们配置的关键**

cacheGroup内配置优先级高于外面配置，可以理解为先进行分割再进行合并，分割的代码放到哪个缓存组的块中，由优先级决定。

​	`splitChunks.cacheGroups.{cacheGroup}.name`

​	拆分块的名称。提供`true`将基于块和缓存组密钥自动生成一个名称。

​	提供字符串或函数使您可以使用自定义名称。指定字符串或始终返回相同字符串的函数会将所有常见模块和供应商合并为一个块。这可能会导致更大的初始下载量并减慢页面加载速度。

​	`splitChunks.cacheGroups.{cacheGroup}.priority`

​	一个模块可以属于多个缓存组。优化将首选具有较高的缓存组`priority`。默认组的优先级为负，以允许自定义组获得更高的优先级（默认值适用`0`于自定义组）。

​	`splitChunks.cacheGroups.{cacheGroup}.reuseExistingChunk`

​	如果当前块包含已从主捆绑包中拆分出的模块，则它将被重用，而不是生成新的模块。这可能会影响块的结果文件名。

​	`splitChunks.cacheGroups.{cacheGroup}.test`

​	控制此缓存组选择的模块。省略它会选择所有模块。它可以匹配绝对模块资源路径或块名称。匹配块名称时，将选择块中的所有模块。

​	`splitChunks.minChunks`

​	拆分前必须共享模块的最小块数。

`optimization.runtimeChunk`也是属于优化的一部分，官网是这样定义的：

> 将 `optimization.runtimeChunk` 设置为 `true` 或 `"multiple"`，会为每个仅含有 runtime 的入口起点添加一个额外 chunk。 
>
> 值 `"single"` 会创建一个在所有生成 chunk 之间共享的运行时文件，即将所有chunk的运行代码都打包到一个文件中。
>
> 'multiple'就是给每一个chunk的运行代码打包一个文件。

作用：

​	假设一个使用动态导入的情况(使用import())，在 app.js 动态导入 component.js

```javascript
const app = () => import('./component')
```

build 之后，产生三个包：

- 0.01e47fe5.js
- main.xxx.js
- runtime.xxx.js

其中runtime，用于管理被分出来的包。

如果采用这种分包策略：

1. 当更改 app 的时候 runtime 与（被分出的动态加载的代码） 0.01e47fe5.js 的名称(hash)不会改变，main的名称(hash)会改变。
2. 当更改<code>component.js</code>，<code>main</code>的<code>名称(hash)</code>不会改变，<code>runtime</code>与 (动态加载的代码) <code>0.01e47fe5.js</code>的名称(hash)会改变。

### 项目目录

在`src`下有以下几个目录：

> 1. assets-------------------存放静态资源文件
> 2. commons--------------公共方法
> 3. components----------公共组件
> 4. layout--------------------项目框架
> 5. locales-------------------国际化i18n
> 6. router--------------------路由
> 7. service-------------------请求封装及接口API
> 8. store----------------------vuex
> 9. tool------------------------工具
> 10. views----------------------页面

我们可以预先将一些常用的公共方法放置到commons里面去，按需调用。

页面常用组件可封装至components里。

页面抽象框架提取后放置到 layout 里，里面嵌套二级路由。

需要使用国际化组件 vue-i18n 的，可以加载 locales 目录下的 index, 里面集成了vue-i18，并且对 element-ui 也做了处理。

在 router 目录里我们将业务相关路由和基础路由分开配置，业务路由会采用嵌套路由的方式，将各具体页面嵌套到 layout 组件下。并且会新建一个 router.filter.js，里面使用 router 的前置守卫。

>  当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于 **等待中**。
>
> 一定要调用该方法来 resolve 这个钩子。执行效果依赖`next`方法的调用参数。
>
> **确保 `next` 函数在任何给定的导航守卫中都被严格调用一次。它可以出现多于一次，但是只能在所有的逻辑路径都不重叠的情况下，否则钩子永远都不会被解析或报错。**

接下来就是 service 目录了，里面集成了项目所用的api 文件和axios请求封装fetch.js。

在 fetch.js 文件中，我们引入 axios ，并对其进行基本设置：

```javascript
axios.defaults.timeout = 1000000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.baseURL = ENV === 'development' ? '/frame-b2b2c-control' : process.env.VUE_APP_API_URL
// 前端设置 headers 后会有 options 请求发出，需后端配置
```

store 目录，我们按照官网把 action 和 mutation 分开，在 index.js 中去调用。

tool 目录里，加入了自定义 toast 组件，和工具类。

### vue-i18n集成

```sh
npm i -S vue-i18n
```

新建 `locales` 目录，下面存放资源文件（zh.json  &  en.json）和入口文件（index.js）

以下是 index.js 中引入 i18n ，并对 elmentUI 框架也做了多语言处理。

```javascript
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from './zh.json'
import en from './en.json'
// 对框架自带语言进行更改
import locale from 'element-ui/lib/locale'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(VueI18n)

// 默认语种为中文--根据浏览器语言自动设置语种
const DEFAULT_LANG = navigator.language.indexOf('zh') > -1 ? 'zh' : 'en'
const LOCAL_KEY = 'localeLanguage'

const locales = {
  zh: Object.assign(zh, zhLocale),
  en: Object.assign(en, enLocale)
}

const i18n = new VueI18n({
  locale: DEFAULT_LANG,
  messages: locales
})

// 官网兼容 vue-i18n@6.x  为了实现element插件的多语言切换
locale.i18n((key, value) => i18n.t(key, value))

export const setup = lang => {
  if (lang === undefined) {
    lang = window.localStorage.getItem(LOCAL_KEY)
    if (locales[lang] === undefined) {
      lang = DEFAULT_LANG
    }
  }
  window.localStorage.setItem(LOCAL_KEY, lang)

  Object.keys(locales).forEach(lang => {
    document.body.classList.remove(`lang-${lang}`)
  })
  document.body.classList.add(`lang-${lang}`)
  document.body.setAttribute('lang', lang)

  Vue.config.lang = lang
  i18n.locale = lang
}

setup()

// 在vue实例外，调用 i18n，可以将i18n挂到window下，避免出现 i18n is not defined
window.i18n = i18n
export default i18n

```



## 完整的导航解析流程

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 用创建好的实例调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数。