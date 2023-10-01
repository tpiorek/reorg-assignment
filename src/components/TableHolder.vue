<script setup>
import DataTable from '../components/DataTable.vue'
import {columns} from '../data/dataModel.js'
import {rowData} from '../data/sampleData.js'
import {onMounted, ref, watch} from 'vue';

const searchQuery = ref('')
const hasContent = ref(false);

// Watcher that sets 'hasContent' based on whether 'searchQuery' has a value
watch(searchQuery, (newVal) => {
  hasContent.value = !!newVal;
});

// Function to clear the search input
const clearInput = () => {
  searchQuery.value = '';
};


// to show scroll bar extra rows added
const additionalRowData = [...rowData, ...Array.from({length: 40}, (_, i) => ({
  id: 11 + i,
  issuerName: `Issuer ${String.fromCharCode(75 + i)}`, // Alphabetically increasing
  dealName: `Deal ${String.fromCharCode(72 + i)}${7 + i}`,
  bloombergId: `BLMB${133 + i}`,
  total: `${2900 + 10 * i}.00`,
  industry: i % 2 === 0 ? "Finance" : "Tech",
  status: i % 3 === 0 ? "Completed" : "Pending",
  analysts: ["Benjamin", "Alice", "John", "Doe"][i % 4],
  docCount: 7 + (i % 4),
  customDealIdentifiers: `ID${215 + i}`
}))
]

// When the component mounts, set the 'hasContent' based on the 'searchQuery' value
onMounted(() => {
  hasContent.value = !!searchQuery.value;
});

// Function to export the data as CSV
const exportToCSV = (exportedData) => {
  const dataToExport = exportedData;
  const csvContent = [];
  // Create the header row based on the columns
  const header = columns.map(col => col.label).join(",");
  csvContent.push(header);
  // Convert each data item to a CSV row
  dataToExport.forEach(item => {
    const row = columns.map(col => item[col.key]).join(",");
    csvContent.push(row);
  });
  // Create a downloadable CSV file and trigger the download
  const blob = new Blob([csvContent.join("\n")], {type: "text/csv"});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "exported_data.csv";
  a.click();
  window.URL.revokeObjectURL(url);
}

</script>

<template>
  <form id="search" class="search-form">
    <div class="search-container" :class="{ 'has-content': searchQuery }">
      <!-- Search input that updates the 'searchQuery' reactive variable -->
      <input type="text" name="query" v-model="searchQuery" placeholder="Search..." class="search-input">
      <!-- Clear button shown when there's content in the search input -->
      <span v-if="searchQuery" class="icon close-icon" @click="clearInput">
        <i class="fa fa-times"></i>
      </span>
    </div>
  </form>
  <!-- Data Table component with slots for export and side pane -->
  <DataTable :data="additionalRowData" :columns="columns" :filter-key="searchQuery">
    <!-- Slot for the export button, which triggers the CSV export when clicked -->
    <template #exportData="{ exportedData }">
      <button class="data-table-button" @click="exportToCSV(exportedData)">Export Database</button>
    </template>
    <!-- Slot for the side pane to display details of a selected row -->
    <template #sidePane="{ isPaneOpen, selectedRow }">
      <div v-if="isPaneOpen" class="side-pane">
        <h3>Record Details</h3>
        <pre>{{ selectedRow }}</pre>
      </div>
    </template>
  </DataTable>
</template>

<!-- Styles specific to this component. The SCSS variables and styles are for enhanced readability and maintainability -->
<style scoped lang="scss">
$search-input-border: 1px solid #ccc;
$search-input-radius: 4px;
$search-icon-spacing: 10px;
$search-input-padding: 10px;
$search-input-font-size: 16px;
$icon-font-size: 16px;

.search-form {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding-bottom: 5px;

  .search-container {
    position: relative;
    width: 100%;

    .search-input {
      width: 100%;
      padding: $search-input-padding $search-icon-spacing * 4 $search-input-padding $search-input-padding;
      box-sizing: border-box;
      border: $search-input-border;
      border-radius: $search-input-radius;
      font-size: $search-input-font-size;
    }

    .icon {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      font-size: $icon-font-size;
      cursor: pointer;
    }

    .close-icon {
      right: $search-icon-spacing * 3;
      display: none;

      i.fa {
        color: rgb(57, 77, 222);
      }
    }
  }

  & .has-content {
    .close-icon {
      display: block;
    }
  }
}

.export-csv {
  margin-left: 15px;
  padding: 2px 6px;
  background-color: #4c63af;
  color: white;
  border: none;
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #76cce2;
  }

  i.fa {
    margin-right: 5px;
  }
}

.data-table-button {
  padding: 10px 15px;
  margin-top: 10px;
  background-color: #4c63af;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #3a50a0;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(76, 99, 175, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }
}
</style>
