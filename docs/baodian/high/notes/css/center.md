---
title: css 实现居中对齐的方式
date: 2021-04-20
tags:
 - CSS
 - 面试
categories:
 - front
---

对于前端小伙伴来说，CSS 中的居中对齐应该是很常见的场景。今天我们来聊下几个常见的居中对齐的方式。

我们按场景来一一介绍。

## 内联元素水平居中

如果要设置的元素是**文本、图片**等**行内元素**时，水平居中是通过给元素设置 `text-align: center` 来实现的。

## 定宽的块状元素水平居中

满足**定宽**和**块状**两个条件的元素是可以通过设置左右 `margin` 值为 `auto` 来实现居中的——`margin: 0 auto`。

> 注意：当元素设置为 float、绝对定位、固定定位时，左右 margin 就会失效。

## 不定宽的块状元素水平居中

有两种方式：

1. 给父元素设置 `display: table; margin: 0 auto;`。即将父元素转换为表格形式，然后让里面的子元素水平居中。
2. 给父元素设置 `text-align: center;`，然后给子元素设置 `display: inline-block;`。这个也很好理解，首先将子元素设置为内联块状元素，然后给父元素一个内联元素水平居中的样式属性即可。

## 定宽高的元素在屏幕窗口水平垂直都居中

这个我们可以直接使用固定定位和调整 `margin` 的方式来实现。

```css
element {
  width: value;
  height: value;
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -width/2 px;
  margin-top: -height/2 px;
}
```

什么意思呢？

首先，宽高是知道的，然后我们设置元素**层模型**（布局模型之一）为固定定位--fixed，让其脱离文档流。然后设置元素的 left 和 top 都为 50%，这里的 50% 是以元素的上边框和左边框为基础的，所以我们还要在此基础上通过设置元素的 `margin-left` 和 `margin-top` 将元素的位置调整到正中央，移动的距离就是元素宽高的一半，水平方向向左，垂直方向向上，所以这里是负数。

## 不定宽高的元素在屏幕窗口水平垂直居中

这里直接使用固定定位就可以实现。

```css
element {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
```

## 定宽高子元素在父元素中水平垂直都居中

这里我们使用相对定位和绝对定位配合的方法来达成我们想要的效果。

::: tip
因为绝对定位的参照物和绝对定位必须是包含和被包含的关系，而且参照物本身必须得具有定位的属性，所以这里我们在父级使用 relative 相对定位，使得父元素成为子元素的定位参照物，这样就可以实现子元素在父元素内部达到水平垂直都居中的效果。
:::

首先，父元素设置为相对定义。

```css
parentElement {
  position: relative;
}
```

其次，子元素设置为绝对定位：

```css
childElement {
  width: value;
  height: value;
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -width/2 px;
  margin-top: -height/2 px;
}
```

## 不定宽高子元素在父元素中水平垂直都居中

有两种方案可以实现这个效果。

第一种，还是相对加绝对的方法。

父元素：

```css
parentElement {
  position: relative;
}
```

子元素：

```css
childElment {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}
```

第二中，直接将父元素转换为表格单元格的形式：

```css
parentElement {
  display: table-cell;
  text-align: center;
  vertical-align: middle;
}
```

## 万能水平居中大法

flex 布局（弹性布局）是现在布局中经常使用到的一种布局方式，我们可以通过在父级元素设置元素主轴和交叉轴的对齐方式来达到水平垂直居中对齐的效果。

```css
parentElment {
  display: flex;
  justify-content: center;
  align-items: center;
}
```