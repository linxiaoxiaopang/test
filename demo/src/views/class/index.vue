<template>
  <div>
    <div @click="animalHandler">Animal</div>
    <div @click="dogHandler">Dog</div>
    <div @click="dogProtoHandler">dogProtoHandler</div>
    <div @click="myArrayHandler">MyArrayHandler</div>
  </div>
</template>

<script>
import { Animal, Dog, MyArray } from "@/utils";
const dog = new Animal("dog", "16");
const dog1 = new Dog();
export default {
  methods: {
    animalHandler() {
      dog.height += 10;
      console.log("dog height", dog.height);
    },

    dogHandler() {
      console.log("dog1", dog1);
      dog1.printName();
      Dog.sayStatic();
    },

    dogProtoHandler() {
      const proto = Dog.__proto__;
      console.log("proto", proto);
    },

    myArrayHandler () {
      const myArray = new MyArray()
      myArray.push(1)
      myArray.push(2)
      myArray.commit()
      console.log('myArray', myArray)
      console.log('myArray.history', myArray.history) 
      myArray.length = 1
      myArray.commit()
       console.log('myArray', myArray)
      console.log('myArray.history', myArray.history) 


    }
  },
};
</script>

<style>
</style>