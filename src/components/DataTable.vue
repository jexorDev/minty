<template>
    <v-data-table 
        :items="data" 
        v-model:page="page"
        :items-per-page="10"
        density="compact">

        <template v-slot:bottom>
            <div class="text-center d-flex justify-space-evenly pt-2">
                <v-icon icon="mdi-chevron-left" @click="moveToPreviousPage" :disabled="page === 1" class="mt-2"></v-icon>
                <v-combobox v-model="page" :items="pageOptions" density="compact" variant="solo-filled" max-width="150">
                    <template v-slot:append>
                        <div class="text-caption">of {{ pageCount }}</div>
                    </template>
                </v-combobox>
                <v-icon icon="mdi-chevron-right" @click="moveToNextPage" :disabled="page === pageCount" class="mt-2"></v-icon>
            </div>
        </template>
    </v-data-table>
</template> 
<script setup lang="ts">

const props = defineProps<{
    data: any[],
    headers: any[]
}>();

const page = ref(1);
const pageCount = computed(() => Math.ceil(props.data.length / 10))
const pageOptions = computed(() => {
    const pages: number[] = [];
    for (var pageIndex = 1; pageIndex <= pageCount.value; pageIndex++) {
        pages.push(pageIndex);
    }
    return pages;
})

function moveToPreviousPage() {
    if (page.value - 1 === 0) return;
    page.value -= 1;
}

function moveToNextPage() {
    if (page.value + 1 > pageCount.value) return;
    page.value += 1;
}
</script>