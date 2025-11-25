<template>
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
    </v-toolbar>
    <v-empty-state v-if="budgets.length === 0"
        headline="You haven't added any budgets"
        text="Use the Add button. Budgets will appear here">        
    </v-empty-state>
    <v-container>
        <v-card v-for="budget in budgets" class="mb-2">            
            <v-card-text>
                <v-row>
                    <v-col cols="12" md="4">
                        <div class="d-flex justify-space-between ">              
                            <span class="text-overline">{{ budget.categoryName }}</span>
                            <span class="text-overline">{{ formatNumber(budget.amount, NumberFormats.Price)}} / {{ budget.type === BudgetTypeEnum.Monthly.value ? "Month" : "Year" }}</span>
                        </div>
                        <v-progress-linear 
                            v-if="budget.currentMonthBudget" 
                            :model-value="budget.budgetPercent * 100"
                            :color="budget.budgetPercent > 1 ? 'error' : 'primary'"
                            height="22"
                            rounded="lg">
                            <v-chip variant="flat">
                                {{ formatNumber(budget.totalToDate, NumberFormats.Price) }}
                            </v-chip>
                        </v-progress-linear>
                    </v-col>
                    <v-col v-if="!$vuetify.display.mobile" md="3">
                        <v-sparkline
                            :model-value="budget.budgetMonths.map(x => x.monthTotal)"
                            color="secondary"
                            line-width="2"
                            padding="16"
                        ></v-sparkline>
                    </v-col>                       
                    <v-spacer></v-spacer>
                    <v-col cols="4" md="2">
                        <div class="text-overline">Monthly Avg</div> 
                        <div class="text-body-1">
                            {{ formatNumber(budget.monthlyAverage, NumberFormats.Price) }}
                        </div>
                    </v-col>
                    <v-col cols="4" md="2">
                        <div class="text-overline">YTD Total</div>
                        <div class="text-body-1">
                            {{ formatNumber(budget.grandTotal, NumberFormats.Price) }}
                        </div>
                    </v-col>
                    <v-col cols="4" md="1" class="d-flex justify-end">
                        <v-menu>
                            <template v-slot:activator="{ props }">
                                <v-btn
                                    color="secondary"
                                    variant="text"
                                    density="compact"
                                    v-bind="props"
                                >
                                    Options
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item title="Edit" @click="setSelected(budget)"></v-list-item>                            
                                <v-list-item title="Delete" @click="deleteBudget(budget)"></v-list-item>                            
                            </v-list>
                        </v-menu>
                    </v-col>
                </v-row>
                <v-row>
                     <v-col>
                        <v-chip class="ml-1 mb-1" label v-for="month in budget.budgetMonths" :color="month.budgetPercent > 1 ? 'error' : 'success'">
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
    </v-container>

    <v-dialog v-if="selectedBudget" v-model="showAddEditDialog" max-width="600">
        <v-card :title="selectedBudget.isNew ? 'Edit Budget' : 'Add Budget'" color="secondary-darken-1">
            <v-card-text>
                <budget-add-edit-form v-model:selected-budget="selectedBudget"></budget-add-edit-form>
            </v-card-text>
            <v-card-actions>
                 <v-btn @click="showAddEditDialog = false" color="primary" variant="tonal">Cancel</v-btn>
                <v-btn @click="saveBudget" color="primary" variant="outlined">Save</v-btn>
            </v-card-actions>
        </v-card>        
    </v-dialog>

</template>
<script lang="ts" setup>
import BudgetModel from '@/data/classes/BudgetModel';
import BudgetTypeEnum from '@/data/enumerations/BudgetType';
import BudgetService from '@/data/services/BudgetService';
import { useConfirmationStore } from '@/stores/ConfirmationStore';
import { useSnackbarStore } from '@/stores/SnackbarStore';
import { formatNumber, NumberFormats } from '@/utilities/NumberFormattingUtility';

const confirmationStore = useConfirmationStore();
const snackbarStore = useSnackbarStore();

const isLoading = ref(false);
const budgets = ref<BudgetModel[]>([]);
const showAddEditDialog = ref(false);
const selectedBudget = ref<BudgetModel>(new BudgetModel());

onMounted(async () => {
    try {
        isLoading.value = true;
        budgets.value = await new BudgetService().getMultiple().then(data => data.map(x => new BudgetModel(x)));
        budgets.value.forEach(async x => await x.setStatistics());
    } finally {
        isLoading.value = false;
    }
})

function setSelected(budget: BudgetModel) {
    selectedBudget.value = budget;
    showAddEditDialog.value = true;
}

function addNewBudget() {
    selectedBudget.value = new BudgetModel();
    showAddEditDialog.value = true;
}

function saveBudget() {    
    try {
        isLoading.value = true;
        selectedBudget.value.save()
        budgets.value = budgets.value.filter(x => x.pk !== selectedBudget.value.pk);
        budgets.value.push(selectedBudget.value);
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
            snackbarStore.setMessage("Budget successfully deleted", "success");
        } finally {
            isLoading.value = false;
        }
    });
}

</script>