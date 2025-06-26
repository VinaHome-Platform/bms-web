<template>
  <div class="">
    <!-- Display Mode -->
    <div 
      v-if="!isEditing"
      @click="startEditing"
      class="w-[150px] flex items-center gap-2 px-2 cursor-pointer hover:bg-yellow-50 hover:border-yellow-300 border border-transparent rounded-lg transition-all duration-200 group"
    >
      <el-icon 
        color="#E6A23C" 
        class="group-hover:!text-yellow-700 transition-colors"
      >
        <InfoFilled />
      </el-icon>
      <span class="text-gray-700 group-hover:text-yellow-700 transition-colors select-none text-[14px]">
        {{ savedNote || 'Thêm ghi chú' }}
      </span>
    </div>

    <!-- Edit Mode -->
    <div 
      v-else
      class="flex items-center gap-2 p-1 border border-yellow-300 rounded-lg bg-yellow-50"
    >
      <el-icon color="#E6A23C" class="flex-shrink-0">
        <InfoFilled />
      </el-icon>
      
      <el-input
        ref="inputRef"
        v-model="noteText"
        placeholder="Nhập ghi chú..."
        size="small"
        class="flex-1"
        @keydown.enter="saveNote"
        @keydown.esc="cancelEdit"
      />
      
      <el-button
        type="success"
        size="small"
        circle
        @click="saveNote"
        class="!w-8 !h-8 !min-w-8"
      >
        <el-icon><Check /></el-icon>
      </el-button>
      
      <el-button
        type="danger"
        size="small"
        circle
        @click="cancelEdit"
        class="!w-8 !h-8 !min-w-8"
      >
        <el-icon><Close /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { InfoFilled, Check, Close } from '@element-plus/icons-vue'

const isEditing = ref(false)
const noteText = ref('')
const savedNote = ref('')
const inputRef = ref()

const startEditing = () => {
  noteText.value = savedNote.value
  isEditing.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const saveNote = () => {
  savedNote.value = noteText.value.trim()
  isEditing.value = false
}

const cancelEdit = () => {
  noteText.value = savedNote.value
  isEditing.value = false
}
</script>

<style scoped>
/* Custom styles để override Element Plus khi cần */
:deep(.el-input__wrapper) {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important;
}

:deep(.el-button.is-circle) {
  border: none !important;
}

/* Đảm bảo icon color được áp dụng đúng */
:deep(.el-icon) {
  transition: color 0.2s ease;
}
</style>