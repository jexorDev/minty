<template>
      <v-card color="secondary-darken-1"
        title="Cash Flow"
        :subtitle="subTitle">
          
          <v-card-text>
            <div class="d-flex justify-space-between ">              
              <span class="text-overline">Income</span>
              <span class="text-overline">Expenses</span>
            </div>
            <v-progress-linear
              color="primary"
              height="22"
              :model-value="cashFlowPercent"
              buffer-color="error"
              buffer-opacity="1"
              :buffer-value="100"
              rounded="lg"
            >
              <span>{{ formatNumber(cashFlow, NumberFormats.Price) }} Net Income</span>
            </v-progress-linear>
            <div class="d-flex justify-space-between pt-1">
              <span class="font-weight-medium">
                {{ formatNumber(props.totalIncome, NumberFormats.Price) }}
              </span>
              <span class="font-weight-medium"> {{ formatNumber(props.totalExpenses, NumberFormats.Price) }} </span>
            </div>
          </v-card-text>
        </v-card>
</template> 
<script lang="ts" setup>
import { formatNumber, NumberFormats } from '@/utilities/NumberFormattingUtility';

const props = defineProps<{
    totalIncome: number,
    totalExpenses: number,
    subTitle?: string
}>();

const cashFlow = computed(() => props.totalIncome - props.totalExpenses);
const cashFlowPercent = computed(() => {
  if (cashFlow.value < 0) {
    return ((props.totalIncome / props.totalExpenses) * 100);
  } else if (cashFlow.value > 0) {
    return 100 - ((props.totalExpenses / props.totalIncome) * 100);
  }
  return 0;
});

</script>