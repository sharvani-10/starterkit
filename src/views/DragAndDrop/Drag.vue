<template>
  <v-container>
    <!-- Add User Button -->
    <v-btn color="primary" @click="dialog = true" class="mb-4">Add User</v-btn>

    <!-- User Form Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          Add New User
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="submitForm" ref="formRef">
            <!-- Email Field -->
            <v-text-field
              v-model="email"
              label="Email"
              variant="outlined"
              density="compact"
              class="mb-3"
              required
            />

            <!-- Password Field -->
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              variant="outlined"
              density="compact"
              class="mb-3"
              required
            />

            <!-- Mobile No. Field -->
            <v-text-field
              v-model="mobile"
              label="Mobile No."
              variant="outlined"
              density="compact"
              class="mb-3"
              required
            />

            <!-- Save Button -->
            <v-row justify="end">
              <v-btn type="submit" color="success">Save</v-btn>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-divider class="my-5"></v-divider>

    <!-- User Table -->
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
const mobile = ref('')

const users = ref<any[]>([])
const formRef = ref()
const dialog = ref(false)

const headers = [
  { text: 'Email', value: 'username' },
  { text: 'Password', value: 'password' },
  { text: 'Mobile', value: 'mobile' }
]

const fetchUsers = async () => {
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
}

onMounted(fetchUsers)

const submitForm = async () => {
  try {
    const payload = {
      username: email.value,
      password: password.value,
      mobile: mobile.value
    }

    await fetch('/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer fake-jwt-token'
      },
      body: JSON.stringify(payload)
    })

    await fetchUsers()

    email.value = ''
    password.value = ''
    mobile.value = ''
    formRef.value.resetValidation()
    dialog.value = false
  } catch (err) {
    console.error('POST failed:', err)
  }
}
</script>

<style scoped>
.custom-table {
  margin-top: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
</style>
