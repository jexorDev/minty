<template>
    <SettingsManagement 
        v-model:selected-item="selectedCategory"
        v-model:filter-string="categoryFilter"        
        :items="filteredCategories"
        :is-loading="isSaving"
        :is-new-item="!selectedCategory?.pk"
        item-title="Category"
        @save="saveCategory"
        @delete="deleteCategory"
        @merge="showMergeDialog = true"
        @add-new="addNewCategory"   
        @view-transactions="routeToTransactions"         
        >
        <template #list-item="item">
            <v-list-item 
                 @click="selectedCategory = item"
                :class="item.ignore ? 'text-disabled' : ''"
                :title="item.name"
                :subtitle="CategoryTypeEnum.getItemByValue(item.type)?.description">                
            </v-list-item>
        </template>
        <template v-slot:card-content>
            <CategoryAddEditForm v-if="selectedCategory" v-model:category="selectedCategory"></CategoryAddEditForm>
        </template>
        <template v-slot:rules-content>
          <div>
              <v-icon icon="mdi-information-outline"></v-icon>
              Any match on rules will map transactions to this category during a file import
          </div>
          <v-divider thickness="2" class="my-2" color="white"></v-divider>
          <TagsContainer v-if="selectedCategory" v-model:selected-tags="selectedCategory.rules" :selectable-tags="[]"></TagsContainer>
        </template>
    </SettingsManagement>
    <v-dialog v-model="showMergeDialog" max-width="600">
        <v-card>
            <v-card-title>Merge Category</v-card-title>
            <v-card-text>
                <v-row>
                <v-col>
                    Merging all transactions with category {{ selectedCategory?.name }} into:
                </v-col>
                </v-row>
                <v-row>
                <v-col>
                    <v-autocomplete 
                        v-model="selectedMergeCategoryId" 
                        :items="categoryStore.categories" 
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
                <v-btn @click="mergeCategory()" color="primary" variant="outlined">Merge</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template> 
<script lang="ts" setup>
import type Category from '@/data/interfaces/Category';
import CategoryService from '@/data/services/CategoryService';
import { useCategoryStore } from '@/stores/CategoryStore';
import { useSnackbarStore } from '@/stores/SnackbarStore';
import CategoryTypeEnum from '@/data/enumerations/CategoryType';
import { useConfirmationStore } from '@/stores/ConfirmationStore';
import GenericService from '@/data/services/GenericService';
import router from "@/router";

const categoryStore = useCategoryStore();
const snackbarStore = useSnackbarStore();
const confirmationStore = useConfirmationStore();

const selectedCategory = ref<Category | null>(null);
const showMergeDialog = ref(false);
const selectedMergeCategoryId = ref<number | null>(null);
const isSaving = ref(false);
const categoryFilter = ref("");

onMounted(async () => {
  if (router.currentRoute.value.query.categoryId) {
    selectedCategory.value = categoryStore.categories.find(x => x.pk == router.currentRoute.value.query.categoryId) ?? null;
  }
})

function addNewCategory() {
  selectedCategory.value = {
    type: 0, 
    ignore: false,
    name: "",
    rules: []
  } as Category;
}

async function saveCategory() {
  if (!selectedCategory.value) return;

  try {
    isSaving.value = true;

    if (selectedCategory.value.pk) {
      await new CategoryService().put(selectedCategory.value);
      const updatedCategory = await new CategoryService().withRouteParameter(selectedCategory.value.pk.toString()).getSingle();
      selectedCategory.value = updatedCategory;
      categoryStore.categories = categoryStore.categories.filter(x => x.pk !== updatedCategory.pk);
      categoryStore.categories.push({...updatedCategory});      
    } else {
      const persistedCategory = await new CategoryService().post(selectedCategory.value);
      categoryStore.categories.push(persistedCategory);
      selectedCategory.value = categoryStore.categories.find(x => x.pk === persistedCategory.pk) ?? null;
    }
    snackbarStore.setMessage("Category successfully saved.", "success");    
  } finally {
    isSaving.value = false;
  }

}

async function deleteCategory() {
  confirmationStore.setConfirmation("Are you sure you want to delete this category? Any transactions with this category will have it removed.", async () => {
    try {
      isSaving.value = true;
      await new CategoryService().withRouteParameter(selectedCategory.value!.pk!.toString()).delete();
      categoryStore.categories = await new CategoryService().getMultiple();      
      selectedCategory.value = null;
      snackbarStore.setMessage("Category successfully deleted.", "success");    
    } finally {
      isSaving.value = false;
    }
  });
}

async function mergeCategory(): Promise<void> {
  if (!selectedMergeCategoryId.value) {
    snackbarStore.setMessage("Please select a category.", "error");        
    return;
  }
  
  await new GenericService("transactions/merge/category").withUrlParameters({
      "fromCategoryId": selectedCategory.value?.pk,
      "toCategoryId": selectedMergeCategoryId.value
    }).put(null).then(async () =>
    { 
      categoryStore.categories = await new CategoryService().getMultiple();
      selectedCategory.value = categoryStore.categories.find(x => x.pk === selectedMergeCategoryId.value) ?? null;
      showMergeDialog.value = false
      snackbarStore.setMessage("Category successfully merged", "success");
    });  
}

function routeToTransactions(): void {
  router.push({path: "/transactions", query: {
    allDates: "true",
    categoryId: selectedCategory.value?.pk
  }})
}

watch(selectedCategory, async () => {
  if (selectedCategory.value?.pk) {
    router.push({query: {"categoryId": selectedCategory.value.pk}})
  } 
})

const filteredCategories = computed(() => categoryFilter.value 
  ? categoryStore.categories.filter(x => x.name.toLowerCase().indexOf(categoryFilter.value.toLowerCase()) >= 0) 
  : categoryStore.categories.sort((a, b) => a.name.localeCompare(b.name)));

</script>