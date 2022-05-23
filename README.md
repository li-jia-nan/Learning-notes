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

举例：在数组内查找某个值是否存在的时候，我们通常会使用到 `indexOf` 方法，该方法成功时返回下标，失败时返回 `-1`，这里用 `-1` 作为失败时的返回值，而这种细节应该被屏蔽掉。

所以更加推荐使用 `includes` 这种不会暴露代码底层实现细节的方法：

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

- 最好用 ssr 框架，比如 react 的 next，或者 vue 的 nuxt（废话）
- HTML 标签语义化，在适当的位置使用适当的标签
- a 标签都记得设置链接，并且要加上 title 属性加以说明
- img 标签都记得加 alt 属性
- 谨慎使用 display: none，因为搜索引擎会过滤掉 display: none 中的内容
- meta 信息包含 title、keywords、description，有的页面需要单独定制，有的需要通用
- 页面在 html 标签上加 lang="zh-CN"属性，表明文档的语言
- 每个页面最好都要有且仅有一个 h1 标题，尤其是不需要登录的页面（若不喜欢 h1 的默认样式可通过 CSS 设置）

## 8. 冷知识：浏览器地址栏也能运行代码

- 运行 js：

做法是以 `javascript:` 开头，然后跟要执行的语句。比如：

```js
// 需要注意的是并不是所有浏览器都支持
javascript: alert('你好');
```

- 运行 html：

做法是以 `data:text/html,` 开头，然后跟要执行的语句。比如：

```html
<!-- 需要注意的是并不是所有浏览器都支持 -->
data:text/html,
<h1>hello</h1>
;
```

## 9. 冷知识：你不知道的 setTimeout

- 冷知识：最大延迟时间 24.8 天

大多数浏览器都是以 32 个 bit 来存储延时值的，32bit 最大只能存放的数字是 2147483647，换算一下相当于 24.8 天。那么这就意味着 setTimeout 设置的延迟值大于做个数字就会溢出。

```js
setTimeout(() => {
  console.log('123');
}, 2147483647);
```

- 冷知识：setTimeout 的第一个参数回调函数也可以是字符串类型

```js
setTimeout(`console.log('balabala');`, 0);
```

## 10. 冷知识：Math.min 和 Math.max

执行 Math.min 而不传参数的时候，得到的结果是 Infinity，执行 Math.max 而不传参数的时候，得到的结果是-Infinity：

```js
Math.min(); // Infinity
Math.max(); // -Infinity
```

## 11. 我们整天挂在嘴边的闭包到底是什么？

这里收集了不同文献中的原话，具体怎么理解看你自己：

- **《JavaScript 高级程序设计》**

  闭包指的是那些引用了另一个函数作用域中变量的函数，通常是在嵌套函数中实现的。

- **《Node 深入浅出》**

  在 JavaScript 中，实现外部作用域访问内部作用域中变量的方法叫做闭包（closure）。

- **《JavaScript 设计模式与开发实践》**

  局部变量所在的环境被外界访问，这个局部变量就有了不被销毁的理由。这时就产生了一个闭包结构，在闭包中，局部变量的生命被延续了。

- **《你不知道的 JavaScript（上卷）》**

  内部的函数持有对一个值的引用，引擎会调用这个函数，而词法作用域在这个过程中保持完整，这就是闭包。换句话说：当函数可以记住并访问所在的词法作用域，即使函数是在当前词法作用域外执行，这时就产生了闭包。

## 12. 节流与防抖

- **函数节流**

```js
// 方法一：定时器
const throttle = function (fn, delay) {
  let timer = null;
  return function () {
    const context = this;
    const args = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args);
        clearTimeout(timer);
      }, delay);
    }
  };
};

// 方法二：时间戳
const throttle2 = function (fn, delay) {
  let preTime = Date.now();
  return function () {
    const context = this;
    let args = arguments;
    let doTime = Date.now();
    if (doTime - preTime >= delay) {
      fn.apply(context, args);
      preTime = Date.now();
    }
  };
};
```

- **函数防抖**

```js
function debounce(func, wait) {
  let timeout;
  return function () {
    let context = this;
    let args = arguments;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}
```

## 11. 冷知识：pr（pull Request）和 mr（merge Request）有什么区别？

答：**没有区别。**

一般我们执行分支合并，需要执行下面两个命令：

```ts
git pull // 拉取需要合并的分支
git merge // 合并进目标分支
```

Github 选择了第一个命令来命名，叫 `Pull Request`。

Gitlab 选择了最后一个命令来命名，叫 `Merge Request`。

反正都不咋地……这起的什么狗屁名字

正确的起名应该是：

```ts
Merge Request // 请求把代码合并进去
Push Request // 请求把代码推进去
```

## 12. 判断一个对象是普通对象还是通过类创建的

```ts
const isPlainObject = (obj: any): boolean => {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  let proto = Object.getPrototypeOf(obj);
  if (proto === null) {
    return true;
  }

  let baseProto = proto;
  while (Object.getPrototypeOf(baseProto) !== null) {
    baseProto = Object.getPrototypeOf(baseProto);
  }

  return proto === baseProto;
};
```

## 13. 判断是否在浏览器环境

```ts
const isBrowser = () =>
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';
```
