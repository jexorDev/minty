<template>
<DialogBase model-type="Transaction" :is-new="model.isNew">
  <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="4"
          >
           <v-date-input v-model="model.transactionDate"></v-date-input>
          </v-col>
  
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="model.description"
              label="Description"
              required
            ></v-text-field>
            <v-text-field
              v-model="model.notes"
              label="Notes"
              required
            ></v-text-field>
          </v-col>
  
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="model.amount"
              label="Amount"
              required
            ></v-text-field>
            <v-checkbox v-model="model.exclude" label="Exclude"></v-checkbox>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select v-model="selectedCategory" label="Category" :items="categories" item-title="name"></v-select>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

</DialogBase>
</template>
<script setup lang="ts">
import type Category from '@/data/interfaces/Category';
import CategoryService from '@/data/services/CategoryService';
import type TransactionModel from '@/data/classes/TransactionModel';

const model = defineModel<TransactionModel>({required: true});

onMounted(async () => {
  categories.value = await new CategoryService()
    .getMultiple();
})

const transactionDate = ref(new Date());
const categories = ref<Category[]>([]);
const selectedCategory = ref<Category | null>(null);
const valid = ref(true);

</script>