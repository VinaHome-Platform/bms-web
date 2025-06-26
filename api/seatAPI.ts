import type { SeatChartType } from "~/types/seatType";
import type { ApiResponse } from "./APIResponse";

export const createSeatChart = async (data: SeatChartType): Promise<ApiResponse<SeatChartType>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie('access_token');
  try {
    return await $fetch<ApiResponse<SeatChartType>>(`${apiGateWay}/v2/seat/create-seat-chart`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${cookie.value}`,
      },
      body: data
    });
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}