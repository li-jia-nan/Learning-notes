export class Event {
  subs: Record<PropertyKey, (() => void)[] | null> = {};
  on = (event: string | string[], callback: () => void) => {
    if (Array.isArray(event)) {
      event.forEach(e => {
        this.on(e, callback);
      });
    } else {
      if (!this.subs[event]) {
        this.subs[event] = [];
      }
      this.subs[event].push(callback);
    }
  };
  off = (event: string | string[], callback: () => void) => {
    // 1、一个参数都没有，解绑全部
    // 2、只传event，解绑该event所有事件
    // 3、两个参数都传递，只移除指定某一个
    if (!event && !callback) {
      this.subs = {};
      return;
    }
    if (Array.isArray(event)) {
      event.forEach(e => {
        this.off(e, callback);
      });
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
  };
  once = (event: string, callback: () => void) => {
    const self = this;
    function on() {
      self.off(event, on);
      callback.apply(self, arguments);
    }
    this.on(event, on);
  };
  emit = (event: string) => {
    const cbs: any[] = this.subs[event];
    if (cbs && cbs.length > 0) {
      cbs.forEach(cb => {
        cb();
      });
    }
  };
}
