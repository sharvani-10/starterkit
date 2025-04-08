<template>
     <v-dialog max-width="600px">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">Add New Task</v-card-title>
        <v-card-text>
          <v-form ref="formRef" @submit.prevent="submitForm">
            <v-text-field v-model="title" label="Title" required />
            <v-textarea v-model="description" label="Description" required />
            <v-text-field v-model="status" label="Status" required />
            <v-text-field v-model="taskPriority" label="Task Priority" required />
            <v-text-field v-model="dueDate" type="date" label="Due Date" required />
            <v-row justify="end" class="mt-4">
              <v-btn type="submit" color="success">Save</v-btn>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
   
</template>