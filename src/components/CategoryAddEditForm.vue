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
            <v-btn v-for="enumItem in CategoryTypeEnum.getItems()">{{ enumItem.description }}</v-btn>                          
        </v-btn-toggle>    
        <v-switch
            v-model="selectedCategory.ignore" 
            label="Ignore"
            base-color="secondary"
            color="primary"
            density="compact"
            class="ml-2 mt-5">            
        </v-switch>                   
    </div>
</template> 
<script lang="ts" setup>
import type Category from '@/data/interfaces/Category';
import CategoryTypeEnum from '@/data/enumerations/CategoryType';

const selectedCategory = defineModel<Category>("category");

</script>