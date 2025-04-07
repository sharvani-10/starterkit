<template>
    <v-container>
      <v-form @submit.prevent="submitForm" ref="formRef">
        <v-text-field v-model="email" label="Email" required />
        <v-text-field v-model="password" label="Password" type="password" required />
  
        <v-text-field
          v-model="mobiles[0]"
          label="Mobile Number"
          class="mr-2"
          required
        />
  
        <v-btn type="submit" color="success" class="mt-4">Save</v-btn>
      </v-form>
  
      <v-divider class="my-5"></v-divider>
  
      <v-data-table
        :headers="headers"
        :items="users"
        item-value="email"
        class="elevation-1"
      >
        <template #item.mobiles="{ item }">
          <div>
            <div v-for="(mob, idx) in item.mobiles" :key="idx">{{ mob.number }}</div>
          </div>
        </template>
      </v-data-table>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import axios from 'axios'
  
  const email = ref('')
  const password = ref('')
  const mobiles = ref<string[]>(['']) // single mobile input
  
  const users = ref<any[]>([])
  const formRef = ref()
  
  const headers = [
    { text: 'Email', value: 'email' },
    { text: 'Mobiles', value: 'mobiles' }
  ]
  
  const submitForm = async () => {
    try {
      const payload = {
        email: email.value,
        password: password.value,
        mobiles: mobiles.value
      }
      console.log("payload",payload);
  
      const response = await axios.post('http://localhost:3000/users', payload)
      users.value.push(response.data)
      console.log("response",response);
      // Reset form
      email.value = ''
      password.value = ''
      mobiles.value = ['']
      formRef.value.resetValidation()
    } catch (err) {
      console.error('Error:', err)
    }
  }
  </script>
  
  <style scoped>
  .v-data-table {
    margin-top: 20px;
  }
  </style>
  