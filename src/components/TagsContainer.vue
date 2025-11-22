<template>
     <div class="d-flex flex-wrap">
        <v-chip 
            v-for="tag in selectedTags"
            class="mr-2 mt-1"
            variant="outlined"
            label
            size="large"
            closable
            @click:close="removeTag(tag)">
            {{ tag }}
        </v-chip>
        <v-autocomplete
            v-model="selectedExistingTag"    
            v-model:search="searchText"                        
            @keydown.enter="addNewTag"
            :items="props.selectableTags"
            class="mt-1"
            variant="outlined" 
            color="primary"
            density="compact" 
            max-width="250" 
            min-width="200"
            append-inner-icon="mdi-plus"
            hide-no-data
            @click:append-inner="addNewTag">                            
        </v-autocomplete>
    </div>
</template> 
<script lang="ts" setup>

const selectedTags = defineModel<string[]>("selected-tags", {required: true});
const props = defineProps<{
    selectableTags: string[]
}>();

const selectedExistingTag = ref("");
const searchText = ref("");

function addNewTag() {
  if (searchText.value === "") return;

  const existingTag = props.selectableTags.find(x => x.toLowerCase() === searchText.value.toLowerCase());
  if (existingTag) {
    selectedTags.value.push(existingTag);  
  } else {
    selectedTags.value.push(searchText.value);
  }
  searchText.value = "";
}

function removeTag(tag: string): void {
    selectedTags.value = selectedTags.value.filter(x => x !== tag);    
}

watch(selectedExistingTag, (newValue, oldValue) => {
    if (oldValue === "" && newValue !== "") {
        selectedTags.value.push(newValue);
        selectedExistingTag.value = "";
        searchText.value = "";
    }
});


</script>