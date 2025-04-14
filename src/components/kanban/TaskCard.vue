<script lang="ts" setup>
import { ref, onMounted, computed, toRaw } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import TaskColumn from './TaskColumn.vue';


const tasks = ref<any[]>([]);


const fetchTasks = async () => {
  console.log('Fetching tasks...'); // Debugging: Check when tasks are being fetched

  // Try to get tasks from sessionStorage first
  const storedTasks = sessionStorage.getItem('allTasks');
  if (storedTasks) {
    console.log('Found tasks in sessionStorage:', storedTasks); // Debugging: Log the data from sessionStorage
    tasks.value = JSON.parse(storedTasks); // Use stored tasks if available
  } else {
    console.log('No tasks found in sessionStorage, fetching from API...'); // Debugging: Log when no tasks in sessionStorage

    // If not found in sessionStorage, fetch from the API
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
        console.log('Fetched tasks from API:', data); // Debugging: Log the data from the API
        tasks.value = data; // Save fetched tasks to the `tasks` ref
        sessionStorage.setItem('allTasks', JSON.stringify(data)); // Store tasks in sessionStorage
      } catch (error) {
        console.error('Error fetching tasks:', error); // Debugging: Log any error during API fetch
      }
    } else {
      console.log('No auth token found'); // Debugging: Log when no token is available
    }
  }
};

// Group tasks by status to form columns
const columns = computed(() => {
  console.log('Grouping tasks by status...');

  const rawTasks = toRaw(tasks.value); // Extract raw tasks from Vue Proxy
  const grouped: Record<string, any> = {
    'ToDo': { id: 'ToDo', name: 'To Do', tasks: [] },
    'In Progress': { id: 'In Progress', name: 'In Progress', tasks: [] },
    'Pending': { id: 'Pending', name: 'Pending', tasks: [] },
    'Done': { id: 'Done', name: 'Done', tasks: [] }
  };

  if (rawTasks && rawTasks.length > 0) {
    console.log('Tasks available:', rawTasks);
    rawTasks.forEach((task) => {
      if (grouped[task.Status]) {
        grouped[task.Status].tasks.push(task);
      }
    });
  } else {
    console.log('No tasks to group');
  }

  const groupedColumns = Object.keys(grouped).map(key => grouped[key]);
  
  // Debugging: Log the grouped tasks by status
  groupedColumns.forEach((column) => {
    console.log(`Tasks in ${column.name}:`, column.tasks);
  });
  
  return groupedColumns;
});

// Fetch tasks when the component is mounted
onMounted(() => {
  fetchTasks();
});

// Breadcrumb data
const page = ref({ title: 'Kanban Application' });
const breadcrumbs = ref([
  {
    text: 'Dashboard',
    disabled: false,
    href: '#'
  },
  {
    text: 'Kanban Application',
    disabled: true,
    href: '#'
  }
]);
</script>

<template>
  <!-- Uncomment if using breadcrumbs -->
  <!-- <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" /> -->

  <v-card elevation="10">
    <div class="pa-5">
      <v-row>
        <!-- Loop through each column (grouped by status) -->
        <v-col
          v-for="column in columns"
          :key="column.id"
          cols="12" md="3" sm="6"
          class="d-flex"
        >
          <TaskColumn :column="column" />
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>
