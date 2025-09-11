<template>
    <v-dialog
          v-model="show"
          transition="dialog-bottom-transition"
          fullscreen
          :loading="loading"
        >
        
    
          <v-card>
            <v-toolbar color="secondary-darken-1" density="compact">
              <v-toolbar-title>{{action}} {{ modelType }}</v-toolbar-title>
              <v-toolbar-items>
                <v-btn
                icon="mdi-close"                
                @click="$emit('cancel')"                
              ></v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <slot></slot>
          <v-card-actions>
            <v-btn color="primary" variant="tonal" @click="$emit('cancel')">Cancel</v-btn>
            <v-btn color="primary" variant="outlined" :text="action" @click="$emit('save')"></v-btn>
          </v-card-actions>  
          </v-card>
          
        </v-dialog>

</template>
<script setup lang="ts">
import {inject} from 'vue';

const show = inject<boolean>('show');
const loading = inject<boolean>('loading');

const props = defineProps<{
  modelType: string,
  isNew: boolean
}>();

const action = computed(() => props.isNew ? "Add" : "Update");

const emit = defineEmits<{
    (e: 'cancel'): void
    (e: 'save'): void
}>();

//get localShow(): boolean { return props.show; }

</script>