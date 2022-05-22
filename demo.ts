// 方法一：定时器实现
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
