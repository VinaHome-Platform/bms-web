<script setup lang="ts">
const value = ref('')

const options = [
    {
        value: 'Option1',
        label: 'Option1',
    },
    {
        value: 'Option2',
        label: 'Option2',
    },
    {
        value: 'Option3',
        label: 'Option3',
    },
    {
        value: 'Option4',
        label: 'Option4',
    },
    {
        value: 'Option5',
        label: 'Option5',
    },

]
const emit = defineEmits(['logout', 'start'])
const handleLogout = () => emit('logout')
const handleStart = () => emit('start', value.value)
</script>
<template>
    <div class="bg-white w-full max-w-lg space-y-4 mb-10">
      <div class="text-center">
        <h2 class="text-xl font-semibold text-blue-800">Xin chào,</h2>
        <p class="text-xl font-bold text-blue-900 mt-1">Đặng Tuấn Thành</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-blue-700 mb-1">Chọn văn phòng</label>
        <el-select
          v-model="value"
          placeholder="Chọn văn phòng"
          size="large"
          class="w-full"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>

      <div class="flex justify-between gap-4 pt-4">
        <el-button size="large" class="flex-1" @click="handleLogout">Đăng xuất</el-button>
        <el-button type="primary" size="large" class="flex-1" @click="handleStart">
          Bắt đầu làm việc
        </el-button>
      </div>
    </div>
</template>
