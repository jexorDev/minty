<template>
    <v-row>
        <v-col v-for="file in importedFiles" cols="12" md="4">
            <v-card 
                :title="importedFileTypeEnum.getItemByValue(file.fileType)?.description"
                :subtitle="file.name">
                <template v-slot:append>
                    <v-chip v-if="file.status === 1" label color="error" variant="elevated" class="text-overline mr-1">Deleted</v-chip>
                    <v-chip class="text-overline">{{ file.lineCount }} Lines</v-chip>
                </template>
                <v-card-text>
                    <v-row>
                        <v-col>
                            <div class="text-overline">Imported</div>
                            <div>{{ file.importDate }}</div>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <div class="text-overline">Min trans date</div>
                            <div>{{ file.minTransactionDate }}</div>
                        </v-col>
                        <v-col>
                            <div class="text-overline">Max trans date</div>
                            <div>{{ file.maxTransactionDate }}</div>
                        </v-col>
                    </v-row>                    
                </v-card-text>
                <v-card-actions>
                    <v-btn color="secondary" :disabled="file.status === 1">View Transactions</v-btn>
                    <v-btn color="error" @click="rollbackFile(file)" v-if="file.status === 0">Delete</v-btn>                    
                    <v-btn color="success" @click="restoreFile(file)" v-if="file.status === 1">Restore</v-btn>                    
                </v-card-actions>
            </v-card>

        </v-col>
    </v-row>
</template>
<script lang="ts" setup>
import type ImportedFile from '@/data/interfaces/ImportedFile';
import ImportedFileService from '@/data/services/ImportedFileService';
import ImportFileTypeEnum from '@/data/enumerations/ImportFileType';
import { useConfirmationStore } from '@/stores/ConfirmationStore';
import { useSnackbarStore } from '@/stores/SnackbarStore';

const confirmationStore = useConfirmationStore();
const snackbarStore = useSnackbarStore();
const importedFileTypeEnum = new ImportFileTypeEnum();
const importedFiles = ref<ImportedFile[]>([]);

onMounted(async () => {    
    importedFiles.value = await new ImportedFileService().getMultiple();    
})

async function rollbackFile(file: ImportedFile) {
    confirmationStore.setConfirmation(`Are you sure you want to delete ${file.name}?`, async () => {
        file.status = 1;
        await new ImportedFileService().put(file);
        snackbarStore.setMessage("File successfully deleted.", "success");
    });
}

async function restoreFile(file: ImportedFile) {
    confirmationStore.setConfirmation(`Are you sure you want to restore ${file.name}?`, async () => {
        file.status = 0;
        await new ImportedFileService().put(file);
        snackbarStore.setMessage("File successfully restored.", "success");
    });
}
</script>