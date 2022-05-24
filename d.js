function invokeCallback(callback, context, args) {
  try {
    callback && callback.apply(context, args);
  } catch {
    console.log('invoke callback error');
  }
}
const event = {
  subs: {},
  on: function (event, callback) {
    if (Array.isArray(event)) {
      for (let index = 0; index < event.length; index++) {
        this.on(event[index], callback);
      }
    } else {
      if (!this.subs[event]) {
        this.subs[event] = [];
      }
      this.subs[event].push(callback);
    }
  },
  off: function (event, callback) {
    // 1、一个参数都没有，解绑全部
    // 2、只传event，解绑改event所有事件
    // 3、两个参数都传递，只移除指定某一个
    if (!arguments.length) {
      this.subs = Object.create(null);
      return;
    }
    if (Array.isArray(event)) {
      for (let index = 0; index < event.length; index++) {
        this.off(event[index], callback);
      }
      return;
    }
    const cbs = this.subs[event];
    if (!cbs || cbs.length === 0) {
      return;
    }
    if (!callback) {
      this.subs[event] = null;
      return;
    }
    let cb;
    let i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === callback || cb.fn === callback) {
        cbs.splice(i, 1);
        break;
      }
    }
  },
  once: function (event, callback) {
    const self = this;
    function on() {
      self.off(event, on);
      callback.apply(self, arguments);
    }
    this.on(event, on);
  },
  emit: function (event) {
    const cbs = this.subs[event];
    if (cbs && cbs.length > 0) {
      console.log('xxxxx', [...arguments]);
      const args = [...arguments].slice(1);
      console.log('yyyyy', args);
      for (let index = 0, len = cbs.length; index < len; index++) {
        invokeCallback(cbs[index], this, args);
      }
    }
  },
};
const speakCallback1 = () => {
  // console.log('speak callback1');
};
const speakCallback2 = () => {
  // console.log('speak callback2');
};
const combineCallback = () => {
  // console.log('write or listen callback');
};
const runningCallback1 = msg => {
  // console.log('running callback1');
};
const runningCallback2 = msg => {
  // console.log('running callback2');
};
event.on('speak', speakCallback1);

event.emit('speak'); //
