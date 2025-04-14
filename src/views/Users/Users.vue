<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import CustomPaginatedTable from '../../components/ReusableTable.vue'
// import EditUser from './EditUser.vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const taskData = ref<any[]>([]);
const isOpen = ref(false);
const editedItem = ref<any | null>(null);

const SampleDataHeaders = [
  { title: 'User ID', key: 'UserId' },
  { title: 'User Name', key: 'UserName' },
  { title: 'First Name', key: 'FirstName' },
  { title: 'Middle Name', key: 'MiddleName' },
  { title: 'Last Name', key: 'LastName' },
  { title: 'Email', key: 'UserEmail' },
  { title: 'Contact No', key: 'ContactNo' },
  { title: 'Gender', key: 'Gender' },
];

const itemsPerPage = 5;

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmcifQ.E5iOFK5967FZRmxD3_qI4DnI7lPJy2dIHmsVuwAuod8";

const fetchTasks = async () => {
  try {
    const res = await axios.get('http://192.168.11.71:8008/users/', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    });
    taskData.value = res.data || [];
    
    sessionStorage.setItem('allUsers', JSON.stringify(taskData.value));
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
};

onMounted(() => {
  fetchTasks();
});

const handleAction = async({ action, item }: any) => {
  if (action === 'edit') {
    sessionStorage.setItem('formTitle','Update User')
    sessionStorage.setItem('item',JSON.stringify(item))
    router.push('/User');
  } else if (action === 'delete') {
    const confirmDelete = confirm("Are you sure you want to delete");
    if (confirmDelete) {
      await deleteUser(item.UserId);
    }
  }
};

const goToAddUser = () => {
  sessionStorage.setItem('formTitle','Add User')
  router.push('/User');
};

const deleteUser = async (userId: number) => {
  try {
    await axios.delete(`http://192.168.11.71:8008/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    fetchTasks(); 
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};
</script>

<template>
  <v-card elevation="0">
    <!-- <v-btn color="primary" class="mb-4 mt-4 ml-4" @click="goToAddUser">
      Add User
    </v-btn> -->
    <CustomPaginatedTable
      :items="taskData"
      :headers="SampleDataHeaders"
      :itemsPerPage="itemsPerPage"
      :goToAddUser="goToAddUser"
      @action="handleAction"
    />
    <!-- <EditUser v-model="isOpen" :item="editedItem" @updated="fetchTasks" /> -->
  </v-card>
</template>
