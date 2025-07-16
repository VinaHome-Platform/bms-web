<script setup lang="ts">
import type { DrawerProps, FormInstance, FormRules } from 'element-plus'
import type { AgentType } from '~/types/agentType';
import InputText from '~/components/inputs/inputText.vue';
import InputNumber from '~/components/inputs/inputNumber.vue';
import {
    Plus, Delete, Edit
} from '@element-plus/icons-vue'
import { createAgent } from '~/api/agentAPI';
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
const agents = ref<AgentType[]>([]);
const ruleFormRef = ref<FormInstance>()
const isSubmitting = ref(false);
const ruleForm = ref<AgentType>({
    id: null,
    full_name: null,
    code: null,
    number_phone: null,
    note: null,
    address: null,
    username: null,
    password: null,
    status: false,
    email: null,
    company_code: companyStore.code,
    company_id: companyStore.id,
})
const rules: FormRules = {
    full_name: [
        { required: true, message: 'Vui lòng nhập tên đại lý', trigger: 'blur' },
    ],
    code: [
        { required: true, message: 'Vui lòng nhập mã đại lý', trigger: 'blur' },
    ],
    number_phone: [
        { required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' },
        { pattern: /^0[0-9]{9}$/, message: 'Số điện thoại không hợp lệ', trigger: 'blur' }
    ],
    username: [
        { required: true, message: 'Vui lòng nhập tài khoản', trigger: 'blur' },
    ],
    password: [
        { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' },
    ],
}
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    drawer.value = false
}
const cancelClick = () => {
    drawer.value = false;
    ruleFormRef.value?.resetFields();
}
const search = ref('')
const filterTableData = computed(() =>
    agents.value.filter(
        (data) =>
            !search.value ||
            (data.full_name ?? '').toLowerCase().includes(search.value.toLowerCase())
    )
)
const handleAdd = () => {
    isEditMode.value = false;
    currentEditId.value = null;
    Object.assign(ruleForm, {
        id: null,
        full_name: null,
        code: null,
        number_phone: null,
        note: null,
        address: null,
        username: null,
        password: null,
        status: false,
        email: null,
        company_code: companyStore.code,
        company_id: companyStore.id,
    });
    drawer.value = true;
};
const handleEdit = (index: number, row: AgentType) => {
    isEditMode.value = true;
    currentEditId.value = row.id;
    Object.assign(ruleForm, { ...row });
    drawer.value = true;
};
const handleDelete = async (index: number, row: AgentType) => {
    loading.value = true;
    try {
        await ElMessageBox.confirm(
            'Bạn có chắc chắn muốn xóa đại lý này?',
            'Xác nhận xoá',
            {
                confirmButtonText: 'Xoá',
                cancelButtonText: 'Huỷ',
                type: 'warning',
            }
        );

        await deleteAgent(row.id!);
        agents.value = agents.value.filter(agent => agent.id !== row.id);
        ElNotification({
            message: h('p', { style: 'color: teal' }, 'Xóa đại lý thành công!'),
            type: 'success',
        });
    } catch (error) {
        if (error !== 'cancel' && error !== 'close') {
            ElNotification({
                message: h('p', { style: 'color: red' }, 'Xóa đại lý thất bại!'),
                type: 'error',
            });
            console.error(error);
        }
    } finally {
        loading.value = false;
    }
};
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    isSubmitting.value = true;
    await formEl.validate(async (valid) => {
        if (valid) {
            try {
                if (isEditMode.value && currentEditId.value !== null) {

                    console.log(ruleForm);
                    // const response = await updateEmployee(currentEditId.value, ruleForm);
                    // if (response.success) {
                    //     ElNotification({
                    //         message: h('p', { style: 'color: teal' }, 'Cập nhật tài khoản thành công!'),
                    //         type: 'success',
                    //     })
                    //     const index = employees.value.findIndex(employee => employee.id === currentEditId.value);
                    //     if (index !== -1) {
                    //         employees.value[ index ] = {
                    //             ...employees.value[ index ],
                    //             ...ruleForm
                    //         };
                    //     }
                    // }
                } else {
                    console.log(ruleForm);
                    const response = await createAgent(ruleForm.value);
                    if (response.success) {
                        ElNotification({
                            message: h('p', { style: 'color: teal' }, 'Thêm đại lý mới thành công!'),
                            type: 'success',
                        })
                        if (response.result) {
                            agents.value.push(response.result);
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
            } finally {
                isSubmitting.value = false;
            }
        } else {
            console.log('error submit!');
            ElNotification({
                message: h('p', { style: 'color: red' }, 'Vui lòng kiểm tra lại thông tin đã nhập!'),
                type: 'error',
            });
            isSubmitting.value = false;
        }
    });
};
onMounted(() => {
    companyStore.loadCompanyStore();
    authStore.loadUserInfo();
});
</script>
<template>
    <section>
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">DANH SÁCH ĐẠI LÝ</h3>
            <el-button :icon="Plus" type="primary" @click="handleAdd">Thêm đại lý</el-button>
        </div>
        <el-table v-loading="loading" element-loading-text="Đang tải dữ liệu..." :data="filterTableData"
            style="width: 100%">
            <el-table-column type="index" label="STT" width="50" />
            <el-table-column label="Tên đại lý" prop="full_name" />
            <el-table-column label="Số điện thoại" prop="number_phone" />

            <el-table-column label="Trạng thái" prop="status">
                <template #default="scope">
                    <el-tag :type="scope.row.status ? 'success' : 'danger'">
                        {{ scope.row.status ? 'Kích hoạt' : 'Ngưng kích hoạt' }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column label="Ghi chú" prop="note" />
            <el-table-column align="right">
                <template #header>
                    <el-input v-model="search" placeholder="Tìm đại lý" />
                </template>
                <template #default="scope">
                    <el-button type="primary" :icon="Edit" circle @click="handleEdit(scope.$index, scope.row)" />
                    <el-button circle type="danger" :icon="Delete" @click="handleDelete(scope.$index, scope.row)" />

                </template>
            </el-table-column>
        </el-table>

        <el-drawer v-model="drawer" :direction="direction" :before-close="cancelClick" size="50%">
            <template #header>
                <div class="font-semibold text-lg text-black">{{ isEditMode ? 'Chỉnh sửa đại lý' : 'Thêm đại lý'
                }}</div>
            </template>
            <template #default>

                <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto">
                    <el-row>
                        <el-col :span="12" class="pr-5">
                            <h2 class="text-gray-500 font-medium mb-5">THÔNG TIN ĐẠI LÝ</h2>
                            <InputText v-model="ruleForm.full_name" prop="full_name" label="Tên đại lý" />
                            <InputText v-model="ruleForm.username" prop="username" label="Tài khoản" />
                            <InputText v-model="ruleForm.password" prop="password" label="Mật khẩu" />
                            <InputText v-model="ruleForm.code" prop="code" label="Mã đại lý" />
                            <InputText v-model="ruleForm.number_phone" prop="number_phone"
                                label="Số điện thoại liên lạc" />
                            <InputText v-model="ruleForm.address" prop="address" label="Địa chỉ" />
                            <InputText v-model="ruleForm.note" prop="note" label="Ghi chú" />
                            <el-form-item prop="status" label-position="top">
                                <template #label>
                                    <label class="text-sm font-medium text-gray-700">Trạng thái</label>
                                </template>
                                <el-switch v-model="ruleForm.status" size="large" active-text="Kích hoạt"
                                    inactive-text="Ngưng kích hoạt" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" class="pl-5">
                            <h2 class="text-gray-500 font-medium mb-5">CHÍNH SÁCH CHIẾT KHẤU</h2>
                        </el-col>
                    </el-row>
                </el-form>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="resetForm(ruleFormRef)">Thoát</el-button>
                    <el-button :loading="isSubmitting" type="primary" @click="submitForm(ruleFormRef)">Lưu</el-button>
                </div>
            </template>
        </el-drawer>
    </section>
</template>
