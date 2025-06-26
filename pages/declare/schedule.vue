<script setup lang="ts">
import {
    Plus, Delete, Edit, ArrowUp, ArrowDown
} from '@element-plus/icons-vue'
import type { DrawerProps, FormInstance, FormRules } from 'element-plus'
import type { ScheduleType } from '~/types/scheduleType';
import Select from '~/components/inputs/select.vue'
import type { DTO_RP_ListRouteName } from '~/types/routeType';
import { getListRouteNameByCompany } from '~/api/routeAPI';
definePageMeta({
    layout: 'default',
})
const companyStore = useCompanyStore();
const authStore = useAuthStore();
const drawer = ref(false)
const direction = ref<DrawerProps[ 'direction' ]>('rtl')
const isEditMode = ref(false)
const currentEditId = ref<number | null>(null);
const loading = ref(false);
const schedules = ref<ScheduleType[]>([]);
const routeNames = ref<DTO_RP_ListRouteName[]>([]);

const ruleFormRef = ref<FormInstance>()
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    drawer.value = false
}
const cancelClick = () => {
    drawer.value = false;
    ruleFormRef.value?.resetFields();
}
const ruleForm = reactive<ScheduleType>({
    id: null,
    route_id: null,

    created_at: null,
    created_by: authStore.username,
    company_id: companyStore.id,
});
const handleAdd = () => {
    isEditMode.value = false;
    currentEditId.value = null;
    Object.assign(ruleForm, {
        id: null,
        route_id: null,

        created_by: authStore.username,
        company_id: companyStore.id,
    });
    drawer.value = true;
};
const handleEdit = (index: number, row: ScheduleType) => {
    isEditMode.value = true;
    currentEditId.value = row.id;
    Object.assign(ruleForm, { ...row });
    drawer.value = true;
};

const categoryRoleOptions = [
    { label: 'Quản trị viên', value: 'ADMIN' },
    { label: 'Nhân viên', value: 'STAFF' },
    { label: 'Tài xế', value: 'DRIVER' },
    { label: 'Phụ xe', value: 'ASSISTANT' },
    { label: 'Đại lý', value: 'AGENT' }
];
const fetchListRouteName = async () => {
    loading.value = true;
    try {
        const response = await getListRouteNameByCompany(Number(companyStore.id));
        if (response.result) {
            routeNames.value = response.result;
            console.log(routeNames.value);
        } else {
            ElNotification({
                message: h('p', { style: 'color: red' }, 'Không tìm thấy tuyến nào!'),
                type: 'warning',
            });
        }
    } catch (error) {
        ElNotification({
            message: h('p', { style: 'color: red' }, 'Đã xảy ra lỗi khi tải danh sách tuyến!'),
            type: 'error',
        });
        console.error('Error fetching route names:', error);
    } finally {
        loading.value = false;
    }
};
const routeNameOptions = computed(() =>
    routeNames.value.map(r => ({
        label: r.route_name,
        value: r.id
    }))
);
onMounted(() => {
    companyStore.loadCompanyStore();
    authStore.loadUserInfo();
    fetchListRouteName();
}); 
</script>
<template>
    <section>
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">DANH SÁCH LỊCH CHẠY</h3>
            <el-button :icon="Plus" type="primary" @click="handleAdd">Thêm lịch chạy</el-button>
        </div>

        <el-drawer v-model="drawer" :direction="direction" :before-close="cancelClick">
            <template #header>
                <div class="font-semibold text-lg text-black">{{ isEditMode ? 'Chỉnh sửa lịch chạy' : 'Thêm lịch chạy'
                    }}</div>
            </template>
            <template #default>
                <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto">
                    <div>
                        <h2 class="text-gray-500 font-medium mb-5">THÔNG TIN LỊCH CHẠY</h2>

                        <Select v-model="ruleForm.route_id" prop="route_id" label="Tuyến" :options="routeNameOptions"
                            clearable />
                        <Select v-model="ruleForm.route_id" prop="route_id" label="Sơ đồ ghế" :options="routeNameOptions"
                            clearable />
                    </div>
                </el-form>

            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="resetForm(ruleFormRef)">Thoát</el-button>
                    <el-button type="primary" @click="submitForm(ruleFormRef)">Lưu</el-button>
                </div>
            </template>
        </el-drawer>
    </section>
</template>
<style scoped>
:deep(.el-drawer__footer) {
    padding-bottom: 10px !important;
    background-color: whitesmoke !important;
    border-top: 1px solid rgb(240, 240, 240) !important;
}

:deep(.el-drawer__header) {
    background-color: whitesmoke !important;
    border-bottom: 1px solid rgb(240, 240, 240) !important;
    padding-bottom: 20px;
    margin-bottom: 0 !important;
}
</style>