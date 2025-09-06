<template>
<DialogBase model-type="Transaction" :is-new="model.isNew" @save="save">
  <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="3"
          >
           <v-date-input v-model="model.transactionDate"></v-date-input>
          </v-col>
  
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="model.description"
              label="Description"
              required
            ></v-text-field>
           
          </v-col>
  
          <v-col
            cols="12"
            md="3"
          >
            <v-text-field
              v-model="model.amount"
              label="Amount"
              required
            ></v-text-field>
            
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select v-model="model.categoryId" label="Category" :items="categories" item-title="name" item-value="pk"></v-select>
          </v-col>
          <v-col>
            <v-select label="Subcategory"></v-select>
          </v-col>
          <v-col>
            <v-select label="Merchant"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select label="Account"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="model.notes"
              label="Notes"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-checkbox v-model="model.exclude" label="Exclude"></v-checkbox>
          </v-col>
        </v-row>
        <h1>Splits</h1>
        <v-btn @click="addNew()">Add</v-btn>
        <v-row v-for="split of transactionSplits">
          <v-col>
            <v-select label="Category" v-model="split.categoryId" :items="categories" item-title="name" item-value="pk"></v-select>
          </v-col>
          <v-col>
            <v-text-field v-model="split.amount"></v-text-field>
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

const model = defineModel<TransactionModel>({required: true});
const splits = defineModel<ModelList<TransactionSplitModel, TransactionSplit>>("splits");
const transaction = ref<Transaction>({} as Transaction);
const transactionSplits = ref<TransactionSplit[]>([] as TransactionSplit[]);

onMounted(async () => {
  categories.value = await new CategoryService()
    .getMultiple();
   
})

  watch(model, async (newValue, oldValue) => {
     if (newValue.pk) {
      transaction.value = await new TransactionsService().getSingle(newValue.pk.toString());
      if (newValue.splitId) {
        for (const split of await new TransactionSplitsService(newValue.splitId).getSingle()) {
          transactionSplits.value.push(split);
        }
        console.log(transactionSplits.value)
      }
    }
  })

function addNew() {
  // if (splits.value !== undefined) {
  //   splits.value.add(new TransactionSplitModel({} as TransactionSplit));

  // }
  console.log(transactionSplits.value)

  transactionSplits.value.push({
    pk: 0,
    categoryId: model.value.categoryId,
    amount: model.value.amount
  } as TransactionSplit);
}

async function save() {
  await new TransactionSplitsService(model.value.pk!).post(transactionSplits.value)
}

const categories = ref<Category[]>([]);
const valid = ref(true);

</script>