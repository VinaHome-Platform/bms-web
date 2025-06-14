<script setup lang="ts">
import {
    Plus, Delete, Edit
} from '@element-plus/icons-vue'
import type { DrawerProps, FormInstance, FormRules } from 'element-plus'
import { createRoute, getListRouteByCompany, updateRoute } from '~/api/routeAPI';
import type { RouteType } from '~/types/routeType';
import { format } from 'date-fns'
import InputText from '~/components/ui/inputText.vue';
import InputNumber from '~/components/ui/inputNumber.vue';
definePageMeta({
    layout: 'default',
})
const companyStore = useCompanyStore();
const authStore = useAuthStore();
const drawer = ref(false)
const direction = ref<DrawerProps['direction']>('rtl')
const isEditMode = ref(false)
const currentEditId = ref<number | null>(null);
const loading = ref(false);
const routes = ref<RouteType[]>([]);
const rules = reactive<FormRules>({
    route_name: [
        { required: true, message: 'Vui lòng nhập tên tuyến', trigger: 'blur' },
        { min: 2, max: 50, message: 'Tên tuyến phải từ 2 đến 50 ký tự', trigger: 'blur' }
    ],
    base_price: [
        { required: true, message: 'Vui lòng nhập giá cơ bản', trigger: 'blur' }
    ],
    short_name: [
        { required: true, message: 'Vui lòng nhập tên tuyến rút gọn', trigger: 'blur' },
        { min: 1, max: 20, message: 'Tên rút gọn phải từ 1 đến 20 ký tự', trigger: 'blur' }
    ],
});
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RouteType>({
    id: null,
    route_name: null,
    short_name: null,
    route_name_e_ticket: null,
    base_price: null,
    e_ticket_price: null,
    note: null,
    status: false,
    distance: null,
    journey: null,
    created_at: null,
    created_by: authStore.username,
    company_id: companyStore.id,
});
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    drawer.value = false
}
const cancelClick = () => {
    drawer.value = false;
    ruleFormRef.value?.resetFields();
}
const handleAdd = () => {
    isEditMode.value = false;
    currentEditId.value = null;
    Object.assign(ruleForm, {
        id: null,
        route_name: null,
        short_name: null,
        route_name_e_ticket: null,
        base_price: null,
        e_ticket_price: null,
        note: null,
        status: false,
        distance: null,
        journey: null,
        created_by: authStore.username,
        company_id: companyStore.id,
    });
    drawer.value = true;
};
const search = ref('')
const filterTableData = computed(() =>
    routes.value.filter(
        (data) =>
            !search.value ||
            (data.route_name ?? '').toLowerCase().includes(search.value.toLowerCase())
    )
)
const handleEdit = (index: number, row: RouteType) => {
    isEditMode.value = true;
    currentEditId.value = row.id;
    Object.assign(ruleForm, { ...row });
    drawer.value = true;
};
const handleDelete = async (index: number, row: RouteType) => {
    try {
        await ElMessageBox.confirm(
            'Bạn có chắc chắn muốn xóa tuyến này?',
            'Xác nhận xoá',
            {
                confirmButtonText: 'Xoá',
                cancelButtonText: 'Huỷ',
                type: 'warning',
            }
        );

        // await deleteOffice(row.id!);
        ElNotification({
            message: h('p', { style: 'color: teal' }, 'Xóa tuyến thành công!'),
            type: 'success',
        });
    } catch (error) {
        if (error !== 'cancel' && error !== 'close') {
            ElNotification({
                message: h('p', { style: 'color: red' }, 'Xóa tuyến thất bại!'),
                type: 'error',
            });
            console.error(error);
        }
    }
};
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
        if (valid) {
            try {
                if (isEditMode.value && currentEditId.value !== null) {
                    // Gọi API cập nhật
                    console.log(ruleForm);
                    const response = await updateRoute(currentEditId.value, ruleForm);
                    if (response.success) {
                        ElNotification({
                            message: h('p', { style: 'color: teal' }, 'Cập nhật tuyến thành công!'),
                            type: 'success',
                        })
                    }
                } else {
                    const response = await createRoute(ruleForm);
                    if (response.success) {
                        ElNotification({
                            message: h('p', { style: 'color: teal' }, 'Thêm tuyến mới thành công!'),
                            type: 'success',
                        })
                    }
                }
                drawer.value = false;
                fetchListRoute();
            } catch (error) {
                ElNotification({
                    message: h('p', { style: 'color: red' }, 'Đã xảy ra lỗi. Vui lòng thử lại!'),
                    type: 'error',
                });
                console.error(error);
            }
        } else {
            console.log('error submit!');
        }
    });
};
const fetchListRoute = async () => {
    loading.value = true;
    try {
        const response = await getListRouteByCompany(Number(companyStore.id));
        if (response.result) {
            routes.value = response.result;
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
        console.error(error);
    } finally {
        loading.value = false;
    }
};
onMounted(() => {
    companyStore.loadCompanyStore();
    authStore.loadUserInfo();
    fetchListRoute();
});
</script>
<template>
    <section>
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">DANH SÁCH TUYẾN</h3>
            <el-button :icon="Plus" type="primary" @click="handleAdd">Thêm tuyến</el-button>
        </div>
        <el-table v-loading="loading" element-loading-text="Đang tải dữ liệu..." :data="filterTableData"
            style="width: 100%">
            <el-table-column type="index" label="STT" width="50" />
            <el-table-column label="Tên tuyến" prop="route_name" />
            <el-table-column label="Tên tuyến rút gọn" prop="short_name" />
            <el-table-column label="Giá cơ bản" prop="base_price" />
            <el-table-column label="Trạng thái" prop="status">
                <template #default="scope">
                    <el-tag :type="scope.row.status ? 'success' : 'danger'">
                        {{ scope.row.status ? 'Kích hoạt' : 'Ngưng kích hoạt' }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column label="Ghi chú" prop="note" />
            <el-table-column label="Cập nhật" prop="created_at">
                <template #default="scope">
                    {{ scope.row.created_by }} - {{ format(new Date(scope.row.created_at), 'dd/MM/yyyy') }}
                </template>
            </el-table-column>
            <el-table-column align="right">
                <template #header>
                    <el-input v-model="search" placeholder="Tìm tuyến" />
                </template>
                <template #default="scope">
                    <el-button type="primary" :icon="Edit" circle @click="handleEdit(scope.$index, scope.row)" />
                    <el-button circle type="danger" :icon="Delete" @click="handleDelete(scope.$index, scope.row)" />

                </template>
            </el-table-column>
        </el-table>

        <el-drawer v-model="drawer" :direction="direction" :before-close="cancelClick">
            <template #header>
                <div class="font-semibold text-lg text-black">{{ isEditMode ? 'Chỉnh sửa tuyến' : 'Thêm tuyến'
                    }}</div>
            </template>
            <template #default>

                <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto">
                    <div>
                        <h2 class="text-gray-500 font-medium mb-5">THÔNG TIN TUYẾN</h2>

                        <InputText 
                            v-model="ruleForm.route_name" 
                            prop="route_name" 
                            label="Tên tuyến" 
                        />
                        
                        <InputNumber
                            v-model="ruleForm.base_price" 
                            prop="base_price"
                            label="Giá cơ bản"
                        />
                        
                        <InputText 
                            v-model="ruleForm.short_name" 
                            prop="short_name"
                            label="Tên rút gọn" 
                        />
                    
                        <InputText 
                            v-model="ruleForm.route_name_e_ticket" 
                            prop="route_name_e_ticket"
                            label="Tên tuyến xuất vé điện tử" 
                        />

                        <InputNumber
                            v-model="ruleForm.e_ticket_price" 
                            prop="e_ticket_price"
                            label="Giá vé điện tử"
                        />

                        <InputText 
                            v-model="ruleForm.note" 
                            prop="note"
                            label="Ghi chú" 
                        />

                        <InputNumber
                            v-model="ruleForm.distance" 
                            prop="distance"
                            label="Quảng đường (km)"
                        />

                        <InputText 
                            v-model="ruleForm.journey" 
                            prop="journey"
                            label="Lộ trình" 
                        />
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