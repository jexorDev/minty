<template>
  <v-container class="fill-height">
    <v-responsive>
      <v-autocomplete :items="autoCompleteObjects" chip item-title="text" item-value="text" variant="underlined" density="compact">
        <template v-slot:chip="{ props, item }" >
                <v-chip
                  v-bind="props"                  
                  :text="item.raw.text"
                ></v-chip>
              </template>

              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"      
                  :subtitle="item.raw.type"
                  :title="item.raw.text"
                ></v-list-item>
              </template>
      </v-autocomplete>
      <v-data-table-virtual :headers="headers" :items="transactions" fixed-header></v-data-table-virtual>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';

interface Transaction {
  transactionDate: Date;
  description: string;
  amount: number;
  categoryName: string;  
}

interface Category {
  pk: number;
  name: string;
}

interface CategoryTotal {
  category: string;
  total: number;
}

interface AutoCompleteObject {
  type: string;
  text: string;
  value: number | string;
}

const transactions = ref<Transaction[]>([]);
const categoryTotals = ref<CategoryTotal[]>([]);
const categories = ref<Category[]>([]);
const selectedFilter = ref<AutoCompleteObject | null>(null);
const fromDate = ref(Date.now().toString())

const headers = ref([
  {title: 'Date', key: 'transactionDate'},
  {title: 'Description', key: 'description'},
  {title: 'Category', key: 'categoryName'},
  {title: 'Amount', key: 'amount'},

]);

onMounted(() => {
  axios.get('http://localhost:5209/transactions?fromDate=1/1/2018&toDate=12/31/2018').then((res) => {
    transactions.value = res.data;
    sumCategories();
  });
  axios.get('http://localhost:5209/categories').then((res) => {
    categories.value = res.data;
  })
});

const transactionDescriptions = computed<string[]>(() => [...new Set(transactions.value.map(x => x.description))]);
const autoCompleteObjects = computed<AutoCompleteObject[]>(() => [...categories.value.map(x => {
  return {
    type: "Category",
    text: x.name,
    value: x.pk
  }
}), ...transactionDescriptions.value.map(x => {
  return {
    type: "",
    text: x,
    value: x
  }
} )]);

function sumCategories() {
  //categoryTotals.value = [...new Set(transactions.value.map(x => x.Category))].map(y => {category: y; total: 0});
  //console.log([...new Set(transactions.value.map(x => x.Category))].map(y => {'category': y; 'total': 0}));
  categoryTotals.value.push({category: 'Poop', total: 69});
}
</script>

