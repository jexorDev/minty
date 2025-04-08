<template>
    <v-dialog
          v-model="props.show"
          transition="dialog-bottom-transition"
          fullscreen
        >
          <template v-slot:activator="{ props: activatorProps }">
            <v-btn
              prepend-icon="mdi-cog"
              size="small"
              text="Settings"
              v-bind="activatorProps"
            ></v-btn>
          </template>
    
          <v-card>
            <v-toolbar>
              <v-btn
                icon="mdi-close"
                @click="$emit('close')"
              ></v-btn>
    
              <v-toolbar-title>{{ props.title }}</v-toolbar-title>
    
              <v-toolbar-items>
                <v-btn
                  text="Save"
                  variant="text"
                  @click="$emit('close')"
                ></v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <slot></slot>
            
          </v-card>
        </v-dialog>

</template>
<script setup lang="ts">

const props = defineProps<{
    title: string,
    show: boolean
}>();
const emit = defineEmits<{
    (e: 'close'): void
}>();

//get localShow(): boolean { return props.show; }

</script>