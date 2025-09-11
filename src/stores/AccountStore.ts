import type Account from '@/data/interfaces/Account'
import { defineStore } from 'pinia'

export const useAccountStore = defineStore('accounts', () => {
    const accounts = ref<Account[]>([]);

    return {accounts};
})