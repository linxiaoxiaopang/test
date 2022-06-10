let cacheHeight = 100;

export class Animal {
  constructor(year, name) {
    this.year = year;
    this.name = name;
    this.x = 1;
  }

  get height() {
    return cacheHeight;
  }

  set height(newVal) {
    console.log("newVal", newVal);
    console.log("this", this);
    cacheHeight = newVal;
  }

  sayHello() {
    console.log(`${this.name}说汪汪`);
  }

  static sayStatic() {
    console.log("sayStatic");
  }

  sayYear() {
    console.log(`我的年龄${this.year}`);
    this.haha;
  }
}

export class Dog extends Animal {
  constructor() {
    super("小白", 20);
    console.log("this", this);
    console.log("this__proto__", this.__proto__);

    // this.x = 2;
    // super.x = 3;
    // this.name = "小黑";
    // console.log("super.x", super.x);
    // console.log("this.x", this.x);
  }

  static sayStatic() {
    super.sayStatic();
  }

  printName() {
    super.sayHello();
  }
}

// export function MyArray() {
//   Array.apply(this, arguments);
// }

// // MyArray.prototype = Object.create(Array.prototype, {
// //   constructor: {
// //     value: MyArray,
// //     writable: true,
// //     configurable: true,
// //     enumerable: true,
// //   },
// // });

// MyArray.prototype = Object.create(Array.prototype);

export class MyArray extends Array {
  constructor() {
    super();
    this.history = [[]];
  }

  commit() {
    this.history.push(this.slice(0));
  }
}
