 <template>
    <v-card class="mb-2">            
            <v-card-text>
                <v-row>
                
                    <v-col cols="12" md="2">
                        <div class="text-overline">{{ budget.categoryName }}</div>
                        <v-progress-circular 
                            v-if="budget.currentMonthBudget" 
                            :model-value="budget.budgetPercent"
                            :color="budget.budgetPercent > 100 ? 'error' : 'primary'"
                            size="106"
                            width="10">
                            <div class="text-subtitle-2">
                                {{ formatNumber(budget.grandTotal, NumberFormats.Price) }}
                            </div>
                        </v-progress-circular>
                    </v-col>
                    <v-col cols="12" md="10">
                        <v-row>                              
                            <v-col>
                                <div class="text-overline">Current Year</div>
                                <div class="d-flex d-inline">
                                    <div class="mr-5">
                                        <div class="text-overline">Budgeted</div>
                                        <div class="text-body-1">
                                            {{ formatNumber(budget.amount, NumberFormats.Price)}} / {{ budget.type === BudgetTypeEnum.Monthly.value ? "Month" : "Year" }}
                                        </div>
                                    </div>
                                    <v-divider vertical thickness="3" class="mr-5"></v-divider>
                                    <div class="mr-5">
                                        <div class="text-overline">Spent</div>
                                        <div class="text-body-1">
                                            {{ formatNumber(budget.grandTotal, NumberFormats.Price)}}
                                        </div>
                                    </div>
                                    <v-divider vertical thickness="3" class="mr-5"></v-divider>
                                    <div class="mr-5">
                                        <div class="text-overline">Allocated</div>
                                        <div class="text-body-1">
                                            {{ formatNumber(budget.budgetAmount, NumberFormats.Price)}}
                                        </div>
                                    </div>
                                    <v-divider vertical thickness="3" class="mr-5"></v-divider>
                                    <div class="mr-5">
                                        <div class="text-overline">Remaining</div>
                                        <div class="text-body-1">
                                            {{ formatNumber(budget.budgetRemainingAmount, NumberFormats.Price) }}
                                        </div>
                                    </div>
                                    <v-divider vertical thickness="3" class="mr-5"></v-divider>
                                    <div class="mr-5">
                                        <div class="text-overline">Monthly Avg</div> 
                                        <div class="text-body-1">
                                            {{ formatNumber(budget.monthlyAverage, NumberFormats.Price) }}
                                        </div>
                                    </div>
                                    
                                    
                                </div>                                
                            </v-col>
                            <v-col v-if="!$vuetify.display.mobile" md="3">
                                <div class="text-overline">Trendline</div>
                                <v-sparkline
                                    :model-value="budget.budgetMonths.map(x => x.monthTotal)"
                                    color="secondary"
                                    line-width="2"
                                    padding="16"
                                ></v-sparkline>
                            </v-col>                     
                          
                        </v-row>
                        <v-row class="d-flex d-inline">
                            <v-col>
                                <div class="text-overline">Previous rolling 12 months</div>
                                <div class="d-flex d-inline">
                                <div class="mr-5">
                                            <div class="text-overline">Spent</div> 
                                            <div class="text-body-1">
                                                {{ formatNumber(budget.grandTotalRollingPastYear, NumberFormats.Price) }}
                                            </div>
                                        </div>
                                        <v-divider vertical thickness="3" class="mr-5"></v-divider>
                                    <div class="mr-5">
                                            <div class="text-overline">Monthly Avg</div> 
                                            <div class="text-body-1">
                                                {{ formatNumber(budget.monthlyAverageRollingPastYear, NumberFormats.Price) }}
                                            </div>
                                        </div>
                                        <v-divider vertical thickness="3" class="mr-5"></v-divider>
                                        <div class="mr-5">
                                            <div class="text-overline">Forecasted total</div> 
                                            <div class="text-body-1">
                                                {{ formatNumber(budget.forecasted, NumberFormats.Price) }}
                                            </div>
                                        </div>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <v-chip class="ml-1 mb-1" label v-for="month in budget.budgetMonths" :color="month.budgetPercent > 1 ? 'error' : 'success'" @click="budgetMonthClicked(month)" >
                                    <div>
                                        {{ month.monthName.substring(0, 3) }}
                                    </div>
                                    <div class="font-weight-medium ml-1">
                                        {{ formatNumber(month.monthTotal, NumberFormats.Price) }}
                                    </div>
                                </v-chip>                                
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>   
            </v-card-text>            
        </v-card>
        </template>
<script lang="ts" setup>
import type BudgetModel from '@/data/classes/BudgetModel';
import type BudgetMonthModel from '@/data/classes/BudgetMonthModel';
import BudgetTypeEnum from '@/data/enumerations/BudgetType';
import router from '@/router';
import { formatNumber, NumberFormats } from '@/utilities/NumberFormattingUtility';

const props = defineProps<{
    budget: BudgetModel;
}>();

function budgetMonthClicked(budgetMonth: BudgetMonthModel) {
    router.push({path: "/transactions", query: {
        categoryId: props.budget.categoryId,
        month: budgetMonth.month
    }});
}
</script>