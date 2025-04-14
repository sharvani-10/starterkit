<script setup lang="ts">
import { computed, ref, watch, defineEmits } from 'vue';

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
  handleFunction: Function;
  goToAddUser: Function;
}>();

const emits = defineEmits(['action']);

const search = ref('');
const pagination = ref(1);
const perPage = ref(props.itemsPerPage);
const sortBy = ref('');
const sortDesc = ref(false);

watch([search, () => props.items], () => {
  pagination.value = 1;
});

const processedItems = computed(() => {
  let filtered = props.items;

  if (search.value) {
    const term = search.value.toLowerCase();
    filtered = filtered.filter((item) =>
      props.headers.some((header) =>
        String(item[header.key] ?? '').toLowerCase().includes(term)
      )
    );
  }

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

const paginatedItems = computed(() => {
  const start = (pagination.value - 1) * perPage.value;
  return processedItems.value.slice(start, start + perPage.value);
});

const pageCount = computed(() =>
  Math.ceil((processedItems.value?.length || 0) / perPage.value)
);

const toggleSort = (key: string) => {
  if (sortBy.value === key) {
    sortDesc.value = !sortDesc.value;
  } else {
    sortBy.value = key;
    sortDesc.value = false;
  }
};

const goToAddUser = () => {
  props.goToAddUser()
}
const handleFunction = (action: any, item: any) => {
  console.log('Emitting action:', action, item);
  emits('action', { action, item });
};
</script>

<template>
  <v-card elevation="0" class="pa-4">
    <div>
      <v-btn color="primary" class="mb-4 mt-4 ml-1" @click="goToAddUser">
        Add User
      </v-btn>
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        class="mb-4"
        clearable
      />

      
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
              <v-btn
                icon
                size="small"
                color="primary"
                variant="text"
                @click="handleFunction('edit', item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                icon
                size="small"
                color="error"
                variant="text"
                @click="handleFunction('delete', item)"
              >
    <v-icon>mdi-delete</v-icon>
  </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

    
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
