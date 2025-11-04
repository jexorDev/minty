<template>
    <div v-if="selectedCategory">
        <div class="text-overline">Name</div>
        <v-text-field v-model="selectedCategory.name"></v-text-field>     
        <div class="text-overline">Type</div>
        <v-btn-toggle 
            v-model="selectedCategory.type" 
            base-color="secondary"
            color="primary"
            density="compact"
            mandatory>
            <v-btn v-for="enumItem in categoryTypeEnum.getItems()">{{ enumItem.description }}</v-btn>                          
        </v-btn-toggle>    
        <div class="text-overline">Statistics</div>
        <v-btn-toggle 
            v-model="selectedCategory.reportingType" 
            base-color="secondary"
            color="primary"
            density="compact"
            mandatory>
            <v-btn v-for="enumItem in categoryReportingTypeEnum.getItems()">{{ enumItem.description }}</v-btn>
        </v-btn-toggle>                   
    </div>
</template> 
<script lang="ts" setup>
import type Category from '@/data/interfaces/Category';
import CategoryReportingTypeEnum from '@/data/enumerations/CategoryReportingType';
import CategoryTypeEnum from '@/data/enumerations/CategoryType';

const selectedCategory = defineModel<Category>("category");

const categoryTypeEnum = new CategoryTypeEnum();
const categoryReportingTypeEnum = new CategoryReportingTypeEnum();

</script>