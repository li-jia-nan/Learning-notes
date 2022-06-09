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
const isBrowser = () => {
  return (
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.document.createElement !== 'undefined'
  );
};
```

## 14. 判断是否为移动端

```js
const userAgent = () => {
  const u = navigator.userAgent;
  return {
    trident: u.includes('Trident'),
    presto: u.includes('Presto'),
    webKit: u.includes('AppleWebKit'),
    gecko: u.includes('Gecko') && !u.includes('KHTML'),
    mobile: !!u.match(/AppleWebKit.*Mobile.*/),
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    android: u.includes('Android') || u.includes('Adr'),
    iPhone: u.includes('iPhone'),
    iPad: u.includes('iPad'),
    webApp: !u.includes('Safari'),
    weixin: u.includes('MicroMessenger'),
    qq: !!u.match(/\sQQ/i),
  };
};

const isMobile = () => {
  if (!isBrowser()) {
    return false;
  }
  const { mobile, android, ios } = userAgent();
  return mobile || android || ios || document.body.clientWidth < 750;
};
```

## 15. 实现一个 compose 函数

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

## 16. 处理数字精度问题

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

## 17. 垂直居中 textarea

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
function getLinesCount(textEle, lineHeight) {
  textEle.style.paddingTop = 0;
  const h0 = textEle.style.height;
  textEle.style.height = 0;
  const h1 = textEle.scrollHeight;
  textEle.style.height = h0;
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

## 18. interface 和 type 的区别

### 相同点：

- 都可以描述对象
- 都允许扩展（extends）

### 不同点：

- type 可以为任何类型引入名称，interface 只能描述对象
- type 不支持继承，只能通过交叉类型合并，interface 可以通过继承扩展，也可以通过重载扩展
- type 无法被实现 implements，而接口可以被派生类实现
- type 重名会抛出错误，interface 重名会产生合并
- interface 性能比 type 好一点（社区有讨论过这点，争议比较大，不管对不对，我贴出来兄弟们自己判断吧）

## 19. gulp 和 webpack 的区别

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

## 20. 手写 getQueryString

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

## 21. 手写 Array.flat(Infinity)

```js
const isArray = Array.isArray;

const flatDeep = arr => {
  return arr.reduce((acc, val) => acc.concat(isArray(val) ? flatDeep(val) : val), []);
};

flatDeep([1, 2, [3, [4, [5, 6]]]]);
// [1, 2, 3, 4, 5, 6]
```

## 22. 算法 — 有效的括号

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

## 23. 图片加载失败处理方式

图片为空很容易判断：

```tsx
<img src={imgSrc || defaultSrc} />
```

图片加载失败，使用图片自带的 error 事件处理即可：

```tsx
<img
  src={imgSrc}
  onError={event => {
    event.currentTarget.src = defaultSrc;
  }}
/>
```

注意`有些`加载 404 的图片不会走`error` 事件，而是走了`load`事件，那么我们可以通过直接添加一个占位底图来实现，这样如果能加载就会覆盖占位图，如果不能加载那就会显示底下的底图

```tsx
<div>
  <img src={imgSrc} />
  <img src={defaultSrc} />
</div>
```

## 24. 判断对象中是否存在某个属性的几种方法

### 1. hasOwnProperty()

`hasOwnProperty`方法会返回一个布尔值，指示对象自身属性中是否具有指定的属性（不包含原型上的属性）：

```js
({ a: 1 }.hasOwnProperty('a')); // true
({ a: 1 }.hasOwnProperty('toString')); // false
```

### 2. in 操作符

`in 操作符`会返回一个布尔值，指示对象自身属性中是否具有指定的属性（包含原型上的属性）：

```js
'a' in { a: 1 }; // true
'toString' in { a: 1 }; // true
```

### 3. Reflect.has()

`Reflect.has`作用与`in 操作符`相同：

```js
Reflect.has({ a: 1 }, 'a'); // true
Reflect.has({ a: 1 }, 'toString'); // true
```

## 25. 实现深拷贝

### 1. 简易版

这个方法有些缺点，懂的都懂，不再废话了

```js
const newData = JSON.parse(JSON.stringify(data));
```

### 2. 加强版

```js
const deepClone = obj => {
  const ans = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      ans[key] = obj[key] && typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key];
    }
  }
  return ans;
};

const newData = deepClone(data);
```

### 3. 非主流版

[`structuredClone`](https://developer.mozilla.org/zh-CN/docs/Web/API/structuredClone)：原生 js 的深拷贝，因为是新出的，所以兼容差的要死，不建议使用

```js
const newData = structuredClone(data);
```

目前只有浏览器可以用，node 环境还不支持，并且只有最新几个版本的浏览器才能用

对了，而且这个方法不能拷贝函数，遇到函数会直接报错，嘻嘻嘻

### 4. 终极版

```js
import { cloneDeep } from 'lodash';

const newData = cloneDeep(data);
```

## 26. 让指定方法最多只能被调用 1 次

```js
function before(n, func) {
  if (typeof n !== 'number') {
    throw new TypeError('Expected a number');
  }
  if (typeof func !== 'function') {
    throw new TypeError('Expected a function');
  }
  let result;
  return function (...args) {
    if (--n >= 0) {
      result = func.apply(this, args);
    }
    if (n < 0) {
      func = null;
    }
    return result;
  };
}

function once(func) {
  return before(1, func);
}

// 使用：

const initialize = once(doSomething);

initialize(); // 只有第一次有效
initialize(); // 无效
initialize(); // 无效
```

## 27. 老掉牙的面试题： React diff 是什么？可以省略吗？

回答：可以省略，但是强烈不推荐（废话文学，面试的时候直接说不可以就好了）

### 下面看满分答案：

- key 的作用就是服务于 diff 算法，是节点是否可以复用的首要判定条件
- 如果省略了 key，内部会默认使用 null，在列表节点有排序需求的情况下，会造成性能损耗

在 react 组件开发的过程中，`key`是一个常用的属性值，多用于列表开发. 这里从源码的角度，分析`key`在`react`内部是如何使用的，`key`是否可以省略.

### ReactElement 对象

我们在编程时直接书写的`jsx`代码，实际上是会被编译成 ReactElement 对象，所以`key`是`ReactElement对象`的一个属性.

#### 构造函数

在把`jsx`转换成`ReactElement对象`的语法时，有一个兼容问题. 会根据编译器的不同策略，编译成 2 种方案.

1. 最新的转译策略: 会将`jsx`语法的代码，转译成`jsx()`函数包裹

   `jsx`函数: 只保留与`key`相关的代码（其余源码这里不讨论）

   ```js
   /**
    * https://github.com/reactjs/rfcs/pull/107
    * @param {*} type
    * @param {object} props
    * @param {string} key
    */
   export function jsx(type, config, maybeKey) {
     let propName;

     // 1. key的默认值是null
     let key = null;

     // Currently, key can be spread in as a prop. This causes a potential
     // issue if key is also explicitly declared (ie. <div {...props} key="Hi" />
     // or <div key="Hi" {...props} /> ). We want to deprecate key spread,
     // but as an intermediary step, we will use jsxDEV for everything except
     // <div {...props} key="Hi" />, because we aren't currently able to tell if
     // key is explicitly declared to be undefined or not.
     if (maybeKey !== undefined) {
       // 2. 将key转换成字符串
       key = '' + maybeKey;
     }

     if (hasValidKey(config)) {
       // 2. 将key转换成字符串
       key = '' + config.key;
     }
     // 3. 将key传入构造函数
     return ReactElement(type, key, ref, undefined, undefined, ReactCurrentOwner.current, props);
   }
   ```

2. 传统的转译策略: 会将`jsx`语法的代码，转译成[React.createElement()函数包裹](https://github.com/facebook/react/blob/v17.0.2/packages/react/src/ReactElement.js#L126-L146)

   `React.createElement()函数`: 只保留与`key`相关的代码（其余源码这里不讨论）

   ```js
   /**
    * Create and return a new ReactElement of the given type.
    * See https://reactjs.org/docs/react-api.html#createelement
    */
   export function createElement(type, config, children) {
     let propName;

     // Reserved names are extracted
     const props = {};

     let key = null;
     let ref = null;
     let self = null;
     let source = null;

     if (config != null) {
       if (hasValidKey(config)) {
         key = '' + config.key; // key转换成字符串
       }
     }

     return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
   }
   ```

可以看到无论采取哪种编译方式，核心逻辑都是一致的:

1. `key`的默认值是`null`
2. 如果外界有显式指定的`key`，则将`key`转换成字符串类型.
3. 调用`ReactElement`这个构造函数，并且将`key`传入.

```js
// ReactElement的构造函数: 本节就先只关注其中的key属性
const ReactElement = function (type, key, ref, self, source, owner, props) {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type: type,
    key: key,
    ref: ref,
    props: props,
    _owner: owner,
  };
  return element;
};
```

源码看到这里，虽然还只是个皮毛，但是起码知道了`key`的默认值是`null`. 所以任何一个`reactElement`对象，内部都是有`key`值的，只是一般情况下（对于单节点）很少显式去传入一个 key.

### Fiber 对象

`react`的核心运行逻辑，是一个从输入到输出的过程（回顾`reconciler 运作流程`）. 编程直接操作的`jsx`是`reactElement对象`，我们的数据模型是`jsx`，而`react内核`的数据模型是`fiber树形结构`. 所以要深入认识`key`还需要从`fiber`的视角继续来看.

`fiber`对象是在`fiber树构造循环`过程中构造的，其构造函数如下:

```js
function FiberNode(tag: WorkTag, pendingProps: mixed, key: null | string, mode: TypeOfMode) {
  this.tag = tag;
  this.key = key; // 重点: key也是`fiber`对象的一个属性
  // ...
  this.elementType = null;
  this.type = null;
  this.stateNode = null;
  // ... 省略无关代码
}
```

可以看到，`key`也是`fiber`对象的一个属性. 这里和`reactElement`的情况有所不同:

1. `reactElement`中的`key`是由`jsx`编译而来，`key`是由开发者直接控制的（即使是动态生成，那也是直接控制）
2. `fiber`对象是由`react`内核在运行时创建的，所以`fiber.key`也是`react`内核进行设置的，程序员没有直接控制.

注意: `fiber.key`是`reactElement.key`的拷贝，他们是完全相等的（包括`null`默认值）。

接下来分析`fiber`创建，剖析`key`在这个过程中的具体使用情况.

`fiber`对象的创建发生在`fiber树构造循环`阶段中，具体来讲，是在`reconcileChildren`调和函数中进行创建.

### reconcileChildren 调和函数

`reconcileChildren`是`react`中的一个`明星`函数，最热点的问题就是`diff算法原理`，事实上，`key`的作用完全就是为了`diff算法`服务的.

> 注意: 这里只分析 key 相关的逻辑，对于 diff 函数的算法原理不做详细分析

调和函数源码（只摘取了部分代码）:

```js
function ChildReconciler(shouldTrackSideEffects) {
  function reconcileChildFibers(
    returnFiber: Fiber,
    currentFirstChild: Fiber | null,
    newChild: any,
    lanes: Lanes
  ): Fiber | null {
    // Handle object types
    const isObject = typeof newChild === 'object' && newChild !== null;

    if (isObject) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          // newChild是单节点
          return placeSingleChild(
            reconcileSingleElement(returnFiber, currentFirstChild, newChild, lanes)
          );
      }
    }
    //  newChild是多节点
    if (isArray(newChild)) {
      return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, lanes);
    }
    // ...
  }
  return reconcileChildFibers;
}
```

#### 单节点

这里先看单节点的情况`reconcileSingleElement`（只保留与`key`有关的逻辑）:

```js
function reconcileSingleElement(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  element: ReactElement,
  lanes: Lanes
): Fiber {
  const key = element.key;
  let child = currentFirstChild;
  while (child !== null) {
    // 重点1: key是单节点是否复用的第一判断条件
    if (child.key === key) {
      switch (child.tag) {
        default: {
          if (child.elementType === element.type) {
            // 第二判断条件
            deleteRemainingChildren(returnFiber, child.sibling);
            // 节点复用: 调用useFiber
            const existing = useFiber(child, element.props);
            existing.ref = coerceRef(returnFiber, child, element);
            existing.return = returnFiber;
            return existing;
          }
          break;
        }
      }
      // 不匹配，直接删除
      deleteRemainingChildren(returnFiber, child);
      break;
    }
    child = child.sibling;
  }
  // 重点2: fiber节点创建，`key`是随着`element`对象被传入`fiber`的构造函数
  const created = createFiberFromElement(element, returnFiber.mode, lanes);
  created.ref = coerceRef(returnFiber, currentFirstChild, element);
  created.return = returnFiber;
  return created;
}
```

可以看到，对于单节点来讲，有 2 个重点:

1. `key`是单节点是否复用的第一判断条件（第二判断条件是`type`是否改变，比如`div`改变为`span`）.
   - 如果`key`不同，其他条件是完全不看的
2. 在新建节点时，`key`随着`element`对象被传入`fiber`的构造函数.

所以到这里才是`key`的最核心作用, 是调和函数中, 针对单节点是否可以复用的`第一判断条件`.

对于单节点来讲, `key`是可以省略的, `react`内部会设置成默认值`null`. 在进行`diff`时, 由于`null === null`为`true`, 前后`render`的`key`是一致的, 可以进行复用比较.

如果单节点显式设置了`key`，且两次`render`时的`key`如果不一致，则无法复用.

#### 多节点

继续查看多节点相关的逻辑:

```js
function reconcileChildrenArray(
  returnFiber: Fiber,
  currentFirstChild: Fiber | null,
  newChildren: Array<*>,
  lanes: Lanes
): Fiber | null {
  if (__DEV__) {
    // First, validate keys.
    let knownKeys = null;
    for (let i = 0; i < newChildren.length; i++) {
      const child = newChildren[i];
      // 1. 在dev环境下, 执行warnOnInvalidKey.
      //  - 如果没有设置key, 会警告提示, 希望能显式设置key
      //  - 如果key重复, 会错误提示.
      knownKeys = warnOnInvalidKey(child, knownKeys, returnFiber);
    }
  }

  let resultingFirstChild: Fiber | null = null;
  let previousNewFiber: Fiber | null = null;

  let oldFiber = currentFirstChild;
  let lastPlacedIndex = 0;
  let newIdx = 0;
  let nextOldFiber = null;
  // 第一次循环: 只会在更新阶段发生
  for (; oldFiber !== null && newIdx < newChildren.length; newIdx++) {
    if (oldFiber.index > newIdx) {
      nextOldFiber = oldFiber;
      oldFiber = null;
    } else {
      nextOldFiber = oldFiber.sibling;
    }
    // 1. 调用updateSlot, 处理公共序列中的fiber
    const newFiber = updateSlot(returnFiber, oldFiber, newChildren[newIdx], lanes);
    if (newFiber === null) {
      // 如果无法复用, 则退出公共序列的遍历
      if (oldFiber === null) {
        oldFiber = nextOldFiber;
      }
      break;
    }
  }

  // 第二次循环
  if (oldFiber === null) {
    for (; newIdx < newChildren.length; newIdx++) {
      // 2. 调用createChild直接创建新fiber
      const newFiber = createChild(returnFiber, newChildren[newIdx], lanes);
    }
    return resultingFirstChild;
  }

  for (; newIdx < newChildren.length; newIdx++) {
    // 3. 调用updateFromMap处理非公共序列中的fiber
    const newFiber = updateFromMap(
      existingChildren,
      returnFiber,
      newIdx,
      newChildren[newIdx],
      lanes
    );
  }

  return resultingFirstChild;
}
```

在`reconcileChildrenArray`中, 有 3 处调用与`fiber`有关（当然也和`key`有关了）, 它们分别是:

1.  `updateSlot`

    ```js
    function updateSlot(
      returnFiber: Fiber,
      oldFiber: Fiber | null,
      newChild: any,
      lanes: Lanes
    ): Fiber | null {
      const key = oldFiber !== null ? oldFiber.key : null;

      if (typeof newChild === 'object' && newChild !== null) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE: {
            // 重点: key用于是否复用的第一判断条件
            if (newChild.key === key) {
              return updateElement(returnFiber, oldFiber, newChild, lanes);
            } else {
              return null;
            }
          }
        }
      }

      return null;
    }
    ```

2.  `createChild`

    ```js
    function createChild(returnFiber: Fiber, newChild: any, lanes: Lanes): Fiber | null {
      if (typeof newChild === 'object' && newChild !== null) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE: {
            // 重点: 调用构造函数进行创建
            const created = createFiberFromElement(newChild, returnFiber.mode, lanes);
            return created;
          }
        }
      }

      return null;
    }
    ```

3.  `updateFromMap`
    ```js
    function updateFromMap(
      existingChildren: Map<string | number, Fiber>,
      returnFiber: Fiber,
      newIdx: number,
      newChild: any,
      lanes: Lanes
    ): Fiber | null {
      if (typeof newChild === 'object' && newChild !== null) {
        switch (newChild.$$typeof) {
          case REACT_ELEMENT_TYPE: {
            //重点: key用于是否复用的第一判断条件
            const matchedFiber =
              existingChildren.get(newChild.key === null ? newIdx : newChild.key) || null;
            return updateElement(returnFiber, matchedFiber, newChild, lanes);
          }
        }
        return null;
      }
    }
    ```

针对多节点的`diff算法`可以分为三个步骤（请回顾算法章节`React 算法之调和算法`）:

1. 第一次循环：比较公共序列
   - 从左到右逐一遍历, 遇到一个无法复用的节点则退出循环.
2. 第二次循环：比较非公共序列

   - 在第一次循环的基础上, 如果`oldFiber`队列遍历完了, 证明`newChildren`队列中剩余的对象全部都是新增.
   - 此时继续遍历剩余的`newChildren`队列即可, 没有额外的`diff`比较.
   - 在第一次循环的基础上, 如果`oldFiber`队列没有遍历完, 需要将`oldFiber`队列中剩余的对象都添加到一个`map`集合中, 以`oldFiber.key`作为键.
   - 此时则在遍历剩余的`newChildren`队列时, 需要用`newChild.key`到`map`集合中进行查找, 如果匹配上了, 就将`oldFiber`从`map`中取出来, 同`newChild`进行`diff`比较.

3. 清理工作
   - 在第二次循环结束后, 如果`map`集合中还有剩余的`oldFiber`，则可以证明这些`oldFiber`都是被删除的节点, 需要打上删除标记.

通过回顾`diff算法`的原理, 可以得到`key`在多节点情况下的特性:

1. 新队列`newChildren`中的每一个对象（即`reactElement`对象）都需要同旧队列`oldFiber`中有相同`key`值的对象（即`oldFiber`对象）进行是否可复用的比较. `key`就是新旧对象能够对应起来的唯一标识.
2. 如果省略`key`或者直接使用列表`index`作为`key`, 表现是一样的（`key=null`时, 会采用`index`代替`key`进行比较）. 在新旧对象比较时, 只能按照`index`顺序进行比较, 复用的成功率大大降低, 大列表会出现性能问题.
   - 例如一个排序的场景: `oldFiber`队列有 100 个, `newChildren`队列有 100 个（但是打乱了顺序）. 由于没有设置`key`, 就会导致`newChildren`中的第 n 个必然要和`oldFiber`队列中的第 n 个进行比较, 这时它们的`key`完全一致（都是`null`）, 由于顺序变了导致`props`不同, 所以新的`fiber`完全要走更新逻辑（理论上比新创建一个的性能还要耗）.
   - 同样是排序场景可以出现的 bug: 上面的场景只是性能差（又不是不能用）, `key`使用不当还会造成`bug`
   - 还是上述排序场景, 只是列表中的每一个`item`内部又是一个组件, 且其中某一个`item`使用了局部状态（比如`class组件`里面的`state`）. 当第二次`render`时, `fiber`对象不会`delete`只会`update`导致新组件的`state`还沿用了上一次相同位置的旧组件的`state`，造成了状态混乱。

### 总结

在`react`中`key`是服务于`diff算法`, 它的默认值是`null`, 在`diff算法`过程中, 新旧节点是否可以复用, 首先就会判定`key`是否相同, 其后才会进行其他条件的判定. 在源码中, 针对多节点（即列表组件）如果直接将`key`设置成`index`和不设置任何值的处理方案是一样的, 如果使用不当, 轻则造成性能损耗, 重则引起状态混乱造成 bug.
