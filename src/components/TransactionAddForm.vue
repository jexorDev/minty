<template>
<DialogBase model-type="Transaction" :is-new="model.isNew">
  <v-form v-model="valid">
      <v-container>
        <v-row>
          <v-col
            cols="12"
            md="3"
          >
           <v-date-input v-model="model.transactionDate"></v-date-input>
          </v-col>
  
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="model.description"
              label="Description"
              required
            ></v-text-field>
           
          </v-col>
  
          <v-col
            cols="12"
            md="3"
          >
            <v-text-field
              v-model="model.amount"
              label="Amount"
              required
            ></v-text-field>
            
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select v-model="model.categoryId" label="Category" :items="categories" item-title="name" item-value="pk"></v-select>
          </v-col>
          <v-col>
            <v-select label="Subcategory"></v-select>
          </v-col>
          <v-col>
            <v-select label="Merchant"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select label="Account"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field
              v-model="model.notes"
              label="Notes"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-checkbox v-model="model.exclude" label="Exclude"></v-checkbox>
          </v-col>
        </v-row>
        <h1>Splits</h1>
        <!-- <v-row v-for="split in splits.currentModels">
          <v-col>
            <v-select label="Category" v-model="split.model.categoryId" :items="categories" item-title="name" item-value="pk"></v-select>
          </v-col>
          <v-col>
            <v-text-field v-model="split.amount"></v-text-field>
          </v-col>
        </v-row> -->
      </v-container>
    </v-form>

</DialogBase>
</template>
<script setup lang="ts">
import type Category from '@/data/interfaces/Category';
import CategoryService from '@/data/services/CategoryService';
import type TransactionModel from '@/data/classes/TransactionModel';
import type TransactionSplitModel from '@/data/classes/TransactionSplitModel';
import type ModelList from '@/data/classes/ModelList';

const model = defineModel<TransactionModel>({required: true});
//const splits = defineModel<ModelList<TransactionSplitModel>>("splits", {required: true});


onMounted(async () => {
  categories.value = await new CategoryService()
    .getMultiple();
})

const categories = ref<Category[]>([]);
const valid = ref(true);

</script>