<template>
  <div>hello world</div>
</template>

<script>
import { Animal } from "@/utils";
console.log("Animal", Animal);
export default {
  created () {
    const dog = new Animal('dog', '16')
    Animal.sayName()
    dog.sayYear()

  }
};
</script>

<style>
</style>