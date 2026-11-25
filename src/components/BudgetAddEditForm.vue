<template>
    <div v-if="selectedBudget">
        <div class="text-overline">Category</div>
        <div v-if="selectedBudget.isNew">
            <v-autocomplete 
                v-if="selectedBudget.isNew"
                v-model="selectedBudget.categoryId" 
                :items="categories" 
                item-title="name" 
                item-value="pk"
                variant="outlined"
                density="compact">
            </v-autocomplete>
        </div>
        <div v-else class="mb-3">
            {{ selectedBudget.categoryName }}
        </div>

        <div class="text-overline">Budget Type</div>
        <v-select 
            v-model="selectedBudget.type" 
            :items="BudgetTypeEnum.getItems()" 
            item-title="description" 
            item-value="value" 
            variant="outlined"
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
        <v-row>
            <v-col>
                <budget-detail :budget="selectedBudget"></budget-detail>
                </v-col>
                </v-row>
    
    </div>
</template>
<script lang="ts" setup>
import type BudgetModel from '@/data/classes/BudgetModel';
import BudgetTypeEnum from '@/data/enumerations/BudgetType';
import type Category from '@/data/interfaces/Category';
import { formatNumber, NumberFormats } from '@/utilities/NumberFormattingUtility';

const props = defineProps<{
  categories: Category[];
}>();
const selectedBudget = defineModel<BudgetModel>("selectedBudget", {required: true});

onMounted(() => console.log(props.categories));
</script>