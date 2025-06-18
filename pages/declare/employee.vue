<script setup lang="ts">
import {
    Plus,
} from '@element-plus/icons-vue'
import type { DrawerProps, FormInstance, FormRules } from 'element-plus'
import type { EmployeeType } from '~/types/employeeType';
import InputText from '~/components/ui/inputText.vue';
import InputDate from '~/components/ui/inputDate.vue';
import Select from '~/components/ui/select.vue';
import { createEmployee, getListEmployeeByCompany, updateEmployee } from '~/api/employeeAPI';
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
const ruleFormRef = ref<FormInstance>()
const employees = ref<EmployeeType[]>([]);
const search = ref('')
const filterTableData = computed(() =>
    employees.value.filter(
        (data) =>
            !search.value ||
            (data.full_name ?? '').toLowerCase().includes(search.value.toLowerCase())
    )
)
const ruleForm = reactive<EmployeeType>({
    id: null,
    username: null,
    password: null,
    number_phone: null,
    full_name: null,
    email: null,
    address: null,
    date_of_birth: null,
    gender: '',
    status: false,
    role: '',
    company_id: companyStore.id,
    accept_app: {
        bms: false,
        cms: false,
        ams: false,
        driver: false,
    }
});
const rules: FormRules = {
    username: [
        { required: true, message: 'Vui lòng nhập tên đăng nhập', trigger: 'blur' },
        { min: 3, max: 20, message: 'Tên đăng nhập phải từ 3 đến 20 ký tự', trigger: 'blur' }
    ],
    password: [
        { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' },
        { min: 6, max: 20, message: 'Mật khẩu phải từ 6 đến 20 ký tự', trigger: 'blur' }
    ],
    full_name: [
        { required: true, message: 'Vui lòng nhập họ và tên', trigger: 'blur' },
        { min: 2, max: 50, message: 'Họ và tên phải từ 2 đến 50 ký tự', trigger: 'blur' }
    ],
    number_phone: [
        { required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' },
        { pattern: /^0[0-9]{9}$/, message: 'Số điện thoại không hợp lệ', trigger: ['blur', 'change'] }
    ],
    role: [
        { required: true, message: 'Vui lòng chọn vai trò', trigger: 'change' }
    ],
    gender: [
        { required: true, message: 'Vui lòng chọn giới tính', trigger: 'change' }
    ],
};
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
        username: null,
        password: null,
        number_phone: null,
        full_name: null,
        email: null,
        address: null,
        date_of_birth: new Date(),
        gender: null,
        status: false,
        role: '', // Changed from null to empty string
        company_id: companyStore.id,
        accept_app: {
            bms: false,
            cms: false,
            ams: false,
            driver: false,
        }
    });
    drawer.value = true;
}
const handleEdit = (index: number, row: EmployeeType) => {
    isEditMode.value = true;
    currentEditId.value = row.id;
    Object.assign(ruleForm, { ...row });
    drawer.value = true;
};
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
        if (valid) {
            try {
                if (isEditMode.value && currentEditId.value !== null) {

                    console.log(ruleForm);
                    const response = await updateEmployee(currentEditId.value, ruleForm);
                    if (response.success) {
                        ElNotification({
                            message: h('p', { style: 'color: teal' }, 'Cập nhật tài khoản thành công!'),
                            type: 'success',
                        })
                        const index = employees.value.findIndex(employee => employee.id === currentEditId.value);
                        if (index !== -1) {
                            employees.value[index] = {
                                ...employees.value[index],
                                ...ruleForm
                            };
                        }
                    }
                } else {
                    console.log(ruleForm);
                    const response = await createEmployee(ruleForm);
                    if (response.success) {
                        ElNotification({
                            message: h('p', { style: 'color: teal' }, 'Thêm tài khoản mới thành công!'),
                            type: 'success',
                        })
                        if (response.result) {
                            employees.value.push(response.result);
                        }
                    }
                }
                drawer.value = false;
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
const fetchListEmployees = async () => {
    loading.value = true;
    try {
        const response = await getListEmployeeByCompany(Number(companyStore.id));
        if (response.result) {
            employees.value = response.result;
        } else {
            ElNotification({
                message: h('p', { style: 'color: red' }, 'Không tìm thấy nhân viên nào!'),
                type: 'warning',
            });
        }
    } catch (error) {
        ElNotification({
            message: h('p', { style: 'color: red' }, 'Đã xảy ra lỗi khi tải danh sách nhân viên!'),
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
    // fetchListEmployees();
});
const categoryGenderOptions = [
    { label: 'Nam', value: 'male' },
    { label: 'Nữ', value: 'female' },
    { label: 'Khác', value: 'other' }
]
const categoryRoleOptions = [
    { label: 'Quản trị viên', value: 'ADMIN' },
    { label: 'Nhân viên', value: 'STAFF' },
    { label: 'Tài xế', value: 'DRIVER' },
    { label: 'Phụ xe', value: 'ASSISTANT' },
    { label: 'Đại lý', value: 'AGENT' }
];
</script>
<template>
    <section>
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">DANH SÁCH NHÂN VIÊN</h3>
            <el-button :icon="Plus" type="primary" @click="handleAdd">Thêm nhân viên</el-button>
        </div>

        <el-drawer v-model="drawer" :direction="direction" :before-close="cancelClick" size="50%">
            <template #header>
                <div class="font-semibold text-lg text-black">{{ isEditMode ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên'
                }}</div>
            </template>
            <template #default>

                <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto">
                    <el-row>
                        <el-col :span="12" class="pr-5">
                            <h2 class="text-gray-500 font-medium mb-5">THÔNG TIN CÁ NHÂN</h2>

                            <InputText v-model="ruleForm.full_name" prop="full_name" label="Họ và tên" />
                            <InputText v-model="ruleForm.number_phone" prop="number_phone" label="Số điện thoại" />
                            <InputText v-model="ruleForm.email" prop="email" label="Email" />
                            <InputText v-model="ruleForm.address" prop="address" label="Địa chỉ" />
                            <InputDate v-model="ruleForm.date_of_birth" prop="date_of_birth" label="Ngày sinh"
                                placeholder="Chọn ngày sinh" type="date" format="DD/MM/YYYY" value-format="YYYY-MM-DD"
                                clearable />
                            <Select v-model="ruleForm.gender" prop="gender" label="Giới tính"
                                :options="categoryGenderOptions" clearable />
                        </el-col>
                        <el-col :span="12" class="pl-5">
                            <h2 class="text-gray-500 font-medium mb-5">THÔNG TIN TÀI KHOẢN</h2>
                            <InputText v-model="ruleForm.username" prop="username" label="Tên đăng nhập" />
                            <InputText v-model="ruleForm.password" prop="password" label="Mật khẩu" type="password" />

                            <Select v-model="ruleForm.role" prop="role" label="Vai trò" :options="categoryRoleOptions"
                                clearable />
                            <el-form-item prop="status" label-position="top">
                                <template #label>
                                    <span class="text-sm font-medium text-gray-700">Trạng thái</span>
                                </template>
                                <el-switch v-model="ruleForm.status" active-text="Kích hoạt"
                                    inactive-text="Ngưng kích hoạt" size="large" />
                            </el-form-item>
                            <h2 class="text-gray-500 font-medium mb-5">CÁC ỨNG DỤNG CẦN TRUY CẬP</h2>
                            <el-form-item prop="accept_app.bms" label-position="top">
                                <template #label>
                                    <span class="text-sm font-medium text-gray-700">Phần mềm Quản lý bán vé</span>
                                </template>
                                <el-switch v-model="ruleForm.accept_app.bms" size="large" />
                            </el-form-item>
                            <el-form-item prop="accept_app.cms" label-position="top">
                                <template #label>
                                    <span class="text-sm font-medium text-gray-700">Phần mềm Quản lý hàng hóa</span>
                                </template>
                                <el-switch v-model="ruleForm.accept_app.cms" size="large" />
                            </el-form-item>
                            <el-form-item prop="accept_app.ams" label-position="top">
                                <template #label>
                                    <span class="text-sm font-medium text-gray-700">Phần mềm Đại lý bán vé</span>
                                </template>
                                <el-switch v-model="ruleForm.accept_app.ams" size="large" />
                            </el-form-item>
                            <el-form-item prop="accept_app.driver" label-position="top">
                                <template #label>
                                    <span class="text-sm font-medium text-gray-700">Ứng dụng Tài xế đón trả khách</span>
                                </template>
                                <el-switch v-model="ruleForm.accept_app.driver" size="large" />
                            </el-form-item>
                        </el-col>
                    </el-row>
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