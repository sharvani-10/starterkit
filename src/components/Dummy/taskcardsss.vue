<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import TaskColumn from './TaskColumn.vue';
import axios from 'axios';

const token = sessionStorage.getItem('authToken') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlciJ9.abc';
sessionStorage.setItem('authToken', token);

const tasks = ref<any[]>([]);
const users = ref<any[]>([]);

const apiBaseUrl = 'http://192.168.11.71:8008/tasks/';
const usersApiUrl = 'http://192.168.11.71:8008/users/';

function getUsernameFromToken(): string {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.sub || 'unknown_user';
  } catch {
    return 'unknown_user';
  }
}

const fetchTasks = async () => {
  const cached = sessionStorage.getItem('allTasks');
  if (cached) {
    try {
      tasks.value = JSON.parse(cached);
    } catch {
      tasks.value = [];
    }
  } else {
    try {
      const res = await fetch(apiBaseUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const data = await res.json();
      tasks.value = Array.isArray(data) ? data : [];
      sessionStorage.setItem('allTasks', JSON.stringify(tasks.value));
    } catch (err) {
      console.error('Fetch error:', err);
      tasks.value = [];
    }
  }
};

const fetchUsers = async () => {
  try {
    const res = await axios.get(usersApiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
    users.value = Array.isArray(res.data) ? res.data : [];
  } catch (err: any) {
    console.error('Fetch users error:', err);
    if (err.response?.status === 401) {
      console.warn('Unauthorized: Invalid token or session expired.');
    }
    users.value = [];
  }
};

const addTask = async (task: any) => {
  const username = getUsernameFromToken();

  const taskWithMeta = {
    ...task,
    TaskId: 0,
    CreatedBy: username,
    ModifiedBy: username,
  };

  try {
    const res = await fetch(apiBaseUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskWithMeta),
    });

    if (!res.ok) {
      const errorBody = await res.json();
      throw new Error(`Failed to create task. ${JSON.stringify(errorBody)}`);
    }

    const newTask = await res.json();
    tasks.value.push(newTask);
    sessionStorage.setItem('allTasks', JSON.stringify(tasks.value));
  } catch (err) {
    console.error('Error saving task:', err);
  }
};

const updateTask = async (task: any) => {
  const username = getUsernameFromToken();
  const updatedTask = {
    ...task,
    ModifiedBy: username,
  };

  try {
    const res = await fetch(`${apiBaseUrl}${task.TaskId}/`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });

    if (!res.ok) {
      const errBody = await res.json();
      throw new Error(`Update failed: ${JSON.stringify(errBody)}`);
    }

    const updatedResTask = await res.json();
    const index = tasks.value.findIndex(t => t.TaskId === task.TaskId);
    if (index !== -1) {
      tasks.value[index] = updatedResTask;
      sessionStorage.setItem('allTasks', JSON.stringify(tasks.value));
    }
  } catch (err) {
    console.error('Update task error:', err);
  }
};

const deleteTask = async (taskId: number) => {
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

onMounted(() => {
  fetchTasks();
  fetchUsers();
});

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

