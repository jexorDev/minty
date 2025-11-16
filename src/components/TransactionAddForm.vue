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
      <v-tab prepend-icon="mdi-information-outline" text="General" value="general"></v-tab>
      <v-tab prepend-icon="mdi-source-fork" text="Splits" value="splits"></v-tab>
    </v-tabs>

    <v-container>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="general">
          <v-row no-gutters>
            <v-col>
              <div class="text-overline">General Info</div>
            </v-col>
          </v-row>
          <v-row>          
            <v-col
              cols="12"
              md="3"
            >
            <v-date-input 
              v-model="fetchedTransaction.transactionDate"
              variant="outlined"
              prepend-icon=""
              prepend-inner-icon="mdi-calendar"
              ></v-date-input>
            </v-col>  
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="fetchedTransaction.description"
                label="Description"
                required
                variant="outlined"
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
                variant="outlined"             
                prefix="$"
                @focus="selectAllText"
              ></v-text-field>
              
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col>
              <div class="text-overline">Supplemental Info</div>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12"
              md="6">
              <v-textarea
                v-model="fetchedTransaction.notes"
                label="Notes"
                required
                variant="outlined"
                rows="4"
              ></v-textarea>
              <div class="text-caption font-weight-light">Tags</div>
              <TagsContainer v-model:selected-tags="fetchedTransaction.tags" :selectable-tags="selectableTags"></TagsContainer>
            </v-col>
            <v-col
              cols="12"
              md="6">
              <v-autocomplete 
                v-model="fetchedTransaction.categoryId" 
                label="Category" 
                :items="categoryStore.categories" 
                item-title="name" 
                item-value="pk" 
                variant="outlined"
                clearable>
                <template v-slot:append>
                  <v-tooltip text="Create new Category" location="top">
                    <template v-slot:activator="{ props }">                    
                      <v-btn v-bind="props" @click="openAddDialog('category')" variant="elevated" color="primary" size="xsmall" icon="mdi-plus"></v-btn>
                    </template>
                  </v-tooltip>
                </template>
              </v-autocomplete>
              <v-autocomplete 
                v-model="fetchedTransaction.merchantId" 
                label="Merchant" :items="merchantStore.merchants" 
                item-title="name" 
                item-value="pk" 
                variant="outlined"
                clearable>
                <template v-slot:append>
                  <v-tooltip text="Create new Merchant" location="top">
                    <template v-slot:activator="{ props }">                    
                      <v-btn v-bind="props" @click="openAddDialog('merchant')" variant="elevated" color="primary" size="xsmall" icon="mdi-plus"></v-btn>
                    </template>
                  </v-tooltip>
                </template>
              </v-autocomplete>
              <v-autocomplete 
                v-model="fetchedTransaction.accountId" 
                label="Account" 
                :items="accountStore.accounts" 
                item-title="name" 
                item-value="pk" 
                variant="outlined"
                clearable>
                <template v-slot:append>
                  <v-tooltip text="Create new Account" location="top">
                    <template v-slot:activator="{ props }">                    
                      <v-btn v-bind="props" @click="openAddDialog('account')" variant="elevated" color="primary" size="xsmall" icon="mdi-plus"></v-btn>
                    </template>
                  </v-tooltip>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>

        </v-tabs-window-item>
          <v-tabs-window-item value="splits">            
            <v-row>
              <v-col
                cols="12"
                md="9">             
                <v-card max-width="800">
                  <v-toolbar color="secondary-darken-1" density="compact" class="mb-2">
                    <v-switch 
                      v-model="splitEqually" 
                      label="Split Equally" 
                      color="primary"
                      class="mt-5 ml-2"
                      ></v-switch>
                    <v-spacer></v-spacer>                                        
                    <v-btn @click="addNew()" variant="elevated" color="primary" append-icon="mdi-source-fork">Add</v-btn>
                  </v-toolbar>
                  <div v-for="split of fetchedTransactionSplits">
                    <v-row no-gutters class="mt-2">
                      <v-col cols="7">
                        <v-autocomplete label="Category" v-model="split.categoryId" :items="categoryStore.categories" item-title="name" item-value="pk" density="compact" clearable variant="outlined" class="mr-1">
                          <template v-if="!split.categoryId" v-slot:prepend-inner>
                             <v-tooltip  text="Create new Category" location="top">
                              <template v-slot:activator="{ props }">                    
                                <v-btn v-bind="props" @click="openAddDialog('category')" variant="elevated" color="primary" size="xsmall" icon="mdi-plus"></v-btn>
                              </template>
                            </v-tooltip>
                          </template>                                                                        
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="5">
                         <v-text-field 
                          v-model="split.amount" 
                          prefix="$" 
                          :append-inner-icon="$vuetify.display.mobile || remainingSplitAllocation <= 0 ? '' : 'mdi-arrow-collapse-up'" 
                          v-on:click:append-inner="allocateRemainingToSplit(split)" 
                          @focus="selectAllText"
                          density="compact" 
                          variant="outlined">
                          <template v-slot:append>
                            <v-btn @click="deleteSplit(split)" color="secondary" icon="mdi-close" variant="text" size="xsmall"></v-btn>
                          </template>
                         </v-text-field>
                      </v-col>                    
                    </v-row> 
                    <v-row no-gutters>
                      <v-col>
                        <v-textarea 
                          v-model="split.notes"
                          label="Notes"
                          density="compact"
                          variant="outlined"
                          rows="1">
                        </v-textarea>
                      </v-col>
                    </v-row>
                    <v-row no-gutters>
                      <v-col>
                        <TagsContainer v-model:selected-tags="split.tags" :selectable-tags="selectableTags"></TagsContainer>
                      </v-col>
                    </v-row>
                    <v-divider thickness="3"></v-divider>
                  </div>
                </v-card>
              </v-col>
              <v-col 
                cols="12"
                md="3">
                <v-card color="secondary-darken-1">
                  <v-card-text>
                    <div class="text-overline">Transaction Total</div>
                    <div class="font-weight-medium">${{ fetchedTransaction.amount }}</div>
                    <div class="text-overline">Remaining Allocation</div>
                    <div class="font-weight-medium">${{ remainingSplitAllocation }} <v-icon v-if="remainingSplitAllocation !== fetchedTransaction.amount" :icon="remainingSplitAllocation === 0 ? 'mdi-check' : 'mdi-alert'" :color="remainingSplitAllocation === 0 ? 'success' : 'warning'"></v-icon></div>                      
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>  
          </v-tabs-window-item>
          </v-tabs-window>
        </v-container>
          <v-card-actions>
            <v-btn color="primary" variant="tonal" @click="show = false">Cancel</v-btn>
            <v-btn color="primary" variant="outlined" text="Save" @click="save()"></v-btn>
          </v-card-actions>  
      </v-card>
      <v-dialog v-model="showAddDialog" max-width="600">
        <v-card :title="`Add new ${newCategory ? 'Category' : (newMerchant ? 'Merchant' : 'Account')}`" color="secondary-darken-1">
          <v-card-text>
            <CategoryAddEditForm v-if="newCategory" v-model:category="newCategory"></CategoryAddEditForm>
            <MerchantAddEditForm v-if="newMerchant" v-model:merchant="newMerchant"></MerchantAddEditForm>
            <AccountAddEditForm v-if="newAccount" v-model:account="newAccount"></AccountAddEditForm>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="tonal" color="primary" @click="closeAddDialog()">Cancel</v-btn>
            <v-btn variant="outlined" color="primary" @click="saveAddDialog()">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
import { useSnackbarStore } from '@/stores/SnackbarStore';
import type Category from '@/data/interfaces/Category';
import CategoryService from '@/data/services/CategoryService';
import type Merchant from '@/data/interfaces/Merchant';
import type Account from '@/data/interfaces/Account';
import MerchantService from '@/data/services/MerchantService';
import AccountService from '@/data/services/AccountService';
import type Tag from '@/data/interfaces/Tag';

const show = defineModel<boolean>("show")
const tab = ref<"general" | "splits">("general");

const props = defineProps<{
  transaction?: TransactionSearch,
  tags?: Tag[]
}>();

const emit = defineEmits<{(e: "refresh"): void}>();

const fetchedTransaction = ref<Transaction>({} as Transaction);
const fetchedTransactionSplits = ref<TransactionSplit[]>([] as TransactionSplit[]);
const isSaving = ref(false);
const showAddDialog = ref(false);
const splitEqually = ref(true);

const categoryStore = useCategoryStore();
const merchantStore = useMerchantStore();
const accountStore = useAccountStore();
const snackbarStore = useSnackbarStore();

const newCategory = ref<Category | undefined>(undefined);
const newMerchant = ref<Merchant | undefined>(undefined);
const newAccount = ref<Account | undefined>(undefined);

const selectableTags = computed(() => props.tags ? props.tags.map(x => x.text) : []);

watch(show, async (newValue) => {
  if (!newValue) return;  

  tab.value = "general";
  fetchedTransactionSplits.value = [];

  if (props.transaction) {
    fetchedTransaction.value = await new TransactionsService().withRouteParameter((props.transaction.splitId ?? props.transaction.pk).toString()).getSingle();
    if (props.transaction.splitId) {
      fetchedTransactionSplits.value = await new TransactionSplitsService(props.transaction.splitId).getMultiple();
      if (fetchedTransactionSplits.value.length > 0) {
        tab.value = "splits";
      }
    } 
  }
}, {deep: true})

async function saveAddDialog() {  
  try {
    isSaving.value = true;

    if (newCategory.value) {
      const persistedCategory = await new CategoryService().post(newCategory.value);
      categoryStore.categories.push(persistedCategory);
      if (tab.value === "general") {
        fetchedTransaction.value.categoryId = persistedCategory.pk;
      } else {
        const firstSplit = fetchedTransactionSplits.value.find(x => x.categoryId === undefined);
        if (firstSplit) {
          firstSplit.categoryId = persistedCategory.pk!;
        }
      }
    } else if (newMerchant.value) {
      const persistedMerchant = await new MerchantService().post(newMerchant.value);
      merchantStore.merchants.push(persistedMerchant);
      fetchedTransaction.value.merchantId = persistedMerchant.pk;
    } else if (newAccount.value) {
      const persistedAccount = await new AccountService().post(newAccount.value);
      accountStore.accounts.push(persistedAccount);
      fetchedTransaction.value.accountId = persistedAccount.pk;
    }

    snackbarStore.setMessage("Successfully saved.", "success");    
    closeAddDialog();
  } finally {
    isSaving.value = false;
  }
}

function openAddDialog(type: "category" | "merchant" | "account") {
  if (type === "category") {
    newCategory.value = {
      type: 0,
    } as Category;
  } else if (type === "merchant") {
    newMerchant.value = {} as Merchant;
  } else if (type === "account") {
    newAccount.value = {} as Account;
  }

  showAddDialog.value = true;
}

function closeAddDialog() {
  newCategory.value = undefined;
  newMerchant.value = undefined;
  newAccount.value = undefined;
  showAddDialog.value = false;
}

function addNew() {

  var amount = 0;
  
  if (splitEqually.value) {
    const splitCount =  fetchedTransactionSplits.value.length + 1;
    var dividedAmount = Math.round(fetchedTransaction.value!.amount / splitCount * 100) / 100;
    var roundingError = Math.round((fetchedTransaction.value!.amount - (dividedAmount * splitCount)) * 100) / 100;

    amount = dividedAmount + roundingError;

    for (const split of fetchedTransactionSplits.value) {
      split.amount = dividedAmount;
    }

  } else {
    amount = fetchedTransaction.value!.amount - currentSplitAllocation.value;
  }

  fetchedTransactionSplits.value.push({
    categoryId: fetchedTransaction.value.categoryId,
    amount: Math.round(amount * 100 ) / 100,
    tags: [],
    notes: ""
  } as TransactionSplit);
}

function deleteSplit(split: TransactionSplit) {
  fetchedTransactionSplits.value = fetchedTransactionSplits.value.filter(t => t !== split);

  if (splitEqually.value && fetchedTransactionSplits.value.length > 0) {
    const splitCount =  fetchedTransactionSplits.value.length;
    var dividedAmount = Math.round(fetchedTransaction.value!.amount / splitCount * 100) / 100;
    var roundingError = Math.round((fetchedTransaction.value!.amount - (dividedAmount * splitCount)) * 100) / 100;

    for (const split of fetchedTransactionSplits.value) {
      split.amount = dividedAmount;
    }

    fetchedTransactionSplits.value[0].amount += roundingError;

  } 
}

async function save() {
  if (fetchedTransactionSplits.value.length > 0 && remainingSplitAllocation.value !== 0) {
    snackbarStore.setMessage("Splits must total to original transaction total.", "error");
    return;
  } else if (fetchedTransactionSplits.value.filter(x => x.categoryId === null).length > 0) {
    snackbarStore.setMessage("All splits must have a category set.", "error");
    return;
  }

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

function selectAllText(event: any) {
    event.target.select();
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

</script>