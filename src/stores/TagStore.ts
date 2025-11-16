import type Tag from "@/data/interfaces/Tag";
import TagService from "@/data/services/TagService";
import { defineStore } from "pinia";


export const useTagStore = defineStore('tags', () => {
    const tags = ref<Tag[]>([]);

    async function refreshTags(): Promise<void> {
        tags.value = await new TagService().getMultiple();        
    }

    return {tags, refreshTags};
})