<template>
    <SettingsManagement 
        v-model:selected-item="selectedMerchant"
        v-model:filter-string="merchantFilter"
        :items="filteredMerchants"
        :is-loading="isSaving"
        :is-new-item="!selectedMerchant?.pk"
        :selected-item-id="selectedMerchant?.pk ?? null"
        item-title="Merchant"
        @save="saveMerchant"
        @add-new="addNewMerchant"   
        @delete="deleteMerchant"
        @view-transactions="routeToTransactions" 
        @merge="showMergeDialog = true"
        >
        <template #list-item="item">
            <v-list-item 
              :id="`settings-management-${item.pk}`"
              :title="item.name" 
              @click="selectedMerchant = item"></v-list-item>
        </template>
        <template v-slot:card-content>
            <MerchantAddEditForm v-if="selectedMerchant" v-model:merchant="selectedMerchant"></MerchantAddEditForm>
        </template>
         <template v-slot:rules-content>
          <div class="text-overline">Merchant Mappings</div>
          <div>
              <v-icon icon="mdi-information-outline"></v-icon>
              Any match on rules will map transactions to this merchant during a file import
          </div>
          <v-divider thickness="2" class="my-2" color="white"></v-divider>
          <TagsContainer v-if="selectedMerchant" v-model:selected-tags="selectedMerchant.rules" :selectable-tags="[]"></TagsContainer>

          <div class="text-overline">Merchant to Category Mapping</div>
          <div>
              <v-icon icon="mdi-information-outline"></v-icon>
              Any transactions during the import process that map to this merchant will be subsequently have the selected category (overriding all other rules/match methods)
          </div>
          <v-divider thickness="2" class="my-2" color="white"></v-divider>
          <v-autocomplete 
            v-if="selectedMerchant"
            v-model="selectedMerchant.forceCategoryId" 
            clearable 
            :items="categoryStore.categories" 
            item-title="name" 
            item-value="pk" 
            label="Category"
            variant="outlined" 
            density="compact">
          </v-autocomplete>
        </template>
    </SettingsManagement>
      <v-dialog v-model="showMergeDialog" max-width="600">
        <v-card>
            <v-card-title>Merge Merchant</v-card-title>
            <v-card-text>
                <v-row>
                <v-col>
                    Merging all transactions with merchant {{ selectedMerchant?.name }} into:
                </v-col>
                </v-row>
                <v-row>
                <v-col>
                  <v-autocomplete 
                      v-model="selectedMergeMerchantId" 
                      :items="merchantStore.merchants" 
                      item-title="name" 
                      item-value="pk"
                      variant="outlined"
                      density="compact">
                  </v-autocomplete>
                </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>          
                <v-btn @click="showMergeDialog = false" color="primary" variant="tonal">Cancel</v-btn>
                <v-btn @click="mergeMerchant()" color="primary" variant="outlined">Merge</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template> 
<script lang="ts" setup>
import type Merchant from '@/data/interfaces/Merchant';
import GenericService from '@/data/services/GenericService';
import MerchantService from '@/data/services/MerchantService';
import router from '@/router';
import { useCategoryStore } from '@/stores/CategoryStore';
import { useConfirmationStore } from '@/stores/ConfirmationStore';
import { useMerchantStore } from '@/stores/MerchantStore';
import { useSnackbarStore } from '@/stores/SnackbarStore';

const merchantStore = useMerchantStore();
const categoryStore = useCategoryStore();
const snackbarStore = useSnackbarStore();
const confirmationStore = useConfirmationStore();

const selectedMerchant = ref<Merchant | null>(null);
const showMergeDialog = ref(false);
const selectedMergeMerchantId = ref<number | null>(null);
const isSaving = ref(false);
const merchantFilter = ref("");

onMounted(async () => {
  if (router.currentRoute.value.query.merchantId) {
    selectedMerchant.value = merchantStore.merchants.find(x => x.pk == router.currentRoute.value.query.merchantId) ?? null;
  }
})

function addNewMerchant() {
  selectedMerchant.value = {
    name: "",
    forceCategoryId: null,
    rules: []
   } as Merchant;
}

async function saveMerchant() {
  if (!selectedMerchant.value) return;

  try {
    isSaving.value = true;

    if (selectedMerchant.value.pk) {
      await new MerchantService().put(selectedMerchant.value);
      const updatedMerchant = await new MerchantService().withRouteParameter(selectedMerchant.value.pk.toString()).getSingle();
      selectedMerchant.value = updatedMerchant;
      merchantStore.merchants = merchantStore.merchants.filter(x => x.pk !== updatedMerchant.pk);
      merchantStore.merchants.push({...updatedMerchant});
    } else {
      const persistedMerchant = await new MerchantService().post(selectedMerchant.value);
      merchantStore.merchants.push(persistedMerchant);
      selectedMerchant.value = merchantStore.merchants.find(x => x.pk === persistedMerchant.pk) ?? null;
    }
    snackbarStore.setMessage("Merchant successfully saved.", "success");    
  } finally {
    isSaving.value = false;
  }
}

async function deleteMerchant() {
   confirmationStore.setConfirmation("Are you sure you want to delete this merchant? Any transactions with this merchant will have it removed.", async () => {
    try {
      isSaving.value = true;
      await new MerchantService().withRouteParameter(selectedMerchant.value!.pk!.toString()).delete();
      merchantStore.merchants = await new MerchantService().getMultiple();      
      selectedMerchant.value = null;
      snackbarStore.setMessage("Merchant successfully deleted.", "success");    
    } finally {
      isSaving.value = false;
    }
  });
}

async function mergeMerchant(): Promise<void> {
  if (!selectedMergeMerchantId.value) {
    snackbarStore.setMessage("Please select a merchant.", "error");        
    return;
  }
  
  await new GenericService("transactions/merge/merchant").withUrlParameters({
      "fromMerchantId": selectedMerchant.value?.pk,
      "toMerchantId": selectedMergeMerchantId.value
    }).put(null).then(async () =>
    { 
      merchantStore.merchants = await new MerchantService().getMultiple();
      selectedMerchant.value = merchantStore.merchants.find(x => x.pk === selectedMergeMerchantId.value) ?? null;
      showMergeDialog.value = false
      snackbarStore.setMessage("Merchant successfully merged", "success");
    });  
}

function routeToTransactions(): void {
  router.push({path: "/transactions", query: {
    allDates: "true",
    merchantId: selectedMerchant.value?.pk
  }})
}

watch(selectedMerchant, async () => {
  if (selectedMerchant.value?.pk) {
    router.push({query: {"merchantId": selectedMerchant.value.pk}});
  }
})

const filteredMerchants = computed(() => merchantFilter.value
  ? merchantStore.merchants.filter(x => x.name.toLowerCase().indexOf(merchantFilter.value.toLowerCase()) >= 0) 
  : merchantStore.merchants);

</script>