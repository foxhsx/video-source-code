---
title: ESlint 的一些使用经验
date: 2021-04-20
tags:
 - JavaScript
 - 日常问题
categories:
 - front
---

我们在写项目时要注意书写规范等问题，这个时候会常常使用到 ESlint 来做代码规范校验，从而也出现了大批爆红（就很戳气--此处自行脑补表情包）。

下面是笔者在项目中遇到的一些问题，大家自行匹配，一起避坑。

## import/no-extraneous-dependencies

```md
'chalk' should be listed in the project's dependencies. Run 'npm i -S chalk' to add it (import/no-extraneous-dependencies)
```

一般这个错误是在于我们开启 ESlint 之后，从 `package.json` 中的 `devDependencies` 开发依赖中去引入依赖，而导致的错误。

解决的方法也很简单，在项目根目录下找到 ESlint 的配置文件 `.eslintrc.js` ，然后在 rules 里配置一条相关规则即可：

```js
module.exports = {
  rules: {
    "import/no-extraneous-dependencies": ["error", {"devDependencies": true}]
  }
}
```

那么为什么会有这么一条规则呢？

在[文档里是这么描述的](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md)：

```md
Forbid the import of external modules that are not declared in the package.json's dependencies, devDependencies, optionalDependencies, peerDependencies, or bundledDependencies. The closest parent package.json will be used. If no package.json is found, the rule will not lint anything. This behaviour can be changed with the rule option packageDir.
```

也就是禁止导入未在 `package.json` 的 `dependencies, devDependencies, optionalDependencies, peerDependencies, or bundledDependencies` 中声明的外部模块。

其实对于 `devDependencies` 来说，默认这块本来就是 `true`，只不过我们安装的某个插件里面被设置为了 `false` 或者其他配置项而导致的。比如 `eslint-config-airbnb-base` 里的 `imports.js` 中就有：

```js
'import/no-extraneous-dependencies': ['error', {
  devDependencies: [
    'test/**', // tape, common npm pattern
    'tests/**', // also common npm pattern
    'spec/**', // mocha, rspec-like pattern
    '**/__tests__/**', // jest pattern
    '**/__mocks__/**', // jest pattern
    'test.{js,jsx}', // repos with a single test file
    'test-*.{js,jsx}', // repos with multiple top-level test files
    '**/*{.,_}{test,spec}.{js,jsx}', // tests where the extension or filename suffix denotes that it is a test
    '**/jest.config.js', // jest config
    '**/jest.setup.js', // jest setup
    '**/vue.config.js', // vue-cli config
    '**/webpack.config.js', // webpack config
    '**/webpack.config.*.js', // webpack config
    '**/rollup.config.js', // rollup config
    '**/rollup.config.*.js', // rollup config
    '**/gulpfile.js', // gulp config
    '**/gulpfile.*.js', // gulp config
    '**/Gruntfile{,.js}', // grunt config
    '**/protractor.conf.js', // protractor config
    '**/protractor.conf.*.js', // protractor config
    '**/karma.conf.js' // karma config
  ],
  optionalDependencies: false,
}],
```