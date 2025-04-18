<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import BaseBreadcrumb from '@/components/shared/BaseBreadcrumb.vue';
import TaskColumn from './TaskColumn.vue';
import AddTask from './AddTask.vue';
import axios from 'axios';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  assignedTo?: string;
}

const tasks = ref<Task[]>([]);
const dialog = ref(false);
const draggedTask = ref<Task | null>(null);

const API_TASKS = 'https://shrimo.com/fake-api/todos';

const fetchTasks = async () => {
  try {
    const res = await axios.get(API_TASKS);
    const cleaned = res.data.map((item: any) => ({
      id: item._id || Math.random().toString(36).substr(2, 9),
      title: item.title,
      description: item.description,
      dueDate: item.dueDate,
      priority: item.priority,
      status: item.status,
      assignedTo: item.assignedTo || '',
    }));
    tasks.value = cleaned;
    sessionStorage.setItem('tasks', JSON.stringify(cleaned));
  } catch (err) {
    console.error('❌ Error loading tasks:', err);
  }
};

const updateTaskStatus = async (task: Task, newStatus: string) => {
  const updatedTask = { ...task, status: newStatus };
  try {
    await axios.put(`https://shrimo.com/fake-api/todos/${task.id}`, {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      status: newStatus,
      tags: [],
    });
  } catch (err) {
    console.error('❌ Error updating task status:', err);
  }
  tasks.value = tasks.value.map(t => t.id === task.id ? updatedTask : t);
  sessionStorage.setItem('tasks', JSON.stringify(tasks.value));
};

const onDrop = (status: string) => {
  if (draggedTask.value && draggedTask.value.status !== status) {
    updateTaskStatus(draggedTask.value, status);
  }
  draggedTask.value = null;
};

const columns = computed(() => {
  const grouped: Record<string, Task[]> = {
    'Not Started': [],
    'In Progress': [],
    'Pending': [],
    'Completed': []
  };

  tasks.value.forEach((task) => {
    if (grouped[task.status]) {
      grouped[task.status].push(task);
    } else {
      grouped[task.status] = [task];
    }
  });

  return Object.entries(grouped).map(([status, tasks]) => ({
    id: status,
    title: status,
    tasks
  }));
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
              @dragstart="(e) => draggedTask = e"
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
