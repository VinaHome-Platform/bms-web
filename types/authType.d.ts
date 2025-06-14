export interface LoginFormType {
  username: string;
  password: string;
}
export interface AuthStoreType {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  id: string;
  username: string;
  full_name: string;
  company_id: number;
  role: string;
}

export interface LoginResponse {
  success: boolean
  message: string
  statusCode: number
  result: {
    access_token: string
    refresh_token: string
    expires_in: number
    id: string
    username: string
    full_name: string
    company_id: number
    role: string
  }
}

export interface AuthUser {
  id: string
  username: string 
  full_name: string
  company_id: number
  role: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  expires_in: number
}