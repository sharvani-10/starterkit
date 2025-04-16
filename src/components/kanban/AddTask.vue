<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

interface Task {
  TaskId: number;
  Title: string;
  Description: string;
  DueDate: string;
  Status: string;
  Priority: string;
  AssignedTo: string;
  OrganizationId: number;
  SubOrganizationId: number;
  CreatedBy: string;
  ModifiedBy: string;
  RecId: number;
}

const dialog = ref(false);
const tasks = ref<Task[]>([]);

// Form fields
const title = ref('');
const description = ref('');
const dueDate = ref('');
const status = ref('ToDo');
const priority = ref('Medium');
const assignedTo = ref<string>(''); // For AssignedTo

const API_URL = 'http://192.168.11.71:8008/tasks/';
const token = sessionStorage.getItem('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmcifQ.E5iOFK5967FZRmxD3_qI4DnI7lPJy2dIHmsVuwAuod8');
const USERS_API_URL = 'http://192.168.11.71:8008/users/';

const users = ref<any[]>([]); // Store the fetched users

// Load tasks on mount
onMounted(async () => {
  const stored = sessionStorage.getItem('tasks');
  if (stored) {
    tasks.value = JSON.parse(stored);
  } else {
    await fetchTasks();
  }
  await loadUsers(); // Load users when component mounts
});

// Fetch tasks from API
async function fetchTasks() {
  try {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    tasks.value = res.data;
    sessionStorage.setItem('tasks', JSON.stringify(res.data));
  } catch (err) {
    console.error('Error fetching tasks:', err);
  }
}

// Fetch users for the AssignedTo field
async function loadUsers() {
  try {
    const res = await axios.get(USERS_API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    users.value = res.data; // Assuming response is an array of users
  } catch (err) {
    console.error('Error fetching users:', err);
  }
}

// Add Task (POST + sessionStorage update)
async function addTask() {
  const newTask = {
    Title: title.value,
    Description: description.value,
    DueDate: dueDate.value,
    Status: status.value,
    Priority: priority.value,
    AssignedTo: assignedTo.value, // AssignedTo is set from user selection
    OrganizationId: 1, // Adjust as necessary
    SubOrganizationId: 1, // Adjust as necessary
    CreatedBy: 'admin', // Adjust as necessary
    ModifiedBy: 'admin', // Adjust as necessary
    RecId: Math.floor(Math.random() * 10000),
  };

  try {
    const res = await axios.post(API_URL, newTask, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    // Update local and sessionStorage
    tasks.value.push(res.data);
    sessionStorage.setItem('tasks', JSON.stringify(tasks.value));

    // Reset form
    title.value = '';
    description.value = '';
    dueDate.value = '';
    status.value = 'ToDo';
    priority.value = 'Medium';
    assignedTo.value = ''; // Reset assigned user
    dialog.value = false;
  } catch (err) {
    console.error('Error adding task:', err);
  }
}

const getTasks = computed(() => tasks.value);
</script>

<template>
  <v-sheet>
    <!-- ➕ Add Task Button -->
    <v-btn color="primary" @click="dialog = true">Add Task</v-btn>

    <!-- 📋 Add Task Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-text>
          <h4 class="text-h6 mb-4">Add Task</h4>
          <v-textarea outlined label="Task Title" v-model="title" />
          <v-textarea outlined label="Description" v-model="description" />
          <v-text-field outlined label="Due Date" v-model="dueDate" type="date" />
          <v-select
            outlined
            label="Status"
            :items="['ToDo', 'In Progress', 'Pending', 'Done']"
            v-model="status"
          />
          <v-select
            outlined
            label="Priority"
            :items="['High', 'Medium', 'Low']"
            v-model="priority"
          />
          <!-- Assigned To Dropdown -->
          <v-select
            outlined
            label="Assigned To"
            :items="users.map(user => ({ text: user.name, value: user.id }))"
            v-model="assignedTo"
            item-text="text"
            item-value="value"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="addTask">Save</v-btn>
          <v-btn color="secondary" @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 🗂 Kanban Style Cards -->
    <div class="d-flex flex-wrap mt-6" style="gap: 16px">
      <v-card
        v-for="task in getTasks"
        :key="task.TaskId"
        class="pa-4"
        elevation="6"
        width="300"
      >
        <div class="text-h6 mb-2">{{ task.Title }}</div>
        <div class="mb-2 text-subtitle-2">{{ task.Description }}</div>
        <div class="mb-1"><strong>Due:</strong> {{ task.DueDate }}</div>
        <div class="mb-1"><strong>Status:</strong> {{ task.Status }}</div>
        <div><strong>Priority:</strong> {{ task.Priority }}</div>
      </v-card>
    </div>
  </v-sheet>
</template>
