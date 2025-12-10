<template>
    <v-card color="secondary-darken-1">
        <v-card-text>
            <div class="text-caption">
                Spending this month vs last month
            </div>
            <div v-if="thisMonthVsLastMonthSpendingDifference < 0" class="text-error text-h6">      
                <v-icon icon="mdi-menu-up"></v-icon>          
                {{ Math.abs(thisMonthVsLastMonthSpendingDifference) }} more
            </div>
            <div v-else class="text-success text-h6">
                <v-icon color="success" size="x-large" icon="mdi-menu-down"></v-icon>          
                {{ formatNumber(Math.abs(thisMonthVsLastMonthSpendingDifference)) }} less
            </div>

            <div class="text-caption">
                Spending this month current vs last year
            </div>
            <div v-if="thisMonthVsThisMonthLastYearSpendingDifference < 0" class="text-error text-h6">      
                <v-icon icon="mdi-menu-up"></v-icon>          
                {{ Math.abs(thisMonthVsThisMonthLastYearSpendingDifference) }} more
            </div>
            <div v-else class="text-success text-h6">
                <v-icon color="success" size="x-large" icon="mdi-menu-down"></v-icon>          
                {{ formatNumber(Math.abs(thisMonthVsThisMonthLastYearSpendingDifference)) }} less                
            </div>
        </v-card-text>
    </v-card>
</template>
<script lang="ts" setup>
import CategoryTypeEnum from '@/data/enumerations/CategoryType';
import type CategoryMonthTotal from '@/data/interfaces/Statistics/CategoryMonthTotal';
import { useUserSettingsStore } from '@/stores/UserSettingsStore';
import { aggregateCategoryMonthTotals } from '@/utilities/CategoryMonthAggregator';
import { adjustDate, getCurrentYear, getMonth, getYear } from '@/utilities/DateArithmeticUtility';
import { formatNumber } from '@/utilities/NumberFormattingUtility';

const userSettings = useUserSettingsStore();

const props = defineProps<{ categoryMonthTotals: CategoryMonthTotal[]}>();

const maxMonth = computed(() => getMonth(userSettings.userSettings.maxTransactionDate));

const previousMonth = computed(() => getMonth(adjustDate(userSettings.userSettings.maxTransactionDate, -1, "month")));
const previousMonthYear = computed(() => getYear(adjustDate(userSettings.userSettings.maxTransactionDate, -1, "month")));

//const currentMonthCurrentYear = computed(() => props.categoryMonthTotals.find(x => x.year === getCurrentYear() && x.month === maxMonth.value));
//const currentMonthPreviousYear = computed(() => props.categoryMonthTotals.find(x => x.year === previousYear.value && x.month === previousMonth.value));

const currentMonthSpending = computed(() => aggregateCategoryMonthTotals(props.categoryMonthTotals, maxMonth.value, getCurrentYear(), undefined, CategoryTypeEnum.Expense.value));
const previousMonthSpending = computed(() => aggregateCategoryMonthTotals(props.categoryMonthTotals, previousMonth.value, previousMonthYear.value, undefined, CategoryTypeEnum.Expense.value));
const currentMonthLastYearSpending = computed(() => aggregateCategoryMonthTotals(props.categoryMonthTotals, maxMonth.value, getCurrentYear() - 1, undefined, CategoryTypeEnum.Expense.value));

const thisMonthVsLastMonthSpendingDifference = computed(() => previousMonthSpending.value - currentMonthSpending.value);
const thisMonthVsThisMonthLastYearSpendingDifference = computed(() => currentMonthLastYearSpending.value - currentMonthSpending.value);
</script>