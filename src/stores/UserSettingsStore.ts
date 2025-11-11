import type UserSettings from "@/data/interfaces/Users/UserSettings"
import UserSettingsService from "@/data/services/UserSettingsService";
import { getYear } from "@/utilities/DateArithmeticUtility";
import { defineStore } from "pinia";

export const useUserSettingsStore = defineStore('userSettings', () => {
    const userSettings = ref<UserSettings>({} as UserSettings);
    const isLoading = ref(false);

    const yearsOfData = computed<number[]>(() => {
        const years: number[] = [];

        for (var yearIndex = getYear(userSettings.value.minTransactionDate); yearIndex <= getYear(userSettings.value.maxTransactionDate); yearIndex++) {
            years.push(yearIndex);
        }        

        return years;
    });

    async function refreshUserSettings(): Promise<void> {
        try {
            isLoading.value = true;
            userSettings.value = await new UserSettingsService().getSingle();
        } finally {
            isLoading.value = false;
        }
    }

    return {userSettings, yearsOfData, refreshUserSettings}
})