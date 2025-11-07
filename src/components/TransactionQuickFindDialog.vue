<template>
    <v-dialog v-model="show" fullscreen>
        <v-card>
             <v-toolbar color="secondary-darken-1" density="compact">
                <v-toolbar-title>Transaction Quick Find</v-toolbar-title>
                <v-toolbar-items>
                    <v-btn icon="mdi-close" @click="show = false"></v-btn>
                </v-toolbar-items>
            </v-toolbar>
                <v-container fluid>
                    <v-row>
                        <v-col>
                            <v-text-field v-model="searchString" variant="outlined" density="compact" max-width="500" label="Quick Search" @update:model-value="searchUpdate" clearable :loading="isLoading">
                                <template v-slot:append>
                                    <v-chip label >{{ resultCount }} results</v-chip>

                                </template>
                            </v-text-field>
                        </v-col>                        
                    </v-row>
                    <v-row no-gutters>
                        <v-col>                            
                            <TransactionsList :transactions="transactions" @selected-transaction-changed="setTransactionToEdit"></TransactionsList>
                            <v-empty-state
                                v-if="searchString && !isLoading && resultCount === 0"                            
                                title="No results"
                                text="Try a different search criteria"  
                            ></v-empty-state>
                        </v-col>
                    </v-row>
                </v-container>
        </v-card>
    </v-dialog>
    <TransactionAddForm :transaction="selectedTransaction" v-model:show="showAddTransactionDialog" @refresh="searchUpdate(searchString)"></TransactionAddForm>
</template>
<script lang="ts" setup>
import type TransactionSearch from '@/data/interfaces/Transactions/TransactionSearch';
import TransactionSearchService from '@/data/services/TransactionSearchService';

const show = defineModel<boolean>("show");
let timerId: number | null = null;
const isLoading = ref(false);
const transactions = ref<TransactionSearch[]>([]);
const selectedTransaction = ref<TransactionSearch | undefined>(undefined);
const showAddTransactionDialog = ref(false);
const searchString = ref("");

function setTransactionToEdit(transaction?: TransactionSearch) {
    selectedTransaction.value = transaction;
    showAddTransactionDialog.value = true;
}

function searchUpdate(searchString: string): void {
    if (timerId) {
        isLoading.value = true;
      clearTimeout(timerId);
    }

    if (!searchString) {
        transactions.value = [];
        isLoading.value = false;
        return;
    }

    timerId = setTimeout(async () => {
      try {
        transactions.value = await new TransactionSearchService()
            .withUrlParameters({
            searchString: searchString
            }).getMultiple();        
      } finally {
        isLoading.value = false;
      }
    }, 1000);       
  }

const resultCount = computed(() => transactions.value.length);
</script>