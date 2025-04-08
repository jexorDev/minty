<template>
<v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="transactionDate"
            :counter="10"
            label="Date"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="description"
            label="Description"
            required
          ></v-text-field>
        </v-col>

        <v-col
          cols="12"
          md="4"
        >
          <v-text-field
            v-model="amount"
            label="Amount"
            required
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
<script setup lang="ts">

const transactionDate = ref(new Date());
const description = ref("");
const amount = ref(0.0);
const categoryId = ref<number | null>(null);
const subcategoryId = ref<number | null>(null);
const merchantId = ref<number | null>(null);
const accountId = ref<number | null>(null);
const notes = ref("");
const exclude = ref(false);
const valid = ref(true);

</script>