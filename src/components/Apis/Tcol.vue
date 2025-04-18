<script setup lang="ts">
import { ref } from 'vue';
import TaskItemCard from './TaskItemCard.vue';
import AddTask from './AddTask.vue';
import { PlusIcon } from 'lucide-vue-next';
import axios from 'axios';
import draggable from 'vuedraggable';

const props = defineProps({
  column: {
    type: Object,
    required: true,
  },
});

const dialog = ref(false);
const columnStatus = ref(props.column?.id);
const emit = defineEmits(['task-updated']);

const openDialog = () => {
  dialog.value = true;
};

// Handle new task creation from dialog
const handleTaskUpdated = async (taskData: any) => {
  try {
    const res = await axios.post('https://shrimo.com/fake-api/todos', {
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate,
      priority: taskData.priority,
      status: taskData.status,
      assignedTo: taskData.assignedTo,
    });

    const newTask = { ...taskData, id: res.data._id };
    const currentTasks = JSON.parse(sessionStorage.getItem('tasks') || '[]');
    currentTasks.push(newTask);
    sessionStorage.setItem('tasks', JSON.stringify(currentTasks));

    emit('task-updated');
    dialog.value = false;
  } catch (error) {
    console.error('Error saving task:', error);
  }
};
</script>

<template>
  <v-card elevation="10" :class="'bg-' + (column.cardbg || 'surface')">
    <div class="pa-5">
      <div class="d-flex align-center justify-space-between">
        <h6 class="text-h6 font-weight-semibold">{{ column?.title }}</h6>
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

      <!-- Task Cards with Drag -->
      <div class="mt-6">
        <draggable
          :list="column.tasks"
          group="tasks"
          item-key="id"
          class="d-flex flex-column"
          ghost-class="ghost"
          drag-class="drag"
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
