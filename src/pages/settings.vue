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
        <v-tab prepend-icon="mdi-file-document-check-outline" value="imported-files" text="Imported Files"></v-tab>
      </v-tabs>

      <v-container fluid>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="option-1">  
            <v-row>
              <v-col 
                cols="12"
                md="4"
                v-if="!$vuetify.display.mobile || selectedCategory === null">
                <v-list :class="$vuetify.display.mobile ? '' : 'main-list-scroll'">
                    <v-list-item>
                      <v-text-field v-model="categoryFilter" density="compact" label="Filter" clearable class="mt-4 mr-2"></v-text-field>                      
                      <template v-slot:append>
                        <v-btn @click="addNewCategory" color="primary">Add New</v-btn>
                      </template>
                      
                    </v-list-item>
                  <v-list-item v-for="category in filteredCategories" @click="selectedCategory = category">
                    <v-list-item-title>
                      {{ category.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>                      
                      {{  getCategoryType(category.type)?.description }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col 
                cols="12"
                md="8"
                >
                <v-card v-if="selectedCategory" color="secondary-darken-1" :title="selectedCategory.pk ? 'Edit Category' : 'Add Category'">
                  <template v-slot:append>
                    <v-icon icon="mdi-close" @click="selectedCategory = null"></v-icon>
                  </template>                  
                  <v-tabs v-model="selectedCategoryTab">
                    <v-tab value="general">General</v-tab>
                    <v-tab value="transactions" :disabled="!selectedCategory.pk">Transactions</v-tab>
                    <v-tab value="rules" :disabled="!selectedCategory.pk">Rules</v-tab>
                  </v-tabs>
                  <v-card-text>
                    <v-tabs-window v-model="selectedCategoryTab">
                      <v-tabs-window-item value="general">
                        <div class="text-overline">Name</div>
                          <v-text-field v-model="selectedCategory.name"></v-text-field>     
                        <div class="text-overline">Type</div>
                        <v-btn-toggle 
                        v-model="selectedCategory.type" 
                         base-color="secondary"
                        color="primary"
                        density="compact"
                        mandatory>
                          <v-btn>Expense</v-btn>
                          <v-btn>Income</v-btn> 
                          <v-btn>Transfer</v-btn>     
                        </v-btn-toggle>    
                        <div class="text-overline">Statistics</div>
                        <v-btn-toggle 
                        v-model="selectedCategory.reportingType" 
                         base-color="secondary"
                        color="primary"
                        density="compact"
                        mandatory>
                          <v-btn>Always Include</v-btn>
                          <v-btn>Exclude by Default</v-btn>
                          <v-btn>Always Exclude</v-btn>
    
                        </v-btn-toggle>                   
                      </v-tabs-window-item>
                      <v-tabs-window-item value="transactions">
                        <v-card :class="$vuetify.display.mobile ? '' : 'inner-list-scroll'">
                          <TransactionsList v-model:selectedTransaction="selectedTransaction" :transactions="selectedCategoryTransactions"></TransactionsList>
                        </v-card>
                      </v-tabs-window-item>
                      <v-tabs-window-item value="rules">
                        <v-card>
                          <v-data-table :items="selectedCategoryRules"></v-data-table>
                        </v-card>
                      </v-tabs-window-item>
                    </v-tabs-window> 
                    
                  </v-card-text>
                  <v-card-actions>
                    <v-btn :disabled="!selectedCategory.pk" color="primary-darken-1" @click="deleteCategory()">Delete</v-btn>
                    <v-btn :disabled="!selectedCategory.pk" variant="tonal" color="primary-darken-1" append-icon="mdi-source-merge" @click="showConvertCategoryDialog = true">Merge</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn variant="outlined" color="primary-darken-1" @click="saveCategory()">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>          
        </v-tabs-window-item>

        <v-tabs-window-item value="option-2">
            <v-row>
              <v-col :cols="4">
                <v-list :class="$vuetify.display.mobile ? '' : 'main-list-scroll'">
                  <v-list-item v-for="merchant in merchantStore.merchants" @click="selectedMerchant = merchant">
                    <v-list-item-title>
                      {{ merchant.name }}
                    </v-list-item-title>                   
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col :cols="8">
                <v-card v-if="selectedMerchant" color="secondary-darken-1">
                  <v-card-title>Edit Merchant</v-card-title>
                  <v-card-text>
                    <div class="text-overline">Name</div>
                    <v-text-field v-model="selectedMerchant.name"></v-text-field>                  
                  </v-card-text>
                  <v-card-actions>
                    <v-btn :disabled="!selectedMerchant.pk" color="primary-darken-1">Delete</v-btn>                    
                    <v-spacer></v-spacer>
                    <v-btn variant="outlined" color="primary-darken-1" @click="saveMerchant()">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
        </v-tabs-window-item>

        <v-tabs-window-item value="option-3">
           <v-row>
              <v-col :cols="4">
                <v-list :class="$vuetify.display.mobile ? '' : 'main-list-scroll'">
                  <v-list-item v-for="account in accountStore.accounts" @click="selectedAccount = account">
                    <v-list-item-title>
                      {{ account.name }}
                    </v-list-item-title>                    
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col :cols="8">
                <v-card v-if="selectedAccount" color="secondary-darken-1">
                  <v-card-title>Edit Account</v-card-title>
                  <v-card-text>
                    <div class="text-overline">Name</div>
                    <v-text-field v-model="selectedAccount.name"></v-text-field> 
                  </v-card-text>
                  <v-card-actions>
                    <v-btn :disabled="!selectedAccount.pk" color="primary-darken-1">Delete</v-btn>                    
                    <v-spacer></v-spacer>
                    <v-btn variant="outlined" color="primary-darken-1" @click="saveAccount()">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
        </v-tabs-window-item>
        <v-tabs-window-item value="imported-files">
          <ImportedFiles></ImportedFiles>
        </v-tabs-window-item>
      </v-tabs-window>     

    <TransactionAddForm :transaction="selectedTransaction" v-model:show="showAddTransactionDialog" ></TransactionAddForm>


    <v-dialog v-model="showConvertCategoryDialog">
      <v-card>
        <v-card-title>Merge Category</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              Merging all transactions with category {{ selectedCategory?.name }} into:
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-autocomplete :rules="['required']" v-model="selectedConvertCategory" :items="categoryStore.categories" item-title="name" item-value="pk"></v-autocomplete>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>          
          <v-btn @click="showConvertCategoryDialog = false">Cancel</v-btn>
          <v-btn @click="convertCategory()">Merge</v-btn>
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
import type CategoryRule from '@/data/interfaces/CategoryRule';
import CategoryRuleService from '@/data/services/CategoryRuleService';
import { useSnackbarStore } from '@/stores/SnackbarStore';
import { useConfirmationStore } from '@/stores/ConfirmationStore';

const categoryStore = useCategoryStore();
const merchantStore = useMerchantStore();
const accountStore = useAccountStore();
const snackbarStore = useSnackbarStore();
const confirmationStore = useConfirmationStore();

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
const selectedCategoryRules = ref<CategoryRule[]>([]);
const categoryFilter = ref("");

async function saveCategory() {
  if (!selectedCategory.value) return;

  try {
    if (selectedCategory.value.pk) {
      await new CategoryService().put(selectedCategory.value);
    } else {
      const persistedCategory = await new CategoryService().post(selectedCategory.value);
      categoryStore.categories = await new CategoryService().getMultiple();
      selectedCategory.value = categoryStore.categories.find(x => x.pk === persistedCategory.pk) ?? null;
    }
  } finally {
    snackbarStore.setMessage("Category successfully saved.", "success");    
  }
}

async function deleteCategory() {
  confirmationStore.setConfirmation("Are you sure you want to delete this category?", async () => {
    snackbarStore.setMessage("This doesn't work yet", "info");
  });
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
  if (!selectedConvertCategory.value) {
    console.log("please enter a category");
    
    return;
  }
  
  await new GenericService("transactions/convert/category").withUrlParameters({
      "fromCategory": selectedCategory.value?.pk,
      "toCategory": selectedConvertCategory.value
    }).put(null).then(async () =>
    { 
      selectedCategory.value = null;
      categoryStore.categories = await new CategoryService().getMultiple();
      showConvertCategoryDialog.value = false
      snackbarStore.setMessage("Category successfully merged", "success");
    });

  
}

function addNewCategory() {
  selectedCategory.value = {
    type: 0, 
    reportingType: 0
  } as Category;
}

const filteredCategories = computed(() => categoryFilter.value ? categoryStore.categories.filter(x => x.name.toLowerCase().startsWith(categoryFilter.value.toLowerCase())) : categoryStore.categories);

watch (selectedCategory, () => {
  selectedCategoryTab.value = "general";
})

watch(selectedCategoryTab, async () => {
  if (!selectedCategory.value?.pk) return;
  if (selectedCategoryTab.value === "transactions") {
    selectedCategoryTransactions.value = await new TransactionSearchService()
    .withUrlParameters({
      "categoryId": selectedCategory.value?.pk
    }).getMultiple();
  } else if (selectedCategoryTab.value === "rules") {
    selectedCategoryRules.value = await new CategoryRuleService(selectedCategory.value.pk).getMultiple();
  }

  
})

  watch(selectedTransaction, () => showAddTransactionDialog.value = true);

</script>
<style scoped>
.main-list-scroll {
  max-height: 97vh;
  overflow: auto;
}
.inner-list-scroll {
  max-height: 75vh;
  overflow: auto;
}
</style>