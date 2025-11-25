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

        <v-row>
            <v-col>
                <div class="text-overline">
                    Total YTD
                </div>
                 {{ formatNumber(selectedBudget.grandTotal, NumberFormats.Price) }} 
            </v-col>
            <v-col>
                <div class="text-overline">
                    Monthly Average
                </div>
                {{ formatNumber(selectedBudget.monthlyAverage, NumberFormats.Price) }}

            </v-col>
        </v-row>
    
    </div>
</template>
<script lang="ts" setup>
import type BudgetModel from '@/data/classes/BudgetModel';
import BudgetTypeEnum from '@/data/enumerations/BudgetType';
import { useCategoryStore } from '@/stores/CategoryStore';
import { formatNumber, NumberFormats } from '@/utilities/NumberFormattingUtility';

const categoryStore = useCategoryStore();

const selectedBudget = defineModel<BudgetModel>("selectedBudget", {required: true});

</script>