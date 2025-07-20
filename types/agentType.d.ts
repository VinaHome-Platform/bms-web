export interface AgentType {
  id: string | null;
  full_name: string | null;
  code: string | null;
  phone_number: string | null;
  note: string | null;
  address: string | null;
  username: string | null;
  password: string | null;
  status: boolean;
  email: string | null;
  company_code: string;
  company_id: number;
  discount_ticket_type: string;
  discount_ticket_value: number;
  discount_goods_type: string;
  discount_goods_value: number;
}

export interface AgentNameType {
  id: string;
  full_name: string;
}