import type { AgentNameType, AgentType } from "~/types/agentType";
import type { ApiResponse } from "./APIResponse";

export const createAgent = async (
  data: AgentType
): Promise<ApiResponse<AgentType>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie("access_token");
  try {
    return await $fetch<ApiResponse<AgentType>>(
      `${apiGateWay}/v1/agent/create-agent`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cookie.value}`,
        },
        body: data,
      }
    );
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

export const getListAgentByCompany = async (
  companyId: number
): Promise<ApiResponse<AgentType[]>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie("access_token");
  try {
    return await $fetch<ApiResponse<AgentType[]>>(
      `${apiGateWay}/v1/agent/get-list-agent-by-company/${companyId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookie.value}`,
        },
      }
    );
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

export const getListAgentNameByCompany = async (
  companyId: number
): Promise<ApiResponse<AgentNameType[]>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie("access_token");
  try {
    return await $fetch<ApiResponse<AgentNameType[]>>(
      `${apiGateWay}/v1/agent/get-list-agent-name-by-company/${companyId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookie.value}`,
        },
      }
    );
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
}

export const updateAgent = async (
  id: string,
  data: AgentType
): Promise<ApiResponse<AgentType>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie("access_token");
  try {
    return await $fetch<ApiResponse<AgentType>>(
      `${apiGateWay}/v1/agent/update-agent/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${cookie.value}`,
        },
        body: data,
      }
    );
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};

export const deleteAgent = async (
  id: string
): Promise<ApiResponse<void>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  const cookie = useCookie("access_token");
  try {
    return await $fetch<ApiResponse<void>>(
      `${apiGateWay}/v1/agent/delete-agent/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${cookie.value}`,
        },
      }
    );
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};
