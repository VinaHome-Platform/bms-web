import type { EmployeeType } from "~/types/employeeType";
import type { ApiResponse } from "./APIResponse";

export const createEmployee = async (data: EmployeeType): Promise<ApiResponse<EmployeeType>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie('access_token');
  try {
    return await $fetch<ApiResponse<EmployeeType>>(`${apiGateWay}/v2/employee/create-employee`, {
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

export const updateEmployee = async (id: number, data: EmployeeType): Promise<ApiResponse<EmployeeType>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie('access_token');
  try {
    return await $fetch<ApiResponse<EmployeeType>>(`${apiGateWay}/v2/employee/update-employee/${id}`, {
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

export const deleteEmployee = async (id: number): Promise<ApiResponse<void>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie('access_token');
  try {
    return await $fetch<ApiResponse<void>>(`${apiGateWay}/v2/employee/delete-employee/${id}`, {
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

export const getListEmployeeByCompany = async (companyId: number): Promise<ApiResponse<EmployeeType[]>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie('access_token');
  try {
    return await $fetch<ApiResponse<EmployeeType[]>>(`${apiGateWay}/v2/employee/get-list-employee-by-company/${companyId}`, {
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