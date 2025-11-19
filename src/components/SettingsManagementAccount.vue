<template>
    <SettingsManagement 
        v-model:selected-item="selectedAccount"
        v-model:filter-string="AccountFilter"
        v-model:selected-rules="selectedAccountRules"
        :items="filteredaccounts"
        :is-loading="isSaving"
        :is-new-item="!selectedAccount?.pk"
        item-title="Account"
        @save="saveAccount"
        @delete="deleteAccount"
        @merge="showMergeDialog = true"
        @add-new="addNewAccount"   
        @view-transactions="routeToTransactions"         
        >
        <template #list-item="item">
            <v-list-item 
                 @click="selectedAccount = item"
                :title="item.name"
            >                
            </v-list-item>
        </template>
        <template v-slot:card-content>
            <AccountAddEditForm v-if="selectedAccount" v-model:account="selectedAccount"></AccountAddEditForm>
        </template>
    </SettingsManagement>
    <v-dialog v-model="showMergeDialog" max-width="600">
        <v-card>
            <v-card-title>Merge Account</v-card-title>
            <v-card-text>
                <v-row>
                <v-col>
                    Merging all transactions with Account {{ selectedAccount?.name }} into:
                </v-col>
                </v-row>
                <v-row>
                <v-col>
                    <v-autocomplete 
                        v-model="selectedMergeAccountId" 
                        :items="accountStore.accounts" 
                        item-title="name" 
                        item-value="pk"
                        variant="outlined"
                        density="compact">
                    </v-autocomplete>
                </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>          
                <v-btn @click="showMergeDialog = false" color="primary" variant="tonal">Cancel</v-btn>
                <v-btn @click="mergeAccount()" color="primary" variant="outlined">Merge</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template> 
<script lang="ts" setup>
import type Account from '@/data/interfaces/Account';
import AccountService from '@/data/services/AccountService';
import { useAccountStore } from '@/stores/AccountStore';
import { useSnackbarStore } from '@/stores/SnackbarStore';
import { useConfirmationStore } from '@/stores/ConfirmationStore';
import GenericService from '@/data/services/GenericService';
import router from "@/router";

const accountStore = useAccountStore();
const snackbarStore = useSnackbarStore();
const confirmationStore = useConfirmationStore();

const selectedAccount = ref<Account | null>(null);
const selectedAccountRules = ref<string[]>([]);
const showMergeDialog = ref(false);
const selectedMergeAccountId = ref<number | null>(null);
const isSaving = ref(false);
const AccountFilter = ref("");

onMounted(async () => {
  if (router.currentRoute.value.query.accountId) {
    selectedAccount.value = accountStore.accounts.find(x => x.pk == router.currentRoute.value.query.accountId) ?? null;
  }
})

function addNewAccount() {
  selectedAccount.value = {  } as Account;
}

async function saveAccount() {
  if (!selectedAccount.value) return;

  try {
    isSaving.value = true;

    if (selectedAccount.value.pk) {
      Promise.all([
        await new AccountService().put(selectedAccount.value)
      ]);
      accountStore.accounts = await new AccountService().getMultiple();
      
    } else {
      const persistedAccount = await new AccountService().post(selectedAccount.value);
      accountStore.accounts.push(persistedAccount);
      selectedAccount.value = accountStore.accounts.find(x => x.pk === persistedAccount.pk) ?? null;
    }
    snackbarStore.setMessage("Account successfully saved.", "success");    
  } finally {
    isSaving.value = false;
  }

}

async function deleteAccount() {
  confirmationStore.setConfirmation("Are you sure you want to delete this Account? Any transactions with this Account will have it removed.", async () => {
    try {
      isSaving.value = true;
      await new AccountService().withRouteParameter(selectedAccount.value!.pk!.toString()).delete();
      accountStore.accounts = await new AccountService().getMultiple();      
      selectedAccount.value = null;
      snackbarStore.setMessage("Account successfully deleted.", "success");    
    } finally {
      isSaving.value = false;
    }
  });
}

async function mergeAccount(): Promise<void> {
  if (!selectedMergeAccountId.value) {
    snackbarStore.setMessage("Please select a Account.", "error");        
    return;
  }
  
  await new GenericService("transactions/merge/Account").withUrlParameters({
      "fromAccountId": selectedAccount.value?.pk,
      "toAccountId": selectedMergeAccountId.value
    }).put(null).then(async () =>
    { 
      accountStore.accounts = await new AccountService().getMultiple();
      selectedAccount.value = accountStore.accounts.find(x => x.pk === selectedMergeAccountId.value) ?? null;
      showMergeDialog.value = false
      snackbarStore.setMessage("Account successfully merged", "success");
    });  
}

function routeToTransactions(): void {
  router.push({path: "/transactions", query: {
    allDates: "true",
    accountId: selectedAccount.value?.pk
  }})
}

watch(selectedAccount, async () => {
  if (selectedAccount.value?.pk) {
    //selectedAccountRules.value = await new AccountRuleService(selectedAccount.value.pk).getMultiple();
    router.push({query: {"accountId": selectedAccount.value.pk}})
  } else {
    selectedAccountRules.value = [];
  }
})

const filteredaccounts = computed(() => AccountFilter.value 
  ? accountStore.accounts.filter(x => x.name.toLowerCase().startsWith(AccountFilter.value.toLowerCase())) 
  : accountStore.accounts.sort((a, b) => a.name.localeCompare(b.name)));

</script>