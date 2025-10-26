<template>
    <v-data-table :items="importedFiles"></v-data-table>
</template>
<script lang="ts" setup>
import type ImportedFile from '@/data/interfaces/ImportedFile';
import ImportedFileService from '@/data/services/ImportedFileService';

const importedFiles = ref<ImportedFile[]>([]);

onMounted(async () => {
    importedFiles.value = await new ImportedFileService().getMultiple();
})
</script>