<template>
       <div :class="mobile ? '' : 'd-flex flex-row'">
   <v-tabs
        v-model="tab"
        color="primary"
        :direction="mobile ? 'horizontal': 'vertical'"
      >
        <v-tab prepend-icon="mdi-sitemap-outline" text="Categories" value="option-1"></v-tab>
        <v-tab prepend-icon="mdi-point-of-sale" text="Merchants" value="option-2"></v-tab>
        <v-tab prepend-icon="mdi-bank" text="Accounts" value="option-3"></v-tab>
      </v-tabs>

      <v-container fluid>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="option-1">  
            <v-row>
              <v-col :cols="$vuetify.display.mobile ? 12 : 4">
                <v-list style="height: 97vh; overflow: auto;">
                  <v-list-item v-for="category in categoryStore.categories" @click="selectedCategory = category">
                    <v-list-item-title>
                      {{ category.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>                      
                      {{  getCategoryType(category.type)?.description }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
                    
                
              </v-col>
              <v-col :cols="$vuetify.display.mobile ? 12 : 8">
                  
  
                <v-card v-if="selectedCategory">
                  <v-card-title>
                    <v-row>
                      <v-col>

                        Edit Category
                        <v-spacer></v-spacer>
                        <v-col>
                          <v-btn @click="showConvertCategoryDialog = true">Convert</v-btn>

                        </v-col>
                      </v-col>
                    </v-row>
                  </v-card-title>

                  <v-tabs v-model="selectedCategoryTab">
                    <v-tab value="general">General</v-tab>
                    <v-tab value="transactions">Transactions</v-tab>
                  </v-tabs>

                  <v-card-text>
                    <v-tabs-window v-model="selectedCategoryTab">
                      <v-tabs-window-item value="general">
                        <div class="text-overline">Name</div>
                        <v-text-field v-model="selectedCategory.name"></v-text-field> 
    
                        <div class="text-overline">Type</div>
                        <v-btn-toggle v-model="selectedCategory.type" mandatory>
                          <v-btn>Expense</v-btn>
                          <v-btn>Income</v-btn> 
                          <v-btn>Transfer</v-btn>                     
    
                        </v-btn-toggle>
    
                        <div class="text-overline">Statistics</div>
                        <v-btn-toggle v-model="selectedCategory.reportingType" mandatory>
                          <v-btn>Always Include</v-btn>
                          <v-btn>Exclude by Default</v-btn>
                          <v-btn>Always Exclude</v-btn>
    
                        </v-btn-toggle>                   
                      </v-tabs-window-item>
                      <v-tabs-window-item value="transactions">
                        <TransactionsList v-model:selectedTransaction="selectedTransaction" :transactions="selectedCategoryTransactions"></TransactionsList>
                      </v-tabs-window-item>
                    </v-tabs-window>
  
                    
                  </v-card-text>
                  <v-card-actions>
                    <v-btn @click="saveCategory()">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>

          
        </v-tabs-window-item>

        <v-tabs-window-item value="option-2">
            <v-row>
              <v-col :cols="4">
                <v-list style="height: 97vh; overflow: auto;">
                  <v-list-item v-for="merchant in merchantStore.merchants" @click="selectedMerchant = merchant">
                    <v-list-item-title>
                      {{ merchant.name }}
                    </v-list-item-title>                   
                  </v-list-item>
                </v-list>
                    
                
              </v-col>
              <v-col :cols="8">
                  
  
                <v-card v-if="selectedMerchant">
                  <v-card-title>Edit Merchant</v-card-title>
                  <v-card-text>
                    <div class="text-overline">Name</div>
                    <v-text-field v-model="selectedMerchant.name"></v-text-field>                  
  
                    
                  </v-card-text>
                  <v-card-actions>
                    <v-btn @click="saveMerchant()">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
        </v-tabs-window-item>

        <v-tabs-window-item value="option-3">
           <v-row>
              <v-col :cols="4">
                <v-list style="height: 97vh; overflow: auto;">
                  <v-list-item v-for="account in accountStore.accounts" @click="selectedAccount = account">
                    <v-list-item-title>
                      {{ account.name }}
                    </v-list-item-title>
                    
                  </v-list-item>
                </v-list>
                    
                
              </v-col>
              <v-col :cols="8">
                  
  
                <v-card v-if="selectedAccount">
                  <v-card-title>Edit Account</v-card-title>
                  <v-card-text>
                    <div class="text-overline">Name</div>
                    <v-text-field v-model="selectedAccount.name"></v-text-field> 

  
                    
                  </v-card-text>
                  <v-card-actions>
                    <v-btn @click="saveAccount()">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
        </v-tabs-window-item>
      </v-tabs-window>
      <v-snackbar
      v-model="snackbar"
    >
      {{ snackbarText }}

      <template v-slot:actions>
        <v-btn
          color="pink"
          variant="text"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <TransactionAddForm :transaction="selectedTransaction" v-model:show="showAddTransactionDialog" ></TransactionAddForm>


    <v-dialog v-model="showConvertCategoryDialog">
      <v-card>
        <v-card-title>Convert Category</v-card-title>
        <v-card-text>
          Converting all transactions with category {{ selectedCategory?.name }} to:
          <v-autocomplete v-model="selectedConvertCategory" :items="categoryStore.categories" item-title="name" item-value="pk"></v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="showConvertCategoryDialog = false">Cancel</v-btn>
          <v-btn @click="convertCategory()">Convert</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
          </v-container>      

    </div>
</template>
<script setup lang="ts">
import type Category from '@/data/interfaces/Category';
import CategoryService from '@/data/services/CategoryService';
import { useDisplay } from 'vuetify'
import { useCategoryStore } from '@/stores/CategoryStore';
import { useMerchantStore } from '@/stores/MerchantStore';
import type Merchant from '@/data/interfaces/Merchant';
import type Account from '@/data/interfaces/Account';
import { useAccountStore } from '@/stores/AccountStore';
import MerchantService from '@/data/services/MerchantService';
import AccountService from '@/data/services/AccountService';
import type TransactionSearch from '@/data/interfaces/Transactions/TransactionSearch';
import TransactionSearchService from '@/data/services/TransactionSearchService';
import TransactionsService from '@/data/services/TransactionsService';
import GenericService from '@/data/services/GenericService';

const categoryStore = useCategoryStore();
const merchantStore = useMerchantStore();
const accountStore = useAccountStore();

const { mobile } = useDisplay()

//const categories = ref<Category[]>([]);
const selectedTransaction = ref<TransactionSearch>({} as TransactionSearch);
const selectedCategory = ref<Category | null>(null);
const selectedConvertCategory = ref<Category | null>(null);
const showConvertCategoryDialog = ref(false);
const categoryTypes : {value: number, description: string}[] = [
  {value: 0, description: "Expense"},
  {value: 1, description: "Income"},
  {value: 2, description: "Transfer"}
];
const categoryReportingTypes : {value: number, description: string}[] = [
  {value: 0, description: "Include"},
  {value: 1, description: "Exclude by Default"},
  {value: 2, description: "Exclude Always"}
];

const selectedMerchant = ref<Merchant | null>(null);
const selectedAccount = ref<Account | null>(null);
const tab = ref("option-1");
const showAddTransactionDialog = ref(false);
const selectedCategoryTab = ref("general");
const selectedCategoryTransactions = ref<TransactionSearch[]>([]);
const snackbar = ref(false);
const snackbarText = ref("");

async function saveCategory() {
  if (!selectedCategory.value) return;

  try {
    await new CategoryService().put(selectedCategory.value);

  } finally {
    snackbar.value = true;
    snackbarText.value = `${selectedCategory.value.name} successfully saved`;
  }


}

async function saveMerchant() {
  if (!selectedMerchant.value) return;

  await new MerchantService().put(selectedMerchant.value);
}

async function saveAccount() {
  if (!selectedAccount.value) return;

  await new AccountService().put(selectedAccount.value);
}

function getCategoryType(id: number) {
  return categoryTypes.find(x => x.value === id);
}

async function convertCategory(): Promise<void> {
  await new GenericService("transactions/convert/category").withUrlParameters({
    "fromCategory": selectedCategory.value?.pk,
    "toCategory": selectedConvertCategory.value
  }).put(null).then(() => showConvertCategoryDialog.value = false);
}

watch (selectedCategory, () => {
  selectedCategoryTab.value = "general";
})

watch(selectedCategoryTab, async () => {
  if (selectedCategoryTab.value !== "transactions") return;

  selectedCategoryTransactions.value = await new TransactionSearchService()
  .withUrlParameters({
    "categoryId": selectedCategory.value?.pk
  }).getMultiple();
  
})

  watch(selectedTransaction, () => showAddTransactionDialog.value = true);

</script>