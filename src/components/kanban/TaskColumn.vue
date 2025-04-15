<script setup lang="ts">
import { ref, computed } from 'vue';
import TaskItemCard from './TaskItemCard.vue';
const dialog = ref(false);
import draggableComponent from 'vuedraggable';


// Assuming task data is stored in sessionStorage
const props = defineProps({
  column: Object,
});

const tasks = ref<any[]>([]);

// Function to retrieve tasks from sessionStorage
const getTasksFromSession = () => {
  const storedTasks = sessionStorage.getItem('allTasks');
  if (storedTasks) {
    tasks.value = JSON.parse(storedTasks);
  } else {
    tasks.value = [];
  }
};

// Call to fetch tasks
getTasksFromSession();

// Filter tasks by column status
const filteredTasks = computed(() => {
  return tasks.value.filter((task) => task.Status === props.column?.id);
});

// Function to add a new task
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
      <draggable class="dragArea list-group mt-6" :list="filteredTasks" :animation="200" ghost-class="ghost-card" group="tasks">
        <transition-group>
          <div v-for="task in filteredTasks" :key="task.TaskId" class="mt-3 cursor-move">
            <TaskItemCard :task="task" />
          </div>
        </transition-group>
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
