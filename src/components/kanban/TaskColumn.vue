<script setup lang="ts">
import { ref } from 'vue';
import draggable from 'vuedraggable';
import TaskItemCard from './TaskItemCard.vue';
import AddTask from './AddTask.vue';
import { PlusIcon } from 'lucide-vue-next';

const props = defineProps({
  column: {
    type: Object,
    required: true,
  },
});

const dialog = ref(false);
const columnStatus = ref(props.column.id);
const emit = defineEmits(['task-updated']);

// Function to open dialog for task creation
const openDialog = () => {
  dialog.value = true;
};

// Handle new task locally by adding it to the column's task list
const handleTaskUpdated = (taskData: any) => {
  const newTask = {
    id: Date.now(), // Generate a unique id for each task
    title: taskData.title,
    description: taskData.description,
    dueDate: taskData.dueDate,
    status: taskData.status,
    priority: taskData.priority,
  };
  props.column.tasks.push(newTask); // Add task to the column
  emit('task-updated');
  dialog.value = false; // Close the dialog
};

// Function to handle task drag-and-drop within columns
const handleTaskDragEnd = (event: any) => {
  // Emit event after task is moved to notify parent (if required)
  emit('task-updated');
};
</script>

<template>
  <v-card elevation="10" :class="'bg-' + (column.cardbg || 'surface')">
    <div class="pa-5">
      <!-- Column Header with Add Task button -->
      <div class="d-flex align-center justify-space-between">
        <h6 class="text-h6 font-weight-semibold">{{ column.title }}</h6>
        <v-avatar
          size="22"
          elevation="10"
          class="bg-surface d-flex align-center cursor-pointer"
          @click="openDialog"
        >
          <v-tooltip activator="parent" location="top">Add Task</v-tooltip>
          <PlusIcon size="13" stroke-width="2" />
        </v-avatar>
      </div>

      <!-- Draggable Task Cards -->
      <div class="mt-6">
        <draggable
          :list="column.tasks"
          group="tasks" 
          item-key="id"
          class="d-flex flex-column"
          ghost-class="ghost"
          drag-class="drag"
          @end="handleTaskDragEnd" 
        >
          <template #item="{ element: task }">
            <div class="mt-3">
              <TaskItemCard :task="task" />
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <!-- Add Task Dialog -->
    <AddTask
      :dialog="dialog"
      :defaultStatus="columnStatus"
      @update:dialog="dialog = $event"
      @task-updated="handleTaskUpdated"
    />
  </v-card>
</template>
