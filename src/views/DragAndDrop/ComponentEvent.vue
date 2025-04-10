<script setup>

</script>

<template>
   <h1>component event</h1> 
   <v-btn color = "primary" @click="$emit('incrementCounter')">+</v-btn>
</template>