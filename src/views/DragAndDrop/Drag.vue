<template>
  <v-container>
    <!-- <v-form @submit.prevent="submitForm" ref="formRef">
      <v-row class="align-center mb-3">
        <v-col cols="2"><strong>Email:</strong></v-col>
        <v-col cols="10">
          <v-text-field
            v-model="email"
            variant="outlined"
            density="compact"
            hide-details
            required
          />
        </v-col>
      </v-row>

      <v-row class="align-center mb-3">
        <v-col cols="2"><strong>Password:</strong></v-col>
        <v-col cols="10">
          <v-text-field
            v-model="password"
            type="password"
            variant="outlined"
            density="compact"
            hide-details
            required
          />
        </v-col>
      </v-row>

      <v-row class="align-center mb-3">
        <v-col cols="2"><strong>Mobile No.:</strong></v-col>
        <v-col cols="10">
          <v-text-field
            v-model="mobiles[0]"
            variant="outlined"
            density="compact"
            hide-details
            required
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="text-right">
          <v-btn type="submit" color="success" class="mt-2">Save</v-btn>
        </v-col>
      </v-row>
    </v-form> -->

    <v-divider class="my-5"></v-divider>

    <!-- ✅ EasyDataTable -->
    <EasyDataTable
      :headers="headers"
      :items="users"
      table-class-name="custom-table"
      header-text-direction="left"
      body-text-direction="left"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const email = ref('')
const password = ref('')
const mobiles = ref<string[]>([''])

const users = ref<any[]>([])
const formRef = ref()

const headers = [
  { text: 'Email', value: 'email' },
  { text: 'Password', value: 'password' },
  { text: 'Mobiles', value: 'mobiles' }
]

// ✅ Fetch users on mount
onMounted(async () => {
  try {
    const res = await fetch('/users', {
      method: 'GET',
      headers: {
        Authorization: 'Bearer fake-jwt-token'
      }
    })
    users.value = await res.json()
  } catch (err) {
    console.error('Fetch users failed:', err)
  }
})

// ✅ Handle form submit and push to table
const submitForm = async () => {
  try {
    const payload = {
      email: email.value,
      password: password.value,
      mobiles: mobiles.value
    }

    const res = await fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer fake-jwt-token'
      },
      body: JSON.stringify(payload)
    })

    const newUser = await res.json()

    // ✅ Push to table immediately
    users.value.push(newUser)

    // Reset form
    email.value = ''
    password.value = ''
    mobiles.value = ['']
    formRef.value.resetValidation()

    console.log('POST payload:', payload)
    console.log('Current users:', users.value)
  } catch (err) {
    console.error('POST failed:', err)
  }
}
</script>


<style scoped>
.custom-table {
  margin-top: 20px;
}
</style>
