<template>
        <v-row>
            <v-col 
                cols="12" 
                md="4"
                v-if="!$vuetify.display.mobile || selectedItem === null">
                <v-btn @click="emit('addNew')" color="primary">Add New</v-btn>
                <v-text-field v-model="filterString" density="compact" label="Filter" clearable class="mt-4 mr-2"></v-text-field>                      
                <v-virtual-scroll
                    id="settings-management-virtual-scroll"
                    ref="settingsManagementVirtualScroll"
                    :items="items"
                    style="height: 82vh">
                    <template v-slot:default="{item}">
                        <slot name="list-item" v-bind="item"></slot>
                    </template>
                </v-virtual-scroll>                
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
                            <v-tabs-window-item value="rules">
                                <slot name="rules-content"></slot>
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
</template> 
<script lang="ts" setup>
import type { VVirtualScroll } from 'vuetify/components';

const selectedItem = defineModel<any | null>("selectedItem");
const filterString = defineModel<string>("filterString");
const props = defineProps<{
    items: any[],
    isLoading?: boolean,
    isNewItem: boolean,
    itemTitle: string,
    selectedItemId: number | null
}>();
const emit = defineEmits<{
    (e: 'addNew'): void
    (e: 'save'): void
    (e: 'delete'): void
    (e: 'merge'): void
    (e: 'viewTransactions'): void
}>();

const selectedTab = ref("general");
const settingsManagementVirtualScroll = ref<VVirtualScroll | null>(null);

watch(() => props.selectedItemId, (newValue, oldValue) => {
    if (oldValue) removeActive();
    if (newValue) setActiveTransaction(newValue);
})

watch(filterString, () => removeActive());

function removeActive(): void {
 const parentEle = document.getElementById("settings-management-virtual-scroll");
  
  if (parentEle) {
    const childEle = parentEle.querySelectorAll('[id^="settings-management-"]');
    childEle.forEach(x => x.classList.remove("bg-grey-darken-3"));
  }
}

function setActiveTransaction(id: number, index: number = 1): void {
    
  const parentEle = document.getElementById("settings-management-virtual-scroll");
  
  if (parentEle) {
        const childEle = parentEle.querySelector("#settings-management-" + id.toString());

        if (childEle) {
            childEle.classList.add('bg-grey-darken-3');
            
        } else {
            if (index <= props.items.length) {
                setTimeout(() => scrollIntoView(id, index + 1), 10);
            }
        }
  }
}

function scrollIntoView(id: number, index: number) {
    settingsManagementVirtualScroll.value?.scrollToIndex(index);
    setActiveTransaction(id, index);
}

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