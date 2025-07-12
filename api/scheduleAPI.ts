import type { ScheduleType } from "~/types/scheduleType";
import type { ApiResponse } from "./APIResponse";

export const createSchedule = async (data: ScheduleType): Promise<ApiResponse<ScheduleType>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie('access_token');
  try {
    return await $fetch<ApiResponse<ScheduleType>>(`${apiGateWay}/v2/schedule/create-schedule`, {
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

export const getListSchedulesByCompany = async (id: number): Promise<ApiResponse<ScheduleType[]>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie('access_token');
  try {
    return await $fetch<ApiResponse<ScheduleType[]>>(`${apiGateWay}/v2/schedule/get-list-schedules-by-company/${id}`, {
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

export const deleteSchedule = async (id: number): Promise<ApiResponse<void>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie('access_token');
  try {
    return await $fetch<ApiResponse<void>>(`${apiGateWay}/v2/schedule/delete-schedule/${id}`, {
      method: "DELETE",
      headers: {
        'Authorization': `Bearer ${cookie.value}`
      }
    });
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

export const updateSchedule = async (id: number, data: ScheduleType): Promise<ApiResponse<ScheduleType>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie('access_token');
  try {
    return await $fetch<ApiResponse<ScheduleType>>(`${apiGateWay}/v2/schedule/update-schedule/${id}`, {
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