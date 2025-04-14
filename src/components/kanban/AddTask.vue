<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const dialog = ref(false);
const title = ref('');
const subtitle = ref('');
const assignedTo = ref('');
const dueDate = ref('');
const priority = ref('Medium');
const users = ref<any[]>([]);
const tasks = ref<any[]>([]);

// Fetch users and tasks from sessionStorage on mount
onMounted(() => {
  const storedUsers = sessionStorage.getItem('allUsers');
  if (storedUsers) {
    users.value = JSON.parse(storedUsers);
  }

  const storedTasks = sessionStorage.getItem('allTasks');
  if (storedTasks) {
    tasks.value = JSON.parse(storedTasks);
  }
});

// Add task
const addTask = async () => {
  const task = {
    TaskId: 0,
    Title: title.value,
    DueDate: dueDate.value || new Date().toISOString().split('T')[0],
    AssignedTo: assignedTo.value,
    Description: subtitle.value,
    Status: 'ToDo',
    Priority: priority.value,
    OrganizationId: 1,
    SubOrganizationId: 1,
    CreatedBy: 'user',
    ModifiedBy: 'user',
  };

  try {
    const token = sessionStorage.getItem(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmcifQ.E5iOFK5967FZRmxD3_qI4DnI7lPJy2dIHmsVuwAuod8'
    );

    if (!token) {
      console.error('Token not found.');
      return;
    }

    const response = await axios.post('http://192.168.11.71:8008/tasks/', task, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const newTask = response.data;
    tasks.value.push(newTask);
    sessionStorage.setItem('allTasks', JSON.stringify(tasks.value));

    // Reset form
    title.value = '';
    subtitle.value = '';
    assignedTo.value = '';
    dueDate.value = '';
    priority.value = 'Medium';
    dialog.value = false;
  } catch (err) {
    console.error('Error adding task:', err);
  }
};
</script>

<template>
  <v-sheet class="pa-4">
    <!-- Button to open dialog -->
    <v-btn color="primary" @click="dialog = true">
      <v-icon>mdi-plus</v-icon> Add Task
    </v-btn>

    <!-- Add Task Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-text>
          <h4 class="text-h6 mb-4">Add Task</h4>

          <v-textarea v-model="title" label="Task Title" outlined class="mb-4" />
          <v-textarea v-model="subtitle" label="Task Subtitle" outlined class="mb-4" />
          <v-text-field v-model="dueDate" label="Due Date" type="date" outlined class="mb-4" />

          <v-select
            v-model="priority"
            :items="['Low', 'Medium', 'High']"
            label="Priority"
            outlined
            class="mb-4"
          />

          <v-select
            v-model="assignedTo"
            :items="users"
            item-title="UserName"
            item-value="UserName"
            label="Assigned To"
            outlined
            class="mb-4"
          />
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" @click="addTask">Save</v-btn>
          <v-btn @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Display Tasks -->
    <v-card class="mt-6" v-for="task in tasks" :key="task.TaskId" outlined>
      <v-card-text>
        <div><strong>{{ task.Title }}</strong></div>
        <div class="text-caption">{{ task.Description }}</div>
        <div class="text-caption">Assigned to: {{ task.AssignedTo }}</div>
        <div class="text-caption">Due: {{ task.DueDate }}</div>
        <div class="text-caption">Priority: {{ task.Priority }}</div>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>
