import type Merchant from '@/data/interfaces/Merchant'
import { defineStore } from 'pinia'

export const useMerchantStore = defineStore('merchants', () => {
    const merchants = ref<Merchant[]>([]);

    return {merchants};
})