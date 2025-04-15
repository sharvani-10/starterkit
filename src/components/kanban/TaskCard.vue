<script lang="ts" setup>
import { ref, onMounted, computed, toRaw } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import TaskColumn from './TaskColumn.vue';

const tasks = ref<any[]>([]);

const fetchTasks = async () => {
  console.log('Fetching tasks...'); 

  const storedTasks = sessionStorage.getItem('allTasks');
  if (storedTasks) {
    console.log('Found tasks in sessionStorage:', storedTasks);
    tasks.value = JSON.parse(storedTasks);
  } else {
    console.log('No tasks found in sessionStorage, fetching from API...');
    const token = sessionStorage.getItem('authToken');
    if (token) {
      try {
        const response = await fetch('http://192.168.11.71:8008/tasks/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        const data = await response.json();
        console.log('Fetched tasks from API:', data);
        tasks.value = data;
        sessionStorage.setItem('allTasks', JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    } else {
      console.log('No auth token found');
    }
  }
};

const columns = computed(() => {
  const rawTasks = toRaw(tasks.value);
  const grouped: Record<string, any> = {
    'ToDo': { id: 'ToDo', name: 'To Do', cardbg: 'bg-light-primary', tasks: [] },
    'In Progress': { id: 'In Progress', name: 'In Progress', cardbg: 'bg-light-warning', tasks: [] },
    'Pending': { id: 'Pending', name: 'Pending', cardbg: 'bg-light-secondary', tasks: [] },
    'Done': { id: 'Done', name: 'Done', cardbg: 'bg-light-success', tasks: [] }
  };

  if (rawTasks && rawTasks.length > 0) {
    rawTasks.forEach((task) => {
      if (grouped[task.Status]) {
        grouped[task.Status].tasks.push(task);
      }
    });
  }

  return Object.keys(grouped).map(key => grouped[key]);
});

onMounted(() => {
  fetchTasks();
});

const page = ref({ title: 'Kanban Application' });
const breadcrumbs = ref([
  { text: 'Dashboard', disabled: false, href: '#' },
  { text: 'Kanban Application', disabled: true, href: '#' }
]);
</script>

<template>
  <v-card elevation="10">
    <div class="pa-5">
      <v-row>
        <v-col
          v-for="column in columns"
          :key="column.id"
          cols="12" md="3" sm="6"
          class="d-flex"
        >
          <!-- Ensure that column.cardbg is passed as a dynamic class for background color -->
          <TaskColumn :column="column" :class="column.cardbg" />
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>
