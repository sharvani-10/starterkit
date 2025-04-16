<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import TaskItemCard from './TaskItemCard.vue'

const props = defineProps({
  column: Object,
})

const dialog = ref(false)
const title = ref('')
const description = ref('')
const dueDate = ref('')
const priority = ref('Low')
const assignedTo = ref('')
const createdDate = ref('')
const updatedDate = ref('')

const token = sessionStorage.getItem('token') || ''
const tasks = ref<any[]>([])
const users = ref<any[]>([])
const organizationId = ref<number | null>(null) // ✅ Dynamic org ID

// Fetch users and organization info
onMounted(async () => {
  if (!token) {
    console.error('No token found. Please log in first.')
    return
  }

  try {
    // Fetch users
    const resUsers = await fetch('http://192.168.11.71:8008/users/', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    if (resUsers.ok) {
      users.value = await resUsers.json()
      console.log('Users fetched:', users.value)
    } else {
      console.error('Error fetching users:', await resUsers.text())
    }

    // Fetch organization ID from /me
    const resMe = await fetch('http://192.168.11.71:8008/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    if (resMe.ok) {
      const userData = await resMe.json()
      organizationId.value = userData.OrganizationId
      console.log('Organization ID:', organizationId.value)
    } else {
      console.error('Error fetching /me:', await resMe.text())
    }

  } catch (err) {
    console.error('Error fetching user/org data:', err)
  }
})

// Load tasks initially
const loadTasks = () => {
  const stored = sessionStorage.getItem('allTasks')
  tasks.value = stored ? JSON.parse(stored) : []
}
loadTasks()

const filteredTasks = computed(() => {
  return tasks.value.filter((task) => task.Status === props.column?.id)
})

const columnId = computed(() => props.column?.id || '')

const addTask = async () => {
  const newTask = {
    Title: title.value,
    Description: description.value,
    DueDate: dueDate.value,
    Priority: priority.value,
    Status: columnId.value,
    AssignedTo: assignedTo.value,
    CreatedDate: createdDate.value || new Date().toISOString().split('T')[0],
    UpdatedDate: updatedDate.value || new Date().toISOString().split('T')[0],
    OrganizationId: organizationId.value || 1, // fallback if /me fails
    SubOrganizationId: 1, // placeholder or default
    CreatedBy: users.value[0]?.UserName || 'admin',
    ModifiedBy: users.value[0]?.UserName || 'admin',
  }

  console.log('Submitting task: ', newTask)

  try {
    const res = await fetch('http://192.168.11.71:8008/tasks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newTask),
    })

    if (!res.ok) {
      const errorBody = await res.text()
      console.error('API Response Error:', errorBody)
      throw new Error('Failed to create task. ' + errorBody)
    }

    const data = await res.json()
    console.log('Task saved successfully: ', data)
    tasks.value.push(data)
    sessionStorage.setItem('allTasks', JSON.stringify(tasks.value))

    resetForm()
    dialog.value = false
  } catch (err) {
    console.error('Error saving task:', err)
  }
}


const resetForm = () => {
  title.value = ''
  description.value = ''
  dueDate.value = ''
  priority.value = 'Low'
  assignedTo.value = ''
  createdDate.value = ''
  updatedDate.value = ''
}
</script>


<template>
  <v-card elevation="10" :class="'bg-' + column?.cardbg">
    <div class="pa-5">
      <div class="d-flex align-center justify-space-between">
        <h6 class="text-h6 font-weight-semibold text-light">{{ column?.name }}</h6>
        <v-avatar
          size="22"
          elevation="10"
          class="bg-surface d-flex align-center cursor-pointer"
          @click="dialog = true"
        >
          <v-tooltip activator="parent" location="top">Add Task</v-tooltip>
          <v-icon size="18" color="primary">mdi-plus</v-icon>
        </v-avatar>
      </div>

      <div class="task-list mt-6">
        <div v-for="task in filteredTasks" :key="task.TaskId" class="mt-3">
          <TaskItemCard :task="task" />
        </div>
      </div>
    </div>

    <!-- Add Task Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-text>
          <h4 class="text-h6 mb-5">Add Task</h4>
          <form @submit.prevent="addTask">
            <v-text-field v-model="title" label="Title" outlined required />
            <v-textarea v-model="description" label="Description" outlined />
            <v-text-field v-model="dueDate" label="Due Date" type="date" outlined required />
            <v-select
              v-model="priority"
              label="Priority"
              :items="['Low', 'Medium', 'High']"
              outlined
              required
            />
            <v-select
              v-model="assignedTo"
              label="Assigned To"
              :items="users.map(user => user.UserName)"   
              :item-text="'UserName'"  
              :item-value="'UserId'" 
              outlined
            />
            <v-text-field v-model="createdDate" label="Created Date" type="date" outlined />
            <v-text-field v-model="updatedDate" label="Updated Date" type="date" outlined />

            <div class="d-flex justify-end gap-2 mt-4">
              <v-btn text @click="dialog = false">Cancel</v-btn>
              <v-btn color="primary" type="submit" :disabled="!title || !dueDate || !organizationId">Save</v-btn>
            </div>
          </form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>


<style scoped>
.bg-light-primary {
  background-color: #a7c7e7;
}
.bg-light-success {
  background-color: #b4d7a8;
}
.bg-light-warning {
  background-color: #f0d16b;
}
.bg-light-secondary {
  background-color: #b3b9c4;
}
.text-light {
  color: #0f0f0f;
}
</style>
