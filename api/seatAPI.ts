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

export const getSeatChartByCompany = async (companyId: number): Promise<ApiResponse<SeatChartType[]>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie('access_token');
  try {
    return await $fetch<ApiResponse<SeatChartType[]>>(`${apiGateWay}/v2/seat/get-seat-chart-by-company/${companyId}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${cookie.value}`,
      }
    });
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

export const deleteSeatChart = async (seatChartId: number): Promise<ApiResponse<null>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie('access_token');
  try {
    return await $fetch<ApiResponse<null>>(`${apiGateWay}/v2/seat/delete-seat-chart/${seatChartId}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${cookie.value}`,
      }
    });
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

export const updateSeatChart = async (id: number, data: SeatChartType): Promise<ApiResponse<SeatChartType>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie('access_token');
  try {
    return await $fetch<ApiResponse<SeatChartType>>(`${apiGateWay}/v2/seat/update-seat-chart/${id}`, {
      method: "PUT",
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