import type Category from '@/data/interfaces/Category'
import { defineStore } from 'pinia'

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref<Category[]>([]);

  return { categories }


})