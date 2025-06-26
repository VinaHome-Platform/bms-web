<template>
  <div class="space-y-3">
    <div 
      v-for="trip in trips" 
      :key="trip.id"
      class="bg-white p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
    >
      <!-- Thanh chỉ báo tỉ lệ lấp đầy -->
      <div 
        class="fill-indicator mb-3"
        :class="getCapacityClass(trip.booked, trip.capacity)"
        :style="{ width: getCapacityPercentage(trip.booked, trip.capacity) + '%' }"
      />
      
      <!-- Hàng trên: Tên chuyến và thông tin đặt chỗ -->
      <div class="flex justify-between items-start mb-2">
        <div class="text-sm font-medium text-gray-700">
          {{ trip.departureTime }}
        </div>
        <div 
          class="text-sm font-medium"
          :class="getBookingStatusClass(trip.booked, trip.capacity)"
        >
          {{ trip.booked }}/{{ trip.capacity }}
        </div>
        
      </div>
      

      
      <!-- Badge trạng thái và tỉ lệ -->
      <div class="mt-2 flex justify-between items-center">
        <span 
          v-if="trip.booked >= trip.capacity" 
          class="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full"
        >
          Đã kín chỗ
        </span>
        <span 
          v-else-if="trip.booked / trip.capacity >= 0.8" 
          class="inline-block px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full"
        >
          Sắp kín chỗ
        </span>
        <span 
          v-else 
          class="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full"
        >
          Còn chỗ trống
        </span>
        
        <div class="text-xs text-gray-500">
          Tỉ lệ: {{ Math.round((trip.booked / trip.capacity) * 100) }}%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Trip {
  id: number
  name: string
  departureTime: string
  departureDate: string
  booked: number
  capacity: number
}

// Props (nếu cần nhận data từ parent component)
interface Props {
  trips?: Trip[]
}

const props = defineProps<Props>()

// Sample data (có thể thay thế bằng API call)
const trips = ref<Trip[]>(props.trips || [
  {
    id: 1,
    name: "HCM - Đà Lạt",
    departureTime: "06:00",
    departureDate: "2024-07-15",
    booked: 30,
    capacity: 36
  },
  {
    id: 2,
    name: "HCM - Nha Trang",
    departureTime: "08:30",
    departureDate: "2024-07-15",
    booked: 25,
    capacity: 40
  },
  {
    id: 3,
    name: "HCM - Vũng Tàu",
    departureTime: "14:00",
    departureDate: "2024-07-16",
    booked: 36,
    capacity: 36
  },
  {
    id: 4,
    name: "HCM - Cần Thơ",
    departureTime: "07:15",
    departureDate: "2024-07-16",
    booked: 12,
    capacity: 45
  },
  {
    id: 5,
    name: "HCM - Phan Thiết",
    departureTime: "09:45",
    departureDate: "2024-07-17",
    booked: 28,
    capacity: 32
  }
])

// Computed hoặc methods
const getCapacityPercentage = (booked: number, capacity: number): number => {
  return Math.min((booked / capacity) * 100, 100)
}

const getCapacityClass = (booked: number, capacity: number): string => {
  const percentage = booked / capacity
  if (percentage >= 1) return 'capacity-full'
  if (percentage >= 0.8) return 'capacity-high'
  if (percentage >= 0.5) return 'capacity-medium'
  return 'capacity-low'
}

const getBookingStatusClass = (booked: number, capacity: number): string => {
  const percentage = booked / capacity
  if (percentage >= 1) return 'text-red-600 font-semibold'
  if (percentage >= 0.8) return 'text-orange-600 font-medium'
  return 'text-green-600'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  return date.toLocaleDateString('vi-VN', options)
}

// Nếu cần fetch data từ API
// const { data: tripsData } = await $fetch('/api/trips')
// trips.value = tripsData
</script>

<style scoped>
.fill-indicator {
  height: 4px;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.capacity-low { 
  background-color: #10b981;
}

.capacity-medium { 
  background-color: #f59e0b;
}

.capacity-high { 
  background-color: #ef4444;
}

.capacity-full { 
  background-color: #6b7280;
}
</style>