export interface AccountType {
  id: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  username: string;
  full_name: string;
  company_id: number;
  role: string;
}
export interface UserInfoType {
  id: string;
  username: string;
  full_name: string;
  company_id: number;
  role: string;
  refresh_token: string;
  expires_in: number;
}
