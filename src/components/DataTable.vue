<script setup>
import {computed, ref, watchEffect} from 'vue'

const props = defineProps({
  data: Array,
  columns: Array,
  filterKey: String
})

const sortKey = ref('')
const sortOrders = ref({});
const isPaneOpen = ref(false);
const selectedRow = ref(null);
const selectedRows = ref([]);

// Function to open the side pane with details of the selected row
const openPaneWithRow = (row) => {
  if (selectedRows.value.length <= 1) {
    selectedRow.value = row;
    isPaneOpen.value = true;
  }
}

const toggleRowSelection = (row) => {
  const index = selectedRows.value.indexOf(row);
  // If the row is not already selected, add to the list, else remove it
  if (index === -1) {
    selectedRows.value.push(row);
  } else {
    selectedRows.value.splice(index, 1);
  }

  // If no rows or more than one row is selected, close the pane.
  if (selectedRows.value.length !== 1) {
    isPaneOpen.value = false;
  }
}

// Watch for changes in the columns prop and set initial sort orders
watchEffect(() => {
  if (props.columns) {
    const newOrders = props.columns.reduce((orders, column) => {
      orders[column.key] = 1;  // default to ascending
      return orders;
    }, {});
    Object.assign(sortOrders.value, newOrders);
  }
});

// Computed property to get the filtered and sorted data based on user input
const filteredData = computed(() => {
  // Guard against props.data being undefined
  let data = props.data || [];
  let filterKey = props.filterKey || '';

  // Filter the data if there's a search query
  if (filterKey) {
    filterKey = filterKey.toLowerCase();
    data = data.filter(row => {
      return Object.keys(row).some(key => {
        return String(row[key]).toLowerCase().indexOf(filterKey) > -1;
      });
    });
  }

  const key = sortKey.value;
  // Check if key exists within the columns
  const columnExists = props.columns.some(column => column.key === key);
  if (key && columnExists) {
    const order = sortOrders.value[key];
    data = data.slice().sort((a, b) => {
      a = a[key];
      b = b[key];
      return (a === b ? 0 : a > b ? 1 : -1) * order;
    });
  }

  return data;
});

// Function to change the sort key and toggle the sort order when a column header is clicked
function sortBy(column) {
  sortKey.value = column.key;
  sortOrders.value[column.key] *= -1;
}

</script>

<template>
  <div class="wrapper">
    <!-- If there's filtered data, display the table -->
    <table v-if="filteredData.length">
      <thead>
      <tr>
        <!-- Loop over the columns to create table headers -->
        <th v-for="column in columns" @click="sortBy(column)" :class="{ active: sortKey == column.key }"
            v-bind:key="column.key">
          {{ column.label }}
          <!-- Display sorting arrow. If sortOrders for the column is positive, show ascending arrow, otherwise descending. -->
          <span class="arrow" :class="sortOrders[column.key] > 0 ? 'asc' : 'dsc'"></span>
        </th>
      </tr>
      </thead>
      <tbody class="table-body">
      <!-- Loop over the filtered data to create table rows -->
      <!-- On row click, toggle its selection and open the detail pane with its data -->
      <tr v-for="(entry, index) in filteredData" v-bind:key="index"
          @click="toggleRowSelection(entry); openPaneWithRow(entry)"
          :class="{ 'selected-row': selectedRows.includes(entry) }">
        <!-- Loop over the columns to create table data cells -->
        <td v-for="column in columns" v-bind:key="`${index}-${column.key}`">
          <!-- Display the data for the given column key -->
          {{ entry[column.key] }}
        </td>
      </tr>
      </tbody>
    </table>
    <p v-else>No matches found.</p>
  </div>
  <!-- Pane for showing the record details -->
  <!-- Slot for external components or parent to display record details -->
  <slot name="sidePane" :isPaneOpen="isPaneOpen" :selectedRow="selectedRow"></slot>
  <!-- Slot for external components or parent to handle exported data -->
  <slot name="exportData" :exportedData="filteredData"></slot>
</template>

<style>
.wrapper {
  display: flex;
}

.selected-row {
  background-color: rgb(10, 10, 77);
  color: rgb(107, 199, 224);
}

.side-pane {
  flex-shrink: 0;
  width: 30%;
  /* or any desired width */
  background: white;
  border-left: 1px solid #ccc;
  padding: 20px;
  overflow-y: auto;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
}

table {
  border: 2px solid #3d37b7;
  border-radius: 3px;
  background-color: #fff;
  display: block;
}

.table-body {
  max-height: 500px;
  display: block;
  overflow-y: auto;
}

tr {
  width: 100%;
}

th {
  background-color: #3d37b7;
  color: rgba(255, 255, 255, 0.66);
  cursor: pointer;
  user-select: none;
}

td {
  background-color: #f9f9f9;
}

th,
td {
  min-width: 120px;
  padding: 10px 20px;

}

th.active {
  color: #fff;
}

th.active .arrow {
  opacity: 1;
}

.arrow {
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid #fff;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid #fff;
}
</style>