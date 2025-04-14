Feature	Purpose
ref	Make reactive variables (like form, dialog open/close)
watch	React when props.item is passed in from the parent
defineEmits	Allow this child component to tell the parent something happened
computed	(Optional) Use reactive logic for displaying/processing values

import { computed, ref, watch, defineEmits } from 'vue';

This is a TypeScript interface called Header. It’s used to define the structure of objects that represent table headers in your app.
Property	Type	Required?	Description
title	string	✅ Yes	The visible name shown in the table header (e.g., 'User Name')
key	string	✅ Yes	The key used to match data from your items (e.g., 'UserName')
align	string	❌ Optional	Tells the table how to align text (e.g., 'left', 'center')
align?: string means it's optional. The ? is what makes it optional.
interface Header {
    title: string;
    key: string;
    align?: string;
  }

  interface Item {
    [key: string]: any;
  }
  This defines an interface named Item where:
  The key can be any string 
  The value can be any type
  It’s saying:
  “This is an object with any number of properties, where each property has a name (string) and its value can be anything (any).”


  ✅ Why ref() instead of reactive()?
You could use either:
ref is great for primitive values or whole objects when you're going to use form.value.
reactive could also be used here, but then you'd access properties directly like form.UserName instead of form.value.UserName.
const form = ref({
    UserId: 0,
    UserName: '',
    UserEmail: '',
    ContactNo: '',
    Gender: '',
    Password: '',
    FirstName: '',
    MiddleName: '',
    LastName: '',
    CreatedBy: '',
    CreatedDatetime: new Date().toISOString()
  })
  const payload = form.value; 

  API expects 1 user	Send form.value as is (object)
API expects multiple users	Send [form.value] (wrap in array)
{
    "UserId": 1,
    "UserName": "john_doe",
    "UserEmail": "john@example.com"
  }Clearly a single object, not a list.
  [
  {
    "UserId": 1,
    "UserName": "john_doe",
    "UserEmail": "john@example.com"
  },
  {
    "UserId": 2,
    "UserName": "jane_smith",
    "UserEmail": "jane@example.com"
  }
]
🔍 This is a list (array) of users.

<!-- <v-form @submit.prevent="saveUser"> -->
In simple words:
When the user submits the form, don’t reload the page — instead, call the saveUser() function to handle the data (like sending it to the backend).
<!-- <v-btn color="primary" class="mt-3" type="submit">Create User</v-btn>
<v-btn class="mt-3 ml-2" @click="router.back()">Cancel</v-btn>
ou're creating a Vuetify button (<v-btn>) labeled "Cancel". -->
 When the user clicks this button, it navigates back to the previous page.

 const emit = defineEmits(['update:modelValue', 'updated']); 
 It allows your component to emit (trigger) two events:
 update:modelValue — Used to control v-model bindings (like open/close dialog).
 updated — A custom event to notify the parent that something (like a user update) happened.
