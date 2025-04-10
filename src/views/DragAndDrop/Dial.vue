<script setup lang="ts">
import { ref, watch } from 'vue';
import axios from 'axios';

const props = defineProps<{
  modelValue: boolean;
  item: any;
}>();

const emit = defineEmits(['update:modelValue', 'updated']); 

const form = ref({
  UserId: '',
  UserName: '',
  UserEmail: '',
  ContactNo: '',
  Gender: '',
  FirstName: '',
  MiddleName: '',
  LastName: '',
  CreatedBy: '',
  CreatedDatetime: ''
});

// Sync dialog form with selected item
watch(
  () => props.item,
  (val) => {
    if (val) {
      form.value = { ...val };
    }
  },
  { immediate: true }
);

// Save/Update user
const saveChanges = async () => {
  try {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHJpbmcifQ.E5iOFK5967FZRmxD3_qI4DnI7lPJy2dIHmsVuwAuod8";

    const res = await axios.put(`http://192.168.11.71:8008/users/${form.value.UserId}`, form.value, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('User updated:', res.data);
    emit('update:modelValue', false); // close dialog
    emit('updated'); // notify parent to refresh
  } catch (error) {
    console.error('Error updating user:', error);
  }
};
</script>

<template>
  <v-dialog v-model="props.modelValue" max-width="600px">
    <v-card>
      <v-card-title>Edit User</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field v-model="form.UserId" label="User ID" readonly />
          <v-text-field v-model="form.UserName" label="User Name" />
          <v-text-field v-model="form.UserEmail" label="Email" />
          <v-text-field v-model="form.ContactNo" label="Contact No" />
          <v-text-field v-model="form.Gender" label="Gender" />
          <v-text-field v-model="form.FirstName" label="First Name" />
          <v-text-field v-model="form.MiddleName" label="Middle Name" />
          <v-text-field v-model="form.LastName" label="Last Name" />
          <v-text-field v-model="form.CreatedBy" label="Created By" />
          <v-text-field v-model="form.CreatedDatetime" label="Created At" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="saveChanges">Save</v-btn> 
        <v-btn text @click="emit('update:modelValue', false)">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
