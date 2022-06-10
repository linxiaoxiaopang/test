export class Animal {
  constructor(year, name) {
    this.year = year;
    this.name = name;
  }

  static sayHello() {
    console.log(`${this.name}说汪汪`);
  }

  sayYear() {
    console.log(`我的年龄${this.year}`);
  }
}
