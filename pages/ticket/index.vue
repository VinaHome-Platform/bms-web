<script setup lang="ts">
import Calendar from '~/components/widgets/Calendar.vue';
import {
  Printer, RefreshLeft, Finished, Delete, Timer,
  Plus, Setting, RefreshRight, ArrowDownBold, InfoFilled
} from '@element-plus/icons-vue'
import InputNote from '~/components/inputs/inputNote.vue'
import TripList from '~/components/widgets/TripList.vue'
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

const trips = ref([
  { id: 1, name: 'Chuyến A1', time: '07:00', date: '26/06/2025' },
  { id: 2, name: 'Chuyến A2', time: '14:00', date: '26/06/2025' },
  { id: 3, name: 'Chuyến A3', time: '20:00', date: '26/06/2025' },
])
</script>

<template>
  <section>
    <el-container>
      <el-aside width="20%" class="">
        <div>
          <el-select v-model="value" placeholder="Select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="mt-2">
          <Calendar />
        </div>

        <div class="mt-4">
          <TripList/>
        </div>

      </el-aside>
      <el-container>
        <el-header>
          <section>
            <div class="flex justify-between items-center">
              <span class="text-[16px] font-semibold">16:00 • 22/06/2025 • Sài Gòn - Buôn Ma Thuột</span>
              <div>
                <el-button type="warning" link>
                  Xem lộ trình <el-icon class="el-icon--right">
                    <ArrowDownBold />
                  </el-icon>
                </el-button>
                <el-button type="warning" link>
                  Xem thông tin chuyến <el-icon class="el-icon--right">
                    <ArrowDownBold />
                  </el-icon>
                </el-button>
                <el-button type="primary" link>
                  Cập nhật
                </el-button>
              </div>
            </div>
            <div>
              <InputNote />
            </div>
          </section>
          <div class="flex justify-between items-center">
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
          </div>
        </el-header>
        <el-main>Main</el-main>
      </el-container>
    </el-container>

  </section>
</template>
<style scoped>
.el-header {
  background-color: red;
  padding: 0px;
  margin-left: 0.25rem;
}
</style>