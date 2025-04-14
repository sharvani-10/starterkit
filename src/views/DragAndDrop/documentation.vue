<!-- ref:  ref is a reactive reference that allows you to create a reactive value or reference a DOM element or component.
 uses:1.  When you want to make a primitive value (like a string, number, or boolean) reactive, you use ref.
 2.You can use ref to reference a DOM element or child component inside the template.
 Use case	What it does
ref(0)	Creates a reactive value
ref(null) in template	References a DOM element or component
Access value	Use .value to get/set the actual value-->

<!-- todousermain.vue -->
const taskData = ref<any[]>([]);
ref which stores the value and make that value reactive.
<any[]> -> an array of any type of data
([]) -> This is the initial value — an empty array

const isOpen = ref(false);
<EditUser v-model="isOpen" :item="editedItem" @updated="fetchTasks" />
-----v-model-v-model is two-way binding between a parent and child component.
It does two things:
Sends a value from the parent to the child (a prop)
Listens for an event emitted by the child to update that value
When:

isOpen.value = true → the dialog opens
isOpen.value = false → the dialog closes
Because of v-model, the child component (EditUser) can:
Read the value (via props.modelValue)
Change it (by emitting update:modelValue)

const props = defineProps<{
  modelValue: boolean;
  item: any;
}>();
is a TypeScript type definition. It tells TypeScript:
“Hey, the props this component receives should have:
modelValue of type boolean
item of any type”
So yes — this is a TypeScript feature.

watch(
  () => props.item,
  (val) => {
    if (val) {
      form.value = { ...val };
    }
  },
  { immediate: true }
);
This is Vue’s reactive watcher.
- () => props.item
This is the source to watch.
It’s a getter function returning props.item.
Vue will re-run the watcher whenever props.item changes (e.g., when the parent sends a new item to edit).
-(val) => { ... }
This is the callback that runs when the watched value changes.
val is the new value of props.item.
So if the parent passes a new editedItem, this callback will be triggered with the new value.
-form.value = { ...val }
This copies the contents of the new item (like a task or user object) into the local form object for editing.
- { immediate: true }
This option means: run the watcher immediately when the component is mounted, even before any prop changes.
This is useful when you want the form to be filled as soon as the dialog opens.
So what is it doing overall?
"Watch props.item. Whenever it changes (or right away on mount), copy its data into form.value so the form is filled with the latest info."


const editedItem = ref<any | null>(null);
-ref(...) -> Reactive wrapper for reactivity
any | null	Can be an object or null (nothing selected)
Initial value null	No item selected for editing at start

const SampleDataHeaders = [
  { title: 'User ID', key: 'UserId' },
  { title: 'User Name', key: 'UserName' },
  { title: 'Email', key: 'UserEmail' },
  { title: 'Contact No', key: 'ContactNo' },
  { title: 'Gender', key: 'Gender' },
  { title: 'First Name', key: 'FirstName' },
  { title: 'Middle Name', key: 'MiddleName' },
  { title: 'Last Name', key: 'LastName' },
  { title: 'Created By', key: 'CreatedBy' },
  { title: 'Created At', key: 'CreatedDatetime' }
];
✅ How is this created?
It’s manually derived from the JSON response keys — you're saying:
“I want to show a table where each column represents one of these fields.”
The key matches the property name in the object, and title is the human-friendly name shown in the UI.

Axios GET with headers:
const res = await axios.get('http://192.168.11.71:8008/users/', {
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json'
  }
});
axios.get(...) → Sends a GET request to your backend (/users/).
headers → Custom headers for the request:
Authorization: Bearer ${token} → Passes the JWT token to prove your identity.
Accept: application/json → Tells server: “Please send JSON response.”

JSON
JSON stands for JavaScript Object Notation.
It’s a lightweight format used to represent structured data — like objects and arrays — in a readable and easy-to-use way.
When you make a request to a web API (like GET /users), the server sends back data — usually in JSON format.
This is called a JSON response.
When you make a request to a web API (like GET /users), the server sends back data — usually in JSON format.
This is called a JSON response.

sessionStorage.setItem('allUsers', JSON.stringify(taskData.value));
JSON.stringify() is a built-in JavaScript function that converts a JavaScript object or array into a JSON-formatted string.
Because sessionStorage only stores strings — it can’t store objects or arrays directly.
'allUsers' is the key
It’s like a label or name for your stored data. You use this key later to retrieve the data.
{
  "allUsers": "[{...}, {...}, {...}]" // stored as a string
}

Why use onMounted()?
onMounted() is a Vue Composition API lifecycle hook.
It lets you run code when the component finishes loading.

const handleAction = ({ action, item }: any) => {
  if (action === 'edit') {
    editedItem.value = { ...item };
    nextTick(() => {
      isOpen.value = true;
    });
  }
};
handleAction is a function that takes an object with two properties: action (like 'edit') and item (the user data or task item).

The : any part is TypeScript — it means the function can accept any kind of input (you can type it better later).
if (action === 'edit') 
This checks if the user clicked an edit button (or triggered an "edit" action).
const editedItem = ref<any | null>(null);
    editedItem is a ref (probably used in a popup or form).
{ ...item } copies all properties from item (spread syntax).
So you're saving the selected item into editedItem, preparing it for editing.
nextTick(() => {
      isOpen.value = true;
    });
    So nextTick says:
“Hey Vue, update everything first… then run this function (open the dialog).”
This ensures your dialog opens with the right data already in place.
If you open the dialog immediately after changing the data (without waiting), the form might not be ready yet and might show old or empty data.


