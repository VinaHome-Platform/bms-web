export interface LoginFormType {
  username: string;
  password: string;
}
export interface AuthStoreType {
  access_token: string
  refresh_token: string
  expires_in: number
  id: string
  username: string
  full_name: string
  company_id: number
  role: string
}