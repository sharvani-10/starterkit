<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import TaskColumn from './TaskColumn.vue';
import AddTask from './AddTask.vue';
import axios from 'axios';

interface Task {
  TaskId: number;
  Title: string;
  DueDate: string;
  AssignedTo: string;
  Description: string;
  Status: string;
  Priority: string;
}

const tasks = ref<Task[]>([]);
const dialog = ref(false);
const draggedTask = ref<Task | null>(null);

// Fetch tasks from sessionStorage instead of API
const fetchTasks = () => {
  const storedTasks = sessionStorage.getItem('tasks');
  if (storedTasks) {
    tasks.value = JSON.parse(storedTasks);
  }
};

// Update task status locally without making an API call
const updateTaskStatus = (task: Task, newStatus: string) => {
  const updatedTask = { ...task, Status: newStatus };

  // Reflect change in local tasks state
  tasks.value = tasks.value.map(t =>
    t.TaskId === task.TaskId ? updatedTask : t
  );

  // Store updated tasks back to sessionStorage
  sessionStorage.setItem('tasks', JSON.stringify(tasks.value));
};

// Drag-and-drop event without API call
const onDrop = (status: string) => {
  if (draggedTask.value && draggedTask.value.Status !== status) {
    updateTaskStatus(draggedTask.value, status);
  }
  draggedTask.value = null;
};

// Group tasks by status
const columns = computed(() => {
  const grouped: Record<string, Task[]> = {
    'Not Started': [],
    'In Progress': [],
    'Pending': [],
    'Completed': [],
  };

  tasks.value.forEach((task) => {
    if (grouped[task.Status]) {
      grouped[task.Status].push(task);
    } else {
      grouped[task.Status] = [task];
    }
  });

  return Object.entries(grouped).map(([status, tasks]) => ({
    id: status,
    title: status,
    tasks,
  }));
});

onMounted(() => {
  fetchTasks();
});

const page = ref({ title: 'ToDo Application' });
const breadcrumbs = ref([
  { text: 'Dashboard', disabled: false, href: '#' },
  { text: 'Todo Application', disabled: true, href: '#' },
]);
</script>

<template>
  <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs" />
  <v-card elevation="10">
    <div class="pa-5">
      <v-row>
        <v-col
          cols="12"
          md="3"
          sm="6"
          class="d-flex"
          v-for="column in columns"
          :key="column.id"
        >
          <div
            class="d-flex flex-column flex-grow-1"
            @dragover.prevent
            @drop="onDrop(column.id)"
          >
            <TaskColumn
              :column="column"
              @dragstart.native="draggedTask = $event"
            />
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Floating Add Button -->
    <v-btn
      fab
      color="primary"
      class="ma-4"
      style="position: fixed; bottom: 20px; right: 20px; z-index: 9999;"
      @click="dialog = true"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!-- Task Dialog -->
    <AddTask :dialog="dialog" @update:dialog="dialog = $event" @task-updated="fetchTasks" />
  </v-card>
</template>
