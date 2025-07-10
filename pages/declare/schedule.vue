<script setup lang="ts">
import {
    Plus, Delete, Edit, ArrowUp, ArrowDown
} from '@element-plus/icons-vue'
import { timePickerDefaultProps, type DrawerProps, type FormInstance, type FormRules } from 'element-plus'
import type { ScheduleType } from '~/types/scheduleType';
import Select from '~/components/inputs/select.vue'
import type { DTO_RP_ListRouteName } from '~/types/routeType';
import { getListRouteNameByCompany } from '~/api/routeAPI';
import type { SeatChartNameType } from '~/types/seatType';
import { getSeatChartNameByCompany } from '~/api/seatAPI';
import InputDate from '~/components/inputs/inputDate.vue';
import { createSchedule } from '~/api/scheduleAPI';
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
const seatChartNames = ref<SeatChartNameType[]>([]);

const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
    route_id: [
        { required: true, message: 'Vui lòng chọn tuyến', trigger: 'blur' },
    ],
    start_time: [
        { required: true, message: 'Vui lòng chọn thời gian khởi hành', trigger: 'blur' },
    ],
    trip_type: [
        { required: true, message: 'Vui lòng chọn loại chuyến', trigger: 'blur' },
    ],
    start_date: [
        { required: true, message: 'Vui lòng chọn ngày bắt đầu', trigger: 'blur' },
    ],
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
const ruleForm = reactive<ScheduleType>({
    id: null,
    route_id: null,
    seat_chart_id: null,
    start_time: '',
    repeat_type: 'weekday',
    weekdays: [],
    odd_even_type: '',
    start_date: null,
    end_date: null,
    trip_type: null,
    is_known_end_date: false,
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
        seat_chart_id: null,
        start_time: '',
        repeat_type: 'weekday',
        weekdays: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
        odd_even_type: '',
        start_date: null,
        end_date: null,
        is_known_end_date: false,
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
const fetchListSeatChartName = async () => {
    loading.value = true;
    try {
        const response = await getSeatChartNameByCompany(Number(companyStore.id));
        if (response.result) {
            seatChartNames.value = response.result;
            console.log(seatChartNames.value);
        } else {
            ElNotification({
                message: h('p', { style: 'color: red' }, 'Không tìm thấy sơ đồ ghế nào!'),
                type: 'warning',
            });
        }
    } catch (error) {
        ElNotification({
            message: h('p', { style: 'color: red' }, 'Đã xảy ra lỗi khi tải danh sách sơ đồ ghế!'),
            type: 'error',
        });
        console.error('Error fetching seat chart names:', error);
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
const seatChartNameOptions = computed(() =>
    seatChartNames.value.map(s => ({
        label: s.seat_chart_name,
        value: s.id
    }))
);
const optionsTypeTrip = [
    { label: 'Chuyến cố định chở khách', value: 1 },
    { label: 'Chuyến cố định chở hàng', value: 2 },
    { label: 'Xe hợp đồng', value: 3 },
]


const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    await formEl.validate(async (valid) => {
        if (valid) {
            try {
                if (isEditMode.value && currentEditId.value !== null) {

                    console.log(ruleForm);

                } else {
                    console.log('Thêm lịch chạy mới:', ruleForm);
                    const response = await createSchedule(ruleForm);
                    if (response.success) {
                        ElNotification({
                            message: h('p', { style: 'color: green' }, 'Thêm lịch chạy thành công!'),
                            type: 'success',
                        });
                        console.log('Thêm lịch chạy thành công:', response);
                    } else {
                        ElNotification({
                            message: h('p', { style: 'color: red' }, response.message || 'Thêm lịch chạy thất bại!'),
                            type: 'error',
                        });
                    }
                }
                // drawer.value = false;
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

}
const showSeatChart = computed(() => ruleForm.trip_type === 1 || ruleForm.trip_type === 3)
watch(
  () => ruleForm.trip_type,
  (newVal) => {
    if (newVal === 2) {
      ruleForm.seat_chart_id = null
    }
  }
)
watch(() => ruleForm.repeat_type, (newType, oldType) => {
    if (newType !== oldType) {
        if (newType === 'weekday') {
            ruleForm.odd_even_type = ''
            ruleForm.weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
        } else if (newType === 'odd_even') {
            ruleForm.weekdays = []
            ruleForm.odd_even_type = 'odd'
        }
    }
})
watch(() => ruleForm.is_known_end_date, (val) => {
  if (!val) {
    ruleForm.end_date = null;
  }
})

onMounted(() => {
    companyStore.loadCompanyStore();
    authStore.loadUserInfo();
    fetchListRouteName();
    fetchListSeatChartName();
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
                        <Select v-model="ruleForm.trip_type" prop="trip_type" label="Loại chuyến" :options="optionsTypeTrip"
                            clearable />
                        <Select v-if="showSeatChart" v-model="ruleForm.seat_chart_id" prop="seat_chart_id" label="Sơ đồ ghế"
                            :options="seatChartNameOptions" clearable />
                        <el-form-item prop="start_time" label-position="top">
                            <template #label>
                                <span class="text-sm font-medium text-gray-700">Thời gian khởi hành</span>
                            </template>
                        <el-time-select v-model="ruleForm.start_time" start="00:05" step="00:05" end="23:55"
                                placeholder="Chọn thời gian" style="width: 180px" />
                        </el-form-item>
                        <div class="mb-4">
                            <span class="text-sm font-medium text-gray-700 block mb-3">Lặp lại lịch</span>
                            <el-radio-group v-model="ruleForm.repeat_type">
                                <el-radio value="weekday">Lặp theo thứ</el-radio>
                                <el-radio value="odd_even">Lặp theo ngày chẵn, lẻ</el-radio>
                            </el-radio-group>
                        </div>


                        <div v-if="ruleForm.repeat_type === 'weekday'" class="mb-4">
                            <span class="text-sm font-medium text-gray-700 block mb-3">Chọn các ngày trong tuần</span>
                            <el-checkbox-group v-model="ruleForm.weekdays">
                                <el-checkbox value="T2">Thứ 2</el-checkbox>
                                <el-checkbox value="T3">Thứ 3</el-checkbox>
                                <el-checkbox value="T4">Thứ 4</el-checkbox>
                                <el-checkbox value="T5">Thứ 5</el-checkbox>
                                <el-checkbox value="T6">Thứ 6</el-checkbox>
                                <el-checkbox value="T7">Thứ 7</el-checkbox>
                                <el-checkbox value="CN">Chủ nhật</el-checkbox>
                            </el-checkbox-group>
                        </div>


                        <div v-if="ruleForm.repeat_type === 'odd_even'" class="mb-4">
                            <span class="text-sm font-medium text-gray-700 block mb-3">Chọn loại ngày</span>
                            <el-radio-group v-model="ruleForm.odd_even_type">
                                <el-radio value="odd">Ngày lẻ</el-radio>
                                <el-radio value="even">Ngày chẵn</el-radio>
                            </el-radio-group>
                        </div>
                        <el-checkbox label="Đã biết ngày dừng" v-model="ruleForm.is_known_end_date" />
                        <InputDate v-model="ruleForm.start_date" label="Ngày bắt đầu" prop="start_date"
                            placeholder="Chọn ngày" type="date" format="DD/MM/YYYY" value-format="YYYY-MM-DD"
                            clearable />


                        <InputDate v-if="ruleForm.is_known_end_date" v-model="ruleForm.end_date" label="Ngày kết thúc" prop="end_date"
                            placeholder="Chọn ngày" type="date" format="DD/MM/YYYY" value-format="YYYY-MM-DD"
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