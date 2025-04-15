<template>
  <v-sheet class="pa-4">
    <!-- Button to open dialog -->
    <v-btn color="primary" @click="openDialog">
      <v-icon>mdi-plus</v-icon> Add Task
    </v-btn>

    <!-- Add Task Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-text>
          <h4 class="text-h6 mb-4">Add Task</h4>

          <!-- Task Title -->
          <v-textarea v-model="title" label="Task Title" outlined class="mb-4" />

          <!-- Task Subtitle -->
          <v-textarea v-model="subtitle" label="Task Subtitle" outlined class="mb-4" />

          <!-- Due Date -->
          <v-text-field v-model="dueDate" label="Due Date" type="date" outlined class="mb-4" />

          <!-- Priority Select -->
          <v-select
            v-model="priority"
            :items="['Low', 'Medium', 'High']"
            label="Priority"
            outlined
            class="mb-4"
          />

          <!-- Assigned To Select -->
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
          <!-- Save Button -->
          <v-btn color="primary" @click="addTask">Save</v-btn>

          <!-- Close Button -->
          <v-btn @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Display Tasks -->
    <v-row class="mt-6">
      <v-col
        v-for="task in tasks"
        :key="task.TaskId"
        cols="12" sm="6" md="4"
      >
        <v-card outlined>
          <v-card-text>
            <div><strong>{{ task.Title }}</strong></div>
            <div class="text-caption">{{ task.Description }}</div>
            <div class="text-caption">Assigned to: {{ task.AssignedTo }}</div>
            <div class="text-caption">Due: {{ task.DueDate }}</div>
            <div class="text-caption">Priority: {{ task.Priority }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Data and state for the dialog and form
const dialog = ref(false); // Dialog visibility
const title = ref('');
const subtitle = ref('');
const assignedTo = ref('');
const dueDate = ref('');
const priority = ref('Medium');
const users = ref<any[]>([]);
const tasks = ref<any[]>([]);

// Function to open the dialog
const openDialog = () => {
  console.log("Opening dialog..."); // Debugging log
  dialog.value = true;
};

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

// Add task function
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

  console.log('Task:', task); // Debugging task

  try {
    const token = sessionStorage.getItem('token'); // Make sure the token is correct
    console.log('Token:', token);  // Debugging token retrieval

    if (!token) {
      console.error('Token not found.');
      return;
    }

    const response = await axios.post('http://192.168.11.71:8008/tasks/', task, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log('Response:', response); // Debugging API response

    const newTask = response.data;
    tasks.value.push(newTask);  // Add new task to tasks array
    sessionStorage.setItem('allTasks', JSON.stringify(tasks.value));  // Update sessionStorage

    // Reset form and close dialog
    title.value = '';
    subtitle.value = '';
    assignedTo.value = '';
    dueDate.value = '';
    priority.value = 'Medium';
    dialog.value = false;

  } catch (err) {
    console.error('Error adding task:', err); // Log error
  }
};
</script>
