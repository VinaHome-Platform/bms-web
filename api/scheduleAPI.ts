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