<script setup lang="ts">
import logo from '@/assets/image/logo-4.png';
import type { FormInstance, FormRules } from 'element-plus';
import { loginBMS } from '~/api/authAPI';
import type { LoginForm } from '~/types/authType';
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
        <el-col :span="6" class=" min-h-screen flex flex-col items-center">
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
                                <el-input v-model="ruleForm.username" placeholder="Nhập tên đăng nhập" size="large" />
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

        <el-col :span="18" class="bg-blue-500">
            2
        </el-col>
    </el-row>
</template>