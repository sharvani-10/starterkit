<script lang="ts" setup>
import { ref } from 'vue';
import TaskItemCard from './TaskItemCard.vue';
import { uniqueId } from 'lodash'; // For unique task ID generation

const props = defineProps({
  column: Object, // Column data is passed as a prop
});

// Dialog and form data
const dialog = ref(false); 
const title = ref('');
const subtitle = ref('');
const category = ref('Mobile');
const categorybg = ref('primary');
const columnId = ref(props.column?.id);

// Function to retrieve tasks from sessionStorage
function getTasksFromSession() {
  const tasks = sessionStorage.getItem('tasks');
  return tasks ? JSON.parse(tasks) : { 'ToDo': [], 'In Progress': [], 'Pending': [], 'Done': [] }; // Default grouped task structure
}

// Function to save tasks into sessionStorage
function saveTasksToSession(tasks: any) {
  sessionStorage.setItem('tasks', JSON.stringify(tasks));
}

// Function to clear form fields after adding a task
function addItemAndClear() {
  title.value = '';
  subtitle.value = '';
  category.value = 'Mobile';
  categorybg.value = 'primary';
}

// Function to add a new task and clear the form
function addTaskAndClear() {
  const tasks = getTasksFromSession(); // Get current tasks from sessionStorage

  const newTask = {
    TaskId: uniqueId('task_'), // Unique task ID using lodash
    Title: title.value,
    DueDate: new Date().toISOString(), // Current date as due date
    AssignedTo: '', // Default empty, can be updated as needed
    Description: subtitle.value,
    Status: columnId.value,  // This should match the column status (e.g., ToDo)
    Priority: category.value, // Using category as priority for now
    OrganizationId: 1, // Static example value
    SubOrganizationId: 1, // Static example value
    CreatedBy: 'admin', // Static, replace with dynamic user data
    ModifiedBy: 'admin', // Static, replace with dynamic user data
    RecId: 1, // Modify if needed
  };

  // Add the new task to the correct column
  if (tasks[columnId.value]) {
    tasks[columnId.value].push(newTask); // Add the task to the right column (status)
  } else {
    // If no such status exists, you can handle it or log an error
    console.error(`Column with status "${columnId.value}" not found in tasks.`);
  }

  // Save updated tasks back to sessionStorage
  saveTasksToSession(tasks);

  // Clear form fields and close dialog
  addItemAndClear();
  dialog.value = false;
}
</script>

<template>
  <v-card elevation="10" :class="'bg-' + column?.cardbg">
    <div class="pa-5">
      <div class="d-flex align-center justify-space-between">
        <h6 class="text-h6 font-weight-semibold">{{ column?.title }}</h6>

        <!-- Add Task Button -->
        <v-avatar size="22" elevation="10" class="bg-surface d-flex align-center cursor-pointer" @click="dialog = true">
          <v-tooltip activator="parent" location="top">Add Task</v-tooltip>
          <PlusIcon size="13" stroke-width="2" />
        </v-avatar>
      </div>

      <!-- Draggable Task List -->
      <draggable class="dragArea list-group mt-6" :list="column?.tasks" :animation="200" ghost-class="ghost-card" group="tasks">
    <transition-group>
        <div v-for="task in column?.tasks" :key="task.TaskId" class="mt-3 cursor-move">
            <TaskItemCard :task="task" />
        </div>
    </transition-group>
</draggable>

    </div>

    <!-- Add Task Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-text class="mb-4">
          <h4 class="text-h6 mb-5">Add Task</h4>
          <form @submit.prevent="addTaskAndClear()">
            <v-text-field outlined name="Task" v-model="title" label="Title" required></v-text-field>
            <v-textarea outlined name="Task-subtitle" v-model="subtitle" label="Subtitle" required></v-textarea>
            <v-select label="Category" v-model="category" variant="outlined" :items="['Mobile', 'Design', 'Development']" required></v-select>
            <v-select label="Category Background" v-model="categorybg" variant="outlined" :items="['primary', 'warning', 'success', 'error']" required></v-select>
            <v-btn color="primary" variant="flat" type="submit" :disabled="title === '' || subtitle === ''">Save</v-btn>
          </form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>
