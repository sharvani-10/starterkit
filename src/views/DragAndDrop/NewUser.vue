<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmcifQ.E5iOFK5967FZRmxD3_qI4DnI7lPJy2dIHmsVuwAuod8"

const form = ref({
  UserId: 0,
  UserName: '',
  UserEmail: '',
  ContactNo: '',
  Gender: '',
  Password: '',
  FirstName: '',
  MiddleName: '',
  LastName: '',
  CreatedBy: '',
  CreatedDatetime: new Date().toISOString()
})

const saveUser = async () => {
  try {
    const payload = [form.value]; // ✅ wrap user in an array

    console.log('Sending data:', JSON.stringify(payload, null, 2));

    const response = await axios.post('http://192.168.11.71:8008/users/', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('User created:', response.data);
    alert('User successfully created!');
    router.push('/users'); // Navigate back to user list or home
  } catch (error: any) {
    console.error('Error creating user:', error.response?.data || error.message);
    console.error('Error response detail:', error.response?.data?.detail); // Detailed backend message
    alert('Failed to create user. Check console for details.');
  }
}
</script>

<template>
  <v-container>
    <v-card max-width="600px" class="mx-auto mt-10 pa-5">
      <v-card-title class="text-h6">Add New User</v-card-title>
      <v-form @submit.prevent="saveUser">
        <v-text-field v-model="form.UserName" label="User Name" required />
        <v-text-field v-model="form.UserEmail" label="User Email" required />
        <v-text-field v-model="form.ContactNo" label="Contact Number" />
        <v-text-field v-model="form.Gender" label="Gender" />
        <v-text-field v-model="form.Password" label="Password" type="password" />
        <v-text-field v-model="form.FirstName" label="First Name" />
        <v-text-field v-model="form.MiddleName" label="Middle Name" />
        <v-text-field v-model="form.LastName" label="Last Name" />
        <v-text-field v-model="form.CreatedBy" label="Created By" />
        <v-text-field v-model="form.CreatedDatetime" label="Created Datetime" readonly />
        <v-btn color="primary" class="mt-3" type="submit">Create User</v-btn>
        <v-btn class="mt-3 ml-2" @click="router.back()">Cancel</v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>
