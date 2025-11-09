<template>
    <v-data-table 
        :items="data" 
        v-model:page="page"
        :items-per-page="10"
        density="compact">

        <template v-slot:bottom>
            <div class="text-center pt-2">
                <v-pagination
                    v-model="page"
                    :length="pageCount"
                ></v-pagination>
            </div>
        </template>
    </v-data-table>
</template> 
<script setup lang="ts">

const props = defineProps<{
    data: any[],
    headers: any[]
}>();

const pageCount = computed(() => Math.ceil(props.data.length / 10))

const page = ref(1);
</script>