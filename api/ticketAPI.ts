import type { TicketType } from "~/types/ticketType";
import type { ApiResponse } from "./APIResponse";

export const getListTicketsByTrip = async (
  id: number
): Promise<ApiResponse<TicketType[]>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie("access_token");
  try {
    return await $fetch<ApiResponse<TicketType[]>>(
      `${apiGateWay}/v2/ticket/get-list-tickets-by-trip/${id}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookie.value}`,
        }
      }
    );
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
