let cacheHeight = 100;

export class Animal {
    constructor(year, name) {
        this.year = year;
        this.name = name;
        const {sayHello} = this
    }

    get height() {
        return cacheHeight;
    }

    set height(newVal) {
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
        console.log('Animal', Animal.sayStatic)

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


export class MyArray extends Array {
    constructor() {
        super();
        this.history = [[]];
    }

    commit() {
        this.history.push(this.slice(0));
    }
}


class CustomHTMLElement {
  static myStaticProp = 42
    constructor(element) {
        this.element = element;
    }
    get html() {
        return this.element.innerHTML;
    }

    set html(value) {
        this.element.innerHTML = value;
    }
}

const descriptor = Object.getOwnPropertyDescriptor(CustomHTMLElement.prototype, "html");

console.log('CustomHTMLElement', CustomHTMLElement.myStaticProp)
"get" in descriptor  // true
"set" in descriptor  // true