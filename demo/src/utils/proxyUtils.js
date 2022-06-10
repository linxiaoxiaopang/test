export function createProxy(object = {}) {
  return new Proxy(object, {
    get(target, key, receiver) {
      console.log("get");
      //   console.log("target, key, receiver", target, key, receiver);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      console.log("set");
      //   console.log("target, key, value, receiver", target, key, value, receiver);
      return Reflect.set(target, key, value, receiver);
    },
  });
}

export function defineProperty(object = {}, prop = "a") {
  let a = 0;
  return Object.defineProperty(object, prop, {
    get() {
      return a;
    },

    set(newVal) {
      console.log("newVal", newVal);
      a = newVal;
    },
  });
}
