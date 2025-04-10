<!-- vue.js is js framework used fpor building user interfaces,particularly for single page page applications -->

<script setup>
const myMessage = 'Yellow World'
const myNumber = 100
const msg = "hello"
const google = "https://vuejs.org/api/"
const image = "https://img.freepik.com/premium-photo/trees-growing-forest_1048944-30368869.jpg?w=996"
const altText = "just a image"
const imageWidth=400
const imageHeight = 400
//dynamically image binding
const imageInfo = {
  src: "https://img.freepik.com/premium-photo/trees-growing-forest_1048944-30368869.jpg?w=996",
  alt: " just a image",
  width:400,
  height:400
}
function add(x, y) {
  return x + y
}
console.log("hello world")
</script>

<template>
  <div>
    <!-- text-interpolation:dynamically updating data -->
    <h1>{{ myMessage }}</h1>
    <h1>{{ myNumber }}</h1>
    <h1>{{ msg }}</h1>
    <!-- expressions -->
    <h1>2 + 2 = {{ 2 + 2 }}</h1>
    <h1>Add Two Numbers: {{ add(2, 2) }}</h1>
    <!-- <p>Not allowed: {{ const myName = 'huxn' }}</p> ❌ -->
    <!-- html attribute bindings - anchor tag links  -->
     <a v-bind:href="google ">html attribute bind</a><br/>>
     <a :href="google ">html attribute bind</a><br/>
     <!-- <img :src="image"  :alt="altText" :width="imageWidth"  :height="imageHeight" /> -->
     <!-- dynamically image binding  -->
     <img v-bind:="imageInfo" />

  </div>
</template>
<!-- style scoped - if it is scoped means it will work locally
 global styling- if we remove scoped then it will work globally and import it in app.vue -->
<style scoped>
h1{
    color:green;
}
</style>