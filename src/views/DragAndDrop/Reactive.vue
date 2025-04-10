<!-- reactive function is used to create reactive objects -->

<!-- it cannot store primitive objects like strings,booleans-->

<!-- it works with objects -->
<!-- ------------------------------- -->
<!-- This code is not gonna work because in "reactive" we can't use (primitive data types) -->

<!-- <script setup>
import { reactive } from 'vue'
let initialState = reactive(0)
</script>

<template>
  <h1>Count: {{ initialState.count }}</h1>
</template> -->
<!-- ------------------------------- -->

<!-- ------------------------------- -->
<!-- Example 1 -->

<!-- <script setup>
import { reactive } from 'vue'
let initialState = reactive({ count: 0 })
</script>

<template>
  <h1>Count: {{ initialState.count }}</h1>
  <button @click="initialState.count++">Increment</button>
  <button @click="initialState.count--">Decrement</button>
</template> -->
<!-- ------------------------------- -->

<!-- ------------------------------- -->
<!-- Example 2 -->

<script setup>
import { reactive } from 'vue'
let initialState = reactive({ val: { count: 0 }, user: ['Sharvani', 'Vanaparthi'] })

const changeUsers = () => {
  initialState.user[0] = 'frontend'
  initialState.user[1] = 'backend'
}
</script>

<template>
  <h1>Current Count: {{ initialState.val.count }}</h1>
  <h2>Users: {{ initialState.user }}</h2>

  <v-btn color = "secondary" @click="initialState.val.count += 10">Add 10</v-btn><br/><br/>
  <v-btn color = "secondary" @click="changeUsers">Change Uses</v-btn><br/><br/>
  <v-btn color = "secondary" @click="initialState.user.push('fullstack developer')">Add One More User</v-btn>
</template>
<!-- ------------------------------- -->