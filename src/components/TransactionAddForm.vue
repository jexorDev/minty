<template>
<v-dialog v-model="show" fullscreen>
  
   <v-card>
            <v-toolbar color="secondary-darken-1" density="compact">
              <v-toolbar-title>Transaction</v-toolbar-title>
              <v-toolbar-items>
                <v-btn
                icon="mdi-close"                
                @click="show = false"
              ></v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="3"
          >
           <v-date-input v-model="fetchedTransaction.transactionDate"></v-date-input>
          </v-col>
  
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="fetchedTransaction.description"
              label="Description"
              required
            ></v-text-field>
           
          </v-col>
  
          <v-col
            cols="12"
            md="3"
          >
            <v-text-field
              v-model="fetchedTransaction.amount"
              label="Amount"
              required
            ></v-text-field>
            
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-autocomplete v-model="fetchedTransaction.categoryId" label="Category" :items="categoryStore.categories" item-title="name" item-value="pk"></v-autocomplete>
          </v-col>
          <v-col>
            <v-select label="Subcategory"></v-select>
          </v-col>
          <v-col>
            <v-autocomplete v-model="fetchedTransaction.merchantId" label="Merchant" :items="merchantStore.merchants" item-title="name" item-value="pk"></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-autocomplete v-model="fetchedTransaction.accountId" label="Account" :items="accountStore.accounts" item-title="name" item-value="pk"></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="fetchedTransaction.notes"
              label="Notes"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h1>Splits</h1>

          </v-col>
          <v-col>

            <v-checkbox v-model="splitEqually">Split Equally</v-checkbox>
          </v-col>
          <v-col>

            <v-btn @click="addNew()" variant="elevated" color="primary">Add</v-btn>
          </v-col>
        </v-row>
        <v-row v-for="split of fetchedTransactionSplits">
          <v-col>
            <v-select label="Category" v-model="split.categoryId" :items="categoryStore.categories" item-title="name" item-value="pk"></v-select>
          </v-col>
          <v-col>
            <v-text-field v-model="split.amount"></v-text-field>
          </v-col>
          <v-col>
            <v-btn @click="deleteSplit(split)" color="secondary">Delete</v-btn>
          </v-col>
        </v-row> 
        <v-row v-if="fetchedTransactionSplits.length > 0">
          <v-col>
            Remaining allocation: {{ remainingSplitAllocation }}
          </v-col>
        </v-row>
      </v-container>
    </v-form>
          <v-card-actions>
            <v-btn color="primary" variant="tonal" @click="show = false">Cancel</v-btn>
            <v-btn color="primary" variant="outlined" text="Save"></v-btn>
          </v-card-actions>  
          </v-card>
  

</v-dialog>
</template>
<script setup lang="ts">
import type TransactionSplit from '@/data/interfaces/Transactions/TransactionSplit';
import type Transaction from '@/data/interfaces/Transactions/Transaction';
import type TransactionSearch from '@/data/interfaces/Transactions/TransactionSearch';
import TransactionsService from '@/data/services/TransactionsService';
import TransactionSplitsService from '@/data/services/TransactionSplitsService';
import {useCategoryStore} from '@/stores/CategoryStore';
import { useMerchantStore } from '@/stores/MerchantStore';
import { useAccountStore } from '@/stores/AccountStore';

const show = defineModel<boolean>("show")

const props = defineProps<{
  transaction: TransactionSearch
}>();

const fetchedTransaction = ref<Transaction>({} as Transaction);
const fetchedTransactionSplits = ref<TransactionSplit[]>([] as TransactionSplit[]);

const splitEqually = ref(true);
const categoryStore = useCategoryStore();
const merchantStore = useMerchantStore();
const accountStore = useAccountStore();

watch(show, async (newValue) => {
  if (!newValue) return;

  fetchedTransaction.value = await new TransactionsService().withRouteParameter((props.transaction.splitId ?? props.transaction.pk).toString()).getSingle();
        if (props.transaction.splitId) {
          fetchedTransactionSplits.value = await new TransactionSplitsService(props.transaction.splitId).getMultiple();
        }
})


function addNew() {
  // if (splits.value !== undefined) {
  //   splits.value.add(new TransactionSplitModel({} as TransactionSplit));

  // }
  var amount = 0;
  
  if (splitEqually.value) {
    const splitCount =  fetchedTransactionSplits.value.length + 1;
    var dividedAmount = Math.round(fetchedTransaction.value!.amount / splitCount * 100) / 100;
    var roundingError = fetchedTransaction.value!.amount - (dividedAmount * splitCount);

    amount = dividedAmount + roundingError;

    for (const split of fetchedTransactionSplits.value) {
      split.amount = dividedAmount;
    }

  } else {
    amount = fetchedTransaction.value!.amount - fetchedTransactionSplits.value.reduce((acc, x) => {return acc + Number(x.amount)}, 0);
  }

  fetchedTransactionSplits.value.push({
    pk: 0,
    categoryId: fetchedTransaction.value.categoryId,
    amount: amount
  } as TransactionSplit);
}

function deleteSplit(split: TransactionSplit) {
  fetchedTransactionSplits.value = fetchedTransactionSplits.value.filter(t => t !== split);

  if (splitEqually.value && fetchedTransactionSplits.value.length > 0) {
    const splitCount =  fetchedTransactionSplits.value.length;
    var dividedAmount = fetchedTransaction.value!.amount / splitCount;
    var roundingError = fetchedTransaction.value!.amount - (dividedAmount * splitCount);


    

    for (const split of fetchedTransactionSplits.value) {
      split.amount = dividedAmount;
    }

  } 
}

async function save() {
  await new TransactionsService().put(fetchedTransaction.value);
  await new TransactionSplitsService(fetchedTransaction.value.pk!).postMultiple(fetchedTransactionSplits.value);
}

const remainingSplitAllocation = computed(() => {
  if (fetchedTransactionSplits.value.length === 0) {
    return fetchedTransaction.value?.amount ?? 0;
  } else {
    return (fetchedTransaction.value?.amount ?? 0)  - fetchedTransactionSplits.value.reduce((acc, x) => {return acc + Number(x.amount)}, 0);
  }
})

//const categories = ref<Category[]>([]);
const valid = ref(true);

</script>