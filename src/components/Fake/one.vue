<template>
    <v-dialog v-model="dialogModel" max-width="600px" persistent>
      <v-card rounded="lg" class="elevation-12">
        <v-card-title class="text-h5">Add Task</v-card-title>
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
                <v-menu
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="task.dueDate"
                      label="Due Date"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      outlined
                      dense
                    />
                  </template>
                  <v-date-picker v-model="task.dueDate" @input="menu = false" />
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="task.priority" :items="['Low', 'Medium', 'High']" label="Priority" outlined dense />
              </v-col>
              <v-col cols="12">
                <v-textarea v-model="task.description" label="Description" outlined dense />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="task.assignedTo"
                  :items="userOptions"
                  item-title="email"
                  item-value="email"
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
  
  <script lang="ts" setup>
  import { ref, reactive, watch, onMounted, defineEmits, defineProps } from 'vue';
  import axios from 'axios';
  
  const props = defineProps({ dialog: Boolean });
  const emit = defineEmits(['task-updated', 'update:dialog']);
  
  const menu = ref(false);
  const userOptions = ref<{ email: string }[]>([]);
  
  const task = reactive({
    title: '',
    description: '',
    dueDate: '',
    priority: '',
    status: '',
    assignedTo: '',
  });
  
  const API_USERS = 'http://192.168.11.71:8008/users/';
  const API_TASKS = 'http://192.168.11.71:8008/tasks/';
  
  const dialogModel = ref(props.dialog);
  
  watch(() => props.dialog, (val) => {
    dialogModel.value = val;
    if (val) resetForm();
  });
  watch(dialogModel, (val) => emit('update:dialog', val));
  
  const fetchUsers = async () => {
    try {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmcifQ.E5iOFK5967FZRmxD3_qI4DnI7lPJy2dIHmsVuwAuod8';
      const res = await axios.get(API_USERS, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      userOptions.value = res.data.map((user: any) => ({
        email: user.email,
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
    if (!task.title || !task.status) {
      alert('Please provide complete task details.');
      return;
    }
  
    const taskToPost = {
      Title: task.title,
      Description: task.description,
      DueDate: task.dueDate,
      Status: task.status,
      Priority: task.priority,
      AssignedTo: task.assignedTo,
    };
  
    try {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmcifQ.E5iOFK5967FZRmxD3_qI4DnI7lPJy2dIHmsVuwAuod8';
      const res = await axios.post(API_TASKS, taskToPost, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const newTask = {
        TaskId: res.data.TaskId || Math.random().toString(36).substr(2, 9),
        Title: res.data.Title,
        Description: res.data.Description,
        DueDate: res.data.DueDate,
        Priority: res.data.Priority,
        Status: res.data.Status,
        AssignedTo: task.assignedTo,
      };
  
      const existingTasks = JSON.parse(sessionStorage.getItem('tasks') || '[]');
      const updatedTasks = [...existingTasks, newTask];
      sessionStorage.setItem('tasks', JSON.stringify(updatedTasks));
  
      emit('task-updated', newTask);
      dialogModel.value = false;
      resetForm();
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Server error: failed to add task. Please try again later.');
    }
  };
  
  onMounted(() => {
    fetchUsers();
  });
  </script>
  
  <style scoped>
  .elevation-12 {
    box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.2);
  }
  </style>
  