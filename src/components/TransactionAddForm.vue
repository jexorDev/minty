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
    <v-tabs
      v-model="tab"
      color="primary"
    >
      <v-tab prepend-icon="mdi-sitemap-outline" text="General" value="option-1"></v-tab>
      <v-tab prepend-icon="mdi-point-of-sale" text="Splits" value="option-2"></v-tab>
    </v-tabs>

    <v-container>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="option-1">
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
          <v-col
            cols="12"
            md="4">
            <v-autocomplete v-model="fetchedTransaction.categoryId" label="Category" :items="categoryStore.categories" item-title="name" item-value="pk"></v-autocomplete>
          </v-col>
          
          <v-col
            cols="12"
            md="4">
            <v-autocomplete v-model="fetchedTransaction.merchantId" label="Merchant" :items="merchantStore.merchants" item-title="name" item-value="pk"></v-autocomplete>
          </v-col>
        
          <v-col
            cols="12"
            md="4">
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

          </v-tabs-window-item>
          <v-tabs-window-item value="option-2">
            <div class="d-flex">
              

            </div>
            
            <v-row>
              <v-col
                cols="12"
                md="9">             
                <v-card max-width="800">
                  <v-toolbar color="secondary-darken-1" density="compact" class="mb-2">
                    <v-checkbox v-model="splitEqually" label="Split Equally" class="mt-5"></v-checkbox>
                    <v-spacer></v-spacer>
                    <v-btn @click="addNew()" variant="elevated" color="primary">Add Split</v-btn>
                  </v-toolbar>
                  <v-row v-for="split of fetchedTransactionSplits">
                    <v-col cols="7">
                      <v-select label="Category" v-model="split.categoryId" :items="categoryStore.categories" item-title="name" item-value="pk"></v-select>
                    </v-col>
                    <v-col cols="4">
                      <!-- <v-combobox v-model="split.amount" hide-no-data :items="splitAmountAutoComplete"></v-combobox> -->
                       <v-text-field v-model="split.amount" prefix="$" :append-inner-icon="$vuetify.display.mobile || remainingSplitAllocation <= 0 ? '' : 'mdi-arrow-collapse-up'" v-on:click:append-inner="allocateRemainingToSplit(split)"></v-text-field>
                      
                    </v-col>
                    <v-col cols="1">
                      <v-btn @click="deleteSplit(split)" color="secondary" class="mt-3" icon="mdi-close" variant="text"></v-btn>
                    </v-col>
                  </v-row> 
                </v-card>
              </v-col>
              <v-col 
                cols="12"
                md="3">
                <v-card color="secondary-darken-1">
                  <v-card-text>
                    <div class="text-overline">Transaction Total</div>
                    <div>${{ fetchedTransaction.amount }}</div>
                    <div class="text-overline">Remaining Allocation</div>
                    <div>${{ remainingSplitAllocation }} <v-icon v-if="remainingSplitAllocation !== fetchedTransaction.amount" :icon="remainingSplitAllocation === 0 ? 'mdi-check' : 'mdi-alert'" :color="remainingSplitAllocation === 0 ? 'success' : 'warning'"></v-icon></div>
                      
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>  
        
 
      
          </v-tabs-window-item>
          </v-tabs-window>
        </v-container>
     
       
          <v-card-actions>
            <v-btn color="primary" variant="tonal" @click="show = false">Cancel</v-btn>
            <v-btn color="primary" variant="outlined" text="Save" @click="save"></v-btn>
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
const tab = ref("option-1");

const props = defineProps<{
  transaction?: TransactionSearch
}>();

const emit = defineEmits<{(e: "refresh"): void}>();

const fetchedTransaction = ref<Transaction>({} as Transaction);
const fetchedTransactionSplits = ref<TransactionSplit[]>([] as TransactionSplit[]);

const splitEqually = ref(true);
const categoryStore = useCategoryStore();
const merchantStore = useMerchantStore();
const accountStore = useAccountStore();

watch(show, async (newValue) => {
  if (!newValue) return;  

  tab.value = "option-1";
  fetchedTransaction.value = {} as TransactionSearch;
  fetchedTransactionSplits.value = [];

  if (props.transaction) {
    fetchedTransaction.value = await new TransactionsService().withRouteParameter((props.transaction.splitId ?? props.transaction.pk).toString()).getSingle();
    if (props.transaction.splitId) {
      fetchedTransactionSplits.value = await new TransactionSplitsService(props.transaction.splitId).getMultiple();
      if (fetchedTransactionSplits.value.length > 0) {
        tab.value = "option-2";
      }
    } 
  }
}, {deep: true})


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
    amount = fetchedTransaction.value!.amount - currentSplitAllocation.value;
  }

  fetchedTransactionSplits.value.push({
    pk: 0,
    categoryId: fetchedTransaction.value.categoryId,
    amount: Math.round(amount * 100 ) / 100
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
  if (fetchedTransaction.value.pk) {
    await new TransactionsService().put(fetchedTransaction.value);
    await new TransactionSplitsService(fetchedTransaction.value.pk!).postMultiple(fetchedTransactionSplits.value);
  } else {
    const persistedTransaction = await new TransactionsService().post(fetchedTransaction.value);
    if (fetchedTransactionSplits.value.length > 0) {
      await new TransactionSplitsService(persistedTransaction.pk!).postMultiple(fetchedTransactionSplits.value);
    } 
  }

  show.value = false;
  emit("refresh");
}

function allocateRemainingToSplit(split: TransactionSplit) {
  split.amount += remainingSplitAllocation.value;
}

const currentSplitAllocation = computed(() => {
  return fetchedTransactionSplits.value.reduce((acc, x) => {return acc + Number(x.amount)}, 0);
});

const remainingSplitAllocation = computed(() => {
  if (fetchedTransactionSplits.value.length === 0) {
    return fetchedTransaction.value?.amount ?? 0;
  } else {
    return Math.round(((fetchedTransaction.value?.amount ?? 0)  - currentSplitAllocation.value) * 100) / 100;
  }
})

//const categories = ref<Category[]>([]);
const valid = ref(true);

</script>