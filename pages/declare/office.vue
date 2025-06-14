<script setup lang="ts">
import {
    Plus, Delete, Edit
} from '@element-plus/icons-vue'
import type { DrawerProps, FormInstance, FormRules } from 'element-plus'
import { createOffice, deleteOffice, getListOfficeByCompany, updateOffice } from '~/api/officeAPI'
import type { OfficeType } from '~/types/officeType';
import { format } from 'date-fns'
definePageMeta({
    layout: 'default',
})
const companyStore = useCompanyStore();
const drawer = ref(false)
const direction = ref<DrawerProps['direction']>('rtl')
const isEditMode = ref(false)
const currentEditId = ref<number | null>(null);
const offices = ref<OfficeType[]>([]);
const loading = ref(false);
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<OfficeType>({
    id: null,
    name: null,
    code: null,
    address: null,
    status: false,
    note: null,
    phones: [
        { id: null, phone: null, type: 'mobile' }
    ],
    created_at: null,
    company_id: companyStore.id,
});
const rules = reactive<FormRules>({
    name: [
        { required: true, message: 'Vui lòng nhập tên văn phòng', trigger: 'blur' },
    ],
    code: [
        { required: true, message: 'Vui lòng nhập mã văn phòng', trigger: 'blur' },
    ],
    address: [
        { required: true, message: 'Vui lòng nhập địa chỉ văn phòng', trigger: 'blur' },
    ],
})
const phoneRules = [
    { required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' },
    {
        pattern: /^[0-9+\-\s()]+$/,
        message: 'Số điện thoại không hợp lệ',
        trigger: 'blur'
    }
]
const removePhone = (index: number) => {
    if (ruleForm.phones.length > 1) {
        ruleForm.phones.splice(index, 1)
        // Clear validation for removed field
        ruleFormRef.value?.clearValidate([`phones.${index}.number`])
    }
}

const addPhone = () => {
    ruleForm.phones.push({
        id: null, phone: null, type: 'mobile',
    })
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
    offices.value.filter(
        (data) =>
            !search.value ||
            (data.name ?? '').toLowerCase().includes(search.value.toLowerCase())
    )
)
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
        if (valid) {
            try {
                if (isEditMode.value && currentEditId.value !== null) {
                    // Gọi API cập nhật
                    console.log(ruleForm);
                    const response = await updateOffice(currentEditId.value, ruleForm);
                    if (response.success) {
                        ElNotification({
                            message: h('p', { style: 'color: teal' }, 'Cập nhật văn phòng thành công!'),
                            type: 'success',
                        })
                    }
                } else {
                    const response = await createOffice(ruleForm);
                    if (response.success) {
                        ElNotification({
                            message: h('p', { style: 'color: teal' }, 'Thêm văn phòng mới thành công!'),
                            type: 'success',
                        })
                    }
                }
                drawer.value = false;
                fetchListOffice();
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

const handleAdd = () => {
    isEditMode.value = false;
    currentEditId.value = null;
    Object.assign(ruleForm, {
        id: 0,
        name: null,
        address: null,
        phones: [],
        code: null,
        status: false,
        note: null,
        company_id: companyStore.id,
    });
    drawer.value = true;
};
const handleEdit = (index: number, row: OfficeType) => {
    isEditMode.value = true;
    currentEditId.value = row.id;
    Object.assign(ruleForm, { ...row });
    drawer.value = true;
};

const handleDelete = async (index: number, row: OfficeType) => {
    try {
        await ElMessageBox.confirm(
            'Bạn có chắc chắn muốn xóa văn phòng này?',
            'Xác nhận xoá',
            {
                confirmButtonText: 'Xoá',
                cancelButtonText: 'Huỷ',
                type: 'warning',
            }
        );

        await deleteOffice(row.id!);
        ElNotification({
            message: h('p', { style: 'color: teal' }, 'Xóa văn phòng thành công!'),
            type: 'success',
        });
        fetchListOffice();
    } catch (error) {
        if (error !== 'cancel' && error !== 'close') {
            ElNotification({
                message: h('p', { style: 'color: red' }, 'Xóa văn phòng thất bại!'),
                type: 'error',
            });
            console.error(error);
        }
    }
};

const fetchListOffice = async () => {
    loading.value = true;
    try {
        const response = await getListOfficeByCompany(Number(companyStore.id));
        if (response.result) {
            console.log('Danh sách văn phòng:', response.result);
            offices.value = response.result;
        } else {
            ElMessage.error('Không thể tải danh sách văn phòng');
        }
    } catch (error) {
        console.error(error);
        ElMessage.error('Đã xảy ra lỗi khi tải danh sách văn phòng');
    } finally {
        loading.value = false;
    }
};
onMounted(() => {
    companyStore.loadCompanyStore();
    fetchListOffice();
});
</script>
<template>
    <section>
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">DANH SÁCH VĂN PHÒNG</h3>
            <el-button :icon="Plus" type="primary" @click="handleAdd">Thêm văn phòng</el-button>
        </div>

        <el-table v-loading="loading" element-loading-text="Đang tải dữ liệu..." :data="filterTableData"
            style="width: 100%">
            <el-table-column type="index" label="STT" width="50" />
            <el-table-column label="Tên văn phòng" prop="name" />
            <el-table-column label="Mã văn phòng" prop="code" />
            <el-table-column label="Địa chỉ" prop="address" />
            <el-table-column label="Trạng thái" prop="status">
                <template #default="scope">
                    <el-tag :type="scope.row.status ? 'success' : 'danger'">
                        {{ scope.row.status ? 'Kích hoạt' : 'Ngưng kích hoạt' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="Số điện thoại" prop="phones">
                <template #default="scope">
                    <div v-for="(phone, index) in scope.row.phones" :key="index" class="mb-1">
                        <el-tag :type="phone.type === 'mobile' ? 'success'
                            : phone.type === 'landline' ? 'info'
                                : phone.type === 'fax' ? 'warning'
                                    : 'danger'" effect="dark">
                            {{ phone.phone }}
                        </el-tag>
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="Ghi chú" prop="note" />
            <el-table-column label="Ngày tạo" prop="created_at">
                <template #default="scope">
                    {{ format(new Date(scope.row.created_at), 'dd/MM/yyyy') }}
                </template>
            </el-table-column>
            <el-table-column align="right">
                <template #header>
                    <el-input v-model="search" placeholder="Tìm văn phòng" />
                </template>
                <template #default="scope">
                    <el-button type="primary" :icon="Edit" circle @click="handleEdit(scope.$index, scope.row)" />
                    <el-button circle type="danger" :icon="Delete" @click="handleDelete(scope.$index, scope.row)" />

                </template>
            </el-table-column>
        </el-table>
        <div class="flex justify-end mt-4">
            <el-pagination background layout="prev, pager, next" :total="100" />
        </div>

        <el-drawer v-model="drawer" :direction="direction" :before-close="cancelClick">
            <template #header>
                <div class="font-semibold text-lg text-black">{{ isEditMode ? 'Chỉnh sửa văn phòng' : 'Thêm văn phòng'
                    }}</div>
            </template>
            <template #default>

                <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto">
                    <div>
                        <h2 class="text-gray-500 font-medium mb-5">THÔNG TIN VĂN PHÒNG</h2>

                        <el-form-item prop="name" label-position="top">
                            <template #label>
                                <label class="text-sm font-medium text-gray-700">Tên văn phòng</label>
                            </template>
                            <el-input v-model="ruleForm.name" />
                        </el-form-item>

                        <el-form-item prop="code" label-position="top">
                            <template #label>
                                <label class="text-sm font-medium text-gray-700">Mã văn phòng</label>
                            </template>
                            <el-input v-model="ruleForm.code" />
                        </el-form-item>

                        <el-form-item prop="address" label-position="top">
                            <template #label>
                                <label class="text-sm font-medium text-gray-700">Địa chỉ</label>
                            </template>
                            <el-input v-model="ruleForm.address" />
                        </el-form-item>
                        <el-form-item prop="note" label-position="top">
                            <template #label>
                                <label class="text-sm font-medium text-gray-700">Ghi chú</label>
                            </template>
                            <el-input v-model="ruleForm.note" />
                        </el-form-item>

                        <el-form-item prop="status" label-position="top">
                            <template #label>
                                <label class="text-sm font-medium text-gray-700">Trạng thái</label>
                            </template>
                            <el-switch v-model="ruleForm.status" active-text="Kích hoạt"
                                inactive-text="Ngưng kích hoạt" />
                        </el-form-item>

                        <div class="phone-section">
                            <div class="flex items-center justify-between mb-3">
                                <label class="text-sm font-medium text-gray-700">Số điện thoại</label>
                                <el-button type="primary" size="small" :icon="Plus" @click="addPhone">
                                    Thêm số điện thoại
                                </el-button>
                            </div>

                            <div v-if="ruleForm.phones.length === 0" class="text-gray-500 text-sm mb-3">
                                Chưa có số điện thoại nào. Nhấn "Thêm số điện thoại" để bắt đầu.
                            </div>

                            <div v-for="(phone, index) in ruleForm.phones" :key="index" class="flex gap-2 ">
                                <el-form-item :prop="`phones.${index}.phone`" :rules="phoneRules" class="flex-1 mb-0">
                                    <el-input v-model="phone.phone" :placeholder="`Số điện thoại ${index + 1}`" />
                                </el-form-item>

                                <el-form-item :prop="`phones.${index}.type`" class="w-40 mb-0">
                                    <el-select v-model="phone.type" placeholder="Loại">
                                        <el-option label="Di động" value="mobile" />
                                        <el-option label="Cố định" value="landline" />
                                        <el-option label="Fax" value="fax" />
                                        <el-option label="Khác" value="other" />
                                    </el-select>
                                </el-form-item>

                                <el-button type="danger" size="small" class="mt-[4.5px]"
                                    :disabled="ruleForm.phones.length === 1" :icon="Delete" circle
                                    @click="removePhone(index)" />
                            </div>
                        </div>
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
<style scoped></style>