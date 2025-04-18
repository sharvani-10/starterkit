<template>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template #activator="{ props }">
        <v-btn color="primary" v-bind="props" @click="openDialog">Add Task</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Add New Task</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-text-field v-model="task.Title" label="Title" required />
            <v-textarea v-model="task.Description" label="Description" />
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
            >
              <template #activator="{ on, attrs }">
                <v-text-field
                  v-model="task.DueDate"
                  label="Due Date"
                  prepend-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <v-date-picker v-model="task.DueDate" @input="menu = false" />
            </v-menu>
            <v-select
              v-model="task.Status"
              :items="['ToDo', 'In Progress', 'Pending', 'Done']"
              label="Status"
              required
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="closeDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="submitTask">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive } from 'vue';
  
  const emit = defineEmits(['add-task']);
  
  const dialog = ref(false);
  const menu = ref(false);
  
  const defaultTask = () => ({
    Title: '',
    Description: '',
    DueDate: '',
    Status: '',
  });
  
  const task = reactive(defaultTask());
  
  const openDialog = () => {
    Object.assign(task, defaultTask());
    dialog.value = true;
  };
  
  const closeDialog = () => {
    dialog.value = false;
  };
  
  const submitTask = () => {
    if (!task.Title || !task.Status) {
      alert('Please fill in Title and Status');
      return;
    }
    emit('add-task', { ...task });
    dialog.value = false;
  };
  </script>
  