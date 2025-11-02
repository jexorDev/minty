<template>
    <v-row>
        <v-col v-for="file in importedFiles" cols="12" md="4">
            <v-card 
                :title="getFileTypeName(file.fileType)"
                :subtitle="file.name">
                <template v-slot:append>
                    <v-chip>{{ file.lineCount }} Lines</v-chip>
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
                    <v-btn color="primary">View Transactions</v-btn>
                    <v-btn color="red" @click="rollbackFile(file)">Rollback</v-btn>
                </v-card-actions>
            </v-card>

        </v-col>
    </v-row>
</template>
<script lang="ts" setup>
import type ImportedFile from '@/data/interfaces/ImportedFile';
import ImportedFileService from '@/data/services/ImportedFileService';
import { useConfirmationStore } from '@/stores/ConfirmationStore';
import { useSnackbarStore } from '@/stores/SnackbarStore';

const confirmationStore = useConfirmationStore();
const snackbarStore = useSnackbarStore();

const importedFiles = ref<ImportedFile[]>([]);

onMounted(async () => {
    importedFiles.value = await new ImportedFileService().getMultiple();
})

function getFileTypeName(fileType: number): string {
    if (fileType === 0) return "Mint";
    if (fileType === 1) return "Rocket Money";
    if (fileType === 2) return "Bank of America";
    return "";
}

async function rollbackFile(file: ImportedFile) {
    confirmationStore.setConfirmation(`Are you sure you want to rollback ${file.name}?`, async () => {
        snackbarStore.setMessage("This doesn't work yet", "info");
    });
}
</script>