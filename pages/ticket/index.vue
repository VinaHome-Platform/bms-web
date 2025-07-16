<script setup lang="ts">
import Calendar from '~/components/widgets/Calendar.vue';
import {
  ArrowUpBold, ArrowRightBold, CloseBold, Delete, Rank, Edit
} from '@element-plus/icons-vue'
import type { CollapseModelValue, TabsPaneContext } from 'element-plus'
import TicketItem from '~/components/widgets/TicketItem.vue';
import InputNote from '~/components/inputs/inputNote.vue'
import TripList from '~/components/widgets/TripList.vue'
import { getListRouteNameActionByCompany } from '~/api/routeAPI';
import type { DTO_RP_ListRouteName } from '~/types/routeType';
import { getListTripByRouteAndDate } from '~/api/tripAPI';
import { startOfDay, format } from 'date-fns';
import type { TripType } from '~/types/tripType';
import { cancelTickets, getListTicketsByTrip, updateTickets } from '~/api/ticketAPI';
import type { CancelTicketType, TicketPayloadUpdate, TicketType } from '~/types/ticketType';
import { useFirebase } from '~/composables/useFirebase';
import { get, remove, update } from 'firebase/database';
import EditTicketDialog from '~/components/widgets/EditTicketDialog.vue';

const { db, ref: dbRef, set, onValue, off } = useFirebase()

const companyStore = useCompanyStore();
const authStore = useAuthStore();
const officeStore = useOfficeStore();
const routeNames = ref<DTO_RP_ListRouteName[]>([]);
const loadingListRouteName = ref(false);
const loadingListTrip = ref(false);
const tripList = ref<TripType[]>([]);
const selectedTrip = ref<TripType | null>(null);
const selectedTickets = ref<TicketType[]>([]);
const ticketList = ref<TicketType[]>([]);
const getFloorSeats = (floor: number) => {
  const floorTickets = ticketList.value.filter(ticket => ticket.seat_floor === floor);
  const rows = new Map();

  floorTickets.forEach(ticket => {
    const rowNumber = ticket.seat_row;
    if (!rows.has(rowNumber)) {
      rows.set(rowNumber, []);
    }
    rows.get(rowNumber).push(ticket);
  });

  // Sort rows by row number and seats by column
  const sortedRows = Array.from(rows.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([rowNumber, seats]) => ({
      rowNumber,
      seats: seats.sort((a: TicketType, b: TicketType) => a.seat_column - b.seat_column)
    }));

  return sortedRows;
}

const getAvailableFloors = () => {
  const floors = [...new Set(ticketList.value.map(ticket => ticket.seat_floor))];
  return floors.sort((a, b) => a - b);
}


const fetchListRouteName = async () => {
  loadingListRouteName.value = true;
  try {
    const response = await getListRouteNameActionByCompany(Number(companyStore.id));
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
    loadingListRouteName.value = false;
  }
}
const valueSelectedDate = ref<string | Date | undefined>(undefined);
function handleDateChange(date: Date) {
  console.log('Ngày được chọn:', date)
  valueSelectedDate.value = date;
  console.log('Ngày chọn:', valueSelectedDate.value);
}
const valueSelectedRoute = ref<number | string>('');
function handleRouteChange(id: number) {
  const selectedRoute = routeNames.value.find((r) => r.id === id);
  valueSelectedRoute.value = selectedRoute ? selectedRoute.id : '';
  console.log('Tuyến được chọn:', selectedRoute);
  console.log('ID tuyến:', valueSelectedRoute.value);
}

const fetchListTripByRouteAndDate = async (valueDate: string | Date | undefined, valueRoute: number | string, companyId: number | null) => {
  if (!valueDate || valueDate === '' || valueDate === undefined) {
    ElNotification({
      message: h('p', { style: 'color: teal' }, 'Vui lòng chọn ngày!'),
      type: 'warning',
    });
    return;
  }
  if (!valueRoute || valueRoute === '' || valueRoute === undefined) {
    ElNotification({
      message: h('p', { style: 'color: teal' }, 'Vui lòng chọn tuyến!'),
      type: 'warning',
    });
    return;
  }
  const normalizedDate = format(startOfDay(valueDate as Date), 'yyyy-MM-dd');
  console.log('Fetching trips for date:', normalizedDate, 'and route:', valueRoute, 'for company:', companyId);
  loadingListTrip.value = true;
  try {
    const response = await getListTripByRouteAndDate(normalizedDate, Number(valueRoute), companyId);
    if (response.result) {
      console.log('Danh sách chuyến:', response.result);
      tripList.value = response.result;

    } else {
      ElNotification({
        message: h('p', { style: 'color: red' }, 'Không tìm thấy chuyến nào!'),
        type: 'warning',
      });
      tripList.value = [];
    }
  } catch (error) {
    console.error('Error fetching trips:', error);
    ElNotification({
      message: h('p', { style: 'color: red' }, 'Đã xảy ra lỗi khi tải danh sách chuyến!'),
      type: 'error',
    });
    tripList.value = [];
  } finally {
    loadingListTrip.value = false;
  }
};

const activeNames = ref(['1'])
const activeTab = ref('1');


const handleChange = (val: CollapseModelValue) => {
  console.log(val)
}
const loadingListTicket = ref(false);
const fetchListTicketByTrip = async (id: number) => {
  console.log('Fetching tickets for trip ID:', id);
  loadingListTicket.value = true;
  try {
    const response = await getListTicketsByTrip(id);
    if (response.result) {
      console.log('Danh sách vé:', response.result);
      ticketList.value = response.result;
    } else {
      ElNotification({
        message: h('p', { style: 'color: red' }, 'Không tìm thấy vé nào!'),
        type: 'warning',
      });
    }
  } catch (error) {
    console.error('Error fetching tickets:', error);
    ElNotification({
      message: h('p', { style: 'color: red' }, 'Đã xảy ra lỗi khi tải danh sách vé!'),
      type: 'error',
    });
  } finally {
    loadingListTicket.value = false;
  }
};






async function handleTripSelected(trip: TripType) {
  console.log('Trip được chọn:', trip);


  // Cập nhật sang trip mới
  selectedTrip.value = trip;
  activeTab.value = '';
  selectedTickets.value = [];
}


const handleTicketClick = async (ticket: TicketType) => {
  if (!selectedTrip.value?.id || !authStore.full_name) return;

  const tripId = selectedTrip.value.id;
  const ticketPath = `selectedTickets/${tripId}/${ticket.id}`;
  const currentUser = authStore.full_name;

  // Lấy danh sách vé ĐÃ CHỌN bởi user hiện tại
  const userSelectedTickets = selectedTickets.value.filter(
    t => t.selectedBy === currentUser
  );
  const index = userSelectedTickets.findIndex(t => t.id === ticket.id);

  try {
    if (index === -1) {
      // 🔹 1. Nếu vé đang chọn là vé KHÔNG CÓ SỐ ĐIỆN THOẠI (hoặc chưa đặt)
      if (!ticket.booked_status || !ticket.ticket_phone?.trim()) {
        // Kiểm tra xem user có đang chọn vé CÓ SỐ ĐIỆN THOẠI không
        const hasBookedTicketWithPhone = userSelectedTickets.some(
          t => t.booked_status && t.ticket_phone?.trim()
        );

        // Nếu có => BỎ CHỌN TẤT CẢ VÉ CÓ SỐ ĐIỆN THOẠI trước khi chọn vé mới
        if (hasBookedTicketWithPhone) {
          for (const selectedTicket of userSelectedTickets) {
            if (selectedTicket.booked_status && selectedTicket.ticket_phone?.trim()) {
              await remove(dbRef(db, `selectedTickets/${tripId}/${selectedTicket.id}`));
            }
          }
        }

        // Cho phép chọn vé KHÔNG CÓ SỐ ĐIỆN THOẠI (không giới hạn số lượng)
        await set(dbRef(db, ticketPath), currentUser);
      }
      // 🔹 2. Nếu vé đang chọn là vé CÓ SỐ ĐIỆN THOẠI (đã đặt)
      else {
        // Kiểm tra xem user có đang chọn vé KHÔNG CÓ SỐ ĐIỆN THOẠI không
        const hasUnbookedTicket = userSelectedTickets.some(
          t => !t.booked_status || !t.ticket_phone?.trim()
        );

        // Nếu có => BỎ CHỌN TẤT CẢ VÉ CŨ (cả vé không số ĐT và vé có số ĐT khác)
        if (hasUnbookedTicket) {
          for (const selectedTicket of userSelectedTickets) {
            await remove(dbRef(db, `selectedTickets/${tripId}/${selectedTicket.id}`));
          }
        }

        // Chọn vé hiện tại (có số điện thoại)
        await set(dbRef(db, ticketPath), currentUser);

        // Tự động chọn các vé CÙNG SỐ ĐIỆN THOẠI (nếu có)
        const ticketsToAutoSelect = ticketList.value.filter(t =>
          t.ticket_phone === ticket.ticket_phone &&
          t.id !== ticket.id &&
          t.booked_status === true &&
          !selectedTickets.value.some(selected => selected.id === t.id)
        );

        for (const relatedTicket of ticketsToAutoSelect) {
          await set(dbRef(db, `selectedTickets/${tripId}/${relatedTicket.id}`), currentUser);
        }
      }
    } else {
      // 🔹 3. Nếu đang BỎ CHỌN vé (chỉ xóa nếu vé thuộc về user hiện tại)
      const ticketToRemove = selectedTickets.value.find(t => t.id === ticket.id);
      if (ticketToRemove?.selectedBy === currentUser) {
        await remove(dbRef(db, ticketPath));
      }
    }
  } catch (error) {
    console.error('Lỗi cập nhật Firebase:', error);
  }
};
const isTicketSelected = (ticket: TicketType) => {
  return selectedTickets.value.some(t => t.id === ticket.id);
};


const setupRealtimeListener = (tripId: number) => {
  // Listener cho vé được chọn
  const ticketRef = dbRef(db, `selectedTickets/${tripId}`);
  onValue(ticketRef, (snapshot) => {
    const data = snapshot.val();
    const selected: TicketType[] = [];

    if (data && ticketList.value.length > 0) {
      for (const [ticketIdStr, userName] of Object.entries(data)) {
        const ticket = ticketList.value.find(t => t.id === Number(ticketIdStr));
        if (ticket) {
          selected.push({
            ...ticket,
            selectedBy: typeof userName === 'string' ? userName : undefined
          });
        }
      }
    }
    selectedTickets.value = selected;
  });

  // Listener cho thông tin vé
  onValue(dbRef(db, `tickets/${tripId}`), (snapshot) => {
    const updatedTickets = snapshot.val();
    if (!updatedTickets) return;

    // Cập nhật danh sách vé local
    ticketList.value = ticketList.value.map(ticket => {
      const updatedData = updatedTickets[ticket.id];
      return updatedData ? { ...ticket, ...updatedData } : ticket;
    });

    console.log("🔄 Đã cập nhật vé từ Firebase");
  });
};
const syncTicketsToFirebase = async (tripId: number, ticketIds: number[], updatedFields: Partial<TicketType>) => {
  try {
    const updates: Record<string, unknown> = {};
    const timestamp = Date.now();

    // Loại bỏ các giá trị undefined
    const sanitizedFields = Object.fromEntries(
      Object.entries(updatedFields).filter(([_, v]) => v !== undefined)
    );

    ticketIds.forEach(ticketId => {
      updates[`tickets/${tripId}/${ticketId}`] = {
        ...sanitizedFields, // Sử dụng object đã được làm sạch
        updatedAt: timestamp,
        updatedBy: authStore.full_name || 'unknown'
      };
    });

    await update(dbRef(db), updates);
  } catch (error) {
    console.error('Lỗi đồng bộ Firebase:', error);
  }
};

const handleClickTabs = async (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
  console.log('Tab được click:', tab.props.name);
  if (tab.props.name === '1') {
    console.log('Sơ đồ ghế tab được chọn');
    if (selectedTrip.value?.id) {
      // 1. Gọi API lấy danh sách vé
      await fetchListTicketByTrip(selectedTrip.value.id);
      await remove(dbRef(db, `selectedTickets/${selectedTrip.value.id}`));

      // 2. Ép cập nhật lại selectedTickets từ Firebase
      setupRealtimeListener(selectedTrip.value.id);
    }
  } else if (tab.props.name === '2') {
    console.log('Hành khách tab được chọn');
  } else if (tab.props.name === '3') {
    console.log('Trung chuyển tab được chọn');
  } else if (tab.props.name === '4') {
    console.log('Hàng hóa tab được chọn');
  } else if (tab.props.name === '5') {
    console.log('Thu chi chuyến tab được chọn');
  }
}
const getTicketSelector = (ticket: TicketType) => {
  const found = selectedTickets.value.find(t => t.id === ticket.id);
  return found?.selectedBy || null;
};
watch(selectedTrip, async (newTrip, oldTrip) => {
  // Dọn dẹp listener và dữ liệu cũ
  if (oldTrip?.id) {
    await cleanupTripData(oldTrip.id);
  }

  // Thiết lập listener mới
  if (newTrip?.id) {
    setupRealtimeListener(newTrip.id);
  }
});
const cleanupTripData = async (tripId: number) => {
  try {
    // 1. Hủy tất cả listeners
    off(dbRef(db, `selectedTickets/${tripId}`));
    off(dbRef(db, `tickets/${tripId}`));

    // 2. Xóa các vé đang chọn của user hiện tại
    const cleanupPromises: Promise<void>[] = [];

    // a. Xóa selectedTickets
    const selectedTicketsSnapshot = await get(dbRef(db, `selectedTickets/${tripId}`));
    if (selectedTicketsSnapshot.exists()) {
      const selectedUpdates: Record<string, null> = {};
      Object.entries(selectedTicketsSnapshot.val()).forEach(([ticketId, userName]) => {
        if (userName === authStore.full_name) {
          selectedUpdates[`selectedTickets/${tripId}/${ticketId}`] = null;
        }
      });

      if (Object.keys(selectedUpdates).length > 0) {
        cleanupPromises.push(update(dbRef(db), selectedUpdates));
      }
    }

    // b. Xóa tickets cũ (chỉ xóa những vé do user hiện tại cập nhật)
    const ticketsSnapshot = await get(dbRef(db, `tickets/${tripId}`));
    if (ticketsSnapshot.exists()) {
      const ticketUpdates: Record<string, null> = {};
      Object.entries(ticketsSnapshot.val()).forEach(([ticketId, ticketData]) => {
        const data = ticketData as { updatedBy?: string };
        if (data.updatedBy === authStore.full_name) {
          ticketUpdates[`tickets/${tripId}/${ticketId}`] = null;
        }
      });

      if (Object.keys(ticketUpdates).length > 0) {
        cleanupPromises.push(update(dbRef(db), ticketUpdates));
      }
    }

    // Thực hiện tất cả các thao tác xóa cùng lúc
    await Promise.all(cleanupPromises);

    console.log(`✅ Đã dọn dẹp toàn bộ dữ liệu cho chuyến ${tripId}`);
  } catch (error) {
    console.error(`❌ Lỗi khi dọn dẹp chuyến ${tripId}:`, error);
    throw error; // Ném lỗi để bên gọi có thể xử lý
  }
};
const mySelectedTickets = computed(() => {
  return selectedTickets.value.filter(
    t => t.selectedBy === authStore.full_name
  );
});



async function clearAllSelectedTickets() {
  if (!selectedTrip.value?.id) return;

  const tripId = selectedTrip.value.id;

  // Lấy danh sách vé đang được chọn bởi user hiện tại
  const myTickets = selectedTickets.value.filter(t => t.selectedBy === authStore.full_name);

  try {
    // Xóa từng vé khỏi Firebase
    for (const ticket of myTickets) {
      await remove(dbRef(db, `selectedTickets/${tripId}/${ticket.id}`));
    }

    // Cập nhật local state
    selectedTickets.value = selectedTickets.value.filter(
      t => t.selectedBy !== authStore.full_name
    );
  } catch (error) {
    console.error('Lỗi khi bỏ chọn vé khỏi Firebase:', error);
    ElNotification({
      message: h('p', { style: 'color: red' }, 'Đã xảy ra lỗi khi bỏ chọn vé!'),
      type: 'error',
    });
  }
}


const dialogFormEditTicket = ref(false)
const handleOpenFormEditTicket = () => {
  dialogFormEditTicket.value = true;
}
const updatingTicketIds = ref<Set<number>>(new Set());
const loadingItemTicket = ref(false);
// [FEAT]: Update ticket
const handleUpdateTickets = async (tickets: TicketPayloadUpdate) => {
  console.log('Cập nhật vé:', tickets);
  loadingItemTicket.value = true;
  tickets.id.forEach(id => updatingTicketIds.value.add(id));
  try {
    const response = await updateTickets(tickets);
    if (response.result) {

      const updatedIds = new Set(tickets.id);
      const { id, ...rest } = tickets;

      ticketList.value = ticketList.value.map(ticket => {
        if (updatedIds.has(ticket.id)) {
          return { ...ticket, ...rest, booked_status: true };
        }
        return ticket;
      });

      if (selectedTrip.value?.id) {
        const { id, ...ticketFields } = tickets;
        await syncTicketsToFirebase(
          selectedTrip.value!.id,
          tickets.id,
          { ...ticketFields, booked_status: true }
        );
      }
      ElNotification({
        message: h('p', { style: 'color: green' }, 'Cập nhật vé thành công!'),
        type: 'success',
      });
    } else {
      ElNotification({
        message: h('p', { style: 'color: red' }, 'Cập nhật vé thất bại!'),
        type: 'error',
      });
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật vé:', error);
    ElNotification({
      message: h('p', { style: 'color: red' }, 'Đã xảy ra lỗi khi cập nhật vé!'),
      type: 'error',
    });
  } finally {
    loadingItemTicket.value = false;
    updatingTicketIds.value.clear();
  }
};

// [FEAT]: Cancel ticket
const handleCancelTickets = async (tickets: CancelTicketType) => {
  console.log('Hủy vé:', tickets);

  // Validate input
  if (!tickets || !tickets.id || !Array.isArray(tickets.id) || tickets.id.length === 0) {
    console.error('Invalid tickets data:', tickets);
    ElNotification({
      message: h('p', { style: 'color: red' }, 'Dữ liệu vé không hợp lệ!'),
      type: 'error',
    });
    return;
  }

  loadingItemTicket.value = true;

  // Add ticket IDs to updating set
  tickets.id.forEach(id => updatingTicketIds.value.add(id));

  try {
    const response = await cancelTickets(tickets);
    if (response.result) {
      ticketList.value = ticketList.value.map(ticket => {
        if (tickets.id.includes(ticket.id)) {
          return {
            ...ticket,
            ticket_phone: ticket.ticket_phone || '',
            ticket_email: ticket.ticket_email || '',
            ticket_customer_name: ticket.ticket_customer_name || '',
            ticket_point_up: ticket.ticket_point_up || '',
            ticket_point_down: ticket.ticket_point_down || '',
            ticket_note: ticket.ticket_note || '',
            ticket_display_price: ticket.ticket_display_price || 0,
            booked_status: false,
          };
        }
        return ticket;
      });

      // Clear selected tickets that were cancelled
      if (selectedTrip.value?.id) {
        const ticketsToSync = ticketList.value.filter(ticket => tickets.id.includes(ticket.id));
        await syncTicketsToFirebase(
          selectedTrip.value!.id,
          tickets.id,
          {
            ticket_phone: '',
            ticket_email: '',
            ticket_customer_name: '',
            ticket_point_up: '',
            ticket_point_down: '',
            ticket_note: '',
            ticket_display_price: ticketsToSync[0]?.ticket_display_price || 0,
            booked_status: false,
          }
        );
        const tripId = selectedTrip.value.id;
        for (const ticketId of tickets.id) {
          await remove(dbRef(db, `selectedTickets/${tripId}/${ticketId}`));
          await remove(dbRef(db, `tickets/${tripId}/${ticketId}`));
        }
        
      }

      ElNotification({
        message: h('p', { style: 'color: green' }, 'Hủy vé thành công!'),
        type: 'success',
      });
    } else {
      ElNotification({
        message: h('p', { style: 'color: red' }, 'Hủy vé thất bại!'),
        type: 'error',
      });
    }
  } catch (error) {
    console.error('Lỗi khi hủy vé:', error);
    ElNotification({
      message: h('p', { style: 'color: red' }, 'Đã xảy ra lỗi khi hủy vé!'),
      type: 'error',
    });
  } finally {
    loadingItemTicket.value = false;
    updatingTicketIds.value.clear();
  }
};


const isTicketUpdating = (ticketId: number) => {
  return updatingTicketIds.value.has(ticketId);
};
watch([valueSelectedDate, valueSelectedRoute], ([newDate, newRoute], [oldDate, oldRoute]) => {
  console.log('Ngày:', oldDate, '=>', newDate);
  console.log('Tuyến:', oldRoute, '=>', newRoute);
  fetchListTripByRouteAndDate(newDate, newRoute, companyStore.id);
  selectedTrip.value = null;
});

onMounted(() => {
  authStore.loadUserInfo();
  companyStore.loadCompanyStore();
  officeStore.loadOfficeStore();
  fetchListRouteName();
});
</script>

<template>
  <section>
    <el-container>
      <el-aside width="20%" class="">
        <div>
          <el-select v-model="valueSelectedRoute" placeholder="Chọn tuyến" @change="handleRouteChange">
            <el-option v-for="item in routeNames" :key="item.id" :label="item.route_name" :value="item.id" />
          </el-select>
        </div>
        <div class="mt-2">
          <Calendar v-model="valueSelectedDate" @change="handleDateChange" />
        </div>

        <div class="mt-2">
          <TripList :loading="loadingListTrip" :trips="tripList" @trip-selected="handleTripSelected" />
        </div>

      </el-aside>
      <el-container>
        <el-header>
          <section v-if="selectedTrip">
            <div class="bg-white px-2 rounded-lg shadow-md">
              <el-collapse v-model="activeNames" @change="handleChange">
                <el-collapse-item name="1">
                  <template #title>
                    <span class="text-[16px] font-semibold">
                      {{ selectedTrip.departure_time?.substring(0, 5) }} •
                      {{ format(new Date(valueSelectedDate as Date), 'dd/MM/yyyy') }} •
                      {{routeNames.find(r => r.id === valueSelectedRoute)?.route_name || 'Tuyến chưa xác định'}}
                    </span>
                  </template>
                  <template #icon="{ isActive }">
                    <span class="flex items-center justify-center">
                      <span class="flex items-center gap-1 text-[#0072bc]">
                        {{ isActive ? 'Thu gọn' : 'Xem thông tin chuyến' }}
                        <el-icon>
                          <component :is="isActive ? ArrowUpBold : ArrowRightBold" />
                        </el-icon>
                      </span>
                    </span>
                  </template>


                  <el-row>
                    <el-col :span="8">
                      <div>
                        <span class="font-medium text-black text-[14px]">Biển số: </span>
                        <span class="font-medium text-[#0072bc] text-[14px]">50F-003.58</span>
                      </div>
                      <div>
                        <span class="font-medium text-black text-[14px]">Số điện thoại xe: </span>
                        <span class="font-medium text-[#0072bc] text-[14px]">0877717575</span>
                      </div>
                      <div>
                        <span class="font-medium text-black text-[14px]">Sơ đồ ghế: </span>
                        <span class="font-medium text-[#0072bc] text-[14px]">{{ selectedTrip.seat_chart_name }}</span>
                      </div>
                      <div>
                        <span class="font-medium text-black text-[14px]">Khởi hành: </span>
                        <span class="font-medium text-[#0072bc] text-[14px]">{{
                          selectedTrip.departure_time?.substring(0,
                            5) }} - {{
                            format(new Date(selectedTrip.departure_date as Date), 'dd/MM/yyyy') }}</span>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div>
                        <span class="font-medium text-black text-[14px]">Tài xế: </span>
                        <span class="font-medium text-[#0072bc] text-[14px]">Đặng Tuấn Thành</span>
                      </div>
                      <div>
                        <span class="font-medium text-black text-[14px]">Phụ xe: </span>
                        <span class="font-medium text-[#0072bc] text-[14px]">Đặng Tuấn Thành</span>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div>
                        <span class="font-medium text-black text-[14px]">Tổng vé: </span>
                        <span class="font-medium text-[#0072bc] text-[14px]">{{ selectedTrip.tickets_booked }}/{{
                          selectedTrip.total_ticket }}</span>
                      </div>
                      <div>
                        <span class="font-medium text-black text-[14px]">Tiền vé: </span>
                        <span class="font-medium text-[#0072bc] text-[14px]">13.000.000</span>
                      </div>
                      <div>
                        <span class="font-medium text-black text-[14px]">Số hàng: </span>
                        <span class="font-medium text-[#0072bc] text-[14px]">13</span>
                      </div>
                      <div>
                        <span class="font-medium text-black text-[14px]">Tiền hàng: </span>
                        <span class="font-medium text-[#0072bc] text-[14px]">7.000.000</span>
                      </div>
                    </el-col>
                  </el-row>
                  <div>
                    <span class="font-medium text-black text-[14px]">Đặt chỗ: </span>
                    <span class="font-medium text-[#0072bc] text-[14px]">VP An Sương(4), VP Tân Bình(5), Bến xe miền
                      đông(10)</span>
                  </div>

                </el-collapse-item>
              </el-collapse>

              <div class="py-2">
                <InputNote />
              </div>
            </div>


          </section>
          <section v-else>
            <div class="flex justify-center items-center h-full">
              <div class="text-center text-gray-500">
                <div class="text-4xl mb-2">🚌</div>
                <p class="text-lg font-medium">Chưa chọn chuyến</p>
                <p class="text-sm">Vui lòng chọn một chuyến để xem thông tin</p>
              </div>
            </div>
          </section>
          <!-- <div class="flex justify-between items-center">
            <div class="">
              <el-button :icon="Printer">In phơi</el-button>
              <el-button :icon="RefreshLeft">Lịch sử</el-button>
              <el-button :icon="Finished">Xuất bến</el-button>
              <el-button :icon="Delete" type="danger" plain>Huỷ chuyến</el-button>
              <el-button :icon="Timer">Đổi giờ</el-button>
              <el-button :icon="Plus" type="warning" plain>Thêm hàng</el-button>


            </div>
            <div>
              <el-button :icon="RefreshRight" type="info" />
              <el-button :icon="Setting" type="info" />
            </div>
          </div> -->
        </el-header>
        <el-main>
          <section v-if="selectedTrip" class="mt-1">
            <div class="bg-white px-2 rounded-lg ">
              <el-tabs v-model="activeTab" @tab-click="handleClickTabs">
                <el-tab-pane label="Sơ đồ ghế" name="1">
                  <div v-if="loadingListTicket" v-loading="loadingListTicket"
                    element-loading-text="Đang tải danh sách vé..."
                    class="text-center py-8 text-gray-500 min-h-[200px]" />
                  <div v-else>
                    <div class="mb-2">
                      <div class="flex flex-wrap gap-3 justify-center items-start">
                        <div v-for="floor in getAvailableFloors()" :key="`floor-${floor}`" class="flex-1 min-w-[300px]">
                          <div class="flex flex-col gap-1">
                            <div v-for="row in getFloorSeats(floor)" :key="`floor${floor}-row${row.rowNumber}`"
                              class="grid gap-1 w-full"
                              :style="{ gridTemplateColumns: `repeat(${row.seats.length}, 1fr)` }">
                              <TicketItem v-for="seat in row.seats" :key="seat.id" :ticket="seat"
                                :onClick="() => handleTicketClick(seat)" :isSelected="isTicketSelected(seat)"
                                :selectedBy="getTicketSelector(seat)" :isLoading="isTicketUpdating(seat.id)" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div v-if="mySelectedTickets.length > 0"
                      class="fixed bottom-2 left-1/2 transform -translate-x-1/2 w-[90%] max-w-5xl bg-white border border-gray-300 shadow-md transition-transform duration-300 z-50 rounded-xl">
                      <div class="flex items-stretch justify-between gap-4 h-full">
                        <div
                          class="bg-gray-100 px-4 py-2 rounded-l-xl text-sm font-medium text-gray-700 flex items-center justify-center flex-shrink-0">
                          <div class="flex items-center gap-x-2">
                            <el-icon @click="clearAllSelectedTickets"
                              class="cursor-pointer hover:text-red-500 transition">
                              <CloseBold />
                            </el-icon>
                            <span class="text-[16px]">
                              Số vé đang chọn:
                              <span class="text-[#FF9900]">{{ mySelectedTickets.length }}</span>
                            </span>
                          </div>
                        </div>
                        <div
                          class=" px-4 py-3 text-sm text-blue-800 flex-1 flex flex-wrap gap-2 items-center rounded-none overflow-hidden">
                          <el-tag v-for="ticket in mySelectedTickets" :key="ticket.id" type="warning" effect="dark">
                            <span class="text-[15px]">{{ ticket.seat_name }}</span>
                          </el-tag>
                        </div>
                        <div
                          class="bg-purple-50 px-4 py-2 rounded-r-xl flex gap-2 items-center justify-center flex-shrink-0">
                          <div>
                            <el-tooltip content="Cập nhật thông tin vé" placement="top">
                              <el-button type="warning" :icon="Edit" circle @click="handleOpenFormEditTicket" />
                            </el-tooltip>
                          </div>
                          <div v-if="mySelectedTickets.filter(t => t.booked_status === true).length > 0">
                            <el-tooltip content="Di chuyển vé" placement="top">
                              <el-button type="primary" :icon="Rank" circle />
                            </el-tooltip>
                          </div>
                          <div v-if="mySelectedTickets.filter(t => t.booked_status === true).length > 0">
                            <el-tooltip content="Hủy vé" placement="top">
                              <el-button type="danger" :icon="Delete" circle
                                @click="handleCancelTickets({ id: mySelectedTickets.filter(t => t.booked_status === true).map(t => t.id) })" />
                            </el-tooltip>
                          </div>
                        </div>
                      </div>
                    </div>





                  </div>
                </el-tab-pane>
                <el-tab-pane label="Hành khách" name="2">Hành khách</el-tab-pane>
                <el-tab-pane label="Trung chuyển" name="3">Trung chuyển</el-tab-pane>
                <el-tab-pane label="Hàng hóa" name="4">Hàng hóa</el-tab-pane>
                <el-tab-pane label="Thu chi chuyến" name="5">Thu chi chuyến</el-tab-pane>
              </el-tabs>
            </div>
          </section>
        </el-main>
      </el-container>
    </el-container>
    <EditTicketDialog v-model="dialogFormEditTicket" :selected-tickets="mySelectedTickets"
      :user-name="authStore.full_name" :office-name="officeStore.name" @closed="clearAllSelectedTickets"
      @update-tickets="handleUpdateTickets" @cancel-tickets="handleCancelTickets"/>
  </section>

</template>
<style scoped>
.el-header {
  padding: 0px;
  margin-left: 0.25rem;
}

.el-main {
  padding: 0px;
  margin-left: 0.25rem;
}

.icon-ele {
  margin: 0 8px 0 auto;
  color: #409eff;
}

.el-header {
  height: auto !important;
}

.el-collapse {
  border-top: none !important;
}
</style>