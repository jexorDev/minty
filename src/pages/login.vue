
<template>
    <v-row align-self="center">
        <v-col cols="3">
            <v-card>
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
                        ></v-text-field>
                     <v-text-field      
                        v-model="password"
                        label="Password"
                        type="password"
                        ></v-text-field>
                        <v-text-field 
                        v-if="mode === 1"     
                        v-model="passwordConfirm"
                        label="Confirm Password"
                        type="password"
                        ></v-text-field>
                </v-card-item>
                <v-card-actions>
                    <v-btn @click="submit">Submit</v-btn>
                </v-card-actions>
            </v-card>

        </v-col>
    </v-row>
</template>
<script lang="ts" setup>
import router from '@/router';
import axios from 'axios';

    const mode = ref(0);
    const username = ref("");
    const password = ref("");
    const passwordConfirm = ref("");

    async function submit() {
        if (username.value.length === 0) {
            console.log("Please enter a Username");
        }
        if (password.value.length === 0) {
            console.log("Please enter a password");
        }
        if (mode.value === 1) {
            if (passwordConfirm.value.length === 0) {
                console.log("Please confirm the entered password")
            } else if (password.value !== passwordConfirm.value) {
                console.log("Please enter matching passwords.")
            }
        }

        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/authentication/${mode.value === 0 ? '' : 'createUser'}`, 
            {
                "username": username.value,
                "password": password.value
            }
        ).then((res) => {
            console.log(res.data)
            if (res.data) {
                localStorage.setItem('authToken', res.data);
                router.push("/");
            }

        });



    }

</script>
<route lang="yaml">
meta:
  layout: blank
</route>