---
title: Vue 的父组件和子组件生命周期钩子执行顺序是什么？
date: 2021-03-16
tags:
 - Vue
 - 面试
categories:
 - front
---

父子组件加载渲染过程：

@flowstart 
st=>start: 父 beforeCreate
crte=>operation: 父 created
bmount=>operation: 父 beforeMount
bcre=>condition: 子 beforeCreate
cred=>condition: 子 created
e=>end: End

st->crte->bmount(path1,right)->bcre
bcre->cred
cred->e
bmount(path2)->e
@flowend

子组件更新过程：


父组件更新过程：


销毁过程：