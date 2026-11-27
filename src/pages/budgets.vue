<template>
     <v-navigation-drawer
    v-model="showFilterDrawer"    
    location="right">
    <v-list>
      <v-list-item>
        <template v-slot:append>          
          <v-icon icon="mdi-close" @click="showFilterDrawer = false"></v-icon>
        </template>
      </v-list-item>
     
      <v-list-item subtitle="Year">
        <v-select :items="budgetYearsRange" v-model="selectedBudgetYear"></v-select>
      </v-list-item>   
      <v-list-item subtitle="Include Unbudgeted Categories">
        <v-switch v-model="includeUnbudgeted" color="primary"></v-switch>          
      </v-list-item>     
      
      
    </v-list>
  </v-navigation-drawer>
    <v-toolbar color="secondary-darken-1" density="compact">    
        <template v-slot:prepend>
            <v-btn
            @click="addNewBudget"
            color="primary"
            append-icon="mdi-plus"
            variant="text"
            >
            Add
            </v-btn>       
            
            
        </template>     
        <template v-slot:append>
            <v-menu>
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" append-icon="mdi-sort">Sort</v-btn>
                    </template>
                    <v-card color="secondary-darken-1">
                      <v-card-text>            
                        <v-radio-group 
                          v-model="selectedSort"
                          density="compact">
                          <v-radio v-for="item in BudgetSortEnum.getItems()" :label="item.description" :value="item.value"></v-radio>
                        </v-radio-group>
                      </v-card-text>
                    </v-card>
                </v-menu>
             <v-btn 
                text="Filter"
                @click="showFilterDrawer = !showFilterDrawer" 
                prepend-icon="mdi-filter-variant" 
                color="primary" 
                class="ml-1" 
                :variant="showFilterDrawer ? `flat` : `outlined`">
            </v-btn>
        </template>  
    </v-toolbar>
    <v-empty-state v-if="budgets.length === 0"
        headline="You haven't added any budgets"
        text="Use the Add button. Budgets will appear here">        
    </v-empty-state>
    <v-table style="height: 93vh" fixed-header fixed-footer>
        <thead>
            <tr>
                <th>Category</th>
                <th>Budgeted</th>
                <th>Spent</th>
                <th style="width: 120px;">Status</th>
                <th>Allocated</th>
                <th>Remaining</th>
                <th>Remain/mo</th>
                <th>Forecasted</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="budget in budgetsSorted" :key="budget.pk!">
                
                <td>{{ budget.categoryName }}</td>
                <td>                  
                    {{ formatNumber(budget.amount, NumberFormats.Price) }}{{ budget.type === BudgetTypeEnum.Monthly.value ? "/month" : "/year" }}                
                </td>
                <td>{{ formatNumber(budget.grandTotal, NumberFormats.Price) }}</td>
                <td >
                    <v-progress-linear
                        height="22"
                        :model-value="budget.budgetPercent"             
                        :color="budget.budgetPercent > 100 ? 'error' : (budget.budgetPercent > 90 ? 'warning' : 'success')"
                        rounded="lg">
                    </v-progress-linear>           
                </td>
                <td>{{ formatNumber(budget.budgetAmount, NumberFormats.Price) }}</td>
                <td>{{ formatNumber(budget.budgetRemainingAmount, NumberFormats.Price) }}</td>
                <td>{{ formatNumber(budget.budgetRemainingPerMonthAmount, NumberFormats.Price) }}</td>
                <td>
                      <v-tooltip location="top">
                        <template v-slot:activator="{ props: activatorProps }">
                            <v-chip :color="budget.forecasted > budget.budgetAmount ? 'error' : 'success'" v-bind="activatorProps">                        
                                {{ formatNumber(budget.forecasted, NumberFormats.Price) }}
                            </v-chip>
                        </template>
                        <div>
                            <div v-if="budget.manualForecast">Manually forecasting {{ formatNumber(budget.manualForecastAmount, NumberFormats.Price) }} spending for remainder of year</div>
                            <div v-else>Automatically forecasting {{ formatNumber(budget.automatciallyForecasted, NumberFormats.Price) }} spending for remainder of year</div>
                        </div>
                    </v-tooltip>
                  
                </td>
                <td>
                    <v-btn
                        icon="mdi-pencil"
                        @click="setSelected(budget)">
                    </v-btn>
                </td>
            </tr>
            <tr v-for="budget in nonBudgetedCategories" :key="budget.pk!">
                <td>{{ budget.categoryName }}</td>
                <td>
                    <v-chip color="error" label variant="flat">
                        Unbudgeted
                    </v-chip>                        
                </td>
                <td>
                    <v-chip :color="budget.grandTotal !== 0 ? 'error' : ''" :variant="budget.grandTotal !== 0 ? 'outlined' : 'plain'">
                        {{ formatNumber(budget.grandTotal, NumberFormats.Price) }}
                    </v-chip>
                </td>
                <td ></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                      <v-icon
                        icon="mdi-plus"
                        @click="setSelected(budget)">
                    </v-icon>
                </td>
            </tr>
           
        </tbody>
        <tfoot>
             <tr class="font-weight-bold">
                <td>Grand Total</td>
                <td></td>
                <td>{{ formatNumber(grandTotalSpent, NumberFormats.Price) }}</td>
                <td></td>
                <td>{{ formatNumber(grandTotalBudgeted, NumberFormats.Price) }}</td>
                <td>{{ formatNumber(grandTotalBudgeted - grandTotalSpent, NumberFormats.Price) }}</td>
                <td></td>
                <td>{{ formatNumber(grandTotalForecasted, NumberFormats.Price) }}</td>
                <td></td>
            </tr>
        </tfoot>
    </v-table>
        

    <v-dialog v-if="selectedBudgetForAddEdit" v-model="showAddEditDialog" fullscreen>
        <v-card>
        <v-toolbar color="secondary-darken-1" density="compact" :title="selectedBudgetForAddEdit.isNew ? 'Add Budget' : 'Edit Budget'" >
            <v-toolbar-items>
                <v-btn
                icon="mdi-close"                
                @click="showAddEditDialog = false"
                ></v-btn>
            </v-toolbar-items>
        </v-toolbar>
            <v-card-text>
                <budget-add-edit-form v-model:selected-budget="selectedBudgetForAddEdit" :categories="categories"></budget-add-edit-form>
            </v-card-text>
            <v-card-actions>
                <v-btn v-show="!selectedBudgetForAddEdit.isNew" @click="deleteBudget(selectedBudgetForAddEdit)" color="primary" variant="text">Delete</v-btn>
                <v-spacer></v-spacer>
                <v-btn @click="showAddEditDialog = false" color="primary" variant="tonal">Cancel</v-btn>
                <v-btn @click="saveBudget" color="primary" variant="outlined">Save</v-btn>
            </v-card-actions>
        </v-card>        
    </v-dialog>

</template>
<script lang="ts" setup>
import BudgetModel from '@/data/classes/BudgetModel';
import BudgetSortEnum from '@/data/enumerations/BudgetSortEnum';
import BudgetTypeEnum from '@/data/enumerations/BudgetType';
import CategoryType from '@/data/enumerations/CategoryType';
import BudgetService from '@/data/services/BudgetService';
import { useCategoryStore } from '@/stores/CategoryStore';
import { useConfirmationStore } from '@/stores/ConfirmationStore';
import { useSnackbarStore } from '@/stores/SnackbarStore';
import { useUserSettingsStore } from '@/stores/UserSettingsStore';
import { getCurrentYear, getYear } from '@/utilities/DateArithmeticUtility';
import { formatNumber, NumberFormats } from '@/utilities/NumberFormattingUtility';

const confirmationStore = useConfirmationStore();
const snackbarStore = useSnackbarStore();
const categoriesStore = useCategoryStore();
const userSettingsStore = useUserSettingsStore();

const isLoading = ref(false);
const includeUnbudgeted = ref(false);
const budgets = ref<BudgetModel[]>([]);
const nonBudgetedCategories = ref<BudgetModel[]>([]);
const showAddEditDialog = ref(false);
const selectedBudgetForAddEdit = ref<BudgetModel>(new BudgetModel());
const selectedSort = ref<number>(BudgetSortEnum.CategoryNameAtoZ.value);
const selectedBudgetYear = ref(getCurrentYear());
const showFilterDrawer = ref(false);

onMounted(async () => {
    await getData();
})

async function getData(): Promise<void> {
    try {
        includeUnbudgeted.value = false;

        isLoading.value = true;
        budgets.value = await new BudgetService().withUrlParameters({
            year: selectedBudgetYear.value
        }).getMultiple().then(data => data.map(x => new BudgetModel(x)));
        budgets.value.forEach(async x => await x.setStatistics());
       
    } finally {
        isLoading.value = false;
    }
}


function setSelected(budget: BudgetModel) {
    selectedBudgetForAddEdit.value = budget;
    showAddEditDialog.value = true;
}

function addNewBudget() {
    selectedBudgetForAddEdit.value = new BudgetModel();
    selectedBudgetForAddEdit.value.year = selectedBudgetYear.value;
    showAddEditDialog.value = true;
}

function saveBudget() {    
    try {
        isLoading.value = true;
        selectedBudgetForAddEdit.value.save()
        budgets.value = budgets.value.filter(x => x.pk !== selectedBudgetForAddEdit.value.pk);
        budgets.value.push(selectedBudgetForAddEdit.value);
        nonBudgetedCategories.value = nonBudgetedCategories.value.filter(x => x.categoryId !== selectedBudgetForAddEdit.value.categoryId);
        showAddEditDialog.value = false;
        snackbarStore.setMessage("Budget successfully saved", "success");
    } finally {
        isLoading.value = false;
    }

}

async function deleteBudget(budget: BudgetModel) : Promise<void> {

    confirmationStore.setConfirmation("Are you sure you want to delete this budget?", async () => {
        try {
            isLoading.value = true;
            await new BudgetService().withRouteParameter(budget.pk!.toString()).delete();
            budgets.value = budgets.value.filter(x => x.pk !== budget.pk);        
            nonBudgetedCategories.value.push(budget);
            showAddEditDialog.value = false;
            snackbarStore.setMessage("Budget successfully deleted", "success");
        } finally {
            isLoading.value = false;
        }
    });
}

async function getUnbudgetedCategories(): Promise<void> {
    nonBudgetedCategories.value = categoriesStore.categories.filter(x => 
        x.type === CategoryType.Expense.value && 
        x.ignore === false &&
        budgets.value.find(y => y.categoryId === x.pk) == null).map(y => {
            const budget = new BudgetModel(
                {
                    categoryId: y.pk!,
                    categoryName: y.name,
                    type: BudgetTypeEnum.Monthly.value,
                    amount: 0,
                    year: selectedBudgetYear.value,
                    manualForecast: false,
                    manualForecastAmount: 0
                }
            );
            
            return budget;
        });
    nonBudgetedCategories.value.forEach(async x => await x.setStatistics());
}

const budgetsSorted = computed(() => budgets.value.sort((a, b) => {
    switch (selectedSort.value) {
        case BudgetSortEnum.CategoryNameAtoZ.value:
            return a.categoryName.localeCompare(b.categoryName);
        case BudgetSortEnum.CategoryNameZtoA.value:
            return b.categoryName.localeCompare(a.categoryName);
        case BudgetSortEnum.AmountSpentMosttoLeast.value:
            return b.grandTotal - a.grandTotal;
        case BudgetSortEnum.AmountSpentLeasttoMost.value:
            return a.grandTotal - b.grandTotal;
        case BudgetSortEnum.AmountRemainingMosttoLeast.value:
            return b.budgetRemainingAmount - a.budgetRemainingAmount;
        case BudgetSortEnum.AmountRemainingLeasttoMost.value:
            return a.budgetRemainingAmount - b.budgetRemainingAmount;
        default:
            return 0;
    }
}));
const grandTotalBudgeted = computed(() => budgets.value.reduce((acc, budget) => acc + budget.budgetAmount, 0));
const grandTotalSpent = computed(() => 
    budgets.value.reduce((acc, budget) => acc + budget.grandTotal, 0) +
    (includeUnbudgeted.value ? nonBudgetedCategories.value.reduce((acc, budget) => acc + budget.grandTotal, 0) : 0));
const grandTotalForecasted = computed(() => budgets.value.reduce((acc, budget) => acc + budget.forecasted, 0) +
    (includeUnbudgeted.value ? nonBudgetedCategories.value.reduce((acc, budget) => acc + budget.grandTotal, 0) : 0));
const categories = computed(() => categoriesStore.categories.filter(x => 
    x.type === CategoryType.Expense.value && 
    x.ignore === false &&
    budgets.value.find(y => y.categoryId === x.pk) == null));

const budgetYearsRange = computed<number[]>(() => {
    const minYear = getYear(userSettingsStore.userSettings.minTransactionDate);
    const range = [];

    for (var i = getCurrentYear(); i > minYear; i--) {
        range.push(i);
    }

    return range;
})
  
watch(selectedBudgetYear, async () => {
    await getData();
})

watch(includeUnbudgeted, async (newValue) => {
    if (newValue) {
        await getUnbudgetedCategories();
    } else {
        nonBudgetedCategories.value = [];
    }
});
</script>