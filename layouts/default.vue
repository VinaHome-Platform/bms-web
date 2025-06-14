<script setup lang="ts">
import Header from '~/components/layout/Header.vue';
const authStore = useAuthStore()
const officeStore = useOfficeStore();
const companyStore = useCompanyStore();
onMounted(async () => {
    await authStore.loadUserInfo();
    await officeStore.loadOfficeStore();
    await companyStore.loadCompanyStore();
});
</script>
<template>
    <div class=" bg-gray-50">
        <Header />

        <section class="p-2 mt-[60px]">
            <slot />
        </section>

    </div>
</template>
