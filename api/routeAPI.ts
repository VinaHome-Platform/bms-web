import type { DTO_RP_ListRouteName, RouteType } from "~/types/routeType";
import type { ApiResponse } from "./APIResponse";

export const createRoute = async (data: RouteType): Promise<ApiResponse<RouteType>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie('access_token');
  try {
    return await $fetch<ApiResponse<RouteType>>(`${apiGateWay}/v2/route/create-route`, {
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

export const updateRoute = async (id: number, data: RouteType): Promise<ApiResponse<RouteType>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie('access_token');
  try {
    return await $fetch<ApiResponse<RouteType>>(`${apiGateWay}/v2/route/update-route/${id}`, {
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

export const deleteRoute = async (id: number): Promise<ApiResponse<void>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie('access_token');
  try {
    return await $fetch<ApiResponse<void>>(`${apiGateWay}/v2/route/delete-route/${id}`, {
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

export const getListRouteByCompany = async (companyId: number): Promise<ApiResponse<RouteType[]>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie('access_token');
  try {
    return await $fetch<ApiResponse<RouteType[]>>(`${apiGateWay}/v2/route/get-list-route-by-company/${companyId}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${cookie.value}`
      }
    });
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

export const updateRouteOrder = async (data: { route_id: number; display_order: number, company_id: number }): Promise<ApiResponse<RouteType>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie('access_token');
  try {
    return await $fetch<ApiResponse<RouteType>>(`${apiGateWay}/v2/route/update-route-order`, {
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

export const getListRouteNameByCompany = async (id:number): Promise<ApiResponse<DTO_RP_ListRouteName[]>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie('access_token');
  try {
    return await $fetch<ApiResponse<DTO_RP_ListRouteName[]>>(`${apiGateWay}/v2/route/get-list-route-name-by-company/${id}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${cookie.value}`
      }
    });
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

export const getListRouteNameActionByCompany = async (id:number): Promise<ApiResponse<DTO_RP_ListRouteName[]>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie('access_token');
  try {
    return await $fetch<ApiResponse<DTO_RP_ListRouteName[]>>(`${apiGateWay}/v2/route/get-list-route-name-action-by-company/${id}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${cookie.value}`
      }
    });
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}




