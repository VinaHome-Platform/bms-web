/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LoginForm } from "~/types/authType";
import type { ApiResponse } from "./APIResponse";
import type { AccountType } from "~/types/accountType";

export const loginBMS = async (data: LoginForm): Promise<ApiResponse<AccountType>> => {
  const config = useRuntimeConfig();
  const apiGateWay = config.public.apiGateWay;
  try {
    return await $fetch<ApiResponse<AccountType>>(`${apiGateWay}/v4/auth/login-bms`, {
      method: "POST",
      body: data,
    });
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};