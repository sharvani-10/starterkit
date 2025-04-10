<script setup>
import {ref} from 'vue'
let count= ref(0)
const incrementcounter = () => count.value++
const decrementcounter = () => count.value--

// submit handler
const submitHandler = (e) =>{
    e.preventDefault()
    alert('valid credentials')
}

// show message
const showmessage = (message) => alert(message)
</script>

<template>
<h1>count: {{ count }}</h1>
<!-- <button v-on:click="count++">increment</button> -->
<!-- two ways -->
<button color= "primary" @click="count++">increment</button>
<!-- vueitfy button -->
<v-btn color= "primary" @click="count++">increment</v-btn>
<!-- increement counter,decrement counter -->
 <button @click="incrementcounter">increment</button>
 <button @click="decrementcounter">decrement</button><br/>
 <br/>

 <!-- forms handling -->
  <form @submit="submitHandler">
    <!-- <input type = "text" placeholder="please enter your name">
    <input type = "email" placeholder="please enter your email"> -->
    <v-text-field
        v-model="firstName"
        :rules="firstNameRules"
        label="First name"
      ></v-text-field>

      <v-text-field
        v-model="lastName"
        :rules="lastNameRules"
        label="Last name"
      ></v-text-field>
    <!-- <button type = "submit">submit</button> -->
    <v-btn color= "primary" type = "submit">Submit</v-btn><br/>
  <!-- show mymessage -->
  <br/>
  <v-btn color= "primary" @click="showmessage('this is message')">show message</v-btn>


</form>

</template>

<!-- reactivity: it is the framework can autometically updates the ui without manipulating the dom-->

<!-- reactive state: reactive()  ref() -->