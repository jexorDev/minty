<template>
  <div :class="mobile ? '' : 'd-flex flex-row'">
   <v-tabs
        v-model="tab"
        color="primary"
        :direction="mobile ? 'horizontal': 'vertical'"
      >
        <v-tab prepend-icon="mdi-sitemap-outline" text="Categories" value="category"></v-tab>
        <v-tab prepend-icon="mdi-point-of-sale" text="Merchants" value="merchant"></v-tab>
        <v-tab prepend-icon="mdi-bank" text="Accounts" value="account"></v-tab>
        <v-tab prepend-icon="mdi-file-document-check-outline" value="imported-files" text="Imported Files"></v-tab>
      </v-tabs>

      <v-container fluid>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="category">  
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
                      {{ categoryTypeEnum.getItemByValue(category.type)?.description }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col 
                cols="12"
                md="8"
                >
                <v-card 
                  v-if="selectedCategory" 
                  color="secondary-darken-1" 
                  :title="selectedCategory.pk ? 'Edit Category' : 'Add Category'" 
                  :loading="isSaving">
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
                        <CategoryAddEditForm v-model:category="selectedCategory"></CategoryAddEditForm>
                      </v-tabs-window-item>
                      <v-tabs-window-item value="transactions">
                        <v-card :class="$vuetify.display.mobile ? '' : 'inner-list-scroll'">
                          <TransactionsList v-if="selectedCategoryTransactions" @selected-transaction-changed="setTransactionToEdit" :transactions="selectedCategoryTransactions"></TransactionsList>
                        </v-card>
                      </v-tabs-window-item>
                      <v-tabs-window-item value="rules">
                        <div>
                          <v-icon icon="mdi-information-outline"></v-icon>
                          Any match on rules will map transactions to this category during a file import
                        </div>
                        <v-divider thickness="2" class="my-2" color="white"></v-divider>
                        <div class="d-flex flex-wrap">
                            <v-chip v-for="rule in selectedCategoryRules"
                              class="mr-2 mt-1"
                              color="secondary-lighten-1"
                              variant="outlined"
                              label
                              size="large"
                              closable
                              @click:close="removeCategoryRule(rule)">
                              {{ rule }}
                            </v-chip>
                          
                          <v-text-field 
                            v-model="categoryRuleText"                            
                            class="mt-1"
                            variant="outlined" 
                            density="compact" 
                            max-width="250" 
                            min-width="200"
                            append-inner-icon="mdi-plus"
                            @click:append-inner="addNewCategoryRule">                            
                          </v-text-field>

                        </div>
                        
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

        <v-tabs-window-item value="merchant">
          <v-row>
              <v-col 
                cols="12"
                md="4"
                v-if="!$vuetify.display.mobile || selectedMerchant === null">
                <v-list :class="$vuetify.display.mobile ? '' : 'main-list-scroll'">
                    <v-list-item>
                      <v-text-field v-model="merchantFilter" density="compact" label="Filter" clearable class="mt-4 mr-2"></v-text-field>                      
                      <template v-slot:append>
                        <v-btn @click="addNewMerchant" color="primary">Add New</v-btn>
                      </template>
                      
                    </v-list-item>
                  <v-list-item v-for="merchant in filteredMerchants" @click="selectedMerchant = merchant" :title="merchant.name">
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col 
                cols="12"
                md="8"
                >
                <v-card 
                  v-if="selectedMerchant" 
                  color="secondary-darken-1" 
                  :title="selectedMerchant.pk ? 'Edit Merchant' : 'Add Merchant'"
                  :loading="isSaving">
                   <template v-slot:append>
                    <v-icon icon="mdi-close" @click="selectedMerchant = null"></v-icon>
                  </template>         
                  <v-card-text>
                      <MerchantAddEditForm v-model:merchant="selectedMerchant"></MerchantAddEditForm>
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

        <v-tabs-window-item value="account">
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
                <v-card 
                  v-if="selectedAccount" 
                  color="secondary-darken-1"
                  :title="selectedAccount.pk ? 'Edit Account' : 'Add Account'"
                  :loading="isSaving">                  
                   <template v-slot:append>
                    <v-icon icon="mdi-close" @click="selectedAccount = null"></v-icon>
                    </template>         
                  <v-card-text>
                    <AccountAddEditForm v-model:account="selectedAccount"></AccountAddEditForm>
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


    <v-dialog v-model="showConvertCategoryDialog" max-width="600">
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
          <v-btn @click="showConvertCategoryDialog = false" color="primary" variant="tonal">Cancel</v-btn>
          <v-btn @click="convertCategory()" color="primary" variant="outlined">Merge</v-btn>
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
import CategoryTypeEnum from '@/data/enumerations/CategoryType';

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

const categoryTypeEnum = new CategoryTypeEnum();
const selectedMerchant = ref<Merchant | null>(null);
const selectedAccount = ref<Account | null>(null);
const tab = ref("category");
const showAddTransactionDialog = ref(false);
const selectedCategoryTab = ref("general");
const selectedCategoryTransactions = ref<TransactionSearch[] | undefined>(undefined);
const selectedCategoryRules = ref<string[] | undefined>(undefined);
const categoryFilter = ref("");
const merchantFilter = ref("");
const categoryRuleText = ref("");
const isSaving = ref(false);

async function saveCategory() {
  if (!selectedCategory.value) return;

  try {
    isSaving.value = true;

    if (selectedCategory.value.pk) {
      await Promise.all([
        new CategoryService().put(selectedCategory.value),
        selectedCategoryRules.value === undefined 
          ? null 
          : new CategoryRuleService(selectedCategory.value!.pk!).postMultiple(selectedCategoryRules.value)
      ]);      
    } else {
      const persistedCategory = await new CategoryService().post(selectedCategory.value);
      categoryStore.categories = await new CategoryService().getMultiple();      
      selectedCategory.value = categoryStore.categories.find(x => x.pk === persistedCategory.pk) ?? null;
    }
    snackbarStore.setMessage("Category successfully saved.", "success");    
  } finally {
    isSaving.value = false;
  }
}

async function deleteCategory() {
  confirmationStore.setConfirmation("Are you sure you want to delete this category?", async () => {
    snackbarStore.setMessage("This doesn't work yet", "info");
  });
}

async function saveMerchant() {
  if (!selectedMerchant.value) return;

  try {
    isSaving.value = true;

    if (selectedMerchant.value.pk) {
      await new MerchantService().put(selectedMerchant.value);
    } else {
      const persistedMerchant = await new MerchantService().post(selectedMerchant.value);
      merchantStore.merchants = await new MerchantService().getMultiple();
      selectedMerchant.value = merchantStore.merchants.find(x => x.pk === persistedMerchant.pk) ?? null;
    }
    snackbarStore.setMessage("Merchant successfully saved.", "success");    
  } finally {
    isSaving.value = false;
  }

}

async function saveAccount() {
  if (!selectedAccount.value) return;

  try {
    isSaving.value = true;

    if (selectedAccount.value.pk) {
      await new AccountService().put(selectedAccount.value);
    } else {
      const persistedAccount = await new AccountService().post(selectedAccount.value);
      accountStore.accounts = await new AccountService().getMultiple();
      selectedAccount.value = accountStore.accounts.find(x => x.pk === persistedAccount.pk) ?? null;
    }
    snackbarStore.setMessage("Account successfully saved.", "success");    
  } finally {
    isSaving.value = false;
  }
}

async function convertCategory(): Promise<void> {
  if (!selectedConvertCategory.value) {
    snackbarStore.setMessage("Please select a category.", "error");        
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

function addNewCategoryRule() {
  if (categoryRuleText.value === "") return;

  selectedCategoryRules.value!.push(categoryRuleText.value);
  categoryRuleText.value = "";
}

function removeCategoryRule(rule: string): void {
  if (selectedCategoryRules.value){
    const index = selectedCategoryRules.value.indexOf(rule);
    if (index >= 0) {
      selectedCategoryRules.value.splice(index, 1);
    }
  }
}

function addNewCategory() {
  selectedCategory.value = {
    type: 0, 
    reportingType: 0
  } as Category;
}

function addNewMerchant() {
  selectedMerchant.value = { } as Merchant;
}

function setTransactionToEdit(transaction: TransactionSearch) {
    selectedTransaction.value = transaction;
    showAddTransactionDialog.value = true;
}

const filteredCategories = computed(() => categoryFilter.value ? categoryStore.categories.filter(x => x.name.toLowerCase().startsWith(categoryFilter.value.toLowerCase())) : categoryStore.categories);
const filteredMerchants = computed(() => merchantFilter.value ? merchantStore.merchants.filter(x => x.name.toLowerCase().startsWith(merchantFilter.value.toLowerCase())) : merchantStore.merchants);

watch (selectedCategory, () => {
  selectedCategoryTab.value = "general"
  selectedCategoryTransactions.value = undefined;
  selectedCategoryRules.value = undefined;
})

watch(selectedCategoryTab, async () => {
  if (!selectedCategory.value?.pk) return;
  if (selectedCategoryTab.value === "transactions" && selectedCategoryTransactions.value === undefined) {
    selectedCategoryTransactions.value = await new TransactionSearchService()
    .withUrlParameters({
      "categoryId": selectedCategory.value?.pk
    }).getMultiple();
  } else if (selectedCategoryTab.value === "rules" && selectedCategoryRules.value === undefined) {
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