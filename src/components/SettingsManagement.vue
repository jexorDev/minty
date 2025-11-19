<template v-bind="selectedItem">
    <v-container fluid>
        <v-row>
            <v-col 
                cols="12" 
                md="4"
                v-if="!$vuetify.display.mobile || selectedItem === null">
                <v-list :class="$vuetify.display.mobile ? '' : 'main-list-scroll'">
                    <v-list-item>
                        <v-text-field v-model="filterString" density="compact" label="Filter" clearable class="mt-4 mr-2"></v-text-field>                      
                        <template v-slot:append>
                            <v-btn @click="emit('addNew')" color="primary">Add New</v-btn>
                        </template>
                    </v-list-item>                        
                    <div v-for="item in props.items">
                        <slot name="list-item" v-bind="item"></slot>
                    </div>
                </v-list>
            </v-col>
            <v-col cols="12" md="8">
                <v-card 
                    v-if="selectedItem"
                    color="secondary-darken-1" 
                    :title="isNewItem ? `Add ${itemTitle}` : `Edit ${itemTitle}`" 
                    :loading="isLoading">
                    <template v-slot:append>
                        <v-btn color="primary" variant="text" text="Transactions" @click="emit('viewTransactions')"></v-btn>
                        <v-icon icon="mdi-close" @click="selectedItem = null"></v-icon>
                    </template>                  
                    <v-tabs v-model="selectedTab">
                        <v-tab value="general">General</v-tab>
                        <v-tab value="rules" :disabled="isNewItem">Rules</v-tab>
                    </v-tabs>
                    <v-card-text>
                        <v-tabs-window v-model="selectedTab">
                            <v-tabs-window-item value="general">
                                <slot name="card-content"></slot>
                            </v-tabs-window-item>
                            <v-tabs-window-item value="rules" v-if="selectedRules">
                                <div>
                                    <v-icon icon="mdi-information-outline"></v-icon>
                                    Any match on rules will map transactions to this category during a file import
                                </div>
                                <v-divider thickness="2" class="my-2" color="white"></v-divider>
                                <TagsContainer v-model:selected-tags="selectedRules" :selectable-tags="[]"></TagsContainer>
                            </v-tabs-window-item>
                        </v-tabs-window>                             
                    </v-card-text>
                    <v-card-actions>
                        <v-btn :disabled="isNewItem" color="primary-darken-1" @click="emit('delete')">Delete</v-btn>
                        <v-btn :disabled="isNewItem" variant="tonal" color="primary-darken-1" append-icon="mdi-source-merge" @click="emit('merge')">Merge</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn variant="outlined" color="primary-darken-1" @click="emit('save')">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template> 
<script lang="ts" setup>

const selectedItem = defineModel<any | null>("selectedItem");
const selectedRules = defineModel<string[] | undefined>("selectedRules");
const filterString = defineModel<string>("filterString");
const props = defineProps<{
    items: any[],
    isLoading?: boolean,
    isNewItem: boolean,
    itemTitle: string,
}>();
const emit = defineEmits<{
    (e: 'addNew'): void
    (e: 'save'): void
    (e: 'delete'): void
    (e: 'merge'): void
    (e: 'viewTransactions'): void
}>();

const selectedTab = ref("general");

</script>
<style scoped>
.main-list-scroll {
  max-height: 97vh;
  overflow: auto;
}
.inner-list-scroll {
  max-height: 75vh;
  overflow: auto;
}
</style>