---
title: 完整的 diff 流程（上）
date: 2021-02-04
tags:
 - JavaScript
 - Vue
categories:
 - front
---

那么我们说组件的渲染过程，本质上就是把各种类型的 vnode 渲染成真实 DOM。我们也知道了组件是由模板、组件描述对象和数据构成的，数据的变化会影响组件的变化。组件的渲染过程中创建了一个带副作用的渲染函数，当数据变化的时候就会执行这个渲染函数来触发组件的更新。

## 副作用渲染函数更新组件的过程

来看下副作用函数 setupRenderEffect 的实现，我们重点关注更新组件部分的逻辑：

```js
const setupRenderEffect = (
	instance,
    initialVNode,
    container,
    anchor,
    parentSuspense,
    isSVG,
    optimized
) => {
    // 创建响应式的副作用渲染函数
    instance.update = effect(function componentEffect() {
        if (!instance.isMounted) {
            // 渲染组件
        }
        else {
            // 更新组件
            let { next, vnode } = instance
            // next 表示新的组件 vnode
            if (next) {
                // 更新组件 vnode 节点信息
                updateComponentPreRender(
                    instance, 
                    next, 
                    optimized
                )
            } else {
                next = vnode
            }
            // 渲染新的子树 vnode
            const nextTree = renderComponentRoot(instance)
            // 缓存旧的子树 vnode
            const prevTree = instance.subTree
            // 更新子树 vnode
            instance.subTree = nextTree
            // 组件更新核心逻辑，根据新旧子树 vnode 做 patch
            patch(
            	prevTree,
                nextTree,
                // 如果在 teleport 组件中父节点可能已经改变，所以容器直接找旧树 DOM 元素的父节点
                hostParentNode(prevTree.el),
                // 参考节点在 fragment 的情况可能改变，所以直接找旧树 DOM 元素的下一个节点
                getNextHostNode(prevTree),
                instance,
                parentSuspense,
                isSVG
            )
            // 缓存更新后的 DOM 节点
            next.el = nextTree.el
        }
    }, prodEffectOptions)
}
```

