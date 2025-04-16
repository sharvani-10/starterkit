<script lang="ts" setup>
import { ref, onMounted, computed, toRaw } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import TaskColumn from './TaskColumn.vue';
import axios from 'axios';

const tasks = ref<any[]>([]);
const users = ref<any[]>([]); // To hold user data for AssignedTo field

// Add static token for testing (remove in production!)
sessionStorage.setItem('authToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmcifQ.E5iOFK5967FZRmxD3_qI4DnI7lPJy2dIHmsVuwAuod8');

// API Base URL
const apiBaseUrl = 'http://192.168.11.71:8008/tasks/';
const usersApiUrl = 'http://192.168.11.71:8008/users/'; // URL to fetch users

// 🟡 Fetch tasks
const fetchTasks = async () => {
  const cached = sessionStorage.getItem('allTasks');
  if (cached) {
    tasks.value = JSON.parse(cached);
  } else {
    const token = sessionStorage.getItem('authToken');
    try {
      const res = await fetch(apiBaseUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const data = await res.json();
      tasks.value = data;
      sessionStorage.setItem('allTasks', JSON.stringify(data));
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }
};

// 🟡 Fetch users for AssignedTo field
const fetchUsers = async () => {
  const token = sessionStorage.getItem('authToken');
  try {
    const res = await axios.get(usersApiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    users.value = res.data;
  } catch (err) {
    console.error('Fetch users error:', err);
  }
};

// 🟢 Add task
const addTask = async (task: any) => {
  const token = sessionStorage.getItem('authToken');
  try {
    // Set missing fields if needed
    task.OrganizationId = task.OrganizationId || 0;
    task.SubOrganizationId = task.SubOrganizationId || 0;
    task.CreatedBy = task.CreatedBy || 'Default Creator';  // Replace with dynamic user if necessary
    task.ModifiedBy = task.ModifiedBy || 'Default Modifier'; // Replace with dynamic user if necessary

    const res = await fetch(apiBaseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    const newTask = await res.json();
    tasks.value.push(newTask);
    sessionStorage.setItem('allTasks', JSON.stringify(tasks.value));
  } catch (err) {
    console.error('Add task error:', err);
  }
};

// 🔵 Edit task
const updateTask = async (task: any) => {
  const token = sessionStorage.getItem('authToken');
  try {
    await fetch(`${apiBaseUrl}${task.TaskId}/`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    const index = tasks.value.findIndex(t => t.TaskId === task.TaskId);
    if (index !== -1) {
      tasks.value[index] = task;
      sessionStorage.setItem('allTasks', JSON.stringify(tasks.value));
    }
  } catch (err) {
    console.error('Update task error:', err);
  }
};

// 🔴 Delete task
const deleteTask = async (taskId: number) => {
  const token = sessionStorage.getItem('authToken');
  try {
    await fetch(`${apiBaseUrl}${taskId}/`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    tasks.value = tasks.value.filter(t => t.TaskId !== taskId);
    sessionStorage.setItem('allTasks', JSON.stringify(tasks.value));
  } catch (err) {
    console.error('Delete task error:', err);
  }
};

// 🧠 Group tasks by status
const columns = computed(() => {
  const grouped: Record<string, { id: string; name: string; tasks: any[] }> = {
    'ToDo': { id: 'ToDo', name: 'To Do', tasks: [] },
    'In Progress': { id: 'In Progress', name: 'In Progress', tasks: [] },
    'Pending': { id: 'Pending', name: 'Pending', tasks: [] },
    'Done': { id: 'Done', name: 'Done', tasks: [] }
  };

  tasks.value.forEach(task => {
    if (grouped[task.Status]) {
      grouped[task.Status].tasks.push(task);
    }
  });

  return Object.values(grouped);
});

// 🔃 Initial fetch
onMounted(() => {
  fetchTasks();
  fetchUsers();  // Fetch users when the component is mounted
});

// Breadcrumb
const page = ref({ title: 'TODO Application' });
const breadcrumbs = ref([
  { text: 'Dashboard', disabled: false, href: '#' },
  { text: 'Todo Application', disabled: true, href: '#' }
]);
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />

  <v-card elevation="10" class="mt-4">
    <div class="pa-5">
      <v-row>
        <v-col
          cols="12"
          md="3"
          sm="6"
          v-for="column in columns"
          :key="column.id"
          class="d-flex"
        >
          <TaskColumn
            :column="column"
            :users="users"  
            @add-task="addTask"
            @update-task="updateTask"
            @delete-task="deleteTask"
          />
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>
