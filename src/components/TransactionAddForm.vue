<template>
<DialogBase model-type="Transaction" :is-new="model.isNew" @save="save">
  <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="3"
          >
           <v-date-input v-model="transaction.transactionDate"></v-date-input>
          </v-col>
  
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="transaction.description"
              label="Description"
              required
            ></v-text-field>
           
          </v-col>
  
          <v-col
            cols="12"
            md="3"
          >
            <v-text-field
              v-model="transaction.amount"
              label="Amount"
              required
            ></v-text-field>
            
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-autocomplete v-model="transaction.categoryId" label="Category" :items="categoryStore.categories" item-title="name" item-value="pk"></v-autocomplete>
          </v-col>
          <v-col>
            <v-select label="Subcategory"></v-select>
          </v-col>
          <v-col>
            <v-autocomplete v-model="transaction.merchantId" label="Merchant" :items="merchantStore.merchants" item-title="name" item-value="pk"></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-autocomplete v-model="transaction.accountId" label="Account" :items="accountStore.accounts" item-title="name" item-value="pk"></v-autocomplete>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="transaction.notes"
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
        <v-row v-for="split of transactionSplits">
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
        <v-row v-if="transactionSplits.length > 0">
          <v-col>
            Remaining allocation: {{ remainingSplitAllocation }}
          </v-col>
        </v-row>
      </v-container>
    </v-form>

</DialogBase>
</template>
<script setup lang="ts">
import type Category from '@/data/interfaces/Category';
import CategoryService from '@/data/services/CategoryService';
import type TransactionModel from '@/data/classes/TransactionModel';
import TransactionSplitModel from '@/data/classes/TransactionSplitModel';
import type ModelList from '@/data/classes/ModelList';
import type TransactionSplit from '@/data/interfaces/Transactions/TransactionSplit';
import type Transaction from '@/data/interfaces/Transactions/Transaction';
import TransactionsService from '@/data/services/TransactionsService';
import TransactionSplitsService from '@/data/services/TransactionSplitsService';
import {useCategoryStore} from '@/stores/CategoryStore';
import { useMerchantStore } from '@/stores/MerchantStore';
import { useAccountStore } from '@/stores/AccountStore';

const model = defineModel<TransactionModel>({required: true});
const splits = defineModel<ModelList<TransactionSplitModel, TransactionSplit>>("splits");
const transaction = ref<Transaction>({} as Transaction);
const transactionSplits = ref<TransactionSplit[]>([] as TransactionSplit[]);
const splitEqually = ref(true);
const categoryStore = useCategoryStore();
const merchantStore = useMerchantStore();
const accountStore = useAccountStore();


  watch(model, async (newValue, oldValue) => {
    transactionSplits.value = [];
     if (newValue.pk) {
      transaction.value = await new TransactionsService().getSingle((newValue.splitId ?? newValue.pk).toString());
      if (newValue.splitId) {
        transactionSplits.value = await new TransactionSplitsService(newValue.splitId).getMultiple();
      }
    }
  })

function addNew() {
  // if (splits.value !== undefined) {
  //   splits.value.add(new TransactionSplitModel({} as TransactionSplit));

  // }
  var amount = 0;
  
  if (splitEqually.value) {
    const splitCount =  transactionSplits.value.length + 1;
    var dividedAmount = Math.round(transaction.value!.amount / splitCount * 100) / 100;
    var roundingError = transaction.value!.amount - (dividedAmount * splitCount);

    amount = dividedAmount + roundingError;

    for (const split of transactionSplits.value) {
      split.amount = dividedAmount;
    }

  } else {
    amount = transaction.value!.amount - transactionSplits.value.reduce((acc, x) => {return acc + Number(x.amount)}, 0);
  }

  transactionSplits.value.push({
    pk: 0,
    categoryId: transaction.value.categoryId,
    amount: amount
  } as TransactionSplit);
}

function deleteSplit(split: TransactionSplit) {
  transactionSplits.value = transactionSplits.value.filter(t => t !== split);

  if (splitEqually.value && transactionSplits.value.length > 0) {
    const splitCount =  transactionSplits.value.length;
    var dividedAmount = transaction.value!.amount / splitCount;
    var roundingError = transaction.value!.amount - (dividedAmount * splitCount);


    

    for (const split of transactionSplits.value) {
      split.amount = dividedAmount;
    }

  } 
}

async function save() {
  await new TransactionsService(transaction.value.pk).put(transaction.value);
  await new TransactionSplitsService(transaction.value.pk!).postMultiple(transactionSplits.value);
}

const remainingSplitAllocation = computed(() => {
  if (transactionSplits.value.length === 0) {
    return transaction.value?.amount ?? 0;
  } else {
    return (transaction.value?.amount ?? 0)  - transactionSplits.value.reduce((acc, x) => {return acc + Number(x.amount)}, 0);
  }
})

//const categories = ref<Category[]>([]);
const valid = ref(true);

</script>