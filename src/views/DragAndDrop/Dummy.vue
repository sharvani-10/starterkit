<script setup lang="ts">
import { computed, ref, watch,defineEmits } from 'vue';

interface Header {
  title: string;
  key: string;
  align?: string;
}

interface Item {
  [key: string]: any;
}

const props = defineProps<{
  items: Item[];
  headers: Header[];
  itemsPerPage: number;
  btnText: string;
  addFunction: Function;
  handleFunction: Function;
}>();

const search = ref('');
const pagination = ref(1);
const perPage = ref(props.itemsPerPage);
const sortBy = ref('');
const sortDesc = ref(false);
const emits = defineEmits([ 'action']);
// 🔄 Reset to page 1 when search or items change
watch([search, () => props.items], () => {
  pagination.value = 1;
});

// 🔍 + 🔃 Filtered & Sorted Data
const processedItems = computed(() => {
  let filtered = props.items;

  // 🔍 Search filter
  if (search.value) {
    const term = search.value.toLowerCase();
    filtered = filtered.filter((item) =>
      props.headers.some((header) =>
        String(item[header.key] ?? '').toLowerCase().includes(term)
      )
    );
  }

  // 🔃 Sort
  if (sortBy.value) {
    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortBy.value];
      const bVal = b[sortBy.value];

      if (aVal < bVal) return sortDesc.value ? 1 : -1;
      if (aVal > bVal) return sortDesc.value ? -1 : 1;
      return 0;
    });
  }

  return filtered;
});

// 📄 Paginated output
const paginatedItems = computed(() => {
  const start = (pagination.value - 1) * perPage.value;
  return processedItems.value.slice(start, start + perPage.value);
});

// 🔢 Total pages
const pageCount = computed(() =>
  Math.ceil(processedItems.value.length / perPage.value)
);

// ↕️ Toggle Sort
const toggleSort = (key: string) => {
  if (sortBy.value === key) {
    sortDesc.value = !sortDesc.value;
  } else {
    sortBy.value = key;
    sortDesc.value = false;
  }
};
const addFunction = () =>{
    props.addFunction()
}

const handleFunction = (action: any, item: any) => {
    emits('action', { action, item });
};
</script>

<template>
    <v-card elevation="0" class="pa-4">
        <div>
          <v-btn color="primary" @click="addFunction">{{ props.btnText }}</v-btn>
      
          <!-- 🔍 Search -->
          <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            class="mb-4"
            clearable
          />
      
          <!-- 📋 Table -->
          <v-table class="border rounded-md">
            <thead>
              <tr>
                <th
                  v-for="header in props.headers"
                  :key="header.key"
                  @click="toggleSort(header.key)"
                  class="cursor-pointer text-left"
                >
                  {{ header.title }}
                  <v-icon v-if="sortBy === header.key">
                    {{ sortDesc ? 'mdi-arrow-down' : 'mdi-arrow-up' }}
                  </v-icon>
                </th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="paginatedItems.length === 0">
                <td :colspan="props.headers.length + 1" class="text-center py-4">
                  No matching records found.
                </td>
              </tr>
              <tr v-for="(item, i) in paginatedItems" :key="i">
                <td
                  v-for="header in props.headers"
                  :key="header.key"
                  :class="`text-${header.align || 'start'}`"
                >
                  {{ item[header.key] ?? '-' }}
                </td>
                <td>
                  <!-- Replace this with your action buttons -->
                  <v-btn icon size="small" color="primary" variant="text" @click="handleFunction('edit', item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
      
          <!-- 📄 Pagination -->
          <div class="d-flex justify-center align-center mt-4 gap-4 flex-wrap">
            <v-pagination
              v-model="pagination"
              :length="pageCount"
              total-visible="5"
            />
      
            <v-text-field
              v-model.number="perPage"
              type="number"
              label="Items per page"
              min="1"
              max="100"
              hide-details
              style="max-width: 150px"
              density="compact"
            />
          </div>
        </div>
    </v-card>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
