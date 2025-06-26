export interface RouteType {
    id: number | null;
    company_id: number;
    route_name: string | null;
    short_name: string | null;
    route_name_e_ticket: string | null;
    base_price: number | null;
    note: string | null;
    e_ticket_price: number | null;
    status: boolean;
    display_order?: number;
    distance: number | null;
    journey: string | null;
    created_by: string | null;
    created_at: Date | null;
}

export interface DTO_RP_ListRouteName {
  id: number;
  route_name: string;
}
