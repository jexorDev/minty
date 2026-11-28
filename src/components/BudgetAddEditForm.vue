<template>
    <div v-if="selectedBudget">
        <v-row>
            <v-col cols="12" sm="4">
                <div class="text-overline">Category</div>
                <div v-if="selectedBudget.isNew">
                    <v-autocomplete v-if="selectedBudget.isNew" v-model="selectedBudget.categoryId" :items="categories"
                        item-title="name" item-value="pk" variant="outlined" density="compact">
                    </v-autocomplete>
                </div>
                <div v-else class="mb-3">
                    {{ selectedBudget.categoryName }} for {{ selectedBudget.year }}
                </div>

                <div class="text-overline">Budget Type</div>
                <v-select v-model="selectedBudget.type" :items="BudgetTypeEnum.getItems()" item-title="description"
                    item-value="value" variant="outlined" density="compact">
                </v-select>

                <div class="text-overline">Amount</div>
                <v-text-field v-model="selectedBudget.amount"
                    :label="BudgetTypeEnum.Monthly.value === selectedBudget.type ? 'Amount per month' : 'Amount per year'"
                    required variant="outlined" density="compact" prefix="$"></v-text-field>

                <div class="text-overline">Forecasting</div>
                <v-switch label="Manual Forecasting" v-model="selectedBudget.manualForecast" color="primary"
                    density="compact"></v-switch>

                <div class="text-overline" v-show="selectedBudget.manualForecast">Manual forecast amount</div>
                <v-text-field v-show="selectedBudget.manualForecast" v-model="selectedBudget.manualForecastAmount"
                    label="Total amount forecasted for remainder of year" required variant="outlined"
                    prefix="$"></v-text-field>

                <v-card variant="outlined" v-if="!selectedBudget.manualForecast">
                    <v-card-text>

                        <div class="d-flex d-inline">
                            <div class="mr-5">
                                <div class="text-overline">Forcasted / mo</div>
                                <div>
                                    {{ formatNumber(selectedBudget.forecastedPerMonth, NumberFormats.Price) }}
                                </div>

                            </div>
                            <v-divider vertical thickness="3" class="mr-5"></v-divider>
                            <div class="mr-5">
                                <div class="text-overline">Forcasted total</div>
                                <div>
                                    {{ formatNumber(selectedBudget.forecasted, NumberFormats.Price) }}
                                </div>

                            </div>
                        </div>
                    </v-card-text>
                </v-card>
                <v-btn text="Transactions" @click="routeToTransactions" color="primary" variant="tonal" block
                    class="mt-5"></v-btn>
                <v-btn text="Statistics" @click="routeToStatistics" color="primary" variant="tonal" block
                    class="mt-2"></v-btn>

            </v-col>
            <v-col sm="8" cols="12">
                <v-row>
                    <v-col cols="2">
                        <v-progress-circular v-if="selectedBudget.currentMonthBudget"
                            :model-value="selectedBudget.budgetPercent"
                            :color="selectedBudget.budgetPercent > 100 ? 'error' : 'primary'" class="mr-2" size="90"
                            width="8">

                            <div class="text-subtitle-2">
                                {{ formatNumber(selectedBudget.grandTotal, NumberFormats.Price) }}
                            </div>
                        </v-progress-circular>
                    </v-col>
                    <v-col cols="10">
                        <v-card color="secondary-darken-1" class="mr-2">
                            <v-card-text>
                                <div class="d-flex d-inline">

                                    <div class="mr-5">
                                        <div class="text-overline">Budgeted</div>
                                        <div class="text-body-1">
                                            {{ formatNumber(selectedBudget.amount, NumberFormats.Price) }} / {{
                                                selectedBudget.type === BudgetTypeEnum.Monthly.value ? "Month" : "Year" }}
                                        </div>
                                    </div>

                                    <v-divider vertical thickness="3" class="mr-5"></v-divider>
                                    <div class="mr-5">
                                        <div class="text-overline">Allocated</div>
                                        <div class="text-body-1">
                                            {{ formatNumber(selectedBudget.budgetAmount, NumberFormats.Price) }}
                                        </div>
                                    </div>
                                    <v-divider vertical thickness="3" class="mr-5"></v-divider>
                                    <div class="mr-5">
                                        <div class="text-overline">Spent YTD</div>
                                        <div class="text-body-1">
                                            {{ formatNumber(selectedBudget.grandTotal, NumberFormats.Price) }}
                                        </div>

                                    </div>
                                    <v-divider vertical thickness="3" class="mr-5"></v-divider>
                                    <div class="mr-5">
                                        <div class="text-overline">Remaining</div>
                                        <div class="text-body-1">
                                            {{ formatNumber(selectedBudget.budgetRemainingAmount, NumberFormats.Price)
                                            }}
                                        </div>
                                    </div>

                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                </v-row>
                <v-row>
                    <v-col>
                        <v-card variant="outlined">
                            <v-card-text>
                                <v-row>
                                    <v-col>
                                        <div class="text-overline">Trendline</div>
                                        <v-sparkline :model-value="selectedBudget.budgetMonths.map(x => x.monthTotal)"
                                            color="secondary" line-width="2" padding="16"></v-sparkline>
                                    </v-col>
                                    <v-col>
                                        <div class="text-overline">Spend by month</div>
                                        <v-chip class="ml-1 mb-1" label v-for="month in selectedBudget.budgetMonths"
                                            :color="month.budgetPercent > 1 ? 'error' : 'success'"
                                            @click="budgetMonthClicked(month)">
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
                    </v-col>
                </v-row>

                <v-row>
                    <v-col>
                        <v-card variant="outlined">
                            <v-row>
                                <v-col>
                                    <apexchart :options="spendingChartOptions" :series="spendingChartSeries">
                                    </apexchart>

                                </v-col>
                                <v-col>
                                    <v-table>
                                        <thead>
                                            <tr>
                                                <th>

                                                </th>
                                                <th>
                                                    Total Spent
                                                </th>
                                                <th>
                                                    Monthly Avg
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in spendingChartLabels" :key="index">
                                                <td>{{ item }}</td>
                                                <td>{{ formatNumber(spendingChartData[index], NumberFormats.Price) }}
                                                </td>
                                                <td>{{ formatNumber(spendingChartLineData[index], NumberFormats.Price)
                                                    }}</td>
                                            </tr>

                                        </tbody>
                                    </v-table>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>

                </v-row>
            </v-col>
        </v-row>

    </div>
</template>
<script lang="ts" setup>
import { useBarChart } from '@/composables/baseCharts/BarChartComposable';
import BudgetModel from '@/data/classes/BudgetModel';
import type BudgetMonthModel from '@/data/classes/BudgetMonthModel';
import BudgetTypeEnum from '@/data/enumerations/BudgetType';
import type Category from '@/data/interfaces/Category';
import router from '@/router';
import { createDate, DateFormats } from '@/utilities/DateFormattingUtility';
import { formatNumber, NumberFormats } from '@/utilities/NumberFormattingUtility';

const props = defineProps<{
    categories: Category[];
}>();
const selectedBudget = defineModel<BudgetModel>("selectedBudget", { required: true });

function budgetMonthClicked(budgetMonth: BudgetMonthModel) {
    router.push({
        path: "/transactions", query: {
            categoryId: selectedBudget.value.categoryId,
            year: selectedBudget.value.year,
            month: budgetMonth.month
        }
    });
}

function routeToTransactions() {
    router.push({
        path: "/transactions", query: {
            categoryId: selectedBudget.value.categoryId,
            fromDate: createDate(selectedBudget.value.year, 0, 1, DateFormats.ISO),
            toDate: createDate(selectedBudget.value.year, 11, 31, DateFormats.ISO),
        }
    });
}

function routeToStatistics() {
    router.push({
        path: "/statistics", query: {
            categoryId: selectedBudget.value.categoryId,
            year: selectedBudget.value.year
        }
    });
}

const spendingChartLabels = ["Last Year", "Previous 12 Months", "This Year"];
const { options: spendingChartOptions } = useBarChart(spendingChartLabels, ref(true), () => { });
const spendingChartData = computed<number[]>(() => [selectedBudget.value.grandTotalLastYear, selectedBudget.value.grandTotalRollingPastYear, selectedBudget.value.grandTotal]);
const spendingChartLineData = computed<number[]>(() => [selectedBudget.value.monthlyAverageLastYear, selectedBudget.value.monthlyAverageRollingPastYear, selectedBudget.value.monthlyAverage]);
const spendingChartSeries = computed(() => [{ name: "Spending", type: "column", data: spendingChartData.value }, { name: "Monthly Avg", type: "line", data: spendingChartLineData.value }]);
</script>