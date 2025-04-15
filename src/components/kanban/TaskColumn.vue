<script setup lang="ts">
import { ref, computed } from 'vue';
import draggable from 'vuedraggable'; // Importing vuedraggable
import TaskItemCard from './TaskItemCard.vue';

const dialog = ref(false);

const props = defineProps({
  column: Object,
});

const tasks = ref<any[]>([]);

// Retrieve tasks from sessionStorage
const getTasksFromSession = () => {
  const storedTasks = sessionStorage.getItem('allTasks');
  if (storedTasks) {
    tasks.value = JSON.parse(storedTasks);
  } else {
    tasks.value = [];
  }
};

getTasksFromSession();

// Filter tasks by column status
const filteredTasks = computed(() => {
  return tasks.value.filter((task) => task.Status === props.column?.id);
});

// Function to handle the drop event
const onTaskDrop = (event: any) => {
  console.log('Drop Event:', event); 
  const movedTask = event.item?.__draggable_context?.element; // Get the moved task
  if (movedTask) {
    const index = tasks.value.findIndex(t => t.TaskId === movedTask.TaskId);
    if (index !== -1) {
      console.log('Task at index:', tasks.value[index]); // Log the task at the current index
      tasks.value = [
        ...tasks.value.slice(0, index),
        { ...tasks.value[index], Status: props.column.id }, // Update status for the moved task
        ...tasks.value.slice(index + 1)
      ];
      sessionStorage.setItem('allTasks', JSON.stringify(tasks.value)); // Save the updated tasks to sessionStorage
    }
  }
};

// Function to add new tasks
const addTask = (newTask: any) => {
  tasks.value.push(newTask);
  sessionStorage.setItem('allTasks', JSON.stringify(tasks.value));
};
</script>

<template>
  <!-- Modify the background class dynamically using 'bg-' + props.column?.cardbg -->
  <v-card :class="['pa-5', 'elevation-10', 'bg-' + props.column?.cardbg]">
    <div class="pa-5">
      <div class="d-flex align-center justify-space-between">
        <h6 class="text-h6 font-weight-semibold text-light">{{ props.column?.name }}</h6>

        <v-avatar size="22" elevation="10" class="bg-surface d-flex align-center cursor-pointer" @click="dialog = true">
          <v-tooltip activator="parent" location="top">Add Task</v-tooltip>
          <PlusIcon size="13" stroke-width="2" />
        </v-avatar>
      </div>

      <!-- Draggable Task List -->
      <draggable
        class="dragArea list-group mt-6"
        :list="filteredTasks"
        :animation="200"
        ghost-class="ghost-card"
        group="tasks"  
        @change="onTaskDrop"  
        item-key="TaskId"
      >
        <template #item="{ element }">
          <div class="mt-3 cursor-move">
            <TaskItemCard :task="element" />
          </div>
        </template>
      </draggable>

    </div>
  </v-card>
</template>

<style scoped>
/* Light colors */
.bg-light-primary {
  background-color: #a7c7e7; /* Lighter blue */
}

.bg-light-success {
  background-color: #b4d7a8; /* Lighter green */
}

.bg-light-warning {
  background-color: #f0d16b; /* Lighter yellow */
}

.bg-light-secondary {
  background-color: #b3b9c4; /* Lighter gray */
}

/* You can modify the title color if needed */
.text-light {
  color: #0f0f0f;
}
</style>
