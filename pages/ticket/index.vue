<script setup lang="ts">
import Calendar from '~/components/widgets/Calendar.vue';
import {
  ArrowUpBold, ArrowRightBold
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
import { getListTicketsByTrip } from '~/api/ticketAPI';
import type { TicketType } from '~/types/ticketType';

const companyStore = useCompanyStore();
const routeNames = ref<DTO_RP_ListRouteName[]>([]);
const loadingListRouteName = ref(false);
const loadingListTrip = ref(false);
const tripList = ref<TripType[]>([]);
const selectedTrip = ref<TripType | null>(null);
const ticketList = ref<TicketType[]>([]);
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
function handleTripSelected(trip: TripType) {
  console.log('Trip được chọn:', trip);
  selectedTrip.value = trip;
  activeTab.value = '';
}

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
const handleClickTabs = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
  console.log('Tab được click:', tab.props.name);
  if (tab.props.name === '1') {
    console.log('Sơ đồ ghế tab được chọn');
    fetchListTicketByTrip(selectedTrip.value?.id || 0);
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

// Seat map functions
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





const selectedTickets = ref<TicketType[]>([]);
const handleTicketClick = (ticket: TicketType) => {
  const index = selectedTickets.value.findIndex(t => t.id === ticket.id);

  if (index === -1) {
    // Nếu chưa có trong danh sách, thêm vào
    selectedTickets.value.push(ticket);
  } else {
    // Nếu đã có, thì bỏ chọn (xóa khỏi danh sách)
    selectedTickets.value.splice(index, 1);
  }

  console.log('Danh sách vé được chọn:', selectedTickets.value);
};
const isTicketSelected = (ticket: TicketType) => {
  return selectedTickets.value.some(t => t.id === ticket.id);
};


watch([valueSelectedDate, valueSelectedRoute], ([newDate, newRoute], [oldDate, oldRoute]) => {
  console.log('Ngày:', oldDate, '=>', newDate);
  console.log('Tuyến:', oldRoute, '=>', newRoute);
  fetchListTripByRouteAndDate(newDate, newRoute, companyStore.id);
  selectedTrip.value = null;
});

onMounted(() => {
  companyStore.loadCompanyStore();
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
                                :onClick="() => handleTicketClick(seat)" :isSelected="isTicketSelected(seat)"/>
                            </div>
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