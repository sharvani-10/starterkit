<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';  // Import parseISO from date-fns
import axios from 'axios';

// Props
const props = defineProps({
  task: Object
});

const emit = defineEmits(['dragstart']);

// Dialog state and edited task data
const dialog = ref(false);
const editedTask = ref({ ...props.task });

const users = ref<{ id: number; name: string }[]>([]);

const token = sessionStorage.getItem('token') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmcifQ.E5iOFK5967FZRmxD3_qI4DnI7lPJy2dIHmsVuwAuod8';

// User list for the "Assigned To" field
const fetchUsers = async () => {
  try {
    const res = await axios.get('http://192.168.11.71:8008/users/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    users.value = res.data.map((user: any) => ({
      id: user.RecId,
      name: user.Title,
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// Open the Edit dialog with task details
function openDialog() {
  editedTask.value = { ...props.task };
  dialog.value = true;
}

// Save the edited task (PUT API)
async function save() {
  try {
    const recid = editedTask.value.RecId;
    const payload = {
      Title: editedTask.value.title,
      Description: editedTask.value.description,
      DueDate: editedTask.value.dueDate,
      AssignedTo: editedTask.value.assignedTo,
      Status: editedTask.value.status,
      Priority: editedTask.value.priority,
      RecId: recid,
    };

    const response = await axios.put(`http://192.168.11.71:8008/tasks/${recid}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });

    dialog.value = false;
  } catch (error) {
    console.error('Failed to save task:', error);
  }
}

// Delete task (DELETE API)
async function deleteTask() {
  try {
    const recid = props.tasks.RecId;
    await axios.delete(`http://192.168.11.71:8008/tasks/${recid}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    dialog.value = false;
  } catch (error) {
    console.error('Failed to delete task:', error);
  }
}

function cancel() {
  dialog.value = false;
}

// Fetch users on mount
onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <v-card
    elevation="10"
    class="mb-5"
    draggable="true"
    @dragstart="$emit('dragstart', task)"
  >
    <div class="d-flex align-center justify-space-between px-4 py-2 pr-3">
      <h5 class="text-subtitle-2 font-weight-semibold pr-4 cursor-move">{{ task?.title }}</h5>
      <RouterLink to="" class="px-0">
        <DotsVerticalIcon size="15" />
        <v-menu activator="parent">
          <v-list density="compact">
            <v-list-item value="Edit">
              <v-list-item-title @click="openDialog">Edit</v-list-item-title>
            </v-list-item>
            <v-list-item value="Delete">
              <v-list-item-title @click="deleteTask">Delete</v-list-item-title>
            </v-list-item>
            </v-list>
          </v-menu>
        </RouterLink>
      </div>

    <v-img v-if="task?.taskimg" :src="task?.taskimg" height="110px" cover class="w-100 mb-3" />

    <p v-if="task?.subtitle" class="text-subtitle-2 px-4 text-medium-emphasis">{{ task?.subtitle }}</p>

    <div class="d-flex align-center justify-space-between px-4 py-3">
      <div class="d-flex align-center">
        <CalendarIcon size="16" />
        <div class="body-text-1 text-dark pl-2">
          {{ task?.dueDate ? formatDistanceToNowStrict(parseISO(task.dueDate), { addSuffix: false }) : 'No due date' }} ago
        </div>
      </div>
      <div :class="'rounded-sm body-text-1 px-1 py-0 bg-' + task?.categorybg" size="small">
        {{ task?.category }}
      </div>
    </div>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-text class="mb-4">
          <h4 class="text-h6 mb-5">Edit Task</h4>
          <v-text-field outlined v-model="editedTask.title" label="Title" />
          <v-textarea outlined v-model="editedTask.description" label="Description" />
          <v-text-field
            outlined
            v-model="editedTask.dueDate"
            label="Due Date (YYYY-MM-DD)"
            :value="editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split('T')[0] : ''"
          />
          <v-select
            label="Assigned To"
            v-model="editedTask.assignedTo"
            variant="outlined"
            :items="users"
            item-value="name"
            item-title="name"
          />
          <v-select
            label="Status"
            v-model="editedTask.status"
            variant="outlined"
            :items="['Not Started', 'In Progress', 'Pending', 'Completed']"
          />
          <v-select
            label="Priority"
            v-model="editedTask.priority"
            variant="outlined"
            :items="['Low', 'Medium', 'High']"
          />
          <v-btn color="primary" variant="flat" @click="save">Save</v-btn>
          <v-btn variant="flat" @click="cancel">Cancel</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>
