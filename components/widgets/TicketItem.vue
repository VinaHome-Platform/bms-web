<script setup lang="ts">
import type { TicketType } from '~/types/ticketType';
import { Location } from '@element-plus/icons-vue';
import { formatCurrencyWithoutSymbol } from '~/lib/formatCurrency';

const { ticket, onClick, isLoading = false } = defineProps<{
    ticket: TicketType;
    onClick: () => void;
    isSelected: boolean;
    selectedBy: string | null;
    isLoading?: boolean;
}>();

function getSeatClass(ticket: TicketType) {
    const baseClass = 'seat-item';
    if (!ticket.seat_status) {
        return `${baseClass} seat-disabled`;
    }
    if (ticket.booked_status) {
        return `${baseClass} seat-booked`;
    }
    return `${baseClass} seat-available`;
}

function handleClick() {
    if (!isLoading) {
        onClick();
    }
}
</script>
<template>
    <div v-loading="isLoading" element-loading-text="Đang cập nhật vé..." :class="[
        'w-full min-h-[90px] border-2 rounded-md font-semibold cursor-pointer transition-all select-none flex flex-col relative',
        getSeatClass(ticket),
        isSelected ? 'border-[#0072bc]' : 'border-gray-300'
    ]" @click="handleClick">
        <!-- Seat name and phone -->
        <div class="flex justify-between">
            <div>
                <span class="mt-2 ml-1 font-semibold text-[#339933] text-base">{{ ticket.seat_name }}</span>
            </div>
            <div v-if="ticket.booked_status">
                <div class="border-1 rounded px-1 border-gray-300 mt-1 mr-1">
                    <span class="font-medium text-black-800">{{ ticket.ticket_phone }}</span>
                </div>
            </div>
        </div>

        <div class="flex-1 relative flex flex-col">
            <div v-if="selectedBy && !isLoading"
                class="absolute inset-0 bg-gray-200 bg-opacity-50 rounded-b flex items-center justify-center z-10">
                <div class="bg-white px-2 py-1 rounded shadow-lg">
                    <span class="text-sm font-semibold text-gray-800">{{ selectedBy }}</span>
                </div>
            </div>

            <div v-if="ticket.booked_status" class="px-1">
                <span class="text-base font-medium text-[15px]">{{ ticket.ticket_customer_name }}</span>
            </div>

            <div v-if="ticket.booked_status" class="px-1">
                <div class="flex items-center gap-1 text-gray-600">
                    <el-icon color="#CC0000">
                        <Location />
                    </el-icon>
                    <span class="text-[14px] font-medium">{{ ticket.ticket_point_up }}</span>
                </div>
                <div class="flex items-center gap-1 text-gray-600">
                    <el-icon color="#0033FF">
                        <Location />
                    </el-icon>
                    <span class="text-[14px] font-medium">{{ ticket.ticket_point_down }}</span>
                </div>
            </div>

            <div v-if="ticket.booked_status" class="flex">
                <span class="ml-auto pr-1 text-[12px] font-medium text-gray-600">({{ ticket.id }})</span>
            </div>

            <div v-if="ticket.booked_status" class="px-1">
                <span class="text-[14px] font-medium text-[#0072bc]">* {{ ticket.ticket_note }}</span>
            </div>

            <div class="mt-auto">
                <div v-if="ticket.booked_status" class="px-1">
                    <div class="flex justify-between items-center text-[14px] font-medium text-gray-600">
                        <span>0/{{ formatCurrencyWithoutSymbol(ticket.ticket_display_price) }}</span>
                        <span>{{ ticket.payment_method }}</span>
                    </div>
                    <div class="h-[5px] bg-[#0072bc] rounded-lg" />
                </div>
                <div v-if="ticket.booked_status" class="px-1">
                    <span class="text-[12px] font-medium text-gray-600">P: {{ ticket.user_created }} /{{ ticket.office_created }}</span>
                </div>
            </div>
        </div>
    </div>
</template>
