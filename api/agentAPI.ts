import type { AgentType } from "~/types/agentType";
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
