# Learning-notes

前端学习笔记 &amp; 踩坑日记，记录一些工作中遇到的问题，长期更新

## 1. `isNaN()` 和 `Number.isNaN()` 的区别

[`Number.isNaN()`](https://developer.mozilla.org/zh-CN/docs/web/javascript/reference/global_objects/number/isnan) 方法确定传递的值是否为  [`NaN`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/NaN)，并且检查其类型是否为  [`Number`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number)。它是  [`isNaN()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isNaN)  的更稳妥的版本。

和  [`isNaN()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/isNaN)  相比，[`Number.isNaN()`](https://developer.mozilla.org/zh-CN/docs/web/javascript/reference/global_objects/number/isnan) 不会自行将参数转换成数字，只有在参数是值为  `NaN`  的数字时，才会返回  `true`，否则返回 `false`。

```ts
Number.isNaN(NaN); // true
Number.isNaN(Number.NaN); // true
Number.isNaN(0 / 0); // true

Number.isNaN({}); // false
Number.isNaN('NaN'); // false
Number.isNaN('blabla'); // false
Number.isNaN(undefined); // false

isNaN({}); // true
isNaN('NaN'); // true
isNaN('blabla'); // true
isNaN(undefined); // true
```

## 2. 文本溢出省略

- 单行文本：

```css
overflow: hidden;
text-overflow: ellipsis;
white-space: nowrap;
```

- 多行文本：

```css
overflow: hidden;
text-overflow: ellipsis;
display: -webkit-box;
-webkit-line-clamp: 3;
-webkit-box-orient: vertical;
```
