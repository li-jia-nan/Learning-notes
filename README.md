---
theme: fancy
---

# Learning-notes

前端学习笔记 &amp; 踩坑日记 &amp; 冷知识，记录一些工作中遇到的问题，长期更新

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

## 2. CSS 实现文本溢出省略

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

## 3. 复制到粘贴板

```js
const clipboardWriteText = copyText => {
  // 判断是否存在clipboard并且是安全的协议
  if (navigator.clipboard && window.isSecureContext) {
    return new Promise((resolve, reject) => {
      navigator.clipboard
        .writeText(copyText)
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          reject(new Error('复制失败'));
        });
    });
  }
  // 否则用被废弃的execCommand
  const textArea = document.createElement('textarea');
  textArea.value = copyText;
  // 使text area不在viewport，同时设置不可见
  textArea.style.position = 'absolute';
  textArea.style.opacity = '0';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.append(textArea);
  textArea.focus();
  textArea.select();
  return new Promise((resolve, reject) => {
    // 执行复制命令并移除文本框
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      resolve(true);
    } else {
      reject(new Error('复制失败'));
    }
    textArea.remove();
  });
};
```

使用：

```js
clipboardWriteText('balabalabala')
  .then(() => {
    console.log('复制成功');
  })
  .catch(() => {
    console.log('复制失败');
  });
```

## 4. 什么是`抽象渗漏`？

抽象渗漏指的是在代码中暴露了底层的实现细节，这些底层实现细节应该被屏蔽掉。

举例：在数组内查找是否存在某个值的时候，我们通常会使用到`indexOf`方法，该方法成功时返回下标，失败时返回-1，这里用 -1 作为失败时的返回值，而这种细节应该被屏蔽掉。

所以更加推荐使用`includes`这种不会暴露代码底层实现细节的方法：

```ts
// 不推荐
[1, 2, 3].indexOf(1) !== -1; // true

// 推荐
[1, 2, 3].includes(1); // true
```

## 5. 高性能向下取整

核心是利用了位运算：

```js
// 不推荐
const num = parseFloat(1.2);
const num = parseFloat('1.2');

// 推荐
const num = 1.2 >>> 0;
const num = '1.2' >>> 0;
```

## 6. 高性能判断奇偶

跟上条一样，也是利用位运算：

```js
// 不推荐
if (num % 2) {
  console.log(`${num}是奇数`);
} else {
  console.log(`${num}是偶数`);
}

// 推荐
if (num & 1) {
  console.log(`${num}是奇数`);
} else {
  console.log(`${num}是偶数`);
}
```

## 7. SEO 优化

- 最好用 ssr 框架，比如 react 的 next，或者 vue 的 nuxt
- HTML 标签语义化，在适当的位置使用适当的标签
- a 标签都记得设置链接，并且要加上 title 属性加以说明
- img 标签都记得加 alt 属性
- 谨慎使用 display: none，因为搜索引擎会过滤掉 display: none 中的内容
- meta 信息包含 title、keywords、description，有的页面需要单独定制，有的需要通用
- 页面在 html 标签上加 lang="zh-CN"属性，表明文档的语言
- 每个页面最好都要有且仅有一个 h1 标题，尤其是不需要登录的页面（若不喜欢 h1 的默认样式可以通过 CSS 设置）
