<script setup lang="ts">
import { onMounted, ref } from 'vue';
import axios from 'axios';


interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  deadline: string;
  created_at: string;
}

// Define sampleData with the correct type
const sampleData = ref<Todo[]>([]);

// Function to fetch the data
const fetchData = async () => {
  try {
    const res = await axios.get("http://192.168.11.71:8000/todos/");
    if (res.status === 200) {
      sampleData.value = res.data;
    }
  } catch (error) {
    console.log("Error fetching data:", error);
  }
};

// Fetch data when the component is mounted
onMounted(() => {
  fetchData();
});

// Helper function to format the deadline date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // You can customize this format as needed
};
</script>

<template>
  <div>
    <button @click="fetchData">Load posts</button>
    <table border="1" cellpadding="5" cellspacing="0" style="width: 100%; margin-top: 20px;">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Description</th>
          <th>Completed</th>
          <th>Deadline</th>
        </tr>
      </thead>
      <tbody>
        <!-- Loop through sampleData and render each item in the table -->
        <tr v-for="item in sampleData" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.completed ? 'Yes' : 'No' }}</td> <!-- Boolean 'completed' field -->
          <td>{{ formatDate(item.deadline) }}</td> <!-- Format the deadline date -->
        </tr>
      </tbody>
    </table>
  </div>
</template>
