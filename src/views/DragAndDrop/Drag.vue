<script setup lang="ts">
import { ref, onMounted } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import CustomPaginatedTable from './Dummy.vue';
import Dial from './Dial.vue';
import axios from 'axios';
const taskData = ref([
  {
    title: 'Design Login Page',
    description: 'Create a responsive login page for the app.',
    status: 'ToDo',
    taskPriority: 'High',
    dueDate: '2025-04-15'
  },
  {
    title: 'Fix Navbar Bug',
    description: 'Resolve the collapse issue on mobile view.',
    status: 'InProgress',
    taskPriority: 'Medium',
    dueDate: '2025-04-10'
  },]);
const btnText = ref('Add Task');
// const isLoading = ref(true);
const isOpen = ref(false);

const SampleDataHeaders = [
  { title: 'Title', key: 'title' },
  { title: 'Description', key: 'description' },
  { title: 'Status', key: 'status' },
  { title: 'Task Priority', key: 'taskPriority' },
  { title: 'Due Date', key: 'dueDate' }
];

const itemsPerPage = 5;

const fetchTasks = async () => {
  try {
    const res =axios.get('http://192.168.11.71:8001/api/v1/masters/todomgmt/todo/todotask');
    console.log(res)
  } catch (error) {
    
  }
};

onMounted(()=>{
  fetchTasks()
});

 const plusFunction =()=>{
  isOpen.value=true
 }
 const handleFunction =({action,item}:any)=>{
 
  if(action==='edit'){
    // alert('edit called')
    console.log(item)
  }
 }


</script>

<template>
  <v-card elevation="0">
      <CustomPaginatedTable
        :items="taskData"
        :headers="SampleDataHeaders"
        :btnText="btnText"
        :addFunction="plusFunction"
        @action="handleFunction"
        :items-per-page="itemsPerPage"
      />
  </v-card>
  <Dial v-model="isOpen" />
</template>
