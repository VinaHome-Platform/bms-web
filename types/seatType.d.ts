export interface SeatChartType {
    id: number | null;
    seat_chart_name: string | null;
    seat_chart_type: number;
    total_floor: number;  
    total_row: number    
    total_column: number; 
    seats: SeatType[] | null;
    created_at: Date | null;
    created_by: string | null;
    company_id: number;
}
export interface SeatType {
    id: number | null;
    name: string | null;
    code: string | null;
    status: boolean;
    floor: number | null;
    row: number | null;
    column: number | null;
    type?: number;
}