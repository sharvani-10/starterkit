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

const tasks = ref<any[]>([])
const users = ref<any[]>([])

const loadTasks = () => {
  try {
    const stored = sessionStorage.getItem('allTasks')
    const parsed = stored ? JSON.parse(stored) : []
    tasks.value = Array.isArray(parsed) ? parsed : []
  } catch (e) {
    console.error('Failed to parse task data from sessionStorage:', e)
    tasks.value = []
  }
}

const fetchUsers = async () => {
  const token = sessionStorage.getItem('authToken')
  if (!token) {
    console.error('Token not found. User might not be authenticated.')
    return
  }

  try {
    const res = await fetch('http://192.168.11.71:8008/users/', {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(errorText)
    }
    users.value = await res.json()
    console.log('Users fetched:', users.value)
  } catch (err) {
    console.error('Error fetching users:', err)
  }
}

onMounted(async () => {
  loadTasks()
  await fetchUsers()
})

const filteredTasks = computed(() => {
  return tasks.value.filter((task) => task.Status === props.column?.id)
})

const columnId = computed(() => props.column?.id || '')

const addTask = async () => {
  const token = sessionStorage.getItem('authToken')
  if (!token) {
    console.error('Token not found. Cannot create task.')
    return
  }

  const newTask = {
    TaskId: 0,
    Title: title.value,
    Description: description.value,
    DueDate: dueDate.value,
    Priority: priority.value,
    Status: columnId.value,
    AssignedTo: assignedTo.value,
    CreatedBy: 'admin',
    ModifiedBy: 'admin',
  }

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
              :items="users.map(user => ({
                title: user.UserName,
                value: user.UserId
              }))"
              item-title="title"
              item-value="value"
              outlined
            />
            <div class="d-flex justify-end gap-2 mt-4">
              <v-btn text @click="dialog = false">Cancel</v-btn>
              <v-btn color="primary" type="submit" :disabled="!title || !dueDate">Save</v-btn>
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
