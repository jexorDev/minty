<template>
  <v-dialog
    v-model="show"
    transition="dialog-bottom-transition"
    fullscreen
    :loading="loading"
  >
   <v-card>
      <v-toolbar color="secondary-darken-1" density="compact">
        <v-toolbar-title>Upload file</v-toolbar-title>
        <v-toolbar-items>
          <v-btn
            icon="mdi-close"                
            @click="show = false"
          ></v-btn>
        </v-toolbar-items>
      </v-toolbar>
                
    <v-card-text>                   
      <v-row>
        <v-col>
          <v-select v-model="selectedImportType" :items="importFileTypeEnum.getItems()" item-title="description" item-value="value" density="compact"></v-select>
        </v-col>
        <v-col>
          <v-file-input
            v-model="selectedFileUpload"
            label="File input"
            density="compact"
            ></v-file-input>
        </v-col>
        <v-col>
          <v-btn @click="parseFile" :loading="loading" variant="outlined" color="primary">Submit</v-btn>
        </v-col>
    </v-row>
    <v-row>
      <v-col>
        
        <v-alert v-if="parsedTransactions.length > 0" color="info" title="Take a look" variant="outlined">
          <template v-slot:append>
            <v-btn @click="uploadFile" variant="text" color="primary" :loading="loading" text="Yes, complete uploading file" prepend-icon="mdi-check"></v-btn>
          </template>
          Does the following look right?
          </v-alert>
        <v-data-table :items="parsedTransactions"></v-data-table>
      </v-col>
    </v-row>
  </v-card-text>

  <v-card-actions>
    <v-btn color="primary" variant="tonal" @click="show = false" :loading="loading">Cancel</v-btn>                
  </v-card-actions>  
  </v-card>              
</v-dialog>
</template>
<script setup lang="ts">
import GenericService from '@/data/services/GenericService';
import { useCategoryStore } from '../stores/CategoryStore';
import { useMerchantStore } from '../stores/MerchantStore';
import { useAccountStore } from '../stores/AccountStore';
import CategoryService from '@/data/services/CategoryService';
import MerchantService from '@/data/services/MerchantService';
import AccountService from '@/data/services/AccountService';
import { useSnackbarStore } from '@/stores/SnackbarStore';
import ImportFileTypeEnum from '@/data/enumerations/ImportFileType';

interface FileTransaction {
    date: Date;
    description: string;
    categoryName: string;
    subCategoryName: string;
    accountName: string;
    merchantName: string;
    amount: number;
    notes: string;
}
const parsedTransactions = ref<FileTransaction[]>([]);

const show = defineModel<boolean>();
const emit = defineEmits<{(e: "refresh"): void}>();

const categoryStore = useCategoryStore();
const merchantStore = useMerchantStore();
const accountStore = useAccountStore();
const snackbarStore = useSnackbarStore();

const loading = ref(false);
const selectedFileUpload = ref<File|null>(null);
const importFileTypeEnum = new ImportFileTypeEnum();
const selectedImportType = ref(importFileTypeEnum.BankOfAmerica.value);

async function parseFile(): Promise<void> {
  if (selectedFileUpload.value === null) {
    snackbarStore.setMessage("Select a file to upload.", "error");
    return;
  }
  
  parsedTransactions.value = [];

  const form = new FormData();
  form.append('csvFile', selectedFileUpload.value);  
  
  try {
      loading.value = true;
      parsedTransactions.value = await new GenericService(`files/${selectedImportType.value}/pre`).withHeaders([{headerName: "Content-Type", headerValue: "multipart/form-data"}]).post(form) as FileTransaction[];
  } finally {
    loading.value = false;
  }
}

  async function uploadFile(): Promise<void> {
    if (selectedFileUpload.value === null) return;
    
    const form = new FormData();
    form.append('csvFile', selectedFileUpload.value);
        
    try {
        loading.value = true;
        
        await new GenericService(`files/${selectedImportType.value}`).withHeaders([{headerName: "Content-Type", headerValue: "multipart/form-data"}]).post(form);        
        
        await Promise.all([
          categoryStore.categories = await new CategoryService().getMultiple(),
          merchantStore.merchants = await new MerchantService().getMultiple(),
          accountStore.accounts = await new AccountService().getMultiple()
        ]);
        
        snackbarStore.setMessage("File successfully uploaded.", "success");
        show.value = false;
        emit("refresh");

    } finally {
      loading.value = false;
    }
  }
</script>