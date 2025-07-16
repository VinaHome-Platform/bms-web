import type { CancelTicketType, TicketPayloadUpdate, TicketType } from "~/types/ticketType";
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

export const updateTickets = async (
  data: TicketPayloadUpdate
): Promise<ApiResponse<TicketType[]>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie("access_token");
  try {
    return await $fetch<ApiResponse<TicketType[]>>(
      `${apiGateWay}/v2/ticket/update-tickets`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookie.value}`,
        },
        body: data
      }
    );
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const cancelTickets = async (
  data: CancelTicketType
): Promise<ApiResponse<TicketType[]>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie("access_token");
  try {
    return await $fetch<ApiResponse<TicketType[]>>(
      `${apiGateWay}/v2/ticket/cancel-tickets`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookie.value}`,
        },
        body: data
      }
    );
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

