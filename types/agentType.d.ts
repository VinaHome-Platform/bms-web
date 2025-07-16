export interface AgentType {
  id: number | null;
  full_name: string | null;
  code: string | null;
  number_phone: string | null;
  note: string | null;
  address: string | null;
  username: string | null;
  password: string | null;
  status: boolean;
  email: string | null;
  company_code: string;
  company_id: number;
}
