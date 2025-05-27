<script setup lang="ts">
import logo from '@/assets/image/logo-4.png';
import type { FormInstance, FormRules } from 'element-plus';
import { loginBMS } from '~/api/authAPI';
import type { LoginForm } from '~/types/authType';
import iconNumberOne from '~/assets/icon/number-one.png';
const ecosystemModules = [
    {
        icon: iconNumberOne,
        title: 'Phần mềm quản lý bán vé',
        showDetail: true,
        route: '/test'
    },
    {
        icon: iconNumberOne,
        title: 'Ứng dụng<br>quản lý tài xế',
        alt: 'Quản lý tài xế',
        showDetail: true,
        route: '/test'
    },
    {
        icon: iconNumberOne,
        title: 'Website/App<br>thương hiệu nhà xe',
        alt: 'Website/App thương hiệu',
        showDetail: false,
    },
    {
        icon: iconNumberOne,
        title: 'Tổng đài<br>bán vé',
        alt: 'Tổng đài bán vé',
        showDetail: false,
    },
    {
        icon: iconNumberOne,
        title: 'Vé/hóa đơn,<br>lệnh vận chuyển điện tử',
        alt: 'Lệnh vận chuyển điện tử',
        showDetail: false,
    },
    {
        icon: iconNumberOne,
        title: 'Tin nhắn<br>SMS/ZNS',
        alt: 'SMS/ZNS',
        showDetail: false,
    },
    {
        icon: iconNumberOne,
        title: 'Phần mềm quản lý<br>đại lý bán vé',
        alt: 'Quản lý đại lý',
        showDetail: false,
        extraClass: 'col-span-1 sm:col-span-2 md:col-span-1',
    },
];
function goToDetail(item: { route?: string }) {
    if (item.route) window.open(item.route, '_blank')
}
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<LoginForm>({
    username: '',
    password: ''
})
const rules = ref<FormRules<LoginForm>>({
    username: [
        { required: true, message: 'Vui lòng nhập tên đăng nhập', trigger: 'blur' },
        { min: 3, message: 'Tên đăng nhập không hợp lệ', trigger: 'blur' }
    ],
    password: [
        { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' },
        { min: 6, message: 'Mật khẩu không hợp lệ', trigger: 'blur' }
    ]
})
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            console.log('submit!')
            console.log('ruleForm', ruleForm)
            try {
                const response = await loginBMS(ruleForm)
                if (response.success) {
                    console.log('Login success:', response.result)
                    // Ví dụ: chuyển trang, lưu token,...
                } else {
                    console.log('Login failed:', response.message)
                    // Hiển thị lỗi backend trả về
                }
            } catch (error) {
                console.error('API error:', error)
                // Hiển thị lỗi mạng hoặc lỗi khác
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}
</script>
<template>
    <el-row>
        <el-col :span="6"
            class="min-h-screen flex flex-col items-center bg-white shadow-2xl shadow-blue-100 border-r border-blue-100 z-20">
            <div class="w-full max-w-sm mx-auto my-auto px-5 flex flex-col justify-center h-full">
                <div>
                    <div class="pb-5">
                        <img :src="logo" alt="Logo" class="w-[280px] m-auto" />
                    </div>
                    <div class="text-center text-[16px] font-semibold text-[#0072bc] tracking-wide">
                        Chúc bạn có một ngày làm việc hiệu quả!
                    </div>
                    <div class="mt-10">
                        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto">
                            <el-form-item label-position="top" prop="username">
                                <template #label>
                                    <span class="text-sm font-semibold tracking-wide">Tên đăng nhập</span>
                                </template>
                                <el-input v-model="ruleForm.username" type="text" placeholder="Nhập tên đăng nhập"
                                    size="large" />
                            </el-form-item>
                            <el-form-item label-position="top" prop="password">
                                <template #label>
                                    <span class="text-sm font-semibold tracking-wide">Mật khẩu</span>
                                </template>
                                <el-input v-model="ruleForm.password" type="password" placeholder="Nhập mật khẩu"
                                    size="large" />
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" class="w-full mt-5" size="large"
                                    @click="submitForm(ruleFormRef)">
                                    <span class="text-base font-semibold tracking-wide">Đăng nhập</span>
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </div>

                    <div class="mt-5 text-center">
                        <span class="text-[12px] italic text-[#0a2e5c] font-regular tracking-wider">
                            Liên hệ Hotline: 0877 71 7575 nếu gặp sự cố đăng nhập
                        </span>
                    </div>
                </div>
            </div>
        </el-col>

        <el-col :span="18"
            class="relative  flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 overflow-hidden">
            <!-- Overlay hình nền mờ (có thể thay bằng hình phù hợp) -->
            <div
                class="absolute inset-0 opacity-10 bg-[url('/static/ecosystem-bg.jpg')] bg-cover bg-center pointer-events-none">
            </div>
            <!-- Nội dung hệ sinh thái -->
            <div class="relative z-10 w-full max-w-5xl mx-auto px-6 py-16">
                <h2 class="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6 text-center drop-shadow-lg">
                    Hệ sinh thái phần mềm nhà xe VinaHome
                </h2>
                <p class="text-lg md:text-xl text-blue-800 mb-12 text-center font-medium">
                    VinaHome cung cấp giải pháp toàn diện cho doanh nghiệp vận tải:
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    <div v-for="(item, idx) in ecosystemModules" :key="idx" :class="[
                        'group flex flex-col items-center bg-white/80 rounded-xl shadow-lg p-6 hover:scale-105 transition relative',
                        item.showDetail ? 'pt-6 pb-10' : '',
                        item.extraClass || ''
                    ]">
                        <img :src="item.icon" class="w-16 h-16 mb-3" :alt="item.title" />
                        <span class="font-semibold text-blue-900 text-center" v-html="item.title"></span>
                        <button 
                            v-if="item.showDetail"
                            class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            @click="goToDetail(item)"
                        >
                            Xem chi tiết
                        </button>
                    </div>
                </div>
                <div class="mt-12 text-center">
                    <span class="text-lg md:text-xl text-blue-700 font-semibold tracking-wide">
                        Tối ưu vận hành - Nâng tầm thương hiệu - Kết nối khách hàng
                    </span>
                </div>
            </div>
        </el-col>
    </el-row>
</template>