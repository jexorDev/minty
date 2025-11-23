<template>
    <div v-if="selectedBudget">
        <div class="text-overline">Category</div>
        <v-autocomplete 
            v-model="selectedBudget.categoryId" 
            :items="categoryStore.categories" 
            item-title="name" 
            item-value="pk"
            variant="outlined"
            density="compact">
        </v-autocomplete>

        <div class="text-overline">Budget Type</div>
        <v-select 
            v-model="selectedBudget.type" 
            :items="BudgetTypeEnum.getItems()" 
            item-title="description" 
            item-value="value" 
            density="compact">
        </v-select>

        <div class="text-overline">Amount</div>
        <v-text-field
            v-model="selectedBudget.amount"
            label="Amount"
            required 
            variant="outlined"             
            prefix="$"
        ></v-text-field>

        <div>
            {{ selectedBudget.grandTotal }} {{ selectedBudget.monthlyAverage }}
        </div>

    </div>
</template>
<script lang="ts" setup>
import type BudgetModel from '@/data/classes/BudgetModel';
import BudgetTypeEnum from '@/data/enumerations/BudgetType';
import { useCategoryStore } from '@/stores/CategoryStore';

const categoryStore = useCategoryStore();

const selectedBudget = defineModel<BudgetModel>("selectedBudget", {required: true});

</script>