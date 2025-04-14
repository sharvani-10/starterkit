<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const formTitle=ref(sessionStorage.getItem('formTitle'))
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmcifQ.E5iOFK5967FZRmxD3_qI4DnI7lPJy2dIHmsVuwAuod8"

const form = ref<any>({})
form.value=JSON.parse(<any>sessionStorage.getItem('item'))
const cancel = async () => {
  router.push('/Users')
}
const saveUser = async () => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmcifQ.E5iOFK5967FZRmxD3_qI4DnI7lPJy2dIHmsVuwAuod8";
  if(formTitle.value==='Add User'){
    try {
    const payload = form.value; 
    const response = await axios.post('http://192.168.11.71:8008/users/', payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
    if(response){
      alert('User Created Succesfully')
      router.push('/Users');
    }
    

  } catch (error: any) {
    console.error('Error creating user:', error.response?.data || error.message);
    console.error('Error response detail:', error.response?.data?.detail); 
    alert('Failed to create user. Check console for details.');
  }
  }else if(formTitle.value==='Update User'){
    try {
    const res = await axios.put(`http://192.168.11.71:8008/users/${form.value.UserId}`, form.value, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });
    if(res){
      alert('User Updated Succesfully')
      router.push('/Users');
    }

  } catch (error) {
    console.error('Error updating user:', error);
  }
  }
}
</script>

<template>
  <v-card elevation="0"  >
      <v-toolbar color="info" class="px-4 rounded">{{ formTitle }}</v-toolbar>
      <v-form @submit.prevent="saveUser" >
        <v-row class="pa-6">
          <v-col cols="12" md="6">
            <v-label class="pb-1">User Id</v-label>
            <v-text-field v-model="form.UserId" :disabled="formTitle==='Update User'" hide-details="auto" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-label class="pb-1">User Name</v-label>
            <v-text-field v-model="form.UserName" :disabled="formTitle==='Update User'" hide-details="auto" required />
          </v-col>
          <v-col cols="12" md="6">
            <v-label class="pb-1">First Name</v-label>
            <v-text-field v-model="form.FirstName"  />
          </v-col>
          <v-col cols="12" md="6">
            <v-label class="pb-1">Middle Name</v-label>
            <v-text-field v-model="form.MiddleName"  />
          </v-col>
          <v-col cols="12" md="6">
            <v-label class="pb-1">Last Name</v-label>
            <v-text-field v-model="form.LastName"/>
          </v-col>
          <v-col cols="12" md="6">
            <v-label class="pb-1">Email</v-label>
            <v-text-field v-model="form.UserEmail" hide-details="auto"  required />
          </v-col>
          <v-col cols="12" md="6">
            <v-label class="pb-1">Contact Number</v-label>
            <v-text-field v-model="form.ContactNo" hide-details="auto"/>
          </v-col>
          <v-col cols="12" md="6">
            <v-label class = "pb-1">Gender</v-label>
            <v-text-field v-model="form.Gender"/>
          </v-col>
          <v-col cols="12" md="12">

            <v-btn color="secondary" class="mt-3" type="submit">{{ formTitle==='Update User'?'Update':'Add' }}</v-btn>
            <v-btn color="error" variant="outlined" class="mt-3 mx-4" @click="cancel">{{ formTitle==='Update User'?'Close':'Cancel' }}</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
</template>
