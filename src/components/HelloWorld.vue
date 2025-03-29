<template>
  <v-container class="fill-height">
    <v-responsive>

      <v-data-table-virtual :headers="headers" :items="transactions" fixed-header>
        
      </v-data-table-virtual>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';

interface Transaction {
  date: Date;
  description: string;
  amount: decimal;
  category: string;  
}

const transactions = ref<Transaction[]>([]);
const headers = ref([
  {title: 'Date', key: 'Date'},
  {title: 'Description', key: 'Description'},
  {title: 'Category', key: 'Category'},
  {title: 'Amount', key: 'Amount'},
  

]);

onMounted(() => {
  axios.get('http://192.168.0.20/mintyapi/').then((res) => transactions.value = res.data);
})
</script>

