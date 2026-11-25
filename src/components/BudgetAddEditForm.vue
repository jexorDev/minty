<template>
    <div v-if="selectedBudget">
        <v-row>
            <v-col cols="4">
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
                
                <div class="d-flex d-inline">
                    <div class="mr-5">
                        <div class="text-overline">Forcasted / mo</div>
                        <div>
                            {{ formatNumber(selectedBudget.forecastedPerMonth, NumberFormats.Price) }}
                        </div>

                    </div>
                    <div class="mr-5">
                        <div class="text-overline">Forcasted total</div>
                        <div>
                            {{ formatNumber(selectedBudget.forecasted, NumberFormats.Price) }}
                        </div>

                    </div>
                </div>
            </v-col>
            <v-col cols="8">
                <v-card color="secondary-darken-1">
                    <v-card-text>
                        <div class="d-flex d-inline">
                            <div class="mr-5">
                                <v-card class="pa-2">
                                    <v-progress-circular 
                                            v-if="selectedBudget.currentMonthBudget" 
                                            :model-value="selectedBudget.budgetPercent"
                                            :color="selectedBudget.budgetPercent > 100 ? 'error' : 'primary'"
                                            size="106"
                                            width="10">
                                            <div class="text-subtitle-2">
                                                {{ formatNumber(selectedBudget.grandTotal, NumberFormats.Price) }}
                                            </div>
                                        </v-progress-circular>

                                </v-card>

                            </div>
                            <div class="mr-5">
                                <div class="text-overline">Budgeted</div>
                                <div class="text-body-1">
                                    {{ formatNumber(selectedBudget.amount, NumberFormats.Price)}} / {{ selectedBudget.type === BudgetTypeEnum.Monthly.value ? "Month" : "Year" }}
                                </div>
                            </div>
                            
                            <v-divider vertical thickness="3" class="mr-5"></v-divider>
                            <div class="mr-5">
                                <div class="text-overline">Allocated</div>
                                <div class="text-body-1">
                                    {{ formatNumber(selectedBudget.budgetAmount, NumberFormats.Price)}}
                                </div>
                            </div>
                            <v-divider vertical thickness="3" class="mr-5"></v-divider>
                            <div class="mr-5">
                                <div class="text-overline">Spent YTD</div>
                                <div class="text-body-1">
                                    {{ formatNumber(selectedBudget.grandTotal, NumberFormats.Price)}}
                                </div>
                               
                            </div>
                                <v-divider vertical thickness="3" class="mr-5"></v-divider>
                            <div class="mr-5">
                                <div class="text-overline">Remaining</div>
                                <div class="text-body-1">
                                    {{ formatNumber(selectedBudget.budgetRemainingAmount, NumberFormats.Price) }}
                                </div>
                            </div>
                            
                        </div>      
                        <v-card class="mt-2">
                            <v-card-text>
                                <v-row>
                                    <v-col>
                                        <div class="text-overline">Trendline</div>
                                        <v-sparkline
                                            :model-value="selectedBudget.budgetMonths.map(x => x.monthTotal)"
                                            color="secondary"
                                            line-width="2"
                                            padding="16"
                                        ></v-sparkline>
                                    </v-col>
                                    <v-col>
                                        <div class="text-overline">Spend by month</div>
                                        <v-chip class="ml-1 mb-1" label v-for="month in selectedBudget.budgetMonths" :color="month.budgetPercent > 1 ? 'error' : 'success'"  @click="budgetMonthClicked(month)">
                                            <div>
                                                {{ month.monthName.substring(0, 3) }}
                                            </div>
                                            <div class="font-weight-medium ml-1">
                                                {{ formatNumber(month.monthTotal, NumberFormats.Price) }}
                                            </div>
                                        </v-chip>                        
                                    </v-col>
                                </v-row>
                            
                            </v-card-text>
                        </v-card>   
                    </v-card-text>
                </v-card>
            </v-col>    
        </v-row>       

        <v-card color="secondary-darken-1">
            <v-card-text>
            <v-row>                              
            <v-col>
                <div class="text-overline">Current Year</div>
                <div class="d-flex d-inline">
                    
                    <div class="mr-5">
                        <div class="text-overline">Spent</div>
                        <div class="text-body-1">
                            {{ formatNumber(selectedBudget.grandTotal, NumberFormats.Price)}}
                        </div>
                    </div>
                    
                    <v-divider vertical thickness="3" class="mr-5"></v-divider>
                    
                    <div class="mr-5">
                        <div class="text-overline">Monthly Avg</div> 
                        <div class="text-body-1">
                            {{ formatNumber(selectedBudget.monthlyAverage, NumberFormats.Price) }}
                        </div>
                    </div>
                    
                    
                </div>                                
            </v-col>
        
            

            <v-col>
                <div class="text-overline">Previous rolling 12 months</div>
                <div class="d-flex d-inline">
                <div class="mr-5">
                            <div class="text-overline">Spent</div> 
                            <div class="text-body-1">
                                {{ formatNumber(selectedBudget.grandTotalRollingPastYear, NumberFormats.Price) }}
                            </div>
                        </div>
                        <v-divider vertical thickness="3" class="mr-5"></v-divider>
                    <div class="mr-5">
                            <div class="text-overline">Monthly Avg</div> 
                            <div class="text-body-1">
                                {{ formatNumber(selectedBudget.monthlyAverageRollingPastYear, NumberFormats.Price) }}
                            </div>
                        </div>
                       
                </div>
            </v-col>
              <v-col>
                <div class="text-overline">Last year</div>
                <div class="d-flex d-inline">
                <div class="mr-5">
                            <div class="text-overline">Spent</div> 
                            <div class="text-body-1">
                                {{ formatNumber(selectedBudget.grandTotalLastYear, NumberFormats.Price) }}
                            </div>
                        </div>
                        <v-divider vertical thickness="3" class="mr-5"></v-divider>
                    <div class="mr-5">
                            <div class="text-overline">Monthly Avg</div> 
                            <div class="text-body-1">
                                {{ formatNumber(selectedBudget.monthlyAverageLastYear, NumberFormats.Price) }}
                            </div>
                        </div>
                       
                </div>
            </v-col>
        </v-row>
            </v-card-text>
        </v-card>
      

    </div>
</template>
<script lang="ts" setup>
import type BudgetModel from '@/data/classes/BudgetModel';
import type BudgetMonthModel from '@/data/classes/BudgetMonthModel';
import BudgetTypeEnum from '@/data/enumerations/BudgetType';
import type Category from '@/data/interfaces/Category';
import router from '@/router';
import { formatNumber, NumberFormats } from '@/utilities/NumberFormattingUtility';

const props = defineProps<{
  categories: Category[];
}>();
const selectedBudget = defineModel<BudgetModel>("selectedBudget", {required: true});

function budgetMonthClicked(budgetMonth: BudgetMonthModel) {
    router.push({path: "/transactions", query: {
        categoryId: selectedBudget.value.categoryId,
        month: budgetMonth.month
    }});
}
</script>