<script setup lang="ts">
import { ref } from 'vue';
import { formatDistanceToNowStrict } from 'date-fns';

// Define the structure of the task
interface Task {
  TaskId: number;
  Title: string;
  DueDate: string;
  AssignedTo: string;
  Description: string;
  Status: string;
  Priority: string;
  OrganizationId: number;
  SubOrganizationId: number;
  CreatedBy: string;
  ModifiedBy: string;
  RecId: number;
  TaskImg?: string;  // Optional property for the image
}

// Define props and specify the type of the task prop
const props = defineProps<{
  task: Task; // Correctly define the task prop type here
  taskIndex: number; // Assuming you pass the index to delete or update task
  updateTasks: (tasks: Task[]) => void; // Function to update the parent task list
  deleteTask: (taskId: number) => void; // Function to delete task from parent
}>();

const dialog = ref(false);

// Function to delete a task
function deleteTask(taskId: number) {
  props.deleteTask(taskId); // Call the parent deleteTask function
  dialog.value = false; // Close dialog if it's open (optional)
}
  
// Function to save the edited task
function save() {
  // Use props to update the task in the parent component or sessionStorage
  const tasks = JSON.parse(sessionStorage.getItem('tasks') || '[]') as Task[];
  tasks[props.taskIndex] = props.task; // Update the specific task based on index

  // Save the updated task list back to sessionStorage or call parent update function
  sessionStorage.setItem('tasks', JSON.stringify(tasks));
  props.updateTasks(tasks); // Update the tasks in the parent component

  dialog.value = false; // Close the dialog after saving
}

// Function to cancel editing
function cancel() {
  dialog.value = false; // Close dialog without saving changes
}
</script>

<template>
  <v-card elevation="10" class="mb-5">
    <div class="d-flex align-center justify-space-between px-4 py-2 pr-3">
      <h5 class="text-subtitle-2 font-weight-semibold pr-4 cursor-move">{{ props.task?.Title }}</h5>
      <RouterLink to="" class="px-0">
        <DotsVerticalIcon size="15" />
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
            <v-select label="Category" v-model="props.task.Priority" variant="outlined"
              :items="['High', 'Medium', 'Low']" />
            <v-select label="Status" v-model="props.task.Status" variant="outlined"
              :items="['ToDo', 'In Progress', 'Pending', 'Done']" />
            <v-btn color="primary" variant="flat" @click="save">Save</v-btn>
            <v-btn variant="flat" @click="cancel">Cancel</v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>

    <!-- Task Image -->
    <v-img v-if="props.task.TaskImg" :src="props.task.TaskImg" height="110px" cover class="w-100 mb-3" />
    
    <!-- Task Description -->
    <p v-if="props.task.Description" class="text-subtitle-2 px-4 text-medium-emphasis">{{ props.task.Description }}</p>

    <!-- Task Due Date and Priority -->
    <div class="d-flex align-center justify-space-between px-4 py-3">
      <div class="d-flex align-center">
        <CalendarIcon size="16" />
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
