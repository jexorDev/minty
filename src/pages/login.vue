
<template>
    <v-row justify="space-around">
        <v-col cols="12" md="4">
            <v-alert v-show="errorMessage" color="error">{{ errorMessage }}</v-alert>
            <v-card class="mt-5">
                <v-card-title>
                    Log in
                </v-card-title>
                <v-card-item>
                    <v-btn-toggle v-model="mode">
                        <v-btn>Sign in</v-btn>
                        <v-btn>Create account</v-btn>
                    </v-btn-toggle>
                    <v-text-field  
                        v-model="username"    
                        label="Username"
                        type="input"
                        class="mt-5"
                        variant="outlined"
                        ></v-text-field>
                        <v-text-field      
                        v-model="password"
                        label="Password"
                        type="password"
                        variant="outlined"
                        ></v-text-field>
                        <v-text-field 
                        v-if="mode === 1"     
                        v-model="passwordConfirm"
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        ></v-text-field>
                </v-card-item>
                <v-card-actions>
                    <v-btn @click="submit" block variant="outlined" color="primary" :loading="loading">Submit</v-btn>
                </v-card-actions>
            </v-card>    
        </v-col>
    </v-row>
</template>
<script lang="ts" setup>
import GenericService from '@/data/services/GenericService';
import router from '@/router';

    const mode = ref(0);
    const username = ref("");
    const password = ref("");
    const passwordConfirm = ref("");
    const errorMessage = ref("");
    const loading = ref(false);

    async function submit() {
        errorMessage.value = "";

        if (username.value.length === 0) {
            errorMessage.value = "Please enter a Username";
            return;
        }
        if (password.value.length === 0) {
            errorMessage.value = "Please enter a password";
            return;
        }
        if (mode.value === 1) {
            if (passwordConfirm.value.length === 0) {
                errorMessage.value = "Please confirm the entered password";
                return;
            } else if (password.value !== passwordConfirm.value) {
                errorMessage.value = "Please enter matching passwords.";
                return;
            }
        }

        try {
            loading.value = true;

            const resp = await new GenericService(`authentication/${mode.value === 0 ? '' : 'createUser'}`).post({
                    "username": username.value,
                    "password": password.value
                });
    
            if (resp) {
                localStorage.setItem('authToken', resp);
                router.push("/");
            } else {
                errorMessage.value = "Invalid username/password combination";
            }     
        } finally {
            loading.value = false;
        }
    }

</script>
<route lang="yaml">
meta:
  layout: blank
</route>