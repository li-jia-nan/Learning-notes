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

## 14. 实现一个 compose 函数

```ts
const compose = (...funcs) => {
  if (funcs.length === 0) {
    return arg => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => {
    return (...args) => a(b(...args));
  });
};
```

## 15. 处理数字精度问题

```js
// 加
function add(arg1, arg2) {
  let digits1, digits2, maxDigits;
  try {
    digits1 = arg1.toString().split('.')[1].length || 0;
  } catch {
    digits1 = 0;
  }
  try {
    digits2 = arg2.toString().split('.')[1].length || 0;
  } catch {
    digits2 = 0;
  }
  maxDigits = 10 ** Math.max(digits1, digits2);
  return (mul(arg1, maxDigits) + mul(arg2, maxDigits)) / maxDigits;
}

// 减
function sub(arg1, arg2) {
  let digits1, digits2, maxDigits;
  try {
    digits1 = arg1.toString().split('.')[1].length || 0;
  } catch {
    digits1 = 0;
  }
  try {
    digits2 = arg2.toString().split('.')[1].length || 0;
  } catch {
    digits2 = 0;
  }
  maxDigits = 10 ** Math.max(digits1, digits2);
  return (mul(arg1, maxDigits) - mul(arg2, maxDigits)) / maxDigits;
}

// 乘
function mul(arg1, arg2) {
  let digits = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  try {
    digits += s1.split('.')[1].length;
  } catch {}
  try {
    digits += s2.split('.')[1].length;
  } catch {}
  return (Number(s1.replace(/\./, '')) * Number(s2.replace(/\./, ''))) / 10 ** digits;
}

function div(arg1, arg2) {
  let int1 = 0;
  let int2 = 0;
  let digits1;
  let digits2;
  try {
    digits1 = arg1.toString().split('.')[1].length || 0;
  } catch (e) {
    digits1 = 0;
  }
  try {
    digits2 = arg2.toString().split('.')[1].length || 0;
  } catch (e) {
    digits2 = 0;
  }
  int1 = Number(arg1.toString().replace(/\./, ''));
  int2 = Number(arg2.toString().replace(/\./, ''));
  return ((int1 / int2) * 10) ** (digits2 - digits1 || 1);
}
```

顺便说一下，关于处理精度问题的解决方案，目前市面上已经有了很多较为成熟的库，比如 `bignumber.js`，`decimal.js`，以及 `big.js` 等，这些库不仅解决了浮点数的运算精度问题，还支持了大数运算，并且修复了原生 toFixed 结果不准确的问题。我们可以根据自己的需求来选择对应的工具。

最后提醒一下：这玩意儿也就面试的时候写一下，强烈建议业务中还是用现成的库，出了问题我可不负责的嗷，唉，我好菜啊

## 16. 垂直居中 textarea

### 难点

根本就他妈的不能通过 css 来实现输入的垂直居中

网上的那些傻逼就会复制答案，操他妈的 flex 都来了，什么傻卵玩意儿 🥲

只能用 js 来实现

### 思路

通过动态调整 paddingTop 来偏移文本内容。

需要注意的是，多行的时候，需要计算行数

可以通过 set Height 0，然后滚动高度就是输入文字的总高度，算完之后把高度复原

**行数 = 文字总高度 / 行高**

所以，**设置行高很重要**，默认是 normal，normal 是字符串，没办法计算的，所以自己手动设一个 lineheight 吧

```html
<textarea id="text"></textarea>
```

```css
textarea {
  width: 200px;
  height: 200px;
  padding: 0;
  margin: 0;
  line-height: 1.2;
  text-align: center;
  border: 1px solid black;
  box-sizing: border-box;
  word-break: break-all;
  resize: none;
}
```

```js
// 获取行数，注意需要先把paddingtop置0，不然scrollHeight会把padding算进去
function getLinesCount($textArea, lineHeight) {
  $textArea.style.paddingTop = 0;
  const h0 = $textArea.style.height;
  $textArea.style.height = 0;
  const h1 = $textArea.scrollHeight;
  $textArea.style.height = h0;
  return Math.floor(h1 / lineHeight);
}

function update() {
  const textArea = document.querySelector('#text');
  const lineHeight = Number(window.getComputedStyle(textArea).lineHeight.slice(0, -2));
  const h = textArea.getBoundingClientRect().height;
  const lines = getLinesCount(textArea, lineHeight);
  const top = h / 2 - (lineHeight * lines) / 2;
  textArea.style.paddingTop = `${top}px`;
}

window.onload = update;
```

## 17. interface 和 type 的区别

### 相同点：

- 都可以描述对象
- 都允许扩展（extends）

### 不同点：

- type 可以为任何类型引入名称，interface 只能描述对象
- type 不支持继承，只能通过交叉类型合并，interface 可以通过继承扩展，也可以通过重载扩展
- type 无法被实现 implements，而接口可以被派生类实现
- type 重名会抛出错误，interface 重名会产生合并
- interface 性能比 type 好一点（社区有讨论过这点，争议比较大，不管对不对，我贴出来兄弟们自己判断吧）

## 18. gulp 和 webpack 的区别

|  | **gulp** | **webpack** |
| :-: | :-: | :-: |
| **定位** | 强调的是规范前端开发的流程 | 是一个前端模块化方案 |
| **目标** | 自动化和优化开发工作流，为通用 website 开发而生 | 通用模块打包加载器，为移动端大型 SPA 应用而生 |
| **学习难度** | 易于学习，易于使用，api 总共只有 5 个方法 | 有大量新的概念和 api，有详尽的官方文档 |
| **使用场景** | 基于流的作用方式合适多页面应用开发 | 一切皆模块的特点适合单页面应用开发 |
| **作业方式** | 对输入（gulp.src）的 js，ts，scss，less 等资源文件进行打包（bundle）、编译（compile）、压缩、重命名等处理后（guld.dest）到指定目录中去，为了构建而打包 | 对入口文件（entry）递归解析生成依赖关系图，然后将所有以来打包在一起，在打包之前将所有依赖转译成可打包的 js 模块，为了打包而构建 |
| **使用方式** | 常规 js 开发，编写一些列构建任务（task） | 编辑各种 JSON 配置 |
| **优点** | 适合多页面开发，易于学习，易于使用，接口优雅 | 可以打包一切资源，适配各种模块系统 |
| **缺点** | 在大页面应用方面输出乏力，而且对流行的大页面技术有些难以处理（比如 vue 但文件组织，使用 gulp 处理就会很困难，而 webpack 一个 loader 就能轻松搞定） | 不适合多页应用开发，灵活度高但同时配置很繁琐复杂，"打包一切"这个优点对于 HTTP1.1 尤其重要，因为所有资源打包在一起能明显减少浏览器访问页面时的请求数量，从而减少应用程序必须等待的时间。但这个有点可能会随着 HTTP/2 的流行而变得不那么突出，因为 HTTP/2 的多路复用可以有效解决客服端并行请求的瓶颈问题。 |
| **结论** | 浏览器多页应用（MPA）首选方案 | 浏览器单页应用（SPA）首选方案 |

## 19. 手写 getQueryString

```js
const src = 'https://www.baidu.com/?id=123&name=aaa&phone=12345';

const getQueryString = url => {
  if (!url.includes('?')) {
    return null;
  }
  const [, search] = url.split('?');
  const obj = {};
  search.split('&').forEach(item => {
    if (item.includes('=')) {
      const [key, val] = item.split('=');
      Reflect.set(obj, key, val);
    }
  });
  return obj;
};

getQueryString(src);
// { id: "123", name: "aaa", phone: "12345" }
```

## 20. 手写 Array.flat(Infinity)

```js
const isArray = Array.isArray;

const flatDeep = arr => {
  return arr.reduce((acc, val) => acc.concat(isArray(val) ? flatDeep(val) : val), []);
};

flatDeep([1, 2, [3, [4, [5, 6]]]]);
// [1, 2, 3, 4, 5, 6]
```

## 21. 算法 — 有效的括号

```ts
// map解法
const isValid = (s: string): boolean => {
  if (s.length & 1) {
    return false;
  }
  const stack: string[] = [];
  const map = new Map<string, string>();
  map.set('(', ')');
  map.set('{', '}');
  map.set('[', ']');
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (map.has(c)) {
      stack.push(c);
    } else {
      const t = stack.at(-1);
      if (map.get(t) === c) {
        stack.pop();
      } else {
        return false;
      }
    }
  }
  return stack.length === 0;
};

// 栈解法
const isValid2 = (s: string): boolean => {
  if (s.length & 1) {
    return false;
  }
  const stack: string[] = [];
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (['(', '[', '{'].includes(c)) {
      stack.push(c);
    } else {
      const t = stack.at(-1);
      if ((t === '(' && c === ')') || (t === '[' && c === ']') || (t === '{' && c === '}')) {
        stack.pop();
      } else {
        return false;
      }
    }
  }
  return stack.length === 0;
};
```
