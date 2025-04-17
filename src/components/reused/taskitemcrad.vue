<script setup lang="ts">
import { ref } from 'vue';
import { formatDistanceToNowStrict } from 'date-fns';

interface Task {
  TaskId: number;
  Title: string;
  DueDate: string;
  AssignedTo: string;
  Description: string;
  Status: string;
  Priority: string;
  RecId: number;
  TaskImg?: string; 
}

const props = defineProps<{
  task: Task;
  taskIndex: number;
  updateTasks: (tasks: Task[]) => void;
  deleteTask: (taskId: number) => void;
}>();

const dialog = ref(false);

// Handle token management
const token = sessionStorage.getItem('authToken') || '';  // Adjust based on how you store token

function deleteTask(taskId: number) {
  if (token) {
    props.deleteTask(taskId);
    dialog.value = false;
  } else {
    console.error('No valid token found.');
  }
}

function save() {
  const tasks = JSON.parse(sessionStorage.getItem('tasks') || '[]') as Task[];
  
  if (token) {
    tasks[props.taskIndex] = props.task;
    sessionStorage.setItem('tasks', JSON.stringify(tasks));
    props.updateTasks(tasks);
    dialog.value = false;
  } else {
    console.error('No valid token found.');
  }
}

function cancel() {
  dialog.value = false;
}
</script>

<template>
  <v-card elevation="10" class="mb-5">
    <div class="d-flex align-center justify-space-between px-4 py-2 pr-3">
      <h5 class="text-subtitle-2 font-weight-semibold pr-4 cursor-move">
        {{ props.task?.Title }}
      </h5>

      <!-- Task Menu -->
      <RouterLink to="" class="px-0">
        <v-icon size="18" class="ml-2">mdi-dots-vertical</v-icon>
        <v-menu activator="parent">
          <v-list density="compact">
            <v-list-item value="Edit">
              <v-list-item-title @click="dialog = true">Edit</v-list-item-title>
            </v-list-item>
            <v-list-item value="Delete">
              <v-list-item-title @click="deleteTask(props.task.TaskId)">Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </RouterLink>

      <!-- Edit Task Dialog -->
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-text class="mb-4">
            <h4 class="text-h6 mb-5">Edit Task</h4>
            <v-text-field outlined v-model="props.task.Title" label="Title" />
            <v-textarea outlined v-model="props.task.Description" label="Subtitle" />
            <v-select
              label="Category"
              v-model="props.task.Priority"
              variant="outlined"
              :items="['High', 'Medium', 'Low']"
            />
            <v-select
              label="Status"
              v-model="props.task.Status"
              variant="outlined"
              :items="['ToDo', 'In Progress', 'Pending', 'Done']"
            />
            <v-btn color="primary" variant="flat" @click="save">Save</v-btn>
            <v-btn variant="flat" @click="cancel">Cancel</v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>

    <!-- Task Image -->
    <v-img v-if="props.task.TaskImg" :src="props.task.TaskImg" height="110px" cover class="w-100 mb-3" />

    <!-- Task Description -->
    <p v-if="props.task.Description" class="text-subtitle-2 px-4 text-medium-emphasis">
      {{ props.task.Description }}
    </p>

    <!-- Task Due Date and Priority -->
    <div class="d-flex align-center justify-space-between px-4 py-3">
      <div class="d-flex align-center">
        <v-icon size="16">mdi-calendar</v-icon>
        <div class="body-text-1 text-dark pl-2">
          {{ formatDistanceToNowStrict(new Date(props.task.DueDate), { addSuffix: false }) }} ago
        </div>
      </div>
      <div :class="'rounded-sm body-text-1 px-1 py-0 bg-' + props.task.Status" size="small">
        {{ props.task.Priority }}
      </div>
    </div>
  </v-card>
</template>
