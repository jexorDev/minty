<template>
       <div :class="mobile ? '' : 'd-flex flex-row'">
   <v-tabs
        v-model="tab"
        color="primary"
        :direction="mobile ? 'horizontal': 'vertical'"
      >
        <v-tab prepend-icon="mdi-sitemap-outline" text="Categories" value="option-1"></v-tab>
        <v-tab prepend-icon="mdi-point-of-sale" text="Merchants" value="option-2"></v-tab>
        <v-tab prepend-icon="mdi-bank" text="Accounts" value="option-3"></v-tab>
      </v-tabs>

      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="option-1">        
          <v-row>
            <v-col>
              <v-list>
                <v-list-item v-for="categoory in categories" @click="selectedCategory = categoory">
                  {{ categoory.name }}
                </v-list-item>
              </v-list>
                  
              
            </v-col>
            <v-col>
                

              <v-card >
                <v-card-text>
                  <v-text-field v-model="selectedCategory?.name">                    
                  </v-text-field>
                  
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          
        </v-tabs-window-item>

        <v-tabs-window-item value="option-2">
          <v-card flat>
            <v-card-text>
              <p>
                Morbi nec metus. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Sed mollis, eros et ultrices tempus, mauris ipsum aliquam libero, non adipiscing dolor urna a orci. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Nunc sed turpis.
              </p>

              <p>
                Suspendisse feugiat. Suspendisse faucibus, nunc et pellentesque egestas, lacus ante convallis tellus, vitae iaculis lacus elit id tortor. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In hac habitasse platea dictumst. Fusce ac felis sit amet ligula pharetra condimentum.
              </p>

              <p>
                Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Nam commodo suscipit quam. In consectetuer turpis ut velit. Sed cursus turpis vitae tortor. Aliquam eu nunc.
              </p>

              <p>
                Etiam ut purus mattis mauris sodales aliquam. Ut varius tincidunt libero. Aenean viverra rhoncus pede. Duis leo. Fusce fermentum odio nec arcu.
              </p>

              <p class="mb-0">
                Donec venenatis vulputate lorem. Aenean viverra rhoncus pede. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. Fusce commodo aliquam arcu. Suspendisse enim turpis, dictum sed, iaculis a, condimentum nec, nisi.
              </p>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>

        <v-tabs-window-item value="option-3">
          <v-card flat>
            <v-card-text>
              <p>
                Fusce a quam. Phasellus nec sem in justo pellentesque facilisis. Nam eget dui. Proin viverra, ligula sit amet ultrices semper, ligula arcu tristique sapien, a accumsan nisi mauris ac eros. In dui magna, posuere eget, vestibulum et, tempor auctor, justo.
              </p>

              <p class="mb-0">
                Cras sagittis. Phasellus nec sem in justo pellentesque facilisis. Proin sapien ipsum, porta a, auctor quis, euismod ut, mi. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nam at tortor in tellus interdum sagittis.
              </p>
            </v-card-text>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </div>
</template>
<script setup lang="ts">
import type Category from '@/data/interfaces/Category';
import CategoryService from '@/data/services/CategoryService';
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()

const categories = ref<Category[]>([]);
const selectedCategory = ref<Category | null>(null);

onMounted(async () => {
  categories.value = await new CategoryService().getMultiple();
})

const tab = ref("option-1")
</script>