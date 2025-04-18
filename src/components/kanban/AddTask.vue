<script setup lang="ts">
import { ref, reactive, onMounted, defineEmits, defineProps, watch } from 'vue';
import axios from 'axios';

const props = defineProps({ dialog: Boolean });
const emit = defineEmits(['task-updated', 'update:dialog']);

const users = ref<{ id: number; name: string }[]>([]);
const task = reactive({
  title: '',
  description: '',
  dueDate: '',
  priority: '',
  status: '',
  assignedTo: '',
});

const API_TASKS = 'https://shrimo.com/fake-api/todos';
const API_USERS = 'https://api.escuelajs.co/api/v1/users';

const dialogModel = ref(props.dialog);

watch(() => props.dialog, (val) => {
  dialogModel.value = val;
  if (val) resetForm();
});
watch(dialogModel, (val) => emit('update:dialog', val));

const fetchUsers = async () => {
  try {
    const res = await axios.get(API_USERS);
    users.value = res.data.map((user: any) => ({
      id: user.id,
      name: user.name,
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const resetForm = () => {
  task.title = '';
  task.description = '';
  task.dueDate = '';
  task.priority = '';
  task.status = '';
  task.assignedTo = '';
};

const submitTask = async () => {
  console.log("✅ Save clicked");
  if (!task.title || !task.status) {
    alert('Please provide complete task details.');
    return;
  }

  const taskToPost = {
    title: task.title,
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority,
    status: task.status,
    tags: [], // required field for shrimo API
  };

  console.log("📤 Posting task to API:", taskToPost);

  try {
    const res = await axios.post(API_TASKS, taskToPost, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const newTask = {
      id: res.data._id || Math.random().toString(36).substr(2, 9),
      title: res.data.title,
      description: res.data.description,
      dueDate: res.data.dueDate,
      priority: res.data.priority,
      status: res.data.status,
      assignedTo: task.assignedTo,
    };

    const existing = JSON.parse(sessionStorage.getItem('tasks') || '[]');
    const updatedTasks = [...existing, newTask];
    sessionStorage.setItem('tasks', JSON.stringify(updatedTasks));

    console.log("✅ Task saved. Updated tasks:", updatedTasks);

    emit('task-updated', newTask);
    dialogModel.value = false;
    resetForm();
  } catch (error) {
    console.error('❌ Error adding task:', error);
    alert('Server error: failed to add task. Please try again later.');
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <v-dialog v-model="dialogModel" max-width="600px" persistent>
    <!-- modified -->
    <v-card rounded="xl" elevation="12" class="bg-grey-lighten-4">
      <v-card-title class="text-h6 font-weight-bold">Add New Task</v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field v-model="task.title" label="Title" outlined dense />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select v-model="task.status" :items="['Not Started', 'In Progress', 'Pending', 'Completed']" label="Status" outlined dense />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="task.dueDate" label="Due Date (YYYY-MM-DD)" outlined dense />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select v-model="task.priority" :items="['Low', 'Medium', 'High']" label="Priority" outlined dense />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="task.description" label="Description" outlined dense />
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="task.assignedTo"
                :items="users"
                item-value="name"
                item-title="name"
                label="Assigned To"
                outlined
                dense
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="submitTask">Save</v-btn>
        <v-btn color="error" text @click="dialogModel = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
